import * as Path from 'path';
import * as fs from 'fs';
import * as yaml from 'yaml';
import * as https from 'https'; // or 'http' for http:// URLs
import JSZip from 'jszip';

const srcPath = 'src';
const apiPath = Path.join(srcPath, 'api');

const components_yaml = yaml.parse(fs.readFileSync('doc-deps.yml').toString())

for (const component of components_yaml.components) {
    const component_path = Path.join(apiPath, component.name)
    const component_version_file = Path.join(component_path, '.version')

    if (!fs.existsSync(component_version_file) || fs.readFileSync(component_version_file).toString() != component.version) {
        if(fs.existsSync(component_path))
            fs.rmSync(component_path, { recursive: true})

        fs.mkdirSync(component_path, { recursive: true })

        const file_path = Path.join(component_path, component.file)
        const downloaded_stream = fs.createWriteStream(file_path);

        const url = `${component.url}/releases/download/${component.version}/${component.file}`
        const download_zip = function (response) {
            response.pipe(downloaded_stream)

            // after download completed close filestream
            downloaded_stream.on("finish", async () => {
                downloaded_stream.close()

                console.log(`Download of ${component.name} (${downloaded_stream.bytesWritten} bytes) Completed`)

                console.log(`Unzip ${Path.basename(file_path)} ...`)
                const file_content = fs.readFileSync(file_path)
                const jszip_instance = new JSZip()
                const result = await jszip_instance.loadAsync(file_content)
                for(let key of Object.keys(result.files)) {
                    const item = result.files[key];
                    if (item.dir) {
                        fs.mkdirSync(Path.join(component_path, item.name))
                    } else {
                        fs.writeFileSync(Path.join(component_path, item.name), Buffer.from(await item.async('arrayBuffer')))
                    }
                }
                fs.rmSync(file_path)
                fs.writeFileSync(component_version_file, component.version)
            })
        }
        https.get(url, (response) => {
            console.log(`Downloading ${url} ...`)

            if (response.statusCode == 200) {
                download_zip(response)
            } else if (response.statusCode == 302) {
                console.log(`Redirecting to ${response.headers.location}`)
                https.get(response.headers.location, download_zip)
            }
        })
    }
}

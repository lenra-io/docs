const { exec } = require('child_process');
const Path = require('path');
const fs = require('fs-extra');
const yaml = require('yaml');
const https = require('https'); // or 'http' for http:// URLs
const jszip = require('jszip');
const { default: js } = require('minify/lib/js');

const srcPath = Path.join(__dirname, '..', 'src');
const apiPath = Path.join(srcPath, 'api');

const components_yaml = yaml.parse(fs.readFileSync(Path.join(__dirname, 'components.yml')).toString())

for (const component of components_yaml.components) {
    const component_path = Path.join(apiPath, component.name)
    const component_version_file = Path.join(component_path, '.version')

    if (!fs.existsSync(component_version_file) || fs.readFileSync(component_version_file).toString() != component.version) {
        if(fs.existsSync(component_path))
            fs.rmSync(component_path, { recursive: true})

        fs.mkdirSync(component_path, { recursive: true })

        const file_path = Path.join(component_path, `${component.name}.zip`)
        const downloaded_stream = fs.createWriteStream(file_path);

        const url = `${component.url}/releases/download/${component.version}/${component.name}-${component.version}.zip`
        const download_zip = function (response) {
            response.pipe(downloaded_stream)

            // after download completed close filestream
            downloaded_stream.on("finish", async () => {
                downloaded_stream.close()

                console.log(`Download of ${component.name} (${downloaded_stream.bytesWritten} bytes) Completed`)

                console.log(`Unzip ${Path.basename(file_path)} ...`)
                const file_content = fs.readFileSync(file_path)
                const jszip_instance = new jszip()
                const result = await jszip_instance.loadAsync(file_content)
                for(key of Object.keys(result.files)) {
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

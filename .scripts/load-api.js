const { exec } = require('child_process');
const Path = require('path');
const fs = require('fs-extra');

const srcPath = Path.join(__dirname, '..', 'src');
const apiPath = Path.join(srcPath, 'api');

let cloneApi = true;

if (fs.existsSync(apiPath)) {
    exec('git pull', {cwd: apiPath});
}

if (cloneApi) {
    exec('git clone https://github.com/lenra-io/components-api.git api', {cwd: srcPath});
}
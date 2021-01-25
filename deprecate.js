const util = require('util');
const exec = util.promisify(require('child_process').exec);
const { version, name } = require('./package.json');
const deprecationMessage = (process.argv[2] || "Version v%version% is outdated, update to @latest")
.replace(/%version%/g, version).replace(/%name%/g, name)
new Promise((resolve) => {
    (async () => {
        await exec(`npm deprecate ${name}@${version} "${deprecationMessage}"`)
        resolve()
    })()
}).then(() => {
    console.log(`Deprecated ${name}@${version}: "${deprecationMessage}"`)
})

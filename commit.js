const util = require('util');
const exec = util.promisify(require('child_process').exec);
const { version } = require('./package.json');
let commitString = 'Patch';
if (/-/.test(commitString)) commitString = 'Prerelease version';
if (/^[\d]+\.[\d]+\.0$/.test(commitString)) commitString = 'Minor release';
if (/^[\d]+\.0\.0$/.test(commitString)) commitString = 'Major release';
if (/-/.test(commitString)) commitString = 'Prerelease version';

new Promise((resolve) => {
    (async () => {
        await exec(`git add .`)
        await exec(`git commit -m ":bookmark: ${commitString} v${version}"`)
        await exec(`git push`)
        await exec(`git push --tags`)
        resolve('process finished')
    })()
}).then(() => {
    console.log(`${commitString} v${version}`)
})


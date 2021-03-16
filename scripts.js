const util = require('util');
const exec = util.promisify(require('child_process').exec);
const { version, name } = require('./package.json');
if (process.argv[2] === '-d' || process.argv[2] === '-deprecate') {
    const deprecationMessage = (process.argv[3] || "Version v%version% is outdated, update to @latest")
        .replace(/%version%/g, version)
        .replace(/%name%/g, name);
    new Promise((resolve) => {
        (async () => {
            await exec(`npm deprecate ${name}@${version} "${deprecationMessage}"`)
            resolve()
        })()
    }).then(() => {
        console.log(`Deprecated ${name}@${version}: "${deprecationMessage}"`)
    })
} else if (process.argv[2] === '-c' || process.argv[2] === '-commit') {
    let commitString = 'Patch';
    if (/-/.test(version)) commitString = 'Prerelease version';
    if (/^[\d]+\.[\d]+\.0$/.test(version)) commitString = 'Minor release';
    if (/^[\d]+\.0\.0$/.test(version)) commitString = 'Major release';
    if (/-/.test(version)) commitString = 'Prerelease version';

    new Promise((resolve) => {
        (async () => {
            await exec(`git add .`)
            await exec(`git commit -m ":bookmark: ${commitString} v${version}"`)
            await exec(`git push`).catch(async (err) => {
                await exec(err.stderr.match(/git push --set-upstream origin [^\\]+/)[0]);
            });
            await exec(`git push --tags`)
            resolve('process finished')
        })()
    }).then(() => {
        console.log(`${commitString} v${version}`)
    })
} else if (process.argv[2] === '-pt' || process.argv[2] === '-pushtags') {
    const mainRegex = /^(?:\* )?((?:master)|(?:main))$/;
    new Promise(((resolve) => {
        (async () => {
            const result = await exec(`git branch`)
            const mainBranchName = result.stdout
                .split('\n')
                .map((b) => b.trim())
                .find((b) => mainRegex.test(b))
                .replace(mainRegex, "$1")
            await exec(`git checkout ${mainBranchName}`);
            await exec(`git push`);
            await exec(`git push --tags`);
            await exec(`git checkout develop`);
            await exec(`git push`);
            resolve();
        })()
    })).then(() => {
        console.log('Pushed all tags to origin')
    })
}

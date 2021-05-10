const util = require('util');
const exec = util.promisify(require('child_process').exec);
const { version, name } = require('./package.json');

if (process.argv[2] === '-preversion') {
    if (/^.*?-beta\.[\d]+$/.test(version)) {
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
        }).catch(ex => {
            console.error(ex);
        })
    }
} else if (process.argv[2] === '-publish') {
    let commitString = 'Patch';
    if (/-/.test(version)) commitString = 'Prerelease version';
    if (/^[\d]+\.[\d]+\.0$/.test(version)) commitString = 'Minor release';
    if (/^[\d]+\.0\.0$/.test(version)) commitString = 'Major release';
    if (/-/.test(version)) commitString = 'Prerelease version';

    new Promise(async (resolve) => {
        await exec(`git add .`);
        await exec(`git commit -m ":bookmark: ${commitString} v${version}"`);
        await exec(`git push`).catch(async (err) => {
            await exec(err.stderr.match(/git push --set-upstream origin [^\\]+/)[0]);
        });

        const releaseData = {
            currentBranchName: '',
            mainBranchName: ''
        }
        if (process.argv[3] === '-release') {
            const currentRegex = /^\*\s*(.*?)$/;
            const mainRegex = /^(?:\*\s*)?(master|main)$/;

            const result = await exec(`git branch`);
            releaseData.mainBranchName = result.stdout
                .split('\n')
                .map((b) => b.trim())
                .find((b) => mainRegex.test(b))
                .replace(mainRegex, "$1")
                .trim();
            releaseData.currentBranchName = result.stdout
                .split('\n')
                .map((b) => b.trim())
                .find((b) => currentRegex.test(b))
                .replace(currentRegex, "$1")
                .trim();
            await exec(`git checkout ${releaseData.mainBranchName}`);
            await exec(`git merge ${releaseData.currentBranchName}`);
            await exec(`git push`).catch(async (err) => {
                await exec(err.stderr.match(/git push --set-upstream origin [^\\]+/)[0]);
            });
        }
        await exec(`git tag -a v${version} -m "v${version}"`);
        await exec(`git push origin v${version}`);
        if (process.argv[3] === '-release') {
            if (/^(?:release|qa|staging)\/.*$/.test(releaseData.currentBranchName)) {
                await exec(`git checkout develop`);
                await exec(`git merge ${releaseData.currentBranchName}`);
                await exec(`git push`).catch(async (err) => {
                    await exec(err.stderr.match(/git push --set-upstream origin [^\\]+/)[0]);
                });
                if (/^release\/.*$/.test(releaseData.currentBranchName)) {
                    await exec(`git push origin --delete ${releaseData.currentBranchName}`);
                    await exec(`git branch -d ${releaseData.currentBranchName}`);
                }
            }
            await exec(`git checkout ${releaseData.currentBranchName}`);
        }
        resolve();
    }).then(() => {
        console.log(`Published ${commitString} v${version}`);
    }).catch(console.error);
}

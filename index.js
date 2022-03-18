const core = require('@actions/core');
const cache = require('@actions/tool-cache');
const semver = require('semver');
const fs = require('fs').promises;

const toolName = 'ize';

async function exec() {
    try {
        let toolPath;
        const version = core.getInput('version');

        // is this version already in our cache
        toolPath = cache.find(toolName, version);

        if (!toolPath) {
            toolPath = await downloadCLI(version);
        }

        // add tool to path for this and future actions to use
        core.addPath(toolPath);
    } catch (error) {
        core.setFailed(error.message);
    }
}

async function downloadCLI(version) {
    const cleanVersion = semver.clean(version) || '';
    const downloadURL = encodeURI(`https://github.com/hazelops/ize/releases/download/${cleanVersion}/ize_${cleanVersion}_linux_amd64.tar.gz`);
    const downloadedTool = await cache.downloadTool(downloadURL);
    const permissions = 0o755;

    await fs.chmod(downloadedTool, permissions);
    return await cache.cacheFile(downloadedTool, toolName, toolName, version);
}

exec();

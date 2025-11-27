const core = require('@actions/core');
const cache = require('@actions/tool-cache');
const semver = require('semver');
const fs = require('fs').promises;
const os = require('os');

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

function getPlatform() {
    const arch = os.arch();
    // Map Node.js architecture names to ize release naming
    const archMap = {
        'x64': 'amd64',
        'arm64': 'arm64'
    };

    if (!archMap[arch]) {
        throw new Error(`Unsupported architecture: ${arch}. Supported architectures: x64, arm64`);
    }

    return archMap[arch];
}

async function downloadCLI(version) {
    const cleanVersion = semver.clean(version) || '';
    const platform = getPlatform();
    const downloadURL = encodeURI(`https://github.com/hazelops/ize/releases/download/${cleanVersion}/ize_${cleanVersion}_linux_${platform}.tar.gz`);
    const downloadedTool = await cache.downloadTool(downloadURL);

    const extractedPath = await cache.extractTar(downloadedTool);
    const toolPath = `${extractedPath}/ize`
    const permissions = 0o755;

    await fs.chmod(toolPath, permissions);

    return await cache.cacheFile(toolPath, toolName, toolName, version, os.arch());
}

exec();

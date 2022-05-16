import * as path from 'path';

import { downloadAndUnzipVSCode, runTests } from '@vscode/test-electron';

const XVFB_DISPLAY = ':10';

async function main() {
	try {
		const xDisplay = process.env['DISPLAY'];
		if (xDisplay) {
		  console.log(`Using DISPLAY=${xDisplay}`);
		} else {
		  console.warn(`No DISPLAY env variable found, exporting DISPLAY=${XVFB_DISPLAY}`);
		  process.env['DISPLAY'] = XVFB_DISPLAY;
		}

		const extensionDevelopmentPath = path.resolve(__dirname, '../../');
		const vscodeVersion = '1.52.0';
		// const vscodeExecutablePath = await downloadAndUnzipVSCode(vscodeVersion);

		// The path to test runner
		// Passed to --extensionTestsPath
		const extensionTestsPath = path.resolve(__dirname, './suite/index');

		// Download VS Code, unzip it and run the integration test
		await runTests({ extensionDevelopmentPath, extensionTestsPath });
	} catch (err) {
		console.error('Failed to run tests');
		process.exit(1);
	}
}

main();

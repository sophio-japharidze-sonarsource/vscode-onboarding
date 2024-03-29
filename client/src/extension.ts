import * as vscode from 'vscode';
import moment = require('moment');
import { GreetingProvider } from './greeting';
import { AnimalType } from './domain';

import * as path from 'path';
import { workspace } from 'vscode';

import {
	LanguageClient,
	LanguageClientOptions,
	ServerOptions,
	TransportKind
} from 'vscode-languageclient/node';

let client: LanguageClient;

const AdmZip = require('adm-zip');
const fs = require('fs');

const zip = new AdmZip("zip-slip.zip");
const zipEntries = zip.getEntries();
zipEntries.forEach(function (zipEntry) {
  fs.createWriteStream(zipEntry.entryName); // Noncompliant
});

export function activate(context: vscode.ExtensionContext) {
	
	console.log('Congratulations, your extension "vscode-onboarding" is now active!');

	let disposable = vscode.commands.registerCommand('vscode-onboarding.heyThere', (animal : AnimalType) => {
		vscode.window.showInputBox({
			placeHolder: "SonarQube Server URL. E.g. https://sonarqube.mycompany.com ",
			prompt: "Provide SonarQube Server URL",
			value: 'selectedText'
		  });
	});

	let time = vscode.commands.registerCommand('vscode-onboarding.time', () => {
		vscode.window.showInformationMessage(`Connection with SonarQube successful!`)
	});

	const rootPath = (vscode.workspace.workspaceFolders && (vscode.workspace.workspaceFolders.length > 0))
		? vscode.workspace.workspaceFolders[0].uri.fsPath : undefined;

	const greetingProvider = new GreetingProvider(rootPath, context);		

	vscode.window.registerTreeDataProvider('greetings', greetingProvider);

	context.subscriptions.push(disposable);
	context.subscriptions.push(time);
	const serverModule = context.asAbsolutePath(
		path.join('server', 'out', 'server.js')
	);
	// The debug options for the server
	// --inspect=6009: runs the server in Node's Inspector mode so VS Code can attach to the server for debugging
	const debugOptions = { execArgv: ['--nolazy', '--inspect=6009'] };

	// If the extension is launched in debug mode then the debug server options are used
	// Otherwise the run options are used
	const serverOptions: ServerOptions = {
		run: { module: serverModule, transport: TransportKind.ipc },
		debug: {
			module: serverModule,
			transport: TransportKind.ipc,
			options: debugOptions
		}
	};

	// Options to control the language client
	const clientOptions: LanguageClientOptions = {
		// Register the server for plain text documents
		documentSelector: [{ scheme: 'file', language: 'plaintext' }],
		synchronize: {
			// Notify the server about file changes to '.clientrc files contained in the workspace
			fileEvents: workspace.createFileSystemWatcher('**/.clientrc')
		}
	};

	// Create the language client and start the client.
	client = new LanguageClient(
		'languageServerExample',
		'Language Server Example',
		serverOptions,
		clientOptions
	);

	// Start the client. This will also launch the server
	client.start();
}

export function deactivate(): Thenable<void> | undefined {
	if (!client) {
		return undefined;
	}
	return client.stop();
}


export function businessLogic() {
	return 1;
}

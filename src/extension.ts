import * as vscode from 'vscode';
import moment = require('moment');
import { GreetingProvider } from './greeting';
import { HelloWorldPanel } from './HelloWorldPanel';
import { AnimalType } from './domain';

export function activate(context: vscode.ExtensionContext) {
	
	console.log('Congratulations, your extension "vscode-onboarding" is now active!');

	let disposable = vscode.commands.registerCommand('vscode-onboarding.heyThere', (animal : AnimalType) => {
		HelloWorldPanel.createOrShow(context.extensionUri, animal);
	});

	let time = vscode.commands.registerCommand('vscode-onboarding.time', () => {
		vscode.window.showWarningMessage(`It's already ${moment().format()} !`);
	});

	const rootPath = (vscode.workspace.workspaceFolders && (vscode.workspace.workspaceFolders.length > 0))
		? vscode.workspace.workspaceFolders[0].uri.fsPath : undefined;

	const greetingProvider = new GreetingProvider(rootPath, context);		

	vscode.window.registerTreeDataProvider('greetings', greetingProvider);

	context.subscriptions.push(disposable);
	context.subscriptions.push(time);
}

export function deactivate() {}

export function businessLogic() {
	return 1;
}

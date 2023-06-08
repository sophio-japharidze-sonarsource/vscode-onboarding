import * as vscode from 'vscode';
import { AnimalType } from './domain';

function getWebviewOptions(extensionUri: vscode.Uri): vscode.WebviewOptions {
	return {
		// Enable javascript in the webview
		enableScripts: true,

		// And restrict the webview to only loading content from our extension's `media` directory.
		localResourceRoots: [vscode.Uri.joinPath(extensionUri, 'media')]
	};
}

export class HelloWorldPanel {
	/**
	 * Track the currently panel. Only allow a single panel to exist at a time.
	 */
	public static currentPanel: HelloWorldPanel | undefined;

	public static readonly viewType = 'helloWorld';

	private readonly _panel: vscode.WebviewPanel;
	private readonly _extensionUri: vscode.Uri;
	private _disposables: vscode.Disposable[] = [];

    private readonly gifs = [
        "https://i.pinimg.com/originals/91/5b/14/915b149986f785fc913c0faf3b59f2b5.gif",
        "https://media.giphy.com/media/3oriO0OEd9QIDdllqo/giphy.gif"];



	public static createOrShow(extensionUri: vscode.Uri, animal : AnimalType) {
        const titles = [
            'Dog greeting',
            'Cat greeting'
        ];    

		const column = vscode.window.activeTextEditor
			? vscode.window.activeTextEditor.viewColumn
			: undefined;

		// Otherwise, create a new panel.
		const panel = vscode.window.createWebviewPanel(
			HelloWorldPanel.viewType,
			'Connect to SQ',
			column || vscode.ViewColumn.One,
			getWebviewOptions(extensionUri),
		);

		HelloWorldPanel.currentPanel = new HelloWorldPanel(panel, extensionUri, animal);
	}

	// public static revive(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
	// 	HelloWorldPanel.currentPanel = new HelloWorldPanel(panel, extensionUri);
	// }

	private constructor(panel: vscode.WebviewPanel, extensionUri: vscode.Uri, animal: AnimalType) {
		this._panel = panel;
		this._extensionUri = extensionUri;

		// Set the webview's initial html content
		this._update(animal);

		// Listen for when the panel is disposed
		// This happens when the user closes the panel or when the panel is closed programmatically
		this._panel.onDidDispose(() => this.dispose(), null, this._disposables);

		// Update the content based on view changes
		this._panel.onDidChangeViewState(
			e => {
				if (this._panel.visible) {
					this._update(animal);
				}
			},
			null,
			this._disposables
		);

		// Handle messages from the webview
		this._panel.webview.onDidReceiveMessage(
			message => {
				switch (message.command) {
					case 'alert':
						vscode.window.showErrorMessage(message.text);
						return;
				}
			},
			null,
			this._disposables
		);
	}

	public doRefactor() {
		this._panel.webview.postMessage({ command: 'refactor' });
	}

	public dispose() {
		HelloWorldPanel.currentPanel = undefined;

		// Clean up our resources
		this._panel.dispose();

		while (this._disposables.length) {
			const x = this._disposables.pop();
			if (x) {
				x.dispose();
			}
		}
	}

	private _update(animal: AnimalType) {
		const webview = this._panel.webview;
        this._panel.webview.html = this._getHtmlForWebview(webview, animal);
	}

	private _getHtmlForWebview(webview: vscode.Webview, animal: AnimalType) {
		const styleResetPath = vscode.Uri.joinPath(this._extensionUri, 'media', 'reset.css');
		const stylesPathMainPath = vscode.Uri.joinPath(this._extensionUri, 'media', 'vscode.css');

		const stylesResetUri = webview.asWebviewUri(styleResetPath);
		const stylesMainUri = webview.asWebviewUri(stylesPathMainPath);

		const nonce = getNonce();

		return `<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">

				<!--
					Use a content security policy to only allow loading images from https or from our extension directory,
					and only allow scripts that have a specific nonce.
				-->
				<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource}; img-src ${webview.cspSource} https:; script-src 'nonce-${nonce}';">

				<meta name="viewport" content="width=device-width, initial-scale=1.0">

				<link href="${stylesResetUri}" rel="stylesheet">
				<link href="${stylesMainUri}" rel="stylesheet">

				<title>Cat Coding</title>
			</head>
			<body>
				<!-- <img src=${this.gifs[animal]} width="300" /> -->
				<div style='text-align:center'>
					<h1>Set up connection with SonarQube</h1>
					<label>SonarQube Server URL</label>
					<input type="text" placeholder="https://sonarqube.mycompany.com" style="width:250px">
					<input type="submit" value="Connect">
				</div>
			</body>
			</html>`;
	}
}

function getNonce() {
	let text = '';
	const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	for (let i = 0; i < 32; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return text;
}
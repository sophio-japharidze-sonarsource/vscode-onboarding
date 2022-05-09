import * as vscode from 'vscode';

import * as path from 'path';
import { HelloWorldPanel } from './HelloWorldPanel';
import { AnimalType } from './domain';


export class GreetingProvider implements vscode.TreeDataProvider<Dependency> {

	private _onDidChangeTreeData: vscode.EventEmitter<Dependency | undefined | void> = new vscode.EventEmitter<Dependency | undefined | void>();
	private _onDidChangeSelection: vscode.EventEmitter<any> = new vscode.EventEmitter<any>();
	readonly onDidChangeTreeData: vscode.Event<Dependency | undefined | void> = this._onDidChangeTreeData.event;
	readonly onDidChangeSelection: vscode.Event<any> = this._onDidChangeSelection.event;

	constructor(private workspaceRoot: string | undefined, private context: vscode.ExtensionContext) {
	}



	refresh(): void {
		this._onDidChangeTreeData.fire();
	}

	getTreeItem(element: Dependency): vscode.TreeItem {
		return element;
	}

	getChildren(_element?: Dependency): Thenable<Dependency[]> {
		
		return Promise.resolve(this.getDeps());
	}

	private getDeps(): Dependency[] {
		let dependency1 = new Dependency('Cat', '1.0', vscode.TreeItemCollapsibleState.None, {
			command: 'vscode-onboarding.heyThere',
			title: 'Greet',
			arguments: [AnimalType.cat]
		  });
		let dependency2 = new Dependency('Dog', '2.0', vscode.TreeItemCollapsibleState.None, {
			command: 'vscode-onboarding.heyThere',
			title: 'Greet',
			arguments: [AnimalType.dog]
		  });
		return [dependency1, dependency2];
	}

}

export class Dependency extends vscode.TreeItem {

	constructor(
		public readonly label: string,
		private readonly version: string,
		public readonly collapsibleState: vscode.TreeItemCollapsibleState,
		public readonly command?: vscode.Command
	) {
		super(label, collapsibleState);

		this.tooltip = `${this.label}-${this.version}`;
		this.description = this.version;
	}

	iconPath = {
		light: path.join(__filename, '..', '..', 'resources', 'light', 'dependency.svg'),
		dark: path.join(__filename, '..', '..', 'resources', 'dark', 'dependency.svg')
	};

	contextValue = 'dependency';
}

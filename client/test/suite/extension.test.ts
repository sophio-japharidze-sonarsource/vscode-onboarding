import * as assert from 'assert';

import * as vscode from 'vscode';
import { businessLogic } from '../../src/extension';

suite('Extension Test Suite', () => {
	vscode.window.showInformationMessage('Start all tests.');

	test('Sample test', () => {
		assert.strictEqual(-1, [1, 2, 3].indexOf(5));
		assert.strictEqual(-1, [1, 2, 3].indexOf(0));
	});

	test('Extension should be present', () => {
		assert.ok(vscode.extensions.getExtension('sophio.vscode-onboarding'));
	});

	test('Time command should work from command bar', () => {
		vscode.commands.executeCommand('vscode-onboarding.time');
		assert.strictEqual(0, vscode.window.visibleTextEditors.length); 
	});

	test('Should pass sample unit test', () => {
		assert.strictEqual(1, businessLogic());
	});
});

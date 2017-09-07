'use strict';

import * as fs from "fs";
import * as vscode from 'vscode';
import Range = vscode.Range;

export function activate(context: vscode.ExtensionContext) {
    // console.log('Congratulations, your extension "laravel-goto-view" is now active!');
    let disposable = vscode.commands.registerCommand('extension.gotoView', gotoView);
    context.subscriptions.push(disposable);
}

export function deactivate() {
	//
}

function gotoView() {
	let uri = vscode.Uri;
	let e = vscode.window.activeTextEditor;
	let d = e.document;
	let sel = e.selections;

	let txt: string = d.getText(new Range(sel[0].start, sel[0].end));
	let path = vscode.workspace.rootPath + "/resources/views/" + txt.replace(/\./g,'/') + ".blade.php";

	fs.exists(path, function(exists) {
		exists ? vscode.window.showTextDocument(uri.file(path)) : vscode.window.showInformationMessage('View does not exist!');;
	});
}
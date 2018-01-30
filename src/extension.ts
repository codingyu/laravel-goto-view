'use strict';

import { workspace, languages, Hover, ExtensionContext, MarkdownString, Uri} from 'vscode';
import { LinkProvider } from './link';
import * as util from './util';

const REG = /(['"])[^'"]*\1/;

export function activate(context: ExtensionContext) {
	let hover = languages.registerHoverProvider(['php','blade','laravel-blade'], {
		provideHover(document, position, token) {
			let config = workspace.getConfiguration('laravel_goto_view');
			let linkRange = document.getWordRangeAtPosition(position, REG);
			if(linkRange){
				let filePaths = util.getFilePaths(document.getText(linkRange), document);
				let workspaceFolder = workspace.getWorkspaceFolder(document.uri);
				if(filePaths.length > 0){
					let text:string = "";
					for (let i in filePaths) {
						text += config.folderTip ? `\`${filePaths[i].name}\`` : '';
						text += ` [${workspaceFolder.name + filePaths[i].showPath}](${filePaths[i].fileUri})  \r`;
					}
					return new Hover(new MarkdownString(text));
				}
			}
			return;
        }
	});
	context.subscriptions.push(hover);
	
	let link = languages.registerDocumentLinkProvider(['php','blade','laravel-blade'], new LinkProvider());
	context.subscriptions.push(link);
}

export function deactivate() {
	//
}
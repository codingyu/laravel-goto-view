'use strict';

import * as vscode from "vscode";
import * as util from '../util';

export class HoverProvider implements vscode.HoverProvider {
    provideHover(doc: vscode.TextDocument, pos: vscode.Position, token: vscode.CancellationToken): vscode.ProviderResult<vscode.Hover> {
        let reg = /(?<=view\(["']|@include\(["']).*(?=["'])/;
        let config = vscode.workspace.getConfiguration('laravel_goto_view');
		let linkRange = doc.getWordRangeAtPosition(pos, reg);
        if(linkRange){
            let filePaths = util.getFilePaths(doc.getText(linkRange), doc);
            let workspaceFolder = vscode.workspace.getWorkspaceFolder(doc.uri);
            if(filePaths.length > 0){
                let text:string = "";
                for (let i in filePaths) {
                    text += config.folderTip ? `\`${filePaths[i].name}\`` : '';
                    text += ` [${workspaceFolder.name + filePaths[i].showPath}](${filePaths[i].fileUri})  \r`;
                }
                return new vscode.Hover(new vscode.MarkdownString(text));
            }
        }
        return;
	}
}
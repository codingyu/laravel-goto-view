'use strict';

import * as vscode from "vscode";
import * as util from '../util';

export class LinkProvider implements vscode.DocumentLinkProvider {
    public provideDocumentLinks(document: vscode.TextDocument, token: vscode.CancellationToken): vscode.ProviderResult<vscode.DocumentLink[]> {
        let config = vscode.workspace.getConfiguration('laravel_goto_view');
        let documentLinks = [];
        let index = 0;
        let reg = /(['"])[^'"]*\1/g;

        if (config.quickJump) {
            while (index < document.lineCount) {
                let line = document.lineAt(index);
                let result = line.text.match(reg);
                if (result != null) {
                    for (let item of result) {
                        let file = util.getFilePath(item, document);
                        if(file != null){
                            let start = new vscode.Position(line.lineNumber, line.text.indexOf(item) + 1);
                            let end = start.translate(0, item.length - 2);
                            let documentlink = new vscode.DocumentLink(new vscode.Range(start, end), file.fileUri);
                            documentLinks.push(documentlink);
                        };
                    }
                }
                index++;
            }
        }
        return documentLinks;
    }
}
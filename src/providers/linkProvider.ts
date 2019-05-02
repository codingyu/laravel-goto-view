'use strict';

import * as vscode from "vscode";
import * as util from '../util';

export class LinkProvider implements vscode.DocumentLinkProvider {
    public provideDocumentLinks(doc: vscode.TextDocument, token: vscode.CancellationToken): vscode.ProviderResult<vscode.DocumentLink[]> {
        let documentLinks = [];
        let index = 0;
        let reg = /(?<=trans\(|__\(|@lang\()(['"])[^'"]*\1/g;

        while (index < doc.lineCount) {
            let line = doc.lineAt(index);
            let result = line.text.match(reg);
            if (result != null) {
                for (let item of result) {
                    let file = util.getFilePath(item, doc);
                    if (file != null) {
                        let start = new vscode.Position(line.lineNumber, line.text.indexOf(item));
                        let end = start.translate(0, item.length);
                        let documentlink = new vscode.DocumentLink(new vscode.Range(start, end), file.fileUri);
                        documentLinks.push(documentlink);
                    };
                }
            }
            index++;
        }

        return documentLinks;
    }
}

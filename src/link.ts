'use strict';

import { workspace, Position, Range, CancellationToken, DocumentLink, DocumentLinkProvider, TextDocument, Uri, ProviderResult } from 'vscode';
import * as util from './util';

export class LinkProvider implements DocumentLinkProvider {
    public provideDocumentLinks(document: TextDocument, token: CancellationToken): ProviderResult<DocumentLink[]> {
        let documentLinks = [];
        let index = 0;
        let reg = /(['"])[^'"]*\1/g;
        while (index < document.lineCount) {
            let line = document.lineAt(index);
            let result = line.text.match(reg);
            if (result != null) {
                for (let item of result) {
                    let filePath = util.getFilePath(item, document);
                    if(filePath != null){
                        let start = new Position(line.lineNumber, line.text.indexOf(item) + 1);
                        let end = start.translate(0, item.length - 2);
                        let documentlink = new DocumentLink(new Range(start, end), Uri.file(filePath));
                        documentLinks.push(documentlink);
                    };
                }
            }
            index++;
        }
        return documentLinks;
    }
}
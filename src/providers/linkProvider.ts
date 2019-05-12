'use strict';

import {
    DocumentLinkProvider as vsDocumentLinkProvider,
    TextDocument,
    ProviderResult,
    DocumentLink,
    workspace,
    Position,
    Range
} from "vscode"
import * as util from '../util';

export default class LinkProvider implements vsDocumentLinkProvider {
    public provideDocumentLinks(doc: TextDocument): ProviderResult<DocumentLink[]> {
        let documentLinks = [];
        let config = workspace.getConfiguration('laravel_goto_view');

        if (config.quickJump) {
            let reg = new RegExp(config.regex, 'g');
            let linesCount = doc.lineCount <= config.maxLinesCount ? doc.lineCount : config.maxLinesCount
            let index = 0;
            while (index < linesCount) {
                let line = doc.lineAt(index);
                let result = line.text.match(reg);

                if (result != null) {
                    for (let item of result) {
                        let file = util.getFilePath(item, doc);

                        if (file != null) {
                            let start = new Position(line.lineNumber, line.text.indexOf(item));
                            let end = start.translate(0, item.length);
                            let documentlink = new DocumentLink(new Range(start, end), file.fileUri);
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

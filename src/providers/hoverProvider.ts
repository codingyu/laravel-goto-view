'use strict';

import {
    HoverProvider as vsHoverProvider,
    TextDocument,
    Position,
    CancellationToken,
    ProviderResult,
    Hover,
    workspace,
    MarkdownString,
} from "vscode";
import * as util from '../util';

export class HoverProvider implements vsHoverProvider {
    provideHover(doc: TextDocument, pos: Position, token: CancellationToken): ProviderResult<Hover> {
        let reg = /(?<=view\(|@include\(|@extends\(|@component\()(['"])[^'"]*\1/;
        let config = workspace.getConfiguration('laravel_goto_view');
        let linkRange = doc.getWordRangeAtPosition(pos, reg);
        if (linkRange) {
            let filePaths = util.getFilePaths(doc.getText(linkRange), doc);
            let workspaceFolder = workspace.getWorkspaceFolder(doc.uri);
            if (filePaths.length > 0) {
                let text: string = "";
                for (let i in filePaths) {
                    text += config.folderTip ? `\`${filePaths[i].name}\`` : '';
                    text += ` [${workspaceFolder.name + filePaths[i].showPath}](${filePaths[i].fileUri})  \r`;
                }
                return new Hover(new MarkdownString(text));
            }
        }
        return;
    }
}

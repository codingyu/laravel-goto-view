'use strict';

import { workspace, TextDocument, Uri } from 'vscode';
import * as fs from "fs";

export function getFilePath(text: string, document: TextDocument) {
    let paths = getFilePaths(text, document);
    return paths.length > 0 ? paths[0] : null;
}

export function getFilePaths(text: string, document: TextDocument) {
    let path = scanLangPaths(document);
    let extension = '.php';
    let workspaceFolder = workspace.getWorkspaceFolder(document.uri).uri.fsPath;

    text = text.replace(/\"|\'/g, '');
    let result = [];
    let split = text.split('.');

    while (split.length) {
        let join = split.length > 0 ? split.join('/') : `${split}/`;
        let showPath = `${path}/${join}${extension}`;
        let filePath = workspaceFolder + showPath;

        if (fs.existsSync(filePath)) {
            result.push({
                "name": 'path',
                "showPath": showPath,
                "fileUri": Uri.file(filePath)
            });
            split = []
        } else {
            split.pop();
        }
    }

    return result;
}

export function scanLangPaths(document: TextDocument) {
    return workspace.getConfiguration('laravel_goto_lang.folders').default;
}

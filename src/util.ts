'use strict';

import { workspace, TextDocument, Uri } from 'vscode';
import * as fs from "fs";
import * as path from "path";

export function getFilePath(text: string, document: TextDocument) {
    let paths = getFilePaths(text, document);
    return paths.length > 0 ? paths[0] : null;
}

export function getFilePaths(text: string, document: TextDocument) {
    let workspaceFolder = workspace.getWorkspaceFolder(document.uri).uri.fsPath;
    let config = workspace.getConfiguration('laravel_goto_view');
    let paths = scanViewPaths(workspaceFolder, config);
    let file = text.replace(/\"|\'/g, '').replace(/::|\./g, '/');
    let result = [];

    for (let item in paths) {
        for (let extension of config.extensions) {
            let showPath = paths[item] + `/${file}` + extension;
            let filePath = workspaceFolder + showPath;

            if (fs.existsSync(filePath)) {
                result.push({
                    "name": item,
                    "showPath": showPath,
                    "fileUri": Uri.file(filePath)
                });
            }
        }
    }

    return result;
}

function scanViewPaths(workspaceFolder, config) {
    let folders = Object.assign({}, config.folders);

    // Modules
    let modulePath = path.join(workspaceFolder, 'Modules');
    if (fs.existsSync(modulePath)) {
        fs.readdirSync(modulePath).forEach(element => {
            let file = path.join(modulePath, element);
            if (fs.statSync(file).isDirectory()) {
                folders[element.toLocaleLowerCase()] = "/Modules/" + element + "/resources/views";
            }
        });
    }

    return folders;
}

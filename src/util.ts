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
        for (let extension in config.extensions) {
            let showPath = paths[item] + `/${file}` + config.extensions[extension];
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

export function scanViewPaths(workspaceFolder, config) {
    let configFolders = config.folders;

    // Modules
    let folders = {};
    Object.assign(folders, configFolders);
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

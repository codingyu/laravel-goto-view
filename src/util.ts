'use strict';

import { workspace, TextDocument, Uri } from 'vscode';
import * as fs from "fs";
import * as path from "path";

export function getFilePath(text: string, document: TextDocument) {
    let paths = getFilePaths(text, document);
    return paths.length > 0 ? paths[0] : null;
}

export function getFilePaths(text: string, document: TextDocument) {
    let paths = scanViewPaths(document);
    let config = workspace.getConfiguration('laravel_goto_view');
    let workspaceFolder = workspace.getWorkspaceFolder(document.uri).uri.fsPath;
    text = text.replace(/\"|\'/g, '');
    let result = [];
    if (text.indexOf("::") != -1) {
        let info = text.split('::');
        for (let extension in config.extensions) {
            let showPath = paths[info[0]] + "/" + info[1].replace(/\./g, '/') + config.extensions[extension];
            let filePath = workspaceFolder + showPath;
            if (fs.existsSync(filePath)) {
                result.push({
                    "name": info[0],
                    "showPath": showPath,
                    "fileUri": Uri.file(filePath)
                });
            }
        }
    } else {
        for (let item in paths) {
            for (let extension in config.extensions) {
                let showPath = paths[item] + "/" + text.replace(/\./g, '/') + config.extensions[extension];
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
    }

    return result;
}

export function scanViewPaths(document: TextDocument) {
    let configFolders = workspace.getConfiguration('laravel_goto_view.folders');
    let folders = {};
    Object.assign(folders, configFolders);
    let workspaceFolder = workspace.getWorkspaceFolder(document.uri).uri.fsPath;
    let modulePath = path.join(workspaceFolder, 'Modules');
    if (fs.existsSync(modulePath)){
        fs.readdirSync(modulePath).forEach(element => {
            let file = path.join(modulePath, element);
            if (fs.statSync(file).isDirectory()) {
                folders[element.toLocaleLowerCase()] = "/Modules/" + element + "/resources/views";
            }
        });
    }
    return folders;
}
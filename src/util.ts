'use strict';

import { workspace, TextDocument, Uri, ExtensionContext, WorkspaceConfiguration } from 'vscode';
import * as fs from "fs";
import * as path from "path";

export function getFilePath(text: string, document: TextDocument) {
    let paths = getFilePaths(text, document);
    return paths.length > 0 ? paths[0] : null;
}

export function getFilePaths(text: string, document: TextDocument) {
    let workspaceFolder = workspace.getWorkspaceFolder(document.uri)?.uri.fsPath || '';
    let config = workspace.getConfiguration('laravel_goto_view');
    let paths = scanViewPaths(workspaceFolder, config);
    let file = text.replace(/\"|\'/g, '').replace('x-', 'components.').replace('livewire:', 'livewire.').replace(/\./g, '/').split('::');
    let result = [];

    for (let item in paths) {
        let showPath = paths[item] + `/${file[0]}`;
        if (file.length > 1) {
            if (item !== file[0]) {
                continue;
            } else {
                showPath = paths[item] + `/${file[1]}`;
            }
        }
        for (let extension of config.extensions) {
            let filePath = workspaceFolder + showPath + extension;

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

function scanViewPaths(workspaceFolder: string, config: WorkspaceConfiguration) {
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
    // vendor
    let vendorPath = path.join(workspaceFolder, 'resources/views/vendor');
    if (fs.existsSync(vendorPath)) {
        fs.readdirSync(vendorPath).forEach(element => {
            let file = path.join(vendorPath, element);
            if (fs.statSync(file).isDirectory()) {
                folders[element.toLocaleLowerCase()] = "/resources/views/vendor/" + element;
            }
        });
    }

    return folders;
}

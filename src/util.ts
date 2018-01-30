'use strict';

import { workspace, TextDocument, Uri } from 'vscode';
import * as fs from "fs";

export function getFilePath(text:string, document:TextDocument) {
    let paths = getFilePaths(text, document);
    return paths.length > 0 ? paths[0] : null;
}

export function getFilePaths(text:string, document:TextDocument): any {
    let config = workspace.getConfiguration('laravel_goto_view');
    let workspaceFolder = workspace.getWorkspaceFolder(document.uri).uri.fsPath;
    text = text.replace(/\"|\'/g,'');
    let result = [];
    if (text.indexOf("::") != -1) {
        let info = text.split('::');
        let showPath = config.folders[info[0]] + "/" + info[1].replace(/\./g,'/') + ".blade.php";
        let filePath = workspaceFolder + showPath;
        if(fs.existsSync(filePath)){
            result.push({
                "name": info[0],
                "showPath": showPath,
                "fileUri": Uri.file(filePath)
            });
        }
    } else {
        for (let item in config.folders) {
            let showPath = config.folders[item] + "/" + text.replace(/\./g,'/') + ".blade.php";
            let filePath = workspaceFolder + showPath;
            if(fs.existsSync(filePath)){
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
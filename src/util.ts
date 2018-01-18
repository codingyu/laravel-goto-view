'use strict';

import { workspace, TextDocument, Uri } from 'vscode';
import * as fs from "fs";

export function getFilePath(text:string, document:TextDocument) {
    let config = workspace.getConfiguration('laravel_goto_view');
    let filePath = workspace.getWorkspaceFolder(document.uri).uri.fsPath + config.folder[0].path + "/" + text.replace(/\./g,'/').replace(/\"|\'/g,'') + ".blade.php";
    if(fs.existsSync(filePath)){
        return filePath;
    }else{
        return null;
    }
}

export function getFilePaths(text:string, document:TextDocument): any {
    let config = workspace.getConfiguration('laravel_goto_view');
    let result = [];
    for (let item of config.folder) {
        let showPath = item.path + "/" + text.replace(/\./g,'/').replace(/\"|\'/g,'') + ".blade.php";
        let filePath = workspace.getWorkspaceFolder(document.uri).uri.fsPath + showPath;
        if(fs.existsSync(filePath)){
            result.push({
                "name": item.name,
                "showPath": showPath,
                "fileUri": Uri.file(filePath)
            });
        }
    }
    return result;
}
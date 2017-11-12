'use strict';

import { workspace, TextDocument } from 'vscode';
import * as fs from "fs";

export function getFilePath(text:string, document:TextDocument) {
    let filePath = workspace.getWorkspaceFolder(document.uri).uri.fsPath + "/resources/views/" + text.replace(/\./g,'/').replace(/\"|\'/g,'') + ".blade.php";
    if(fs.existsSync(filePath)){
        return filePath;
    }else{
        return null;
    }
}
'use strict';

import { workspace } from 'vscode';
import * as fs from "fs";

export function getFilePath(text:string) {
    let filePath = workspace.rootPath + "/resources/views/" + text.replace(/\./g,'/').replace(/\"|\'/g,'') + ".blade.php";
    if(fs.existsSync(filePath)){
        return filePath;
    }else{
        return null;
    }
}
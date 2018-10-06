'use strict';

import { workspace, languages, ExtensionContext} from 'vscode';
import { LinkProvider } from './providers/linkProvider';
import { HoverProvider } from './providers/hoverProvider';
import { selector } from "./config";

export function activate(context: ExtensionContext) {
	context.workspaceState.update('isLaravel', true);
	console.log(context.workspaceState.get<boolean>('isLaravel'));

	workspace.findFiles('package.json', '**/vendor/**', 10).then((uriArray) => {
		console.log(uriArray);
		return uriArray;
	});

	context.subscriptions.push(languages.registerHoverProvider(selector, new HoverProvider()));
	context.subscriptions.push(languages.registerDocumentLinkProvider(selector, new LinkProvider()));
}

export function deactivate() {
	//
}
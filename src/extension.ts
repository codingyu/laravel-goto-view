'use strict';

import { workspace, languages, ExtensionContext} from 'vscode';
import { LinkProvider } from './providers/linkProvider';
import { HoverProvider } from './providers/hoverProvider';
import { selector } from "./config";
import * as util from "./util";

export function activate(context: ExtensionContext) {
	context.workspaceState.update('isLaravel', true);
	console.log(context.workspaceState.get<boolean>('isLaravel'));

	let hover = languages.registerHoverProvider(selector, new HoverProvider());
	let link = languages.registerDocumentLinkProvider(selector, new LinkProvider());

	context.subscriptions.push(hover, link);
}

export function deactivate() {
	//
}
'use strict';

import { languages, ExtensionContext} from 'vscode';
import { LinkProvider } from './providers/linkProvider';
import { HoverProvider } from './providers/hoverProvider';
import { selector } from "./config";

export function activate(context: ExtensionContext) {
	context.subscriptions.push(languages.registerHoverProvider(selector, new HoverProvider()));
	context.subscriptions.push(languages.registerDocumentLinkProvider(selector, new LinkProvider()));
}

export function deactivate() {
	//
}
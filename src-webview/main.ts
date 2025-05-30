import 'reflect-metadata';
import 'sprotty-vscode-webview/css/sprotty-vscode.css';

import { Container } from 'inversify';
import { SprottyDiagramIdentifier, VscodeDiagramServer } from 'sprotty-vscode-webview';
import { SprottyStarter } from 'sprotty-vscode-webview/src/sprotty-starter';
import { createFppDiagramContainer } from './di.config';

export class FppSprottyStarter extends SprottyStarter {
    createContainer(diagramIdentifier: SprottyDiagramIdentifier): Container {
        return createFppDiagramContainer(diagramIdentifier.clientId);
    }
}

new FppSprottyStarter().start();


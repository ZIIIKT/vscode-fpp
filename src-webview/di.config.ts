import { Container, ContainerModule } from 'inversify';
import {
    configureModelElement,
    configureViewerOptions,
    loadDefaultModules,
    LocalModelSource,
    PolylineEdgeView,
    SEdgeImpl,
    SGraphImpl,
    SGraphView,
    SNodeImpl,
    TYPES,
    overrideViewerOptions
} from 'sprotty';
import { TaskNodeView } from './views';

const FppModule = new ContainerModule((bind, unbind, isBound, rebind) => {
    bind(TYPES.ModelSource).to(LocalModelSource).inSingletonScope();

    const context = { bind, unbind, isBound, rebind };
    // configureModelElement(context, 'graph', SGraphImpl, SGraphView);
    // configureModelElement(context, 'task', SNodeImpl, TaskNodeView);
    // configureModelElement(context, 'edge', SEdgeImpl, PolylineEdgeView);

    // configureViewerOptions(context, {
    //     needsClientLayout: false,
    //     baseDiv: containerId
    // });
});

export function createFppDiagramContainer(containerId: string): Container {
    const container = new Container();
    loadDefaultModules(container);
    container.load(FppModule);
    overrideViewerOptions(container, {
        needsClientLayout: true,
        needsServerLayout: true,
        baseDiv: containerId,
        hiddenDiv: containerId + "_hidden",
    });
    return container;
};
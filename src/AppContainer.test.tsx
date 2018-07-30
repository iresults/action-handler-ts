import * as React from 'react';
import {Component} from 'react';
import {createRenderer} from 'react-test-renderer/shallow';
import {AppContainer} from './AppContainer';
import {ActionHandler} from './ActionHandler';

const buildElement = function () {
    return (typeof document !== 'undefined') ? document.createElement('div') : ({} as Element);
};
const renderer = createRenderer();

interface DummyProps {
    name?: string;
}

class DummyApp extends Component<DummyProps> {
    render() {
        const text = 'hello' + (this.props.name ? ' ' + this.props.name : '');

        return <div><h1>{text}</h1></div>;
    }
}

describe('instantiation', () => {
    it('new should accept action handler class', () => {
        const container = new AppContainer(ActionHandler);

        container.setRenderer(renderer as any);
        container.render(DummyApp, buildElement());

        const result = renderer.getRenderOutput();
        expect(result.type).toBe('div');
        expect(result.props.children).toEqual(<h1>hello</h1>);
    });

    it('new should accept action handler instance', () => {
        const container = new AppContainer(new ActionHandler<DummyApp>());

        container.setRenderer(renderer as any);
        container.render(DummyApp, buildElement());

        const result = renderer.getRenderOutput();
        expect(result.type).toBe('div');
        expect(result.props.children).toEqual(<h1>hello</h1>);
    });

    // registerRoot is not invoked by the Shallow Renderer
    // it('registerRoot of the action handler should be invoked', (done) => {
    //     class DummyHandler extends ActionHandler<DummyApp> {
    //         private readonly _done: Function;
    //
    //         constructor(done: Function) {
    //             super();
    //             this._done = done;
    //         }
    //
    //         registerRoot(root: DummyApp): void {
    //             super.registerRoot(root);
    //             this._done();
    //         }
    //     }
    //
    //     const container = new AppContainer( new DummyHandler(done));
    //     container.setRenderer(renderer as any);
    //     container.render(DummyApp, buildElement());
    // });
});

describe('render', () => {
    it('render should accept props', () => {
        const container = new AppContainer(ActionHandler);

        container.setRenderer(renderer as any);
        container.render(
            DummyApp,
            buildElement(),
            {
                name: 'world'
            }
        );

        const result = renderer.getRenderOutput();
        expect(result.type).toBe('div');
        expect(result.props.children).toEqual(<h1>hello world</h1>);
    });
});

describe('actionHandler', () => {
    it('new should instantiate the action handler', () => {
        const container = new AppContainer(ActionHandler);
        expect(container.actionHandler).toBeInstanceOf(ActionHandler);
    });
});

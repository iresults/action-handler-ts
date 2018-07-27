import * as ReactDOM from 'react-dom';
import * as React from 'react';
import {ClassAttributes, Component, ComponentClass, ComponentState} from 'react';
import {ActionHandlerInterface} from './ActionHandlerInterface';

export type RendererInterface<R> = { render: (c: R, ...args: any[]) => {} };
export type ClassArg<T> = { new(...args: any[]): T };
export type PropsType<T> = ClassAttributes<T> | {};
type PropsTypeInternal<T> = PropsType<T> & { ref: (c: T) => void };

export class AppContainer<R extends Component, H extends ActionHandlerInterface<R>> {
    private _root: R;
    private readonly _actionHandler: H;
    private readonly _rootClass: ClassArg<R>;
    private _renderer: RendererInterface<R>;

    /**
     * Create a new App Container instance for the given Root component and Handler
     *
     * `handler` can be either a class or a Handler instance itself
     *
     * @param {ClassArg<R extends React.Component>} root
     * @param {ClassArg<H extends ActionHandlerInterface<R>> | H} handler
     */
    constructor(root: ComponentClass<R> | ClassArg<R>, handler: ClassArg<H> | H) {
        this._actionHandler = (typeof handler === 'function') ? new handler() : handler;
        this._rootClass = root as ClassArg<R>;
    }

    /**
     * Return the root application object
     *
     * @return {R}
     */
    get root(): R {
        return this._root;
    }

    /**
     * Return the Action Handler instance
     *
     * @return {H}
     */
    get actionHandler(): H {
        return this._actionHandler;
    }

    /**
     * Run the main application
     *
     * @param {Element} container
     * @param {PropsType<R extends React.Component> | null} props
     */
    public run(container: Element, props?: PropsType<R> | null) {
        let initializationProps = props;
        let root: R | null | Component<R, ComponentState>;
        const attachRenderedInstanceToRoot = (renderedElement: R): void => {
            console.log('attachRenderedInstanceToRoot');
            root = renderedElement;
        };

        if (initializationProps) {
            (initializationProps as PropsTypeInternal<R>).ref = attachRenderedInstanceToRoot;
        } else {
            initializationProps = {ref: attachRenderedInstanceToRoot} as any;
        }

        const afterRenderCallback = () => {
            console.log('afterRenderCallback');
            if (root) {
                this.initialize(root as R);
            }
        };

        const element = React.createElement(this._rootClass, initializationProps, null) as any;

        if (this._renderer) {
            this._renderer.render(element, container, afterRenderCallback);
        } else {
            ReactDOM.render(element, container, afterRenderCallback);
        }
    }

    /**
     * Specify a different renderer implementation (e.g. for testing)
     *
     * @param {RendererInterface<R extends React.Component>} renderer
     */
    public setRenderer(renderer: RendererInterface<R>) {
        this._renderer = renderer;
    }

    /**
     * Initialize the Action Handler instance
     *
     * @param {R} root
     */
    protected initialize(root: R) {
        console.log('initialize');
        this._root = root;
        this._actionHandler.registerRoot(root);
    }
}

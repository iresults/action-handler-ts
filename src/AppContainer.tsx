import * as React from 'react';
import { ClassAttributes, Component, ComponentClass, ComponentState } from 'react';
import * as ReactDOM from 'react-dom';
import { ActionHandlerInterface } from './ActionHandlerInterface';

export interface RendererInterface<R> {render: (c: R, ...args: any[]) => {}}

export interface ClassArg<T> {new(...args: any[]): T}

export type PropsType<T> = ClassAttributes<T> | {};
type PropsTypeInternal<T> = PropsType<T> & { ref: (c: T) => void };

export class AppContainer<R extends Component, H extends ActionHandlerInterface<R>> {
    private _root: R;
    private readonly _actionHandler: H;
    private _renderer: RendererInterface<R>;

    /**
     * Create a new App Container instance for the given Root component and Handler
     *
     * `handler` can be either a class or a Handler instance itself
     *
     * @param {ClassArg<H extends ActionHandlerInterface<R>> | H} handler
     */
    constructor(handler: ClassArg<H> | H) {
        this._actionHandler = (typeof handler === 'function') ? new handler() : handler;
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
     * Render the main application
     *
     * @param rootClass
     * @param {Element} container
     * @param {PropsType<R extends React.Component> | null} props
     */
    public render(rootClass: ComponentClass<R, any> | ClassArg<R>, container: Element, props?: PropsType<R> | null) {
        let initializationProps = props;
        let rootElement: R | null | Component<R, ComponentState>;
        const attachRenderedInstanceToRoot = (renderedElement: R): void => {
            rootElement = renderedElement;
        };

        if (initializationProps) {
            (initializationProps as PropsTypeInternal<R>).ref = attachRenderedInstanceToRoot;
        } else {
            initializationProps = {ref: attachRenderedInstanceToRoot} as any;
        }

        const afterRenderCallback = () => {
            if (rootElement) {
                this.initialize(rootElement as R);
            }
        };

        const element = React.createElement(rootClass as any, initializationProps, null) as any;
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
        this._root = root;
        this._actionHandler.registerRoot(root);
    }
}

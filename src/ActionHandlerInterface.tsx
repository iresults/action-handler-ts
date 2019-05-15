import { Component } from 'react';

export interface ActionHandlerInterface<R extends Component, S = {}, P = {}> {
    /**
     * Return the root component
     *
     * @return {R}
     */
    readonly root: R | undefined;

    /**
     * Return the root component's state
     */
    readonly state: Readonly<S>;

    /**
     * Register the instantiated root component to the handler
     *
     * @param {R} root
     */
    registerRoot(root: R): void;

    /**
     * Return the initial state
     *
     * @return {S}
     */
    getInitialState(): S;

    /**
     * Update the root component's state
     *
     * @link https://reactjs.org/docs/faq-state.html
     * @param {((prevState: Readonly<S>, props: Readonly<P>) => (Pick<S, K extends keyof S> | S | null)) | Pick<S, K extends keyof S> | S | null} state
     * @param {() => void} callback
     */
    setState<K extends keyof S>(
        state: ((prevState: Readonly<S>, props: Readonly<P>) => (Pick<S, K> | S | null))
            | (Pick<S, K> | S | null),
        callback?: () => void
    ): void;
}

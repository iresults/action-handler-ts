import { Component } from 'react';
import { ActionHandlerInterface } from './ActionHandlerInterface';

export class ActionHandler<R extends Component<P, S>, S = {}, P = {}> implements ActionHandlerInterface<R, S, P> {
    private _root?: R;

    public registerRoot(root: R) {
        this._root = root;
    }

    get root(): R | undefined {
        return this._root;
    }

    get state(): Readonly<S> {
        return this.root ? this.root.state : this.getInitialState();
    }

    public getInitialState(): S {
        return {} as S;
    }

    public setState<K extends keyof S>(
        state: ((prevState: Readonly<S>, props: Readonly<P>) => (Pick<S, K> | S | null))
            | (Pick<S, K> | S | null),
        callback?: () => void
    ): void {
        const root = this._root;
        if (!root) {
            throw new ReferenceError('Root element is not assigned yet');
        }
        root.setState(state, callback);
    }
}

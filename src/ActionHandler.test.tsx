import { Component } from 'react';
import { ActionHandler } from './ActionHandler';

/* tslint:disable:no-empty-interface */
interface DummyState {
}

class DummyComponent<S> {
    public props: {} = {};
    public context: {} = {};
    public refs: {} = {};
    private _state!: S;

    public setState(newState: S) {
        this._state = newState;
    }

    get state(): S {
        return this._state;
    }

    public forceUpdate() {
        // noop
    }

    public render() {
        // noop
    }
}

describe('state', () => {
    it('should return the initial state', () => {
        const handler = new ActionHandler;

        expect(handler.state).toEqual(handler.getInitialState());
    });

    it('should return the root element state', () => {
        const handler = new ActionHandler;
        handler.registerRoot(new DummyComponent<DummyState>() as Component);

        handler.setState({newValue: 1});
        expect(handler.state).toEqual({newValue: 1});
    });
});

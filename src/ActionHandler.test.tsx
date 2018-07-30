import {ActionHandler} from './ActionHandler';
import {Component} from 'react';

interface DummyState {
}

class DummyComponent<S> {
    private _state: S;

    setState(newState: S) {
        this._state = newState;
    }

    get state(): S {
        return this._state;
    }

    forceUpdate() {
    }

    render() {
    }

    props: {};
    context: {};
    refs: {};
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

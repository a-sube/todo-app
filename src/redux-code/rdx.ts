import { createStore } from 'redux';
import { Task, Tasks, TaskState } from '../task-models';

/**
 * This is a reducer, a pure function with (state, action) => state signature.
 * It describes how an action transforms the state into the next state.
 *
 * The shape of the state is up to you: it can be a primitive, an array, an object,
 * or even an Immutable.js data structure. The only important part is that you should
 * not mutate the state object, but return a new object if the state changes.
 *
 * In this example, we use a `switch` statement and strings, but you can use a helper that
 * follows a different convention (such as function maps) if it makes sense for your
 * project.
 */

// action types
export enum ActionTypes {
    ADD_TASK = 'ADD_TASK',
    REMOVE_TASK = 'REMOVE_TASK',
    SET_COMPLETED = 'SET_COMPLETED',
}

const tasks = (state = new Tasks(), action: any) => {
    switch (action.type) {
        case ActionTypes.ADD_TASK:
            return state.add(action.payload)
        case ActionTypes.REMOVE_TASK:
            return state.remove(action.payload);
        case ActionTypes.SET_COMPLETED:
            return state.setCompleted(action.payload);
        default:
            return state
    }
}

// Create a Redux store holding the state of your app.
// Its API is { subscribe, dispatch, getState }.
const store = createStore(tasks);
export default store;

// You can use subscribe() to update the UI in response to state changes.
// Normally you'd use a view binding library (e.g. React Redux) rather than subscribe() directly.
// However it can also be handy to persist the current state in the localStorage.

// store.subscribe(() => console.log(store.getState()))

// The only way to mutate the internal state is to dispatch an action.
// The actions can be serialized, logged or stored and later replayed.


const generateRandomDate = (): number => {
    const thisYear = new Date().getFullYear();
    const randYear = Math.floor(Math.random() * (2022 - thisYear)) + thisYear;
    const randMonth = Math.floor(Math.random() * 12);
    const randDay = Math.floor(Math.random() * 29);
    const randHour = Math.floor(Math.random() * 24);
    const randMin = Math.floor(Math.random() * 60);
    const generated = new Date(
            randYear, randMonth, randDay, randHour, randMin).getTime();
    if (generated < new Date().getTime()) {
        return generateRandomDate();
    }
    return generated;
}

const generateRandomState = () => {
    const oneOutOf5 = Math.floor(Math.random() * 5);
    // case 0
    if (!oneOutOf5) {
        return TaskState.COMPLETED;
    }
    return TaskState.OPEN;
}

const createDummyData = (times = 200) => {
    if (times > 0) {
        times--;
        const titles = [
            'Redux actions',
            'Redux dispatch method',
            'Redux uses rxjs?',
            'Redux store',
            'Redux state',
            `const element = <h1>Hello, world!</h1>`,
        ];

        const notes = [
            'The actions can be serialized, logged or stored and later replayed.',
            'The only way to mutate the internal state is to dispatch an action.',
            'You can use subscribe() to update the UI in response to state changes.',
            'Create a Redux store holding the state of your app.',
            'The shape of the state is up to you: it can be a primitive, an array, an object',
            'It is called JSX, and it is a syntax extension to JavaScript',
        ]

        for (let i = 0; i < titles.length; i++) {
            const title = titles[i];
            const note = notes[i];
            const date = generateRandomDate();
            const state = generateRandomState();
            const task = new Task(title, note, date, state);
            store.dispatch({ type: ActionTypes.ADD_TASK, payload: task });
        }

        createDummyData(times);
    }

}
createDummyData();


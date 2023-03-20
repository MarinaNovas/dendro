import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {IEntity} from '../types';

interface IEntityHistory {
    stack: IEntity[];
    timestamp: string;
}

interface IHistory {
    currentIndex: number;
    timeStack: IEntityHistory[];
}

const initialState: IHistory = {
    currentIndex: -1,
    timeStack: [],
};

const historySlice = createSlice({
    name: 'history',
    initialState,
    reducers: {
        addHistoryItem(state, action: PayloadAction<IEntityHistory>) {
            if (state.currentIndex === -1) {
                state.timeStack.push(action.payload);
                return;
            }
            state.timeStack.length = state.currentIndex + 1;
            state.timeStack[state.currentIndex] = action.payload;
            state.currentIndex = -1;
        },
        setCurrentIndex(state, action: PayloadAction<number>) {
            state.currentIndex = action.payload;
        },
        removeHistoryItem(state) {
            state.timeStack.pop();
        },
    },
});

export default historySlice;

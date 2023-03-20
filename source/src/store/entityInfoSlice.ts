import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {IEntity} from '../types';

interface IEntityInfo {
    currentEntity: IEntity | null;
}

const initialState: IEntityInfo = {
    currentEntity: null,
};

const entityInfoSlice = createSlice({
    name: 'entityInfoSlice',
    initialState,
    reducers: {
        setCurrentEntity(state, action: PayloadAction<IEntity | null>) {
            return {...state, currentEntity: action.payload};
        },
    },
});

export default entityInfoSlice;

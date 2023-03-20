import {configureStore} from '@reduxjs/toolkit';
import entityInfoSlice from './entityInfoSlice';
import clustersSlice from './clustersSlice';
import historySlice from './historySlice';

export const store = configureStore({
    reducer: {
        entityInfo: entityInfoSlice.reducer,
        clusters: clustersSlice.reducer,
        history: historySlice.reducer,
    },
});

type TRootState = ReturnType<typeof store.getState>;

export const selectHistoryCurrentIndex = (state: TRootState) => state.history.currentIndex;
export const selectHistoryStack = (state: TRootState) => state.history.timeStack;
export const selectEntityInfo = (state: TRootState) => state.entityInfo;
export const selectClusters = (state: TRootState) => state.clusters;

export const {deleteProduct, addProduct, deleteGroup, addGroup, updateClusters} = clustersSlice.actions;
export const {addHistoryItem, setCurrentIndex, removeHistoryItem} = historySlice.actions;
export const {setCurrentEntity} = entityInfoSlice.actions;

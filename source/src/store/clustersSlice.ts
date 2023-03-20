import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {IEntity, IChangeNode, INodeInf} from '../types';
import data from '../static/db.json';

const clusterSlice = createSlice({
    name: 'clusters',
    initialState: data as IEntity[],
    reducers: {
        deleteProduct(state, action: PayloadAction<IChangeNode>) {
            return state.map(cluster =>
                cluster.id === action.payload.cluster.id
                    ? {
                          ...cluster,
                          children: cluster.children?.map(group =>
                              group.id === action.payload.group?.id
                                  ? {
                                        ...group,
                                        children: group.children?.filter(
                                            product => product.id !== action.payload.product?.id
                                        ),
                                    }
                                  : group
                          ),
                      }
                    : cluster
            );
        },
        addProduct(state, action: PayloadAction<IChangeNode>) {
            return state.map(cluster =>
                cluster.id === action.payload.cluster.newId
                    ? {
                          ...cluster,
                          children: cluster.children?.map(group => {
                              const payload_group = action.payload.group as INodeInf;

                              return group.id === payload_group?.newId
                                  ? {
                                        ...group,
                                        children: [...(group.children || []), action.payload.product as IEntity],
                                    }
                                  : group;
                          }),
                      }
                    : cluster
            );
        },
        deleteGroup(state, action: PayloadAction<IChangeNode>) {
            return state.map(cluster =>
                cluster.id === action.payload.cluster.id
                    ? {
                          ...cluster,
                          children: cluster.children?.filter(group => group.id !== action.payload.group?.id),
                      }
                    : cluster
            );
        },
        addGroup(state, action: PayloadAction<IChangeNode>) {
            return state.map(cluster =>
                cluster.id === action.payload.cluster.newId
                    ? {
                          ...cluster,
                          children: [...(cluster.children || []), action.payload.group as IEntity],
                      }
                    : cluster
            );
        },
        updateClusters(_state, action: PayloadAction<IEntity[]>) {
            return action.payload;
        },
    },
});

export default clusterSlice;

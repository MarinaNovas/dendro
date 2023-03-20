import {FC} from 'react';
import {DragDropContext, DropResult} from 'react-beautiful-dnd';
import {useDispatch, useSelector} from 'react-redux';
import {addHistoryItem, selectClusters, updateClusters} from '../store';
import {getReoderedList, getTimeStamp} from '../utils';
import TreeBranch from './TreeBranch';

const TreePanel: FC = () => {
    const clusters = useSelector(selectClusters);
    const dispatch = useDispatch();

    const onDragEnd = (result: DropResult) => {
        const isInvalidDrop: boolean =
            !result.destination ||
            (result.source.droppableId === result.destination.droppableId &&
                result.source.index === result.destination.index);

        if (isInvalidDrop) {
            return;
        }

        dispatch(addHistoryItem({stack: clusters, timestamp: getTimeStamp()}));
        dispatch(updateClusters(getReoderedList(clusters, result)));
    };

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            {clusters.map(item => (
                <TreeBranch key={item.id} entity={item} />
            ))}
        </DragDropContext>
    );
};

export default TreePanel;

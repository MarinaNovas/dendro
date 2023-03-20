import {DropResult} from 'react-beautiful-dnd';
import {EEntityType} from './enums';
import {IEntity} from './types';

function reorder(list: IEntity[], startIndex: number, endIndex: number): IEntity[] {
    const result = [...list];
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
}

function findOrigin(list: IEntity[], id: string): IEntity | null {
    let originItem: IEntity | null = list?.find(item => item.id === id) || null;
    if (!originItem) {
        for (let element of list) {
            originItem = element.children ? findOrigin(element.children, id) : null;
            if (originItem) break;
        }
    }
    return originItem;
}

const changeMainList = (list: IEntity[], id: string, childrenList: IEntity[]): IEntity[] =>
    list.map(elem =>
        elem.id === id
            ? {...elem, children: childrenList}
            : elem?.children
            ? {...elem, children: changeMainList(elem.children, id, childrenList)}
            : elem
    );

export function getReoderedList(list: IEntity[] = [], result: DropResult): IEntity[] {
    const sourceIndex = result.source.index;
    const destIndex = result.destination!.index;

    const sourceDroppableId = result.source.droppableId;
    const destDroppableId = result.destination!.droppableId;

    const sourceItemList = findOrigin(list, sourceDroppableId)?.children;
    const destItemList = findOrigin(list, destDroppableId)?.children;

    if (!sourceItemList || !destItemList) {
        return list;
    }

    if (sourceDroppableId === destDroppableId) {
        const newSourceItemList = reorder(sourceItemList, sourceIndex, destIndex);
        return changeMainList(list, sourceDroppableId, newSourceItemList);
    } else {
        let newSourceItemList = [...sourceItemList];
        const [draggedItem] = newSourceItemList.splice(sourceIndex, 1);

        let newDestItemList = [...destItemList];
        newDestItemList.splice(destIndex, 0, draggedItem);

        let newList = changeMainList(list, sourceDroppableId, newSourceItemList);
        return changeMainList(newList, destDroppableId, newDestItemList);
    }
}

export const findCurrentCluster = (clusters: IEntity[] = [], entity: IEntity | null): IEntity | null =>
    (entity?.type === EEntityType.Product
        ? clusters.find(cluster =>
              cluster.children?.find(group => group.children?.find(product => product.id === entity.id))
          )
        : entity?.type === EEntityType.Group
        ? clusters.find(cluster => cluster.children?.find(group => group.id === entity.id))
        : clusters.find(cluster => cluster.id === entity?.id)) || null;

export const findCurrentGroup = (groups: IEntity[] = [], entity: IEntity | null): IEntity | null =>
    (entity?.type === EEntityType.Group
        ? groups.find(group => group.id === entity?.id)
        : entity?.type === EEntityType.Product
        ? groups.find(group => group.children?.find(product => product.id === entity.id))
        : null) || null;

export const getTimeStamp = (): string =>
    Intl.DateTimeFormat(undefined, {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
    }).format(new Date());

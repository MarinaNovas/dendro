import {Button, Grid, Select, SelectItem, Stack, TextInput} from '@mantine/core';
import {useEffect, useState, FC, useMemo} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {IEntity, IChangeNode, INodeInf} from '../types';
import {EEntityType} from '../enums';
import {findCurrentCluster, findCurrentGroup, getTimeStamp} from '../utils';
import {
    addHistoryItem,
    deleteGroup,
    deleteProduct,
    selectClusters,
    selectEntityInfo,
    setCurrentEntity,
    updateClusters,
} from '../store';

const EntityInfo: FC = () => {
    const [selectedGroup, setSelectedGroup] = useState<IEntity | null>(null);
    const [selectedCluster, setSelectedCluster] = useState<IEntity | null>(null);

    const clusters = useSelector(selectClusters);
    const {currentEntity} = useSelector(selectEntityInfo);
    const dispatch = useDispatch();

    const isProductAvailable = currentEntity?.type === EEntityType.Product;
    const isGroupAvailable = currentEntity?.type === EEntityType.Group || isProductAvailable;
    const isClusterAvailable = currentEntity?.type === EEntityType.Cluster || isGroupAvailable;

    const currentCluster = useMemo(() => findCurrentCluster(clusters, currentEntity), [clusters, currentEntity]);
    const currentGroup = useMemo(
        () => findCurrentGroup(currentCluster?.children, currentEntity),
        [currentCluster, currentEntity]
    );

    const clusterSelectOptions = useMemo<SelectItem[]>(
        () => clusters.map(({id, name}) => ({label: name, value: id})),
        [clusters]
    );

    const groupSelectOptions = useMemo<SelectItem[]>(
        () => currentCluster?.children?.map(({id, name}) => ({label: name, value: id})) || [],
        [currentCluster]
    );

    useEffect(() => {
        setSelectedCluster(currentCluster);
        setSelectedGroup(currentGroup);
    }, [currentCluster, currentGroup]);

    const handleDeleteBtnClick = () => {
        dispatch(addHistoryItem({stack: clusters, timestamp: getTimeStamp()}));

        const nodeInformation: IChangeNode = {
            cluster: {id: currentCluster?.id || null, newId: isGroupAvailable ? selectedCluster?.id : null},
            group: !isProductAvailable ? currentGroup : ({id: currentGroup?.id, newId: selectedGroup?.id} as INodeInf),
            product: isProductAvailable ? currentEntity : null,
        };

        if (isProductAvailable) {
            dispatch(deleteProduct(nodeInformation));
        } else if (isGroupAvailable) {
            dispatch(deleteGroup(nodeInformation));
        } else if (isClusterAvailable) {
            dispatch(updateClusters(clusters.filter(cluster => cluster.id !== currentCluster?.id)));
        }

        dispatch(setCurrentEntity(null));
    };

    const handleGroupSelect = (selectedId: string) => {
        const findedGroup: IEntity | null = currentCluster?.children?.find(({id}) => id == selectedId) || null;

        if (findedGroup?.id === currentGroup?.id) {
            return;
        }

        const prevProductList = currentGroup?.children?.filter(({id}) => id !== currentEntity?.id);
        const updatedProductList = currentEntity ? findedGroup?.children?.concat(currentEntity) : findedGroup?.children;

        const newClusterList = clusters.map(cluster =>
            cluster.id === currentCluster?.id
                ? {
                      ...cluster,
                      children: cluster.children?.map(group =>
                          group.id === currentGroup?.id
                              ? {...group, children: prevProductList}
                              : group.id === findedGroup?.id
                              ? {...group, children: updatedProductList}
                              : group
                      ),
                  }
                : cluster
        );

        setSelectedGroup(findedGroup);
        dispatch(addHistoryItem({stack: clusters, timestamp: getTimeStamp()}));
        dispatch(updateClusters(newClusterList));
    };

    const handleClusterSelect = (selectedId: string) => {
        const findedCluster = clusters.find(({id}) => id === selectedId) || null;

        if (findedCluster?.id === currentCluster?.id) {
            return;
        }

        if (currentEntity?.type === EEntityType.Group) {
            const prevGroupList = currentCluster?.children?.filter(({id}) => id !== currentEntity?.id);
            const updatedGroupList = currentEntity
                ? findedCluster?.children?.concat(currentEntity)
                : findedCluster?.children;

            const newClusterList = clusters.map(cluster =>
                cluster.id === currentCluster?.id
                    ? {...cluster, children: prevGroupList}
                    : cluster.id === findedCluster?.id
                    ? {...cluster, children: updatedGroupList}
                    : cluster
            );

            setSelectedGroup(findedCluster?.children?.[0] || null);
            setSelectedCluster(findedCluster);
            dispatch(addHistoryItem({stack: clusters, timestamp: getTimeStamp()}));
            dispatch(updateClusters(newClusterList));
        } else if (currentEntity?.type === EEntityType.Product) {
            const prevGroupList = currentCluster?.children?.map(group =>
                group.id === currentGroup?.id
                    ? {...group, children: group.children?.filter(p => p.id !== currentEntity.id)}
                    : group
            );
            const updatedGroupList = currentEntity
                ? findedCluster?.children?.map((group, index) =>
                      index === 0 ? {...group, children: group.children?.concat(currentEntity)} : group
                  )
                : findedCluster?.children;

            const newClusterList = clusters.map(cluster =>
                cluster.id === currentCluster?.id
                    ? {...cluster, children: prevGroupList}
                    : cluster.id === findedCluster?.id
                    ? {...cluster, children: updatedGroupList}
                    : cluster
            );

            setSelectedGroup(findedCluster?.children?.[0] || null);
            setSelectedCluster(findedCluster);
            dispatch(addHistoryItem({stack: clusters, timestamp: getTimeStamp()}));
            dispatch(updateClusters(newClusterList));
        }
    };

    return (
        <Grid grow>
            {isProductAvailable && (
                <Grid.Col>
                    <TextInput label="Продукт:" value={currentEntity?.name} disabled />
                </Grid.Col>
            )}

            {isGroupAvailable && (
                <Grid.Col>
                    {isProductAvailable ? (
                        <Select
                            label="Группа:"
                            value={selectedGroup?.id}
                            onChange={handleGroupSelect}
                            data={groupSelectOptions}
                        />
                    ) : (
                        <TextInput label="Группа:" value={currentGroup?.name} disabled />
                    )}
                </Grid.Col>
            )}

            {isClusterAvailable && (
                <Grid.Col>
                    {isGroupAvailable ? (
                        <Select
                            label="Кластер:"
                            value={selectedCluster?.id}
                            onChange={handleClusterSelect}
                            data={clusterSelectOptions}
                        />
                    ) : (
                        <TextInput label="Кластер:" value={currentCluster?.name} disabled />
                    )}
                </Grid.Col>
            )}

            {currentEntity?.id && (
                <Grid.Col>
                    <Stack align="center">
                        <Button color="red" onClick={handleDeleteBtnClick}>
                            Удалить
                        </Button>
                    </Stack>
                </Grid.Col>
            )}
        </Grid>
    );
};

export default EntityInfo;

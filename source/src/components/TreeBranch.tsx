import {Grid, Text, Paper} from '@mantine/core';
import {FC} from 'react';
import {Droppable} from 'react-beautiful-dnd';
import useMainTheme from '../hooks/useMainTheme';
import {IEntity} from '../types';
import TreeLeaf from './TreeLeaf';

interface IProps {
    entity: IEntity;
}

const TreeBranch: FC<IProps> = ({entity}) => {
    const mainTheme = useMainTheme();

    return (
        <Droppable droppableId={entity.id} type={entity.type}>
            {provided => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                    <Grid grow>
                        <Grid.Col sx={{marginBottom: 10}}>
                            <Paper
                                shadow="sm"
                                mb="md"
                                sx={() => ({
                                    backgroundColor: mainTheme.clusterColor,
                                    color: mainTheme.colorSecondary,
                                    padding: '10px 8px',
                                    width: 230,
                                    '& .mantine-Text-root': {
                                        lineHeight: 1.2,
                                        padding: '0 8px',
                                        fontSize: mainTheme.fontSize,
                                        fontWeight: mainTheme.fotnWeight,
                                    },
                                })}
                            >
                                <Text align="left">{entity.name}</Text>
                            </Paper>
                            {entity.children?.map((item, i) => (
                                <TreeLeaf key={item.id} entity={item} index={i} />
                            ))}
                        </Grid.Col>
                    </Grid>
                    {provided.placeholder}
                </div>
            )}
        </Droppable>
    );
};

export default TreeBranch;

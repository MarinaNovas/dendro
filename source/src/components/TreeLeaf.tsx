import {Grid, Paper, ActionIcon, Collapse, Text} from '@mantine/core';
import {FC, useState} from 'react';
import {Draggable, Droppable} from 'react-beautiful-dnd';
import {Minus, Plus} from 'tabler-icons-react';
import useMainTheme from '../hooks/useMainTheme';
import {EEntityType} from '../enums';
import {IEntity} from '../types';

interface IProps {
    entity: IEntity;
    index: number;
}

const TreeLeaf: FC<IProps> = ({entity, index}) => {
    const [isOpened, setIsOpened] = useState(true);
    const mainTheme = useMainTheme();

    return (
        <Draggable key={entity.id} draggableId={entity.id} index={index}>
            {provided => (
                <div {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}>
                    <Droppable droppableId={entity.id} type={entity.type}>
                        {provided => (
                            <div {...provided.droppableProps} ref={provided.innerRef}>
                                <Grid grow sx={{marginLeft: 22}}>
                                    <Grid.Col>
                                        <Paper
                                            shadow="sm"
                                            sx={() => ({
                                                display: 'flex',
                                                justifyContent: 'flex-start',
                                                alignItems: 'center',
                                                backgroundColor:
                                                    entity.type == EEntityType.Product
                                                        ? 'transparent'
                                                        : mainTheme.groupColor,
                                                color:
                                                    entity.type == EEntityType.Product
                                                        ? 'rgba(255, 255, 255,0.7)'
                                                        : mainTheme.color,

                                                marginBottom: entity.type == EEntityType.Product ? 0 : 10,

                                                padding: 5,
                                                width: entity.type == EEntityType.Product ? 168 : 200,
                                                border: entity.type == EEntityType.Product ? mainTheme.border : '',

                                                '& .mantine-Text-root': {
                                                    lineHeight: 1.2,
                                                    padding: '0 8px',
                                                    fontSize: mainTheme.fontSize,
                                                    fontWeight: mainTheme.fotnWeight,
                                                },
                                                '&:hover': {
                                                    color: mainTheme.color,
                                                    backgroundColor: mainTheme.colorHover,
                                                },
                                            })}
                                        >
                                            {entity.type === EEntityType.Group && (
                                                <ActionIcon
                                                    variant="transparent"
                                                    onClick={() => setIsOpened(prev => !prev)}
                                                >
                                                    {isOpened ? <Minus size={14} /> : <Plus size={14} />}
                                                </ActionIcon>
                                            )}
                                            <Text align="left">{entity.name}</Text>
                                        </Paper>

                                        {entity.type === EEntityType.Group && (
                                            <Collapse in={isOpened}>
                                                {entity.children?.map((item, i) => (
                                                    <TreeLeaf key={item.id} entity={item} index={i} />
                                                ))}
                                            </Collapse>
                                        )}
                                    </Grid.Col>
                                </Grid>
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </div>
            )}
        </Draggable>
    );
};

export default TreeLeaf;

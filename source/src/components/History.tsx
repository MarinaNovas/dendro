import {Group, ScrollArea, Text, Box, Stack, Button, Collapse, Center} from '@mantine/core';
import {MouseEventHandler, FC, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {getTimeStamp} from '../utils';
import {
    selectClusters,
    selectHistoryStack,
    selectHistoryCurrentIndex,
    updateClusters,
    setCurrentIndex,
    addHistoryItem,
} from '../store';
import useMainTheme from '../hooks/useMainTheme';

const History: FC = () => {
    const mainTheme = useMainTheme();
    const [isCollapsed, setIsCollapsed] = useState(false);

    const data = useSelector(selectClusters);
    const historyRecords = useSelector(selectHistoryStack);
    const historyCurrentIndex = useSelector(selectHistoryCurrentIndex);

    const dispatch = useDispatch();

    const isHistoryVisible = historyRecords.length > 0;

    const handleCurrentStateClick: MouseEventHandler<HTMLButtonElement> = () => {
        const index = historyRecords.length - 1;
        dispatch(updateClusters(historyRecords[index].stack));
        dispatch(setCurrentIndex(index));
    };

    const handleHistoryClick: MouseEventHandler<HTMLDivElement> = e => {
        const index = parseInt(e.currentTarget.id, 10);
        if (historyCurrentIndex === -1) {
            dispatch(addHistoryItem({stack: data, timestamp: getTimeStamp()}));
        }
        dispatch(updateClusters(historyRecords[index].stack));
        dispatch(setCurrentIndex(index));
    };

    return (
        <Stack>
            <Button
                sx={_theme => ({
                    fontWeight: 400,
                    fontSize: mainTheme.fontSize,
                    backgroundColor: mainTheme.groupColor,
                    color: mainTheme.color,
                })}
                disabled={!isHistoryVisible}
                variant="light"
                color="gray"
                onClick={() => setIsCollapsed(o => !o)}
            >
                <Group position="center">
                    <Text>История изменений</Text>
                </Group>
            </Button>

            <Collapse in={isCollapsed}>
                <Stack>
                    <ScrollArea type="auto" style={{height: 350, width: '100%'}}>
                        {historyRecords.map((item, index) => (
                            <Box
                                key={index}
                                id={index.toString()}
                                onClick={handleHistoryClick}
                                px="sm"
                                sx={theme => ({
                                    backgroundColor:
                                        index === historyCurrentIndex ? theme.colors.dark[4] : theme.colors.dark[8],

                                    textAlign: 'center',
                                    padding: theme.spacing.xs,
                                    borderRadius: theme.radius.xs,
                                    cursor: 'pointer',
                                    margin: theme.spacing.xs,

                                    '&:hover': {
                                        backgroundColor: mainTheme.colorHover,
                                    },
                                })}
                            >
                                <Group position="apart" grow>
                                    <Text>{`Версия - ${index}`}</Text>
                                    <Text>{item.timestamp}</Text>
                                </Group>
                            </Box>
                        ))}
                    </ScrollArea>

                    {historyCurrentIndex !== -1 && (
                        <Center>
                            <Button
                                color="gray"
                                variant="subtle"
                                onClick={handleCurrentStateClick}
                                sx={_theme => ({
                                    fontWeight: 400,
                                    fontSize: mainTheme.fontSize,
                                })}
                            >
                                Вернуть актуальную версию
                            </Button>
                        </Center>
                    )}
                </Stack>
            </Collapse>
        </Stack>
    );
};

export default History;

import {FC, useMemo} from 'react';
import {useSelector} from 'react-redux';
import {selectClusters} from '../store';
import {Button, Center} from '@mantine/core';

const ExportJson: FC = () => {
    const clusters = useSelector(selectClusters);

    const link = useMemo(() => {
        const fileBlob = new Blob([JSON.stringify(clusters)], {type: 'text/plain'});
        return URL.createObjectURL(fileBlob);
    }, [clusters]);

    return (
        <Center>
            <Button component="a" variant="light" color="blue" download="export.json" href={link}>
                Экспортировать json
            </Button>
        </Center>
    );
};

export default ExportJson;

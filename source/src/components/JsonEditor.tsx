import {JsonInput} from '@mantine/core';
import {FC, useMemo} from 'react';
import {useSelector} from 'react-redux';
import {selectClusters} from '../store';

const JsonEditor: FC = () => {
    const clusters = useSelector(selectClusters);
    const clustersJson = useMemo(() => JSON.stringify(clusters, null, 1), [clusters]);

    return (
        <JsonInput
            placeholder="[]"
            validationError="Некорректный json"
            formatOnBlur
            autosize
            minRows={42}
            value={clustersJson}
            disabled
        />
    );
};

export default JsonEditor;

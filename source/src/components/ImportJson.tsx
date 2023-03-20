import {Button} from '@mantine/core';
import Ajv, {JSONSchemaType} from 'ajv';
import {FC, useRef, ChangeEventHandler} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {selectClusters, addHistoryItem, updateClusters} from '../store';
import {IEntity} from '../types';
import {getTimeStamp} from '../utils';

const schema: JSONSchemaType<IEntity[]> = {
    type: 'array',
    items: {
        type: 'object',
        properties: {
            id: {
                type: 'string',
            },
            type: {
                type: 'string',
            },
            name: {
                type: 'string',
            },
            children: {
                $ref: '#',
            },
        },
        required: ['id', 'name', 'type'],
    },
    additionalProperties: false,
};

interface IProps {
    onImportFile: (isSuccess: boolean) => void;
}

const ImportJson: FC<IProps> = ({onImportFile}) => {
    const fileInput = useRef<HTMLInputElement>(null);

    const clusters = useSelector(selectClusters);
    const dispatch = useDispatch();

    const handleImportFile = () => {
        fileInput.current?.click();
    };

    const onChangeFile: ChangeEventHandler<HTMLInputElement> = async event => {
        event.stopPropagation();
        event.preventDefault();

        onImportFile(false);

        const file = event.currentTarget.files?.[0] || null;
        const fileText = await file?.text();
        const parsedFile = fileText ? JSON.parse(fileText) : null;

        if (fileInput.current?.value) {
            fileInput.current.value = '';
        }

        const ajv = new Ajv();

        const validate = ajv.compile(schema);

        if (validate(parsedFile)) {
            dispatch(addHistoryItem({stack: clusters, timestamp: getTimeStamp()}));
            dispatch(updateClusters(parsedFile));
        } else {
            onImportFile(true);
        }
    };

    return (
        <Button variant="light" color="blue" onClick={handleImportFile}>
            Импортировать json
            <input
                type="file"
                id="file"
                accept=".json"
                ref={fileInput}
                style={{display: 'none'}}
                onInput={onChangeFile}
            />
        </Button>
    );
};

export default ImportJson;

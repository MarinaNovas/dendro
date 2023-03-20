import {Container} from '@mantine/core';
import {FC} from 'react';
import {useSelector} from 'react-redux';
import {selectClusters} from '../store';
import Dendrogram from './Dendrogram';

const DendrogramList: FC = () => {
    const clusters = useSelector(selectClusters);

    return (
        <Container fluid>
            {clusters.map(cluster => (
                <Dendrogram key={cluster.id} cluster={cluster} />
            ))}
        </Container>
    );
};

export default DendrogramList;

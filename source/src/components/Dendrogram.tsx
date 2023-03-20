import {useMantineTheme} from '@mantine/core';
import {cluster, hierarchy, select, tree} from 'd3';
import {useEffect, useRef, FC, useMemo} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {selectEntityInfo, setCurrentEntity} from '../store';
import {IEntity} from '../types';

interface IProps {
    cluster: IEntity;
}

const Dendrogram: FC<IProps> = ({cluster: clusterData}) => {
    const {currentEntity} = useSelector(selectEntityInfo);
    const theme = useMantineTheme();
    const dispatch = useDispatch();

    const primaryColor = theme.colors.blue[2];
    const secondaryColor = theme.colors.blue[9];
    const lineColor = theme.colors.dark[4];
    const borderColor = theme.colors.dark[7];
    const textColor = theme.colors.gray[3];

    const d3Container = useRef(null);

    const padding = 1;
    const defaultOffset = 86;
    const width = window.screen.width - 600;
    const height = useMemo<number>(
        () =>
            clusterData.children?.reduce(
                (acc, current): number => (acc += (current.children?.length || 0) * defaultOffset),
                clusterData.children?.length
            ) || defaultOffset,
        [clusterData]
    );

    useEffect(() => {
        select(d3Container.current).selectAll('svg').remove();

        const d3Cluster = cluster<IEntity>();
        const root = hierarchy(clusterData, d => d.children);
        const preRootLayout = d3Cluster(root);

        const dx = 60;
        const dy = width / (preRootLayout.height + padding);
        const treeLayout = tree<IEntity>().nodeSize([dx, dy]);
        const rootLayout = treeLayout(preRootLayout);

        let x0 = Infinity;
        let x1 = -Infinity;
        rootLayout.each(d => {
            if (d.x > x1) x1 = d.x;
            if (d.x < x0) x0 = d.x;
        });

        const svg = select(d3Container.current)
            .append('svg')
            .attr('viewBox', [(-dy * padding) / 2, x0 - dx, width, height])
            .attr('width', width)
            .attr('height', height)
            .attr('style', 'max-width: 100%; height: auto; height: intrinsic;')
            .attr('font-family', 'sans-serif')
            .attr('font-size', 16);

        svg.selectAll('path')
            .data(rootLayout.descendants().slice(1))
            .join('path')
            .attr(
                'd',
                d =>
                    'M' +
                    d.y +
                    ',' +
                    d.x +
                    'C' +
                    (d.parent?.y ? d.parent?.y + 150 : 150) +
                    ',' +
                    d.x +
                    ' ' +
                    (d.parent?.y ? d.parent?.y + 50 : 50) +
                    ',' +
                    d.parent?.x +
                    ' ' +
                    d.parent?.y +
                    ',' +
                    d.parent?.x
            )
            .style('fill', 'none')
            .attr('stroke', lineColor);

        const selectedElements = svg.selectAll('g').data(rootLayout.descendants()).join('g');

        selectedElements
            .attr('transform', d => `translate(${d.y + 10},${d.x})`)
            .append('circle')
            .on('click', (event, d) => {
                if (d.data.id === currentEntity?.id) {
                    event.target.style.fill = primaryColor;
                    dispatch(setCurrentEntity(null));
                } else {
                    event.target.style.fill = secondaryColor;
                    dispatch(setCurrentEntity(d.data));
                }
            })
            .attr('r', 12)
            .style('fill', d => (d.data.id === currentEntity?.id ? primaryColor : secondaryColor))
            .attr('stroke', borderColor)
            .style('stroke-width', 3);

        selectedElements
            .append('text')
            .text(d => d.data.name)
            .style('font', `12px ${theme.fontFamily}`)
            .style('fill', textColor)
            .attr('x', -24)
            .attr('y', -24);
    }, [clusterData, currentEntity]);

    return <div ref={d3Container} />;
};

export default Dendrogram;

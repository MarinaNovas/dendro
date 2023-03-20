import {useMantineTheme} from '@mantine/core';
import {useMemo} from 'react';

const useMainTheme = () => {
    const theme = useMantineTheme();

    return useMemo(
        () => ({
            clusterColor: theme.fn.rgba(theme.colors.gray[7], 0.45),
            groupColor: theme.fn.rgba(theme.colors.gray[7], 0.22),
            colorHover: theme.fn.rgba(theme.colors.blue[9], 0.21),
            color: theme.colors.gray[0],
            colorSecondary: theme.fn.rgba(theme.colors.gray[0], 0.49),
            fontSize: 14,
            fotnWeight: 300,
            border: `1px solid ${theme.colors.gray[7]}`,
        }),
        [theme]
    );
};

export default useMainTheme;

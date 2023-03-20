import {
    AppShell,
    Aside,
    Button,
    Drawer,
    Grid,
    Group,
    Header,
    MantineProvider,
    Navbar,
    Title,
    ScrollArea,
    Notification,
    Space,
} from '@mantine/core';
import {useState, FC} from 'react';
import {createRoot} from 'react-dom/client';
import {Provider} from 'react-redux';
import {X} from 'tabler-icons-react';
import {store} from '../store';
import DendrogramList from '../components/DendrogramList';
import EntityInfo from '../components/EntityInfo';
import History from '../components/History';
import JsonEditor from '../components/JsonEditor';
import ImportJson from '../components/ImportJson';
import ExportJson from '../components/ExportJson';
import TreePanel from '../components/TreePanel';
import '../styles/reset.css';
import '../styles/app.css';

const Main: FC = () => {
    const [isDrawerOpened, setIsDrawerOpened] = useState(false);
    const [hasInvalidImport, setHasInvalidImport] = useState(false);

    const handleCloseDrawer = () => setIsDrawerOpened(false);
    const handleOpenDrawer = () => setIsDrawerOpened(true);

    return (
        <Provider store={store}>
            <MantineProvider theme={{fontFamily: 'Roboto', colorScheme: 'dark'}}>
                <AppShell
                    fixed
                    padding="md"
                    navbar={
                        <Navbar width={{base: 300}} p="xs">
                            <Navbar.Section grow mt="md">
                                <ScrollArea
                                    style={{height: window.screen.height - 240, width: '100%'}}
                                    offsetScrollbars
                                >
                                    <TreePanel />
                                </ScrollArea>
                            </Navbar.Section>
                        </Navbar>
                    }
                    header={
                        <Header height={60} p="xs">
                            <Group position="apart">
                                <Title order={3}>Project Dendro</Title>

                                <Group>
                                    <ImportJson onImportFile={isSuccess => setHasInvalidImport(isSuccess)} />

                                    <Button variant="light" color="gray" onClick={handleOpenDrawer}>
                                        Посмотреть json
                                    </Button>
                                </Group>

                                <Drawer
                                    opened={isDrawerOpened}
                                    onClose={handleCloseDrawer}
                                    title="Схема json"
                                    padding="xl"
                                    size="md"
                                >
                                    <ScrollArea type="auto" style={{height: window.screen.height - 280}}>
                                        <JsonEditor />
                                    </ScrollArea>

                                    <Space h="md" />

                                    <ExportJson />
                                </Drawer>
                            </Group>
                        </Header>
                    }
                    aside={
                        <Aside fixed p="md" hiddenBreakpoint="sm" width={{sm: 200, lg: 300}}>
                            <Aside.Section grow>
                                <EntityInfo />
                                <Space h="md" />
                            </Aside.Section>

                            <Aside.Section>
                                <History />
                            </Aside.Section>
                        </Aside>
                    }
                >
                    {hasInvalidImport && (
                        <Notification icon={<X size={18} />} color="red" onClose={() => setHasInvalidImport(false)}>
                            Некорректная схема!
                        </Notification>
                    )}
                    <Grid grow gutter="sm" justify="center">
                        <Grid.Col>
                            <DendrogramList />
                        </Grid.Col>
                    </Grid>
                </AppShell>
            </MantineProvider>
        </Provider>
    );
};

const root = createRoot(document.getElementById('app')!);
root.render(<Main />);

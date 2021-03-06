import React, { useState, useCallback, useEffect } from 'react';
import { useQuery } from 'react-apollo';
import { Button, CircularProgress, Box, Divider } from '@material-ui/core';
import SnackMessage from '../client/components/SnackMessage';
import PageTitle from '../components/PageTitle';
import { GET_HOSTS, GET_CONTAINERS, GET_PHYSICALS } from '../queries';

import HostConsole from './Console/HostConsole';
import ContainerConsole from './Console/ContainerConsole';
import AddHostDialog from './Console/AddHostDialog';
import AddContainerDialog from './Console/AddContainerDialog';

import { useStyles } from './Console/ConsoleStyle';
import PhysicalConsole from './Console/PhysicalConsole';
import AddPhysicalDialog from './Console/AddPhysicalDialog';

export default function Console() {
    const classes = useStyles();
    const [hostConsoleOpen, setHostConsoleOpen] = useState(true);
    const [selectedHost, setSelectedHost] = useState({});
    const [hosts, setHosts] = useState([]);
    const [physicals, setPhysicals] = useState([]);
    const { loading, error, data, refetch } = useQuery(GET_HOSTS);
    const { loading: phLoading, error: phError, data: phData, refetch: phRefetch } = useQuery(
        GET_PHYSICALS,
    );
    const [physicalDialogOpen, setPhysicalDialogOpen] = useState(false);
    const [hostDialogOpen, setHostDialogOpen] = useState(false);
    const [containerDialogOpen, setContainerDialogOpen] = useState(false);
    const [containers, setContainers] = useState([]);

    const handleOpenContainerConsole = useCallback((host) => {
        setHostConsoleOpen(false);
        setSelectedHost({ ...host });
    }, []);
    const {
        loading: loadingContainer,
        error: errorContainer,
        data: dataContainer,
        refetch: refetchContainer,
    } = useQuery(GET_CONTAINERS, {
        variables: {
            hostId: parseInt(selectedHost.id) || null,
        },
    });
    useEffect(() => {
        if (data) {
            setHosts(data.getHosts);
        }
    }, [data, setHosts]);
    useEffect(() => {
        if (phData) {
            setPhysicals(phData.getPhysicals);
        }
    }, [phData, setPhysicals]);
    useEffect(() => {
        if (dataContainer) {
            setContainers(dataContainer.getContainers);
        }
    }, [dataContainer, setContainers]);

    if (loading || phLoading || loadingContainer) return <CircularProgress />;
    if (error || phError || errorContainer)
        return (
            <SnackMessage message="???????????????. ????????? ?????? ??? ????????? ??????????????????. ?????? ?????? ?????? ??????????????????." />
        );

    return (
        <>
            {hostConsoleOpen && (
                <>
                    <PageTitle title="????????? ??????" />
                    <Divider />
                    <PageTitle title="?????? ??????" />
                    <AddPhysicalDialog
                        refetch={phRefetch}
                        setHostDialogOpen={setPhysicalDialogOpen}
                        hostDialogOpen={physicalDialogOpen}
                    />
                    <Box display="flex" flexDirection="row" justify="center" m={1}>
                        <span style={{ flex: 1, color: '#666' }}>
                            ?????? ????????? OS??? ??????????????? ????????????. ?????? ????????? ??????????????? ???????????????.
                        </span>
                        <Button
                            size="small"
                            color="primary"
                            variant="outlined"
                            onClick={() => {
                                setPhysicalDialogOpen(true);
                            }}
                        >
                            ???????????? ??????
                        </Button>
                    </Box>
                    <PhysicalConsole hosts={physicals} classes={classes} refetch={phRefetch} />
                    {physicals.length === 0 && (
                        <SnackMessage message="????????? ?????? ????????? ????????????. ????????? ???????????????." />
                    )}
                    <Divider style={{ marginTop: 30 }} />
                    <PageTitle title="????????? ?????? (?????????)" />
                    <AddHostDialog
                        refetch={refetch}
                        setHostDialogOpen={setHostDialogOpen}
                        hostDialogOpen={hostDialogOpen}
                    />
                    <Box display="flex" flexDirection="row" justify="center" m={1}>
                        <span style={{ flex: 1, color: '#666' }}>
                            ???????????? ???????????? ???????????? ????????? ???????????? ????????? ????????? ??? ????????????.
                        </span>
                        <Button
                            size="small"
                            color="primary"
                            variant="outlined"
                            onClick={() => {
                                setHostDialogOpen(true);
                            }}
                        >
                            ????????? ??????
                        </Button>
                    </Box>
                    <HostConsole
                        hosts={hosts}
                        classes={classes}
                        handleOpenContainerConsole={handleOpenContainerConsole}
                        refetch={refetch}
                    />
                    {hosts.length === 0 && (
                        <SnackMessage message="????????? ????????? ????????? ????????????. ???????????? ???????????????." />
                    )}
                </>
            )}
            {!hostConsoleOpen && (
                <>
                    <PageTitle title={`???????????? ?????? (?????????: ${selectedHost.name})`} />
                    <Box display="flex" flexDirection="row-reverse" justify="center">
                        <Button
                            size="small"
                            color="primary"
                            variant="outlined"
                            onClick={() => {
                                setContainerDialogOpen(true);
                            }}
                            style={{ marginLeft: 5 }}
                        >
                            ???????????? ??????
                        </Button>
                        <Button
                            onClick={() => setHostConsoleOpen(true)}
                            variant="outlined"
                            color="secondary"
                            size="small"
                        >
                            ????????? ????????? ????????????
                        </Button>
                    </Box>
                    <AddContainerDialog
                        refetch={refetchContainer}
                        setContainerDialogOpen={setContainerDialogOpen}
                        selectedHost={selectedHost}
                        containerDialogOpen={containerDialogOpen}
                    />
                    <ContainerConsole
                        containers={containers}
                        classes={classes}
                        refetch={refetchContainer}
                    />
                    {containers.length === 0 && (
                        <SnackMessage message="????????? ??????????????? ????????????. ??????????????? ???????????????." />
                    )}
                </>
            )}
        </>
    );
}

import React, { useState, useEffect, useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    CircularProgress,
    Divider,
} from '@material-ui/core';
import RefreshIcon from '@material-ui/icons/Refresh';
import SnackMessage from './components/SnackMessage';
import MonthlyReservationDialog from './MonthlyReservationDialog';
import { useQuery } from 'react-apollo';
import { GET_SERVERS_FROM_CLIENT, GET_CONTAINER_STATUS } from '../queries';
import PageTitle from '../components/PageTitle';
import StatusCircle from '../admin/Console/StatusCircle';

const useStyles = makeStyles((theme) => ({
    tableWrapper: {
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(5),
    },
    table: {
        minWidth: 500,
        '& .MuiTableCell-root': {
            padding: 10,
        },
    },
}));

export default function Dashboard() {
    const classes = useStyles();
    const [servers, setServers] = useState([]);
    const [open, setOpen] = useState([]);
    const [containerStatus, setContainerStatus] = useState([]);
    const { loading, error, data } = useQuery(GET_SERVERS_FROM_CLIENT);
    const { error: errorStatus, data: dataStatus, refetch: refetchStatus } = useQuery(
        GET_CONTAINER_STATUS,
    );

    const initOpen = (length) => {
        const array = new Array(length).fill(false);
        setOpen(array);
    };
    const handleOpenClick = useCallback(
        (id) => {
            let array = [...open];
            array[id] = true;
            setOpen(array);
        },
        [open],
    );

    useEffect(() => {
        if (data) {
            setServers(
                data.getServersFromClient.map((s) => {
                    return { ...s, ram: `${s.ram}GB` };
                }),
            );
            initOpen(servers.length);
        }
    }, [data, setServers, servers.length]);

    useEffect(() => {
        if (dataStatus) setContainerStatus([...dataStatus.getContainerStatus]);
    }, [dataStatus, setContainerStatus]);

    const getStatus = (id) => {
        const targetStatusData = containerStatus.find((s) => s.id === parseInt(id));
        return targetStatusData ? targetStatusData.status : null;
    };

    const handleRefreshClick = useCallback(() => {
        setTimeout(() => refetchStatus(), 0);
    }, [refetchStatus]);

    if (loading) return <CircularProgress />;
    if (error || errorStatus)
        return (
            <SnackMessage message="???????????????. ????????? ?????? ??? ????????? ??????????????????. ?????? ?????? ?????? ??????????????????." />
        );

    return (
        <div>
            <PageTitle title="????????????" />
            <SnackMessage message="??????????????? ???????????????????????? ???????????? ?????? ???????????????. ?????? ????????? ????????? ????????? ?????? ??? ???????????? ??????????????? ????????? ????????????????????????." />
            <Divider style={{ marginTop: 10, marginBottom: 20 }} />
            <PageTitle title="?????? ??????????????? ??????" />
            <TableContainer className={classes.tableWrapper} component={Paper}>
                <Table className={classes.table}>
                    <TableHead>
                        <TableRow>
                            <TableCell align="center" width={100}>
                                ?????? ID
                            </TableCell>
                            <TableCell align="center">??????</TableCell>
                            <TableCell align="center">??????</TableCell>
                            <TableCell align="center">OS</TableCell>
                            <TableCell align="center">CPU</TableCell>
                            <TableCell align="center">RAM</TableCell>
                            <TableCell align="center">
                                {'?????? '}
                                {loading && (
                                    <CircularProgress style={{ width: '14px', height: '14px' }} />
                                )}
                                <RefreshIcon
                                    style={{ fontSize: '14px', cursor: 'pointer' }}
                                    onClick={handleRefreshClick}
                                />
                            </TableCell>
                            <TableCell align="center" width={110}>
                                ????????????
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {servers
                            .filter((s) => s.isUsing === 0)
                            .map((row) => (
                                <TableRow key={row.id}>
                                    <TableCell align="center" component="th" scope="row">
                                        {row.id}
                                    </TableCell>
                                    <TableCell align="center" component="th" scope="row">
                                        {row.isPhysical === 0 ? '????????? ??????' : '?????? ??????'}
                                    </TableCell>
                                    <TableCell align="center">{row.name}</TableCell>
                                    <TableCell align="center">{row.os}</TableCell>
                                    <TableCell align="center">{row.cpu}</TableCell>
                                    <TableCell align="center">{row.ram}</TableCell>
                                    <TableCell align="center">
                                        {getStatus(row.id) === 1 ? (
                                            <StatusCircle color="green" />
                                        ) : (
                                            <StatusCircle color="crimson" />
                                        )}
                                    </TableCell>
                                    <TableCell align="center">
                                        <Button
                                            variant="outlined"
                                            color="primary"
                                            size="small"
                                            onClick={() => handleOpenClick(row.id)}
                                        >
                                            ??????
                                        </Button>
                                        {open[row.id] && (
                                            <MonthlyReservationDialog
                                                serverId={row.id}
                                                open={open}
                                                setOpen={setOpen}
                                            />
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <PageTitle title="?????? ???????????? ??????" />
            <TableContainer className={classes.tableWrapper} component={Paper}>
                <Table className={classes.table}>
                    <TableHead>
                        <TableRow>
                            <TableCell align="center" width={100}>
                                ?????? ID
                            </TableCell>
                            <TableCell align="center">??????</TableCell>
                            <TableCell align="center">??????</TableCell>
                            <TableCell align="center">OS</TableCell>
                            <TableCell align="center">CPU</TableCell>
                            <TableCell align="center">RAM</TableCell>
                            <TableCell align="center">
                                {'?????? '}
                                {loading && (
                                    <CircularProgress style={{ width: '14px', height: '14px' }} />
                                )}
                                <RefreshIcon
                                    style={{ fontSize: '14px', cursor: 'pointer' }}
                                    onClick={handleRefreshClick}
                                />
                            </TableCell>
                            <TableCell align="center" width={110}>
                                ????????????
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {servers
                            .filter((s) => s.isUsing === 1)
                            .map((row) => (
                                <TableRow key={row.id}>
                                    <TableCell align="center" component="th" scope="row">
                                        {row.id}
                                    </TableCell>
                                    <TableCell align="center" component="th" scope="row">
                                        {row.isPhysical === 0 ? '????????? ??????' : '?????? ??????'}
                                    </TableCell>
                                    <TableCell align="center">{row.name}</TableCell>
                                    <TableCell align="center">{row.os}</TableCell>
                                    <TableCell align="center">{row.cpu}</TableCell>
                                    <TableCell align="center">{row.ram}</TableCell>
                                    <TableCell align="center">
                                        {getStatus(row.id) === 1 ? (
                                            <StatusCircle color="green" />
                                        ) : (
                                            <StatusCircle color="crimson" />
                                        )}
                                    </TableCell>
                                    <TableCell align="center">
                                        <Button
                                            variant="outlined"
                                            color="primary"
                                            size="small"
                                            onClick={() => handleOpenClick(row.id)}
                                        >
                                            ??????
                                        </Button>
                                        {open[row.id] && (
                                            <MonthlyReservationDialog
                                                serverId={row.id}
                                                open={open}
                                                setOpen={setOpen}
                                            />
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}

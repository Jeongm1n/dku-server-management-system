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
    Box,
    FormControl,
    OutlinedInput,
    InputAdornment,
} from '@material-ui/core';
import ReservationConfirmDialog from './components/ReservationConfirmDialog';
import ReturnConfirmDialog from './components/ReturnConfirmDialog';
import SnackMessage from './components/SnackMessage';
import PageTitle from '../components/PageTitle';
import moment from 'moment';
import { useQuery } from 'react-apollo';
import { GET_CONFIRMS, GET_RETURN_CONFIRMS, GET_DEADLINE_RETURNS } from '../queries';

const useRowStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
            borderBottom: 'unset',
        },
    },
    tableWrapper: {
        marginTop: theme.spacing(1),
    },
    textField: {
        width: '19.5ch',
    },
}));

export default function Confirm() {
    const classes = useRowStyles();
    const [reservations, setReservations] = useState([]);
    const [returns, setReturns] = useState([]);
    const [deadline, setDeadline] = useState([]);
    const [userDDay, setUserDDay] = useState(7);
    const [dDay, setDDay] = useState(7);
    const [open, setOpen] = useState([]);
    const [returnOpen, setReturnOpen] = useState([]);
    const { loading, error, data, refetch } = useQuery(GET_CONFIRMS);
    const {
        loading: loadingReturns,
        error: errorReturns,
        data: dataReturns,
        refetch: refetchReturns,
    } = useQuery(GET_RETURN_CONFIRMS);

    const { loading: loadingDeadline, error: errorDeadline, data: dataDeadline } = useQuery(
        GET_DEADLINE_RETURNS,
        {
            variables: {
                dDay,
            },
        },
    );

    const initOpen = (length) => {
        const array = new Array(length).fill(false);
        setOpen(array);
    };

    const initReturnOpen = (length) => {
        const array = new Array(length).fill(false);
        setReturnOpen(array);
    };

    const handleOpenClick = useCallback(
        (id) => {
            let array = [...open];
            array[id] = true;
            setOpen(array);
        },
        [open],
    );

    const handleReturnOpenClick = useCallback(
        (id) => {
            let array = [...returnOpen];
            array[id] = true;
            setReturnOpen(array);
        },
        [returnOpen],
    );

    const handleSelectClick = useCallback(() => {
        setDDay(parseInt(userDDay));
    }, [userDDay]);

    const handleChange = useCallback((e) => {
        if (e.target.value >= 0) {
            setUserDDay(parseInt(e.target.value));
        } else return;
    }, []);

    useEffect(() => {
        if (data) {
            setReservations(
                data.getConfirms.map((c) => {
                    return { ...c };
                }),
            );
            initReturnOpen(reservations.length);
        }
    }, [data, setReservations, reservations.length]);

    useEffect(() => {
        if (dataReturns) {
            setReturns([...dataReturns.getReturnConfirms]);
            initOpen(returns.length);
        }
    }, [dataReturns, setReservations, returns.length]);

    useEffect(() => {
        if (dataDeadline) {
            setDeadline(dataDeadline.getDeadlineReturns);
        }
    }, [dataDeadline, setDeadline]);

    if (loading || loadingReturns) return <CircularProgress />;
    if (error || errorReturns || errorDeadline)
        return (
            <SnackMessage message="???????????????. ????????? ?????? ??? ????????? ??????????????????. ?????? ?????? ?????? ??????????????????." />
        );

    return (
        <>
            <div>
                <PageTitle title="????????? ???????????? ??????" />
                <TableContainer component={Paper} className={classes.tableWrapper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell align="center">?????? ?????????</TableCell>
                                <TableCell align="center">??????</TableCell>
                                <TableCell align="center">??????</TableCell>
                                <TableCell align="center">?????????</TableCell>
                                <TableCell align="center">?????????</TableCell>
                                <TableCell align="center">??????ID</TableCell>
                                <TableCell align="center">????????????</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {reservations.map((row, idx) => (
                                <TableRow key={idx} className={classes.root}>
                                    <TableCell align="center">{row.createdAt}</TableCell>
                                    <TableCell align="center">{row.userDepartment}</TableCell>
                                    <TableCell align="center">{row.userName}</TableCell>
                                    <TableCell align="center">{row.start}</TableCell>
                                    <TableCell align="center">{row.end}</TableCell>
                                    <TableCell align="center">{row.serverId}</TableCell>
                                    <TableCell align="center">
                                        <Button
                                            style={{ color: '#777' }}
                                            variant="outlined"
                                            size="small"
                                            onClick={() => handleOpenClick(row.id)}
                                        >
                                            ????????????
                                        </Button>
                                        <ReservationConfirmDialog
                                            id={row.id}
                                            open={open}
                                            setOpen={setOpen}
                                            refetch={refetch}
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                {!loading && reservations.length === 0 && (
                    <SnackMessage message="????????? ?????? ????????????." />
                )}
            </div>
            <div style={{ marginTop: 35 }}>
                <PageTitle title="????????? ???????????? ??????" />
                <TableContainer component={Paper} className={classes.tableWrapper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell align="center">?????? ?????????</TableCell>
                                <TableCell align="center">??????</TableCell>
                                <TableCell align="center">??????</TableCell>
                                <TableCell align="center">?????????</TableCell>
                                <TableCell align="center">?????????</TableCell>
                                <TableCell align="center">??????ID</TableCell>
                                <TableCell align="center">?????????</TableCell>
                                <TableCell align="center">????????????</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {returns.map((row, idx) => (
                                <TableRow key={idx} className={classes.root}>
                                    <TableCell align="center">{row.createdAt}</TableCell>
                                    <TableCell align="center">{row.userDepartment}</TableCell>
                                    <TableCell align="center">{row.userName}</TableCell>
                                    <TableCell align="center">{row.start}</TableCell>
                                    <TableCell align="center">{row.end}</TableCell>
                                    <TableCell align="center">{row.serverId}</TableCell>
                                    <TableCell align="center">{row.serverName}</TableCell>
                                    <TableCell align="center">
                                        <Button
                                            style={{ color: '#777' }}
                                            variant="outlined"
                                            size="small"
                                            onClick={() => handleReturnOpenClick(row.id)}
                                        >
                                            ????????????
                                        </Button>
                                        <ReturnConfirmDialog
                                            id={row.id}
                                            open={returnOpen}
                                            setOpen={setReturnOpen}
                                            refetch={refetchReturns}
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                {!loadingReturns && returns.length === 0 && (
                    <SnackMessage message="????????? ?????? ????????????." />
                )}
            </div>
            <div style={{ marginTop: 35 }}>
                <PageTitle title="????????? ?????? ??????" />
                <Box display="flex" flexDirection="row" justify="center" flexWrap="nowrap" m={1}>
                    <FormControl className={classes.textField} variant="outlined" size="small">
                        <OutlinedInput
                            type="number"
                            value={userDDay}
                            onChange={handleChange}
                            startAdornment={
                                <InputAdornment position="start">???????????????</InputAdornment>
                            }
                            endAdornment={<InputAdornment position="end">???</InputAdornment>}
                            labelWidth={0}
                        />
                    </FormControl>
                    <Button variant="outlined" color="primary" onClick={handleSelectClick}>
                        ??????
                    </Button>
                </Box>
                {loadingDeadline ? (
                    <CircularProgress />
                ) : (
                    <TableContainer component={Paper} className={classes.tableWrapper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell align="center">??????</TableCell>
                                    <TableCell align="center">??????</TableCell>
                                    <TableCell align="center">????????????</TableCell>
                                    <TableCell align="center">?????????</TableCell>
                                    <TableCell align="center">?????????</TableCell>
                                    <TableCell align="center">??????ID</TableCell>
                                    <TableCell align="center">?????????</TableCell>
                                    <TableCell align="center">??????</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {deadline.map((row, idx) => (
                                    <TableRow key={idx} className={classes.root}>
                                        <TableCell align="center">{row.userDepartment}</TableCell>
                                        <TableCell align="center">{row.userName}</TableCell>
                                        <TableCell align="center">{row.userTel}</TableCell>
                                        <TableCell align="center">{row.start}</TableCell>
                                        <TableCell align="center">{row.end}</TableCell>
                                        <TableCell align="center">{row.serverId}</TableCell>
                                        <TableCell align="center">{row.serverName}</TableCell>
                                        <TableCell align="center">
                                            {row.late === 1 && (
                                                <span
                                                    style={{
                                                        color: 'crimson',
                                                    }}
                                                >
                                                    {moment.duration(moment().diff(row.end)).days()}
                                                    ??? ??????
                                                </span>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
                {!loadingDeadline && deadline.length === 0 && (
                    <SnackMessage message="????????? ?????? ????????????." />
                )}
            </div>
        </>
    );
}

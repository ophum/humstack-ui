import React, { useState, useEffect, useCallback } from "react";
import {
    Container,
    Typography,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    TablePagination,
    makeStyles,
    createStyles,
    Theme,
    Button,
    Chip,
} from "@material-ui/core";
import { HeadMenu, HeadMenuActive } from "./HeadMenu";
import { useParams, useHistory } from "react-router";
import { useGlobalState } from "../../../../App";
import {
    VirtualRouter,
    VirtualRouterState,
} from "../../../../service/client/system/types";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        subSection: {
            marginTop: 10,
        },
        newButton: {
            margin: 10,
        },
    })
);

export interface VirtualRouterListPageProps {}

export function VirtualRouterListPage(_: VirtualRouterListPageProps) {
    const classes = useStyles();
    const history = useHistory();
    const [client] = useGlobalState("client");
    const { groupID, namespaceID } = useParams();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const [vmList, setVMList] = useState([] as VirtualRouter[]);

    const reload = useCallback(() => {
        client
            .SystemV0()
            .VirtualRouter()
            .List(groupID, namespaceID)
            .then((res) => {
                if (!res.ok || !res.data) {
                    return;
                }

                setVMList(res.data.virtualrouters);
            });
    }, [client, groupID, namespaceID]);

    useEffect(() => reload(), [reload]);

    const handleClickNewButton = () => {
        history.push(
            `/groups/${groupID}/namespaces/${namespaceID}/virtualrouters/new`
        );
    };

    const handleClickTableRow = (id: string) => {
        history.push(
            `/groups/${groupID}/namespaces/${namespaceID}/virtualrouters/show/${id}`
        );
    };

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };
    return (
        <Container>
            <Typography variant="h4">VirtualRouter</Typography>
            <HeadMenu
                active={HeadMenuActive.VirtualRouterList}
                groupID={groupID}
                namespaceID={namespaceID}
            />
            <Typography variant="h5" className={classes.subSection}>
                VirtualRouter List
            </Typography>
            <Button
                variant="contained"
                className={classes.newButton}
                color="primary"
                onClick={handleClickNewButton}
            >
                New
            </Button>
            <TableContainer>
                <Table stickyHeader aria-label="virtual router list table">
                    <TableHead>
                        <TableRow>
                            <TableCell key="id" align="left">
                                ID
                            </TableCell>
                            <TableCell key="name" align="left">
                                Name
                            </TableCell>
                            <TableCell key="state" align="left">
                                State
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {vmList
                            .slice(
                                page * rowsPerPage,
                                page * rowsPerPage + rowsPerPage
                            )
                            .map((vm) => {
                                return (
                                    <TableRow
                                        hover
                                        role="checkbox"
                                        tabIndex={-1}
                                        key={vm.meta.id}
                                        onClick={() =>
                                            handleClickTableRow(vm.meta.id)
                                        }
                                    >
                                        <TableCell align="left">
                                            {vm.meta.id}
                                        </TableCell>
                                        <TableCell align="left">
                                            {vm.meta.name}
                                        </TableCell>
                                        <TableCell align="left">
                                            <VirtualRouterStateChip
                                                state={vm.status.state}
                                            />
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={vmList.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
            />
        </Container>
    );
}

interface VirtualRouterStateChipProps {
    state: VirtualRouterState;
}

function VirtualRouterStateChip(props: VirtualRouterStateChipProps) {
    switch (props.state) {
        case VirtualRouterState.Running:
            return <Chip label="Running" color="primary" />;
        case VirtualRouterState.Pending:
            return <Chip label="Pending" color="secondary" />;
    }
    return <></>;
}

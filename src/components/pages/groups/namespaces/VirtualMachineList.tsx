import React, { useState, useEffect } from "react";
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
    VirtualMachine,
    VirtualmachineState,
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

export interface VirtualMachineListPageProps {}

export function VirtualMachineListPage(_: VirtualMachineListPageProps) {
    const classes = useStyles();
    const history = useHistory();
    const [client] = useGlobalState("client");
    const { groupID, namespaceID } = useParams();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const [vmList, setVMList] = useState([] as VirtualMachine[]);

    const reload = () => {
        client
            .SystemV0()
            .VirtualMachine()
            .List(groupID, namespaceID)
            .then((res) => {
                if (!res.ok || !res.data) {
                    return;
                }

                setVMList(res.data.virtualmachines);
            });
    };

    useEffect(() => reload(), []);

    const handleClickNewButton = () => {
        history.push(
            `/groups/${groupID}/namespaces/${namespaceID}/virtualmachines/new`
        );
    };

    const handleClickTableRow = (id: string) => {
        history.push(
            `/groups/${groupID}/namespaces/${namespaceID}/virtualmachines/show/${id}`
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
            <Typography variant="h4">VirtualMachine</Typography>
            <HeadMenu
                active={HeadMenuActive.VirtualMachineList}
                groupID={groupID}
                namespaceID={namespaceID}
            />
            <Typography variant="h5" className={classes.subSection}>
                VirtualMachine List
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
                <Table stickyHeader aria-label="virtual machine list table">
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
                                            <VirtualMachineStateChip
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

interface VirtualMachineStateChipProps {
    state: VirtualmachineState;
}

function VirtualMachineStateChip(props: VirtualMachineStateChipProps) {
    switch (props.state) {
        case VirtualmachineState.Running:
            return <Chip label="Running" color="primary" />;
        case VirtualmachineState.Pending:
            return <Chip label="Pending" color="secondary" />;
    }
    return <></>;
}

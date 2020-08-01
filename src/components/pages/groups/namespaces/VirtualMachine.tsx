import React from "react";
import {
    Theme,
    createStyles,
    makeStyles,
    Container,
    Typography,
    TableContainer,
    Paper,
    Table,
    TableBody,
    TableRow,
    TableCell,
    Button,
    List,
    ListItem,
} from "@material-ui/core";
import { useGlobalState } from "../../../../App";
import { useState, useEffect } from "react";
import { skelVirtualMachine } from "../../../../service/client/system/utils";
import { useParams, useHistory } from "react-router";
import { HeadMenuActive, HeadMenu } from "./HeadMenu";
import { VirtualMachineV0Annotation } from "../../../../service/client/system/annotations";
import { VirtualMachineActionState } from "../../../../service/client/system/types";

export interface VirtualMachinePageProps {}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        subSection: {
            marginTop: 10,
        },
        deleteButton: {
            margin: 10,
        },
        tableContainer: {
            marginTop: 10,
        },
    })
);
export function VirtualMachinePage(_: VirtualMachinePageProps) {
    const classes = useStyles();
    const history = useHistory();
    const { groupID, namespaceID, virtualmachineID } = useParams();

    const [client] = useGlobalState("client");

    const [vm, setVM] = useState(skelVirtualMachine());

    const reload = async () => {
        const res = await client
            .SystemV0()
            .VirtualMachine()
            .Get(groupID, namespaceID, virtualmachineID);
        if (!res.ok || !res.data) {
            return;
        }

        setVM(res.data.virtualmachine);
    };
    useEffect(() => {
        reload();
    }, []);

    const handleClickDeleteButton = async () => {
        const res = await client
            .SystemV0()
            .VirtualMachine()
            .Delete(groupID, namespaceID, virtualmachineID);
        if (!res.ok) {
            return;
        }

        history.push(
            `/groups/${groupID}/namespaces/${namespaceID}/virtualmachines`
        );
    };

    const moveBlockStorageByID = (id: string) => {
        history.push(
            `/groups/${groupID}/namespaces/${namespaceID}/blockstorages/${id}`
        );
    };
    const moveNetworkByID = (id: string) => {
        history.push(
            `/groups/${groupID}/namespaces/${namespaceID}/networks/${id}`
        );
    };

    const handleClickPowerOnButton = async () => {
        vm.spec.actionState = VirtualMachineActionState.PowerOn;
        const res = await client.SystemV0().VirtualMachine().Update(vm);
        if (!res) {
            return;
        }

        reload();
    };

    const handleClickPowerOffButton = async () => {
        vm.spec.actionState = VirtualMachineActionState.PowerOff;
        const res = await client.SystemV0().VirtualMachine().Update(vm);
        if (!res) {
            return;
        }

        reload();
    };
    return (
        <Container>
            <Typography variant="h4">VirtualMachine</Typography>
            <HeadMenu
                active={HeadMenuActive.VirtualMachine}
                groupID={groupID}
                namespaceID={namespaceID}
            />

            <Typography variant="h5" className={classes.subSection}>
                Details
            </Typography>
            {(() => {
                if (vm.spec.actionState === VirtualMachineActionState.PowerOn) {
                    return (
                        <Button
                            variant="outlined"
                            color="primary"
                            onClick={handleClickPowerOffButton}
                        >
                            PowerOff
                        </Button>
                    );
                }
                return (
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleClickPowerOnButton}
                    >
                        PowerOn
                    </Button>
                );
            })()}
            <Button
                variant="outlined"
                className={classes.deleteButton}
                color="secondary"
                onClick={handleClickDeleteButton}
            >
                Delete
            </Button>
            <TableContainer
                className={classes.tableContainer}
                component={Paper}
            >
                <Table>
                    <TableBody>
                        <TableRow>
                            <TableCell component="th" scope="row">
                                id
                            </TableCell>
                            <TableCell align="left">{vm.meta.id}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell component="th" scope="row">
                                name
                            </TableCell>
                            <TableCell align="left">{vm.meta.name}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell component="th" scope="row">
                                actionState
                            </TableCell>
                            <TableCell align="left">
                                {vm.spec.actionState}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell component="th" scope="row">
                                state
                            </TableCell>
                            <TableCell align="left">
                                {vm.status.state}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell component="th" scope="row">
                                requestVcpus/limitVcpus
                            </TableCell>
                            <TableCell align="left">
                                {vm.spec.requestVcpus}/{vm.spec.limitVcpus}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell component="th" scope="row">
                                requestMemory/limitMemory
                            </TableCell>
                            <TableCell align="left">
                                {vm.spec.requestMemory}/{vm.spec.limitMemory}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell component="th" scope="row">
                                blockStorageIDs
                            </TableCell>
                            <TableCell align="left">
                                <List>
                                    {vm.spec.blockStorageIDs.map((id) => (
                                        <ListItem
                                            key={id}
                                            onClick={() =>
                                                moveBlockStorageByID(id)
                                            }
                                        >
                                            {id}
                                        </ListItem>
                                    ))}
                                </List>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell component="th" scope="row">
                                nics
                            </TableCell>
                            <TableCell align="left">
                                <List>
                                    {vm.spec.nics.map((nic) => {
                                        return (
                                            <ListItem>
                                                <List>
                                                    <ListItem
                                                        onClick={() =>
                                                            moveNetworkByID(
                                                                nic.networkID
                                                            )
                                                        }
                                                    >
                                                        ID: {nic.networkID}
                                                    </ListItem>
                                                    <ListItem>
                                                        IPv4Address:{" "}
                                                        {nic.ipv4Address}
                                                    </ListItem>
                                                    <ListItem>
                                                        DefaultGateway:{" "}
                                                        {nic.defaultGateway}
                                                    </ListItem>
                                                    <ListItem>
                                                        Nameservers:
                                                        <List>
                                                            {nic.nameservers.map(
                                                                (ns) => (
                                                                    <ListItem>
                                                                        {ns}
                                                                    </ListItem>
                                                                )
                                                            )}
                                                        </List>
                                                    </ListItem>
                                                </List>
                                            </ListItem>
                                        );
                                    })}
                                </List>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell component="th" scope="row">
                                node
                            </TableCell>
                            <TableCell align="left">
                                {vm.meta.annotations &&
                                    vm.meta.annotations[
                                        VirtualMachineV0Annotation.NodeName
                                    ]}
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
}

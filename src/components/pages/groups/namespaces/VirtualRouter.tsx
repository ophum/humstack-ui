import React, { useCallback } from "react";
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
import { skelVirtualRouter } from "../../../../service/client/system/utils";
import { useParams, useHistory } from "react-router";
import { HeadMenuActive, HeadMenu } from "./HeadMenu";
import { VirtualRouterV0Annotation } from "../../../../service/client/system/annotations";

export interface VirtualRouterPageProps {}

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
export function VirtualRouterPage(_: VirtualRouterPageProps) {
    const classes = useStyles();
    const history = useHistory();
    const { groupID, namespaceID, virtualrouterID } = useParams();

    const [client] = useGlobalState("client");

    const [vr, setVR] = useState(skelVirtualRouter());

    const reload = useCallback(async () => {
        const res = await client
            .SystemV0()
            .VirtualRouter()
            .Get(groupID, namespaceID, virtualrouterID);
        if (!res.ok || !res.data) {
            return;
        }

        setVR(res.data.virtualrouter);
    }, [client, groupID, namespaceID, virtualrouterID]);
    useEffect(() => {
        reload();
    }, [reload]);

    const handleClickDeleteButton = async () => {
        const res = await client
            .SystemV0()
            .VirtualRouter()
            .Delete(groupID, namespaceID, virtualrouterID);
        if (!res.ok) {
            return;
        }

        history.push(
            `/groups/${groupID}/namespaces/${namespaceID}/virtualrouters`
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

    return (
        <Container>
            <Typography variant="h4">VirtualRouter</Typography>
            <HeadMenu
                active={HeadMenuActive.VirtualRouter}
                groupID={groupID}
                namespaceID={namespaceID}
            />

            <Typography variant="h5" className={classes.subSection}>
                Details
            </Typography>
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
                            <TableCell align="left">{vr.meta.id}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell component="th" scope="row">
                                name
                            </TableCell>
                            <TableCell align="left">{vr.meta.name}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell component="th" scope="row">
                                state
                            </TableCell>
                            <TableCell align="left">
                                {vr.status.state}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell component="th" scope="row">
                                externalGateway
                            </TableCell>
                            <TableCell align="left">
                                {vr.spec.externalGateway}
                            </TableCell>
                        </TableRow>

                        <TableRow>
                            <TableCell component="th" scope="row">
                                natGateway
                            </TableCell>
                            <TableCell align="left">
                                {vr.spec.natGatewayIP}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell component="th" scope="row">
                                externalIPs
                            </TableCell>
                            <TableCell align="left">
                                <List>
                                    {vr.spec.externalIPs.map((eip) => {
                                        return (
                                            <ListItem>
                                                <List>
                                                    <ListItem>
                                                        eipid:{" "}
                                                        {eip.externalIPID}
                                                    </ListItem>
                                                    <ListItem>
                                                        bindAddress:{" "}
                                                        {
                                                            eip.bindInternalIPv4Address
                                                        }
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
                                nics
                            </TableCell>
                            <TableCell align="left">
                                <List>
                                    {vr.spec.nics.map((nic) => {
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
                                                        NetworkID:{" "}
                                                        {nic.networkID}
                                                    </ListItem>
                                                    <ListItem>
                                                        IPv4Address:{" "}
                                                        {nic.ipv4Address}
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
                                {vr.meta.annotations &&
                                    vr.meta.annotations[
                                        VirtualRouterV0Annotation.NodeName
                                    ]}
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
}

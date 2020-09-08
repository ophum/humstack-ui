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
} from "@material-ui/core";
import { useGlobalState } from "../../../../App";
import { useState, useEffect } from "react";
import { skelNetwork } from "../../../../service/client/system/utils";
import { useParams, useHistory } from "react-router";
import { HeadMenuActive, HeadMenu } from "./HeadMenu";
import { NetworkV0Annotation } from "../../../../service/client/system/annotations";

export interface NetworkPageProps {}

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
export function NetworkPage(_: NetworkPageProps) {
    const classes = useStyles();
    const history = useHistory();
    const { groupID, namespaceID, networkID } = useParams();

    const [client] = useGlobalState("client");

    const [net, setNet] = useState(skelNetwork());

    const reload = useCallback(async () => {
        const res = await client
            .SystemV0()
            .Network()
            .Get(groupID, namespaceID, networkID);
        if (!res.ok || !res.data) {
            return;
        }

        setNet(res.data.network);
    }, [client, groupID, namespaceID, networkID]);
    useEffect(() => {
        reload();
    }, [reload]);

    const handleClickDeleteButton = async () => {
        const res = await client
            .SystemV0()
            .Network()
            .Delete(groupID, namespaceID, networkID);
        if (!res.ok) {
            return;
        }

        history.push(`/groups/${groupID}/namespaces/${namespaceID}/networks`);
    };
    return (
        <Container>
            <Typography variant="h4">Network</Typography>
            <HeadMenu
                active={HeadMenuActive.Network}
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
                            <TableCell align="left">{net.meta.id}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell component="th" scope="row">
                                name
                            </TableCell>
                            <TableCell align="left">{net.meta.name}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell component="th" scope="row">
                                ipv4 cidr
                            </TableCell>
                            <TableCell align="left">
                                {net.spec.ipv4CIDR}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell component="th" scope="row">
                                ipv6 cidr
                            </TableCell>
                            <TableCell align="left">
                                {net.spec.ipv6CIDR}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell component="th" scope="row">
                                type
                            </TableCell>
                            <TableCell align="left">
                                {net.meta.annotations &&
                                    net.meta.annotations[
                                        NetworkV0Annotation.NetworkType
                                    ]}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell component="th" scope="row">
                                gateway
                            </TableCell>
                            <TableCell align="left">
                                {net.meta.annotations &&
                                    net.meta.annotations[
                                        NetworkV0Annotation.DefaultGateway
                                    ]}
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
}

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
} from "@material-ui/core";
import { useGlobalState } from "../../../../App";
import { useState, useEffect } from "react";
import { skelBlockStorage } from "../../../../service/client/system/utils";
import { useParams, useHistory } from "react-router";
import { HeadMenuActive, HeadMenu } from "./HeadMenu";
import { BlockStorageV0Annotation } from "../../../../service/client/system/annotations";
import { BlockStorageFromType } from "../../../../service/client/system/types";

export interface BlockStoragePageProps {}

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
export function BlockStoragePage(_: BlockStoragePageProps) {
    const classes = useStyles();
    const history = useHistory();
    const { groupID, namespaceID, blockstorageID } = useParams();

    const [client] = useGlobalState("client");

    const [bs, setBS] = useState(skelBlockStorage());

    const reload = async () => {
        const res = await client
            .SystemV0()
            .BlockStorage()
            .Get(groupID, namespaceID, blockstorageID);
        if (!res.ok || !res.data) {
            return;
        }

        setBS(res.data.blockstorage);
    };
    useEffect(() => {
        reload();
    }, []);

    const handleClickDeleteButton = async () => {
        const res = await client
            .SystemV0()
            .BlockStorage()
            .Delete(groupID, namespaceID, blockstorageID);
        if (!res.ok) {
            return;
        }

        history.push(
            `/groups/${groupID}/namespaces/${namespaceID}/blockstorages`
        );
    };
    return (
        <Container>
            <Typography variant="h4">BlockStorage</Typography>
            <HeadMenu
                active={HeadMenuActive.BlockStorage}
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
                            <TableCell align="left">{bs.meta.id}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell component="th" scope="row">
                                name
                            </TableCell>
                            <TableCell align="left">{bs.meta.name}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell component="th" scope="row">
                                requestSize/limitSize
                            </TableCell>
                            <TableCell align="left">
                                {bs.spec.requestSize}/{bs.spec.limitSize}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell component="th" scope="row">
                                from
                            </TableCell>
                            <TableCell align="left">
                                {(() => {
                                    switch (bs.spec.from.type) {
                                        case BlockStorageFromType.HTTP:
                                            return bs.spec.from.http
                                                ? bs.spec.from.http.url
                                                : "";
                                        default:
                                            return "";
                                    }
                                })()}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell component="th" scope="row">
                                type
                            </TableCell>
                            <TableCell align="left">
                                {bs.meta.annotations &&
                                    bs.meta.annotations[
                                        BlockStorageV0Annotation.Type
                                    ]}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell component="th" scope="row">
                                node
                            </TableCell>
                            <TableCell align="left">
                                {bs.meta.annotations &&
                                    bs.meta.annotations[
                                        BlockStorageV0Annotation.NodeName
                                    ]}
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
}

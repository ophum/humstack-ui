import {
    Button,
    Container,
    createStyles,
    FormControl,
    InputLabel,
    makeStyles,
    MenuItem,
    Select,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    TextField,
    Theme,
    Typography,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import { useGlobalState } from "../../../../App";
import {
    BlockStorageV0Annotation,
    BlockStorageV0Type,
} from "../../../../service/client/system/annotations";
import {
    BlockStorage,
    Node,
    BlockStorageFromType,
} from "../../../../service/client/system/types";
import { HeadMenu, HeadMenuActive } from "./HeadMenu";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        subSection: {
            marginTop: 10,
        },
    })
);

export interface BlockStorageListPageProps {}

export function BlockStorageListPage(props: BlockStorageListPageProps) {
    const classes = useStyles();
    const history = useHistory();
    const [client] = useGlobalState("client");
    const { groupID, namespaceID } = useParams();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const [newBS, setNewBS] = useState({
        meta: {
            id: "",
            group: groupID,
            namespace: namespaceID,
            annotations: {} as { [key: string]: string },
        },
        spec: {
            requestSize: "",
            limitSize: "",
            from: {
                type: "",
            },
        },
    } as BlockStorage);
    const [nodeList, setNodeList] = useState([] as Node[]);
    const [bsList, setBSList] = useState([] as BlockStorage[]);

    const reload = () => {
        client
            .SystemV0()
            .BlockStorage()
            .List(groupID, namespaceID)
            .then((res) => {
                if (!res.ok || !res.data) {
                    return;
                }

                setBSList(res.data.blockstorages);
            });
        client
            .SystemV0()
            .Node()
            .List()
            .then((res) => {
                if (!res.ok || !res.data) {
                    return;
                }

                setNodeList(res.data.nodes);
            });
    };
    useEffect(() => reload(), []);

    const handleChangeNewBSID = (e: React.ChangeEvent<HTMLInputElement>) => {
        const updateBS = {
            ...newBS,
        };
        updateBS.meta.id = e.target.value;
        setNewBS(updateBS);
    };

    const handleChangeNewBSName = (e: React.ChangeEvent<HTMLInputElement>) => {
        const updateBS = {
            ...newBS,
        };
        updateBS.meta.name = e.target.value;
        setNewBS(updateBS);
    };

    const handleChangeNewBSType = (
        e: React.ChangeEvent<{ value: unknown }>
    ) => {
        const updateBS = {
            ...newBS,
        };
        if (!updateBS.meta.annotations) {
            updateBS.meta.annotations = {};
        }
        updateBS.meta.annotations[BlockStorageV0Annotation.NodeName] = e.target
            .value as string;
        setNewBS(updateBS);
    };

    const handleChangeNewBSHTTPURL = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const updateBS = {
            ...newBS,
        };
        updateBS.spec.from = {
            type: BlockStorageFromType.HTTP,
            http: {
                url: e.target.value,
            },
        };
        setNewBS(updateBS);
    };
    const handleChangeNewBSRequestSize = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const updateBS = {
            ...newBS,
        };
        updateBS.spec.requestSize = e.target.value;
        setNewBS(updateBS);
    };

    const handleChangeNewBSLimitSize = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const updateBS = {
            ...newBS,
        };
        updateBS.spec.limitSize = e.target.value;
        setNewBS(updateBS);
    };

    const handleClickCreateButton = async () => {
        console.log(newBS);
        if (!newBS.meta.annotations) {
            newBS.meta.annotations = {};
        }
        newBS.meta.annotations[BlockStorageV0Annotation.Type] =
            BlockStorageV0Type.Local;
        const res = await client.SystemV0().BlockStorage().Create(newBS);
        if (res.ok) {
            reload();
        }
    };

    const handleClickTableRow = (id: string) => {
        history.push(
            `/groups/${groupID}/namespaces/${namespaceID}/blockstorages/${id}`
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
            <Typography variant="h4">BlockStorage</Typography>
            <HeadMenu
                active={HeadMenuActive.BlockStorageList}
                groupID={groupID}
                namespaceID={namespaceID}
            />

            <Typography variant="h5" className={classes.subSection}>
                BlockStorage Create
            </Typography>
            <FormControl>
                <TextField
                    label="ID"
                    value={newBS.meta.id}
                    onChange={handleChangeNewBSID}
                />
                <TextField
                    label="Name"
                    value={newBS.meta.name}
                    onChange={handleChangeNewBSName}
                />
                <FormControl>
                    <InputLabel id="Node">Node</InputLabel>
                    <Select
                        labelId="Node"
                        id="NodeSelect"
                        value={
                            newBS.meta.annotations
                                ? newBS.meta.annotations[
                                      BlockStorageV0Annotation.NodeName
                                  ]
                                : ""
                        }
                        onChange={handleChangeNewBSType}
                    >
                        {nodeList.map((v) => (
                            <MenuItem value={v.meta.id}>{v.meta.id}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <TextField
                    label="FromURL"
                    value={newBS.spec.from.http ? newBS.spec.from.http.url : ""}
                    onChange={handleChangeNewBSHTTPURL}
                />
                <TextField
                    label="RequestSize"
                    value={newBS.spec.requestSize}
                    onChange={handleChangeNewBSRequestSize}
                />
                <TextField
                    label="LimitSize"
                    value={newBS.spec.limitSize}
                    onChange={handleChangeNewBSLimitSize}
                />
                <Button variant="contained" onClick={handleClickCreateButton}>
                    Create
                </Button>
            </FormControl>

            <Typography variant="h5" className={classes.subSection}>
                BlockStorage List
            </Typography>
            <TableContainer>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            <TableCell key="id" align="left">
                                ID
                            </TableCell>
                            <TableCell key="name" align="left">
                                Name
                            </TableCell>
                            <TableCell key="name" align="left">
                                State
                            </TableCell>
                            <TableCell key="type" align="left">
                                RequestSize/LimitSize
                            </TableCell>
                            <TableCell key="ipv4CIDR" align="left">
                                From
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {bsList
                            .slice(
                                page * rowsPerPage,
                                page * rowsPerPage + rowsPerPage
                            )
                            .map((bs) => {
                                return (
                                    <TableRow
                                        hover
                                        role="checkbox"
                                        tabIndex={-1}
                                        key={bs.meta.id}
                                        onClick={() =>
                                            handleClickTableRow(bs.meta.id)
                                        }
                                    >
                                        <TableCell align="left">
                                            {bs.meta.id}
                                        </TableCell>
                                        <TableCell align="left">
                                            {bs.meta.name}
                                        </TableCell>
                                        <TableCell align="left">
                                            {bs.status.state}
                                        </TableCell>
                                        <TableCell align="left">
                                            {bs.spec.requestSize}/
                                            {bs.spec.limitSize}
                                        </TableCell>
                                        <TableCell align="left">
                                            {bs.spec.from.type}
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
                count={bsList.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
            />
        </Container>
    );
}

import {
    Button,
    Container,
    Table,
    TableContainer,
    TextField,
    Typography,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    TablePagination,
    makeStyles,
    Theme,
    createStyles,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import { useGlobalState } from "../../../../App";
import { Network } from "../../../../service/client/system/types";
import { HeadMenuActive, HeadMenu } from "./HeadMenu";
import {
    NetworkV0Annotation,
    NetworkV0NetworkType,
} from "../../../../service/client/system/annotations";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        subSection: {
            marginTop: 10,
        },
    })
);

export interface NetworkListPageProps {}

export function NetworkListPage(props: NetworkListPageProps) {
    const classes = useStyles();
    const history = useHistory();
    const [client] = useGlobalState("client");
    const { groupID, namespaceID } = useParams();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const [newNet, setNewNet] = useState({
        meta: {
            id: "",
            group: groupID,
            namespace: namespaceID,
            annotations: {} as { [key: string]: string },
        },
        spec: {
            ipv4CIDR: "",
            ipv6CIDR: "",
        },
    } as Network);
    const [netList, setNetList] = useState([] as Network[]);

    const reload = () => {
        client
            .SystemV0()
            .Network()
            .List(groupID, namespaceID)
            .then((res) => {
                if (!res.ok || !res.data) {
                    return;
                }

                setNetList(res.data.networks);
            });
    };
    useEffect(() => reload(), []);

    const handleChangeNewNetID = (e: React.ChangeEvent<HTMLInputElement>) => {
        const updateNet = {
            ...newNet,
        };
        updateNet.meta.id = e.target.value;
        setNewNet(updateNet);
    };

    const handleChangeNewNetName = (e: React.ChangeEvent<HTMLInputElement>) => {
        const updateNet = {
            ...newNet,
        };
        updateNet.meta.name = e.target.value;
        setNewNet(updateNet);
    };

    const handleChangeNewNetNetworkType = (
        e: React.ChangeEvent<{ value: unknown }>
    ) => {
        const updateNet = {
            ...newNet,
        };
        if (!updateNet.meta.annotations) {
            updateNet.meta.annotations = {};
        }
        updateNet.meta.annotations[NetworkV0Annotation.NetworkType] = e.target
            .value as string;
        setNewNet(updateNet);
    };

    const handleChangeNewNetIPv4CIDR = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const updateNet = {
            ...newNet,
        };
        updateNet.spec.ipv4CIDR = e.target.value;
        setNewNet(updateNet);
    };

    const handleChangeNewNetIPv6CIDR = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const updateNet = {
            ...newNet,
        };
        updateNet.spec.ipv6CIDR = e.target.value;
        setNewNet(updateNet);
    };

    const handleChangeNewNetDefaultGateway = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const updateNet = {
            ...newNet,
        };
        if (!updateNet.meta.annotations) {
            updateNet.meta.annotations = {};
        }
        updateNet.meta.annotations[NetworkV0Annotation.DefaultGateway] =
            e.target.value;
        setNewNet(updateNet);
    };

    const handleClickCreateButton = async () => {
        const res = await client.SystemV0().Network().Create(newNet);
        if (res.ok) {
            reload();
        }
    };

    const handleClickTableRow = (id: string) => {
        history.push(
            `/groups/${groupID}/namespaces/${namespaceID}/networks/${id}`
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
            <Typography variant="h4">Network</Typography>
            <HeadMenu
                active={HeadMenuActive.NetworkList}
                groupID={groupID}
                namespaceID={namespaceID}
            />

            <Typography variant="h5" className={classes.subSection}>
                Network Create
            </Typography>
            <FormControl>
                <TextField
                    label="ID"
                    value={newNet.meta.id}
                    onChange={handleChangeNewNetID}
                />
                <TextField
                    label="Name"
                    value={newNet.meta.name}
                    onChange={handleChangeNewNetName}
                />
                <FormControl>
                    <InputLabel id="NetworkType">NetworkType</InputLabel>
                    <Select
                        labelId="NetworkType"
                        id="NetworkTypeSelect"
                        value={
                            newNet.meta.annotations
                                ? newNet.meta.annotations[
                                      NetworkV0Annotation.NetworkType
                                  ]
                                : ""
                        }
                        onChange={handleChangeNewNetNetworkType}
                    >
                        {Object.keys(NetworkV0NetworkType).map((v) => (
                            <MenuItem value={v}>{v}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <TextField
                    label="IPv4CIDR"
                    value={newNet.spec.ipv4CIDR}
                    onChange={handleChangeNewNetIPv4CIDR}
                />
                <TextField
                    label="IPv6CIDR"
                    value={newNet.spec.ipv6CIDR}
                    onChange={handleChangeNewNetIPv6CIDR}
                />
                <TextField
                    label="DefaultGateway"
                    value={
                        newNet.meta.annotations
                            ? newNet.meta.annotations[
                                  NetworkV0Annotation.DefaultGateway
                              ]
                            : ""
                    }
                    onChange={handleChangeNewNetDefaultGateway}
                />
                <Button variant="contained" onClick={handleClickCreateButton}>
                    Create
                </Button>
            </FormControl>

            <Typography variant="h5" className={classes.subSection}>
                Network List
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
                            <TableCell key="ipv4CIDR" align="left">
                                IPv4 CIDR
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {netList
                            .slice(
                                page * rowsPerPage,
                                page * rowsPerPage + rowsPerPage
                            )
                            .map((net) => {
                                return (
                                    <TableRow
                                        hover
                                        role="checkbox"
                                        tabIndex={-1}
                                        key={net.meta.id}
                                        onClick={() =>
                                            handleClickTableRow(net.meta.id)
                                        }
                                    >
                                        <TableCell align="left">
                                            {net.meta.id}
                                        </TableCell>
                                        <TableCell align="left">
                                            {net.meta.name}
                                        </TableCell>
                                        <TableCell align="left">
                                            {net.spec.ipv4CIDR}
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
                count={netList.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
            />
        </Container>
    );
}

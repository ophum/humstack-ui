import {
    Button,
    Container,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    TextField,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import { useGlobalState } from "../../../../App";
import { Namespace } from "../../../../service/client/core/types";
import { HeadMenu, HeadMenuActive } from "./HeadMenu";

export interface NamespaceListPageProps {}

export function NamespaceListPage(props: NamespaceListPageProps) {
    const { groupID } = useParams();
    const history = useHistory();

    const [clinet] = useGlobalState("client");
    const [, setIsLogin] = useGlobalState("isLogin");
    const [nsList, setNSList] = useState([] as Namespace[]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const [newNS, setNewNS] = useState({
        meta: {
            id: "",
        },
        spec: {},
    } as Namespace);

    const reload = () => {
        clinet
            .CoreV0()
            .Namespace()
            .List(groupID!)
            .then((res) => {
                if (!res.ok || !res.data) {
                    history.push(`/groups/${groupID}`);
                    return;
                }
                setNSList(res.data?.namespaces);
            });
    };
    useEffect(() => reload(), [groupID]);

    const changeNewNSName = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewNS({
            ...newNS,
            meta: {
                id: e.target.value,
            },
        });
    };

    const clickCreateNamespaceButton = async () => {
        newNS.meta.group = groupID;
        const res = await clinet.CoreV0().Namespace().Create(newNS);
        if (res.ok) {
            reload();
        }
    };

    const handleClickTableRow = (id: string) => {
        history.push(`/groups/${groupID}/namespaces/${id}`);
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
            <div>
                <TextField
                    value={newNS.meta.id}
                    label="id"
                    onChange={changeNewNSName}
                />
                <Button
                    variant="contained"
                    onClick={clickCreateNamespaceButton}
                >
                    Create
                </Button>
            </div>
            <TableContainer>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            <TableCell key="id" align="left">
                                ID
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {nsList
                            .slice(
                                page * rowsPerPage,
                                page * rowsPerPage + rowsPerPage
                            )
                            .map((ns) => {
                                return (
                                    <TableRow
                                        hover
                                        role="checkbox"
                                        tabIndex={-1}
                                        key={ns.meta.id}
                                        onClick={() =>
                                            handleClickTableRow(ns.meta.id)
                                        }
                                    >
                                        <TableCell align="left">
                                            {ns.meta.id}
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
                count={nsList.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
            />
        </Container>
    );
}

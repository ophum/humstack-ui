import React, { useEffect, useState } from "react";
import { Container, TextField, Button } from "@material-ui/core";
import { useParams, useHistory } from "react-router";
import { useGlobalState } from "../../App";
import { Namespace } from "../../service/client/core/types";
import { networkInterfaces } from "os";

export interface NamespaceListPageProps {}

export function NamespaceListPage(props: NamespaceListPageProps) {
    const { groupID } = useParams();
    const history = useHistory();

    const [clinet] = useGlobalState("client");
    const [, setIsLogin] = useGlobalState("isLogin");
    const [nsList, setNSList] = useState([] as Namespace[]);

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
        const res = await clinet.CoreV0().Namespace().Create(newNS);
        if (res.ok) {
            reload();
        }
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
            <tr>
                {nsList.length === 0 && <>Not Found</>}
                {nsList.map((v, k) => {
                    return <td key={k}>{v.meta.id}</td>;
                })}
            </tr>
        </Container>
    );
}

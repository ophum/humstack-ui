import React, { useState, useEffect } from "react";
import { Container, Typography, TextField, Button } from "@material-ui/core";
import { useHistory, useParams } from "react-router";
import { Network } from "../../../../service/client/system/types";
import { useGlobalState } from "../../../../App";

export interface NetworkListPageProps {}

export function NetworkListPage(props: NetworkListPageProps) {
    const history = useHistory();
    const [client] = useGlobalState("client");
    const { groupID, namespaceID } = useParams();

    const [newNet, setNewNet] = useState({
        meta: {
            id: "",
            group: groupID,
            namespace: namespaceID,
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

    const handleClickCreateButton = async () => {
        const res = await client.SystemV0().Network().Create(newNet);
        if (res.ok) {
            reload();
        }
    };

    return (
        <Container>
            <Typography variant="h4">
                {`Group>${groupID} Namespace>${namespaceID} Network> `}
            </Typography>
            <div>
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
                <Button variant="contained" onClick={handleClickCreateButton}>
                    Create
                </Button>
            </div>
            {netList.map((net, k) => {
                return (
                    <li key={k}>
                        {net.meta.name} {net.spec.ipv4CIDR}
                    </li>
                );
            })}
        </Container>
    );
}

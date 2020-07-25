import React, { useState, useEffect } from "react";
import {
    Container,
    Theme,
    makeStyles,
    createStyles,
    Typography,
    FormControl,
    TextField,
    InputLabel,
    Select,
    MenuItem,
    Button,
} from "@material-ui/core";
import { HeadMenu, HeadMenuActive } from "./HeadMenu";
import { useParams } from "react-router";
import {
    Node,
    VirtualMachine,
    BlockStorage,
    BlockStorageState,
    Network,
} from "../../../../service/client/system/types";
import { useGlobalState } from "../../../../App";
import { skelVirtualMachine } from "../../../../service/client/system/utils";
import {
    VirtualMachineV0Annotation,
    BlockStorageV0Annotation,
} from "../../../../service/client/system/annotations";

const useStyles = makeStyles((theme: Theme) => createStyles({}));

export interface VirtualMachineCreatePageProps {}

export function VirtualMachineCreatePage(_: VirtualMachineCreatePageProps) {
    const classes = useStyles();
    const { groupID, namespaceID } = useParams();
    const [client] = useGlobalState("client");

    const [nodeList, setNodeList] = useState([] as Node[]);
    const [bsList, setBSList] = useState([] as BlockStorage[]);
    const [netList, setNetList] = useState([] as Network[]);

    const [newVM, setNewVM] = useState({
        ...skelVirtualMachine(),
        spec: {
            loginUsers: [
                {
                    username: "",
                    sshAuthorizedKeys: [""],
                },
            ],
        },
    });

    const [selectedBSID, setSelectedBSID] = useState("");
    const [selectedNetID, setSelectedNetID] = useState("");

    const reload = () => {
        console.log("hello");
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

    return (
        <Container>
            <Typography variant="h4">VirtualMachine</Typography>
            <HeadMenu
                active={HeadMenuActive.VirtualMachineCreate}
                groupID={groupID}
                namespaceID={namespaceID}
            />
            <Typography variant="h5">VirtualMachine Create</Typography>
            <FormControl>
                <TextField label="ID" value={newVM.meta.id} />
                <TextField label="Name" value={newVM.meta.name} />
                <FormControl>
                    <InputLabel id="Node">Node</InputLabel>
                    <Select
                        labelId="Node"
                        id="NodeSelect"
                        value={
                            newVM.meta.annotations
                                ? newVM.meta.annotations[
                                      VirtualMachineV0Annotation.NodeName
                                  ]
                                : ""
                        }
                    >
                        {nodeList.map((node) => (
                            <MenuItem value={node.meta.id}>
                                {node.meta.id}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl>
                    <InputLabel id="BlockStorage">BlockStorage</InputLabel>
                    <Select
                        labelId="BlockStorage"
                        id="BlockStorageSelect"
                        value={bsList.find((bs) => bs.meta.id === selectedBSID)}
                    >
                        {bsList.map((bs) => (
                            <MenuItem value={bs.meta.id}>{bs.meta.id}</MenuItem>
                        ))}
                    </Select>
                    <Button variant="contained">Add</Button>
                </FormControl>
                <FormControl>
                    <InputLabel id="Network">Network</InputLabel>
                    <Select
                        labelId="Network"
                        id="NetworkSelect"
                        value={netList.find(
                            (net) => net.meta.id === selectedNetID
                        )}
                    >
                        {netList.map((net) => (
                            <MenuItem value={net.meta.id}>
                                {net.meta.id}
                            </MenuItem>
                        ))}
                    </Select>
                    <Button variant="contained">Add</Button>
                </FormControl>
                <FormControl>
                    <TextField
                        label="Username"
                        value={newVM.spec.loginUsers[0].username}
                    />
                    <TextField
                        label="SSH Public Key"
                        value={newVM.spec.loginUsers[0].sshAuthorizedKeys[0]}
                    />
                </FormControl>
                <Button variant="contained" color="primary">
                    Create
                </Button>
            </FormControl>
        </Container>
    );
}

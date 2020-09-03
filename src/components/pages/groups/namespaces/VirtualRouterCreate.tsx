import {
    Button,
    Card,
    CardActions,
    CardContent,
    Container,
    createStyles,
    FormControl,
    InputLabel,
    makeStyles,
    MenuItem,
    Select,
    TextField,
    Theme,
    Typography,
    Paper,
} from "@material-ui/core";
import React, { useEffect, useState, useCallback } from "react";
import { useParams, useHistory } from "react-router";
import { useGlobalState } from "../../../../App";
import {
    VirtualRouterV0Annotation,
    NetworkV0Annotation,
} from "../../../../service/client/system/annotations";
import {
    BlockStorage,
    Network,
    Node,
    VirtualRouterNIC,
    BlockStorageState,
} from "../../../../service/client/system/types";
import { skelVirtualRouter } from "../../../../service/client/system/utils";
import { HeadMenu, HeadMenuActive } from "./HeadMenu";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        paper: {
            marginTop: 10,
            padding: 10,
        },
        formControl: {
            minWidth: 300,
        },
    })
);

export interface VirtualRouterCreatePageProps {}

interface AttachedNetwork {
    network: Network;
    nic: VirtualRouterNIC;
}

const VCPUList = ["1000m", "2000m", "4000m", "8000m"];
const MemoryList = ["256M", "512M", "1G", "2G", "4G", "8G", "16G", "32G"];

export function VirtualRouterCreatePage(_: VirtualRouterCreatePageProps) {
    const classes = useStyles();
    const history = useHistory();
    const { groupID, namespaceID } = useParams();
    const [client] = useGlobalState("client");

    const [nodeList, setNodeList] = useState([] as Node[]);
    const [bsList, setBSList] = useState([] as BlockStorage[]);
    const [netList, setNetList] = useState([] as Network[]);

    const [selectedNetID, setSelectedNetID] = useState("");
    const [nicIPv4Address, setNICIPv4Address] = useState("");

    const [nicList, setNICList] = useState([] as VirtualRouterNIC[]);

    const [newVR, setNewVR] = useState({
        ...skelVirtualRouter(),
    });

    const reload = useCallback(() => {
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

                setBSList(
                    res.data.blockstorages.filter(
                        (bs) => bs.status.state !== BlockStorageState.Used
                    )
                );
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
    }, [client, groupID, namespaceID]);
    useEffect(() => reload(), [reload]);

    const handleChangeNewVRID = (e: React.ChangeEvent<HTMLInputElement>) => {
        const updateNewVR = { ...newVR };
        updateNewVR.meta.id = e.target.value;
        setNewVR(updateNewVR);
    };

    const handleChangeNewVRName = (e: React.ChangeEvent<HTMLInputElement>) => {
        const updateNewVR = { ...newVR };
        updateNewVR.meta.name = e.target.value;
        setNewVR(updateNewVR);
    };

    const handleChangeNewVRExternalGateway = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const updateNewVR = { ...newVR };
        updateNewVR.spec.externalGateway = e.target.value;
        setNewVR(updateNewVR);
    };

    const handleChangeNewVRExternalIP = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const updateNewVR = { ...newVR };
        updateNewVR.spec.externalIPs = [
            {
                externalIPID: e.target.value,
                bindInternalIPv4Address: "192.168.10.1",
            },
        ];
        setNewVR(updateNewVR);
    };
    const handleChangeNewVRNode = (
        e: React.ChangeEvent<{ value: unknown }>
    ) => {
        const updateNewVR = { ...newVR };
        if (!updateNewVR.meta.annotations) {
            updateNewVR.meta.annotations = {} as { [key: string]: string };
        }
        updateNewVR.meta.annotations[VirtualRouterV0Annotation.NodeName] = e
            .target.value as string;
        setNewVR(updateNewVR);
    };

    const handleChangeSelectedNetID = (
        e: React.ChangeEvent<{ value: unknown }>
    ) => {
        setSelectedNetID(e.target.value as string);
    };

    const handleChangeNICIPv4Address = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        setNICIPv4Address(e.target.value);
    };
    const handleClickAddNICButton = () => {
        const selectedNet = netList.find(
            (net) => net.meta.id === selectedNetID
        );
        if (!selectedNet) {
            return;
        }
        setNICList([
            ...nicList,
            {
                networkID: selectedNetID,
                ipv4Address: nicIPv4Address,
            },
        ]);
        setSelectedNetID("");
        setNICIPv4Address("");
    };

    const popNICList = (index: number) => {
        if (index < 0 || index >= nicList.length) {
            return;
        }

        const popNIC = nicList[index];
        setNICList(nicList.filter((_, i) => i !== index));
    };

    const handleClickCreateVRButton = async () => {
        const vr = { ...newVR };
        vr.meta.group = groupID;
        vr.meta.namespace = namespaceID;

        vr.spec.nics = nicList;
        const res = await client.SystemV0().VirtualRouter().Create(vr);
        if (!res.ok || !res.data) {
            return;
        }

        history.push(
            `/groups/${groupID}/namespaces/${namespaceID}/virtualrouters`
        );
    };
    return (
        <Container>
            <Typography variant="h4">VirtualRouter</Typography>
            <HeadMenu
                active={HeadMenuActive.VirtualRouterCreate}
                groupID={groupID}
                namespaceID={namespaceID}
            />
            <Typography variant="h5">VirtualRouter Create</Typography>
            <Paper className={classes.paper}>
                <FormControl className={classes.formControl}>
                    <TextField
                        label="ID"
                        value={newVR.meta.id}
                        onChange={handleChangeNewVRID}
                    />
                    <TextField
                        label="Name"
                        value={newVR.meta.name}
                        onChange={handleChangeNewVRName}
                    />
                    <FormControl>
                        <InputLabel id="Node">Node</InputLabel>
                        <Select
                            labelId="Node"
                            id="NodeSelect"
                            value={
                                newVR.meta.annotations
                                    ? newVR.meta.annotations[
                                          VirtualRouterV0Annotation.NodeName
                                      ]
                                    : ""
                            }
                            onChange={handleChangeNewVRNode}
                        >
                            {nodeList.map((node) => (
                                <MenuItem value={node.meta.id}>
                                    {node.meta.id}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </FormControl>
            </Paper>
            <Paper className={classes.paper}>
                <FormControl className={classes.formControl}>
                    <FormControl>
                        <TextField
                            label="ExternalGateway"
                            value={newVR.spec.externalGateway}
                            onChange={handleChangeNewVRExternalGateway}
                        />
                    </FormControl>
                    <FormControl>
                        <TextField
                            label="ExternalIP"
                            onChange={handleChangeNewVRExternalIP}
                        />
                    </FormControl>
                </FormControl>
            </Paper>
            <Paper className={classes.paper}>
                <FormControl className={classes.formControl}>
                    <InputLabel id="Network">NICs</InputLabel>
                    <Select
                        labelId="Network"
                        id="NetworkSelect"
                        value={netList.find(
                            (net) => net.meta.id === selectedNetID
                        )}
                        onChange={handleChangeSelectedNetID}
                    >
                        {netList.map((net) => (
                            <MenuItem value={net.meta.id}>
                                {net.meta.id}
                            </MenuItem>
                        ))}
                    </Select>
                    <TextField
                        value={nicIPv4Address}
                        onChange={handleChangeNICIPv4Address}
                    />
                    <Button
                        variant="contained"
                        onClick={handleClickAddNICButton}
                    >
                        Add
                    </Button>
                </FormControl>
                {nicList.map((nic, i) => (
                    <Card key={i}>
                        <CardContent>
                            <Typography variant="h5" component="h2">
                                {nic.networkID}
                            </Typography>
                            {nic.ipv4Address}
                        </CardContent>
                        <CardActions>
                            <Button
                                variant="outlined"
                                color="secondary"
                                onClick={() => popNICList(i)}
                            >
                                削除
                            </Button>
                        </CardActions>
                    </Card>
                ))}
            </Paper>
            <Paper className={classes.paper}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleClickCreateVRButton}
                >
                    Create
                </Button>
            </Paper>
        </Container>
    );
}

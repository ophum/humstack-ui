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
import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router";
import { useGlobalState } from "../../../../App";
import {
    VirtualMachineV0Annotation,
    NetworkV0Annotation,
} from "../../../../service/client/system/annotations";
import {
    BlockStorage,
    Network,
    Node,
    VirtualMachineNIC,
    BlockStorageState,
} from "../../../../service/client/system/types";
import { skelVirtualMachine } from "../../../../service/client/system/utils";
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

export interface VirtualMachineCreatePageProps {}

interface AttachedNetwork {
    network: Network;
    nic: VirtualMachineNIC;
}

const VCPUList = ["1000m", "2000m", "4000m", "8000m"];
const MemoryList = ["256M", "512M", "1G", "2G", "4G", "8G", "16G", "32G"];

export function VirtualMachineCreatePage(_: VirtualMachineCreatePageProps) {
    const classes = useStyles();
    const history = useHistory();
    const { groupID, namespaceID } = useParams();
    const [client] = useGlobalState("client");

    const [nodeList, setNodeList] = useState([] as Node[]);
    const [bsList, setBSList] = useState([] as BlockStorage[]);
    const [netList, setNetList] = useState([] as Network[]);

    const [attachedBSList, setAttachedBSList] = useState([] as BlockStorage[]);
    const [attachedNetList, setAttachedNetList] = useState(
        [] as AttachedNetwork[]
    );

    const [newVM, setNewVM] = useState({
        ...skelVirtualMachine(),
    });

    const [selectedVCPUS, setSelectedVCPUS] = useState("");
    const [selectedMemory, setSelectedMemory] = useState("");
    const [selectedBSID, setSelectedBSID] = useState("");
    const [selectedNetID, setSelectedNetID] = useState("");

    const reload = () => {
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
    };
    useEffect(() => reload(), []);

    const handleChangeNewVMID = (e: React.ChangeEvent<HTMLInputElement>) => {
        const updateNewVM = { ...newVM };
        updateNewVM.meta.id = e.target.value;
        setNewVM(updateNewVM);
    };

    const handleChangeNewVMName = (e: React.ChangeEvent<HTMLInputElement>) => {
        const updateNewVM = { ...newVM };
        updateNewVM.meta.name = e.target.value;
        setNewVM(updateNewVM);
    };

    const handleChangeNewVMNode = (
        e: React.ChangeEvent<{ value: unknown }>
    ) => {
        const updateNewVM = { ...newVM };
        if (!updateNewVM.meta.annotations) {
            updateNewVM.meta.annotations = {} as { [key: string]: string };
        }
        updateNewVM.meta.annotations[VirtualMachineV0Annotation.NodeName] = e
            .target.value as string;
        setNewVM(updateNewVM);
    };

    const handleChangeSelectedVCPUS = (
        e: React.ChangeEvent<{ value: unknown }>
    ) => {
        setSelectedVCPUS(e.target.value as string);
    };

    const handleChangeSelectedMemory = (
        e: React.ChangeEvent<{ value: unknown }>
    ) => {
        setSelectedMemory(e.target.value as string);
    };

    const handleChangeSelectedBSID = (
        e: React.ChangeEvent<{ value: unknown }>
    ) => {
        setSelectedBSID(e.target.value as string);
    };

    const handleChangeSelectedNetID = (
        e: React.ChangeEvent<{ value: unknown }>
    ) => {
        setSelectedNetID(e.target.value as string);
    };

    const handleClickAddBlockStorageButton = () => {
        const selectedBS = bsList.find((bs) => bs.meta.id === selectedBSID);
        if (!selectedBS) {
            return;
        }
        setAttachedBSList([...attachedBSList, selectedBS]);
        setBSList(bsList.filter((bs) => bs.meta.id !== selectedBSID));
        setSelectedBSID("");
    };

    const swapAttachedBSList = (i1: number, i2: number) => {
        if (
            i1 < 0 ||
            i1 >= attachedBSList.length ||
            i2 < 0 ||
            i2 >= attachedBSList.length
        ) {
            return;
        }

        const updateAttachedBSList = [...attachedBSList];
        const tmp = updateAttachedBSList[i1];
        updateAttachedBSList[i1] = updateAttachedBSList[i2];
        updateAttachedBSList[i2] = tmp;
        setAttachedBSList(updateAttachedBSList);
    };

    const popAttachedBSList = (index: number) => {
        if (index < 0 || index >= attachedBSList.length) {
            return;
        }

        const popBS = attachedBSList[index];
        setAttachedBSList(attachedBSList.filter((_, i) => i !== index));
        setBSList([...bsList, popBS]);
    };

    const handleClickAddNICButton = () => {
        const selectedNet = netList.find(
            (net) => net.meta.id === selectedNetID
        );
        console.log(selectedNet);
        if (!selectedNet) {
            return;
        }

        setAttachedNetList([
            ...attachedNetList,
            {
                network: selectedNet,
                nic: {
                    networkID: selectedNet.meta.id,
                    ipv4Address: "",
                    ipv6Address: "",
                    defaultGateway: "",
                    macAddress: "",
                    nameservers: [],
                },
            },
        ]);
    };

    const swapAttachedNetList = (i1: number, i2: number) => {
        if (
            i1 < 0 ||
            i1 >= attachedNetList.length ||
            i2 < 0 ||
            i2 >= attachedNetList.length
        ) {
            return;
        }

        const updateAttachedNetList = [...attachedNetList];
        const tmp = updateAttachedNetList[i1];
        updateAttachedNetList[i1] = updateAttachedNetList[i2];
        updateAttachedNetList[i2] = tmp;
        setAttachedNetList(updateAttachedNetList);
    };

    const popAttachedNetList = (index: number) => {
        if (index < 0 || index >= attachedNetList.length) {
            return;
        }

        setAttachedNetList(attachedNetList.filter((_, i) => i !== index));
    };

    const handleChangeAttachedNetIPv4Address = (
        index: number,
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        if (index < 0 || index >= attachedNetList.length) {
            return;
        }
        const updateAttachedNetList = [...attachedNetList];
        updateAttachedNetList[index].nic.ipv4Address = e.target.value;
        setAttachedNetList(updateAttachedNetList);
    };

    const handleChangeAttachedNetGateway4 = (
        index: number,
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        if (index < 0 || index >= attachedNetList.length) {
            return;
        }

        const updateAttachedNetList = [...attachedNetList];
        updateAttachedNetList[index].nic.defaultGateway = e.target.value;
        setAttachedNetList(updateAttachedNetList);
    };

    const handleChangeAttachedNetNameserver = (
        index: number,
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        if (index < 0 || index >= attachedNetList.length) {
            return;
        }
        const updateAttachedNetList = [...attachedNetList];
        if (updateAttachedNetList[index].nic.nameservers.length === 0) {
            updateAttachedNetList[index].nic.nameservers.push("");
        }
        updateAttachedNetList[index].nic.nameservers[0] = e.target.value;
        setAttachedNetList(updateAttachedNetList);
    };
    const handleChangeNewVMUsername = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const updateNewVM = { ...newVM };
        updateNewVM.spec.loginUsers[0].username = e.target.value;
        setNewVM(updateNewVM);
    };

    const handleChangeNewVMSSHAuthorizedKey = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const updateNewVM = { ...newVM };
        updateNewVM.spec.loginUsers[0].sshAuthorizedKeys[0] = e.target.value;
        setNewVM(updateNewVM);
    };

    const handleClickCreateVMButton = async () => {
        const vm = { ...newVM };
        vm.meta.group = groupID;
        vm.meta.namespace = namespaceID;
        vm.spec.limitVcpus = selectedVCPUS;
        vm.spec.limitMemory = selectedMemory;
        vm.spec.requestVcpus = "1m";
        vm.spec.requestMemory = "1M";
        attachedBSList.map((bs) => {
            vm.spec.blockStorageIDs.push(bs.meta.id);
        });
        attachedNetList.map((net) => {
            vm.spec.nics.push(net.nic);
        });

        const res = await client.SystemV0().VirtualMachine().Create(vm);
        if (!res.ok || !res.data) {
            return;
        }

        history.push(
            `/groups/${groupID}/namespaces/${namespaceID}/virtualmachines`
        );
    };
    return (
        <Container>
            <Typography variant="h4">VirtualMachine</Typography>
            <HeadMenu
                active={HeadMenuActive.VirtualMachineCreate}
                groupID={groupID}
                namespaceID={namespaceID}
            />
            <Typography variant="h5">VirtualMachine Create</Typography>
            <Paper className={classes.paper}>
                <FormControl className={classes.formControl}>
                    <TextField
                        label="ID"
                        value={newVM.meta.id}
                        onChange={handleChangeNewVMID}
                    />
                    <TextField
                        label="Name"
                        value={newVM.meta.name}
                        onChange={handleChangeNewVMName}
                    />
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
                            onChange={handleChangeNewVMNode}
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
                        <InputLabel id="VCPUS">Vcpus</InputLabel>
                        <Select
                            labelId="VCPUS"
                            id="VCPUSSelect"
                            value={selectedVCPUS}
                            onChange={handleChangeSelectedVCPUS}
                        >
                            {VCPUList.map((cpu, i) => (
                                <MenuItem key={i} value={cpu}>
                                    {cpu}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl>
                        <InputLabel id="Memory">Memory</InputLabel>
                        <Select
                            labelId="Memory"
                            id="MemorySelect"
                            value={selectedMemory}
                            onChange={handleChangeSelectedMemory}
                        >
                            {MemoryList.map((m, i) => (
                                <MenuItem key={i} value={m}>
                                    {m}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </FormControl>
            </Paper>
            <Paper className={classes.paper}>
                <FormControl className={classes.formControl}>
                    <InputLabel id="BlockStorage">BlockStorage</InputLabel>
                    <Select
                        labelId="BlockStorage"
                        id="BlockStorageSelect"
                        value={bsList.find((bs) => bs.meta.id === selectedBSID)}
                        onChange={handleChangeSelectedBSID}
                    >
                        {bsList.map((bs) => (
                            <MenuItem value={bs.meta.id}>{bs.meta.id}</MenuItem>
                        ))}
                    </Select>
                    <Button
                        variant="contained"
                        onClick={handleClickAddBlockStorageButton}
                    >
                        Add
                    </Button>
                </FormControl>
                {attachedBSList.map((bs, i) => (
                    <Card key={i}>
                        <CardContent>
                            <Typography variant="h5" component="h2">
                                {bs.meta.id}:{bs.meta.name}
                            </Typography>
                            {bs.spec.requestSize}/{bs.spec.limitSize} from{" "}
                            {bs.spec.from.http!.url}
                        </CardContent>
                        <CardActions>
                            <Button
                                variant="contained"
                                onClick={() => swapAttachedBSList(i, i - 1)}
                            >
                                ↑
                            </Button>
                            <Button
                                variant="contained"
                                onClick={() => swapAttachedBSList(i, i + 1)}
                            >
                                ↓
                            </Button>
                            <Button
                                variant="outlined"
                                color="secondary"
                                onClick={() => popAttachedBSList(i)}
                            >
                                削除
                            </Button>
                        </CardActions>
                    </Card>
                ))}
            </Paper>
            <Paper className={classes.paper}>
                <FormControl>
                    <FormControl className={classes.formControl}>
                        <InputLabel id="Network">Network</InputLabel>
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
                        <Button
                            variant="contained"
                            onClick={handleClickAddNICButton}
                        >
                            Add
                        </Button>
                    </FormControl>
                    {attachedNetList.map((net, i) => (
                        <Card>
                            <CardContent>
                                <Typography variant="h5" component="h2">
                                    {net.network.meta.id}:{" "}
                                    {net.network.spec.ipv4CIDR}
                                </Typography>
                                <FormControl>
                                    <TextField
                                        label="ipv4 address"
                                        value={net.nic.ipv4Address}
                                        onChange={(
                                            e: React.ChangeEvent<
                                                HTMLInputElement
                                            >
                                        ) =>
                                            handleChangeAttachedNetIPv4Address(
                                                i,
                                                e
                                            )
                                        }
                                    />
                                    <TextField
                                        label="gateway4"
                                        value={net.nic.defaultGateway}
                                        onChange={(
                                            e: React.ChangeEvent<
                                                HTMLInputElement
                                            >
                                        ) =>
                                            handleChangeAttachedNetGateway4(
                                                i,
                                                e
                                            )
                                        }
                                    />
                                    <TextField
                                        label="nameserver"
                                        value={net.nic.nameservers[0]}
                                        onChange={(
                                            e: React.ChangeEvent<
                                                HTMLInputElement
                                            >
                                        ) =>
                                            handleChangeAttachedNetNameserver(
                                                i,
                                                e
                                            )
                                        }
                                    />
                                </FormControl>
                            </CardContent>
                            <CardActions>
                                <Button
                                    variant="contained"
                                    onClick={() =>
                                        swapAttachedNetList(i, i - 1)
                                    }
                                >
                                    ↑
                                </Button>
                                <Button
                                    variant="contained"
                                    onClick={() =>
                                        swapAttachedNetList(i, i + 1)
                                    }
                                >
                                    ↓
                                </Button>
                                <Button
                                    variant="outlined"
                                    color="secondary"
                                    onClick={() => popAttachedNetList(i)}
                                >
                                    削除
                                </Button>
                            </CardActions>
                        </Card>
                    ))}
                </FormControl>
            </Paper>
            <Paper className={classes.paper}>
                <FormControl className={classes.formControl}>
                    <TextField
                        label="Username"
                        value={newVM.spec.loginUsers[0].username}
                        onChange={handleChangeNewVMUsername}
                    />
                    <TextField
                        label="SSH Public Key"
                        value={newVM.spec.loginUsers[0].sshAuthorizedKeys[0]}
                        onChange={handleChangeNewVMSSHAuthorizedKey}
                    />
                </FormControl>
            </Paper>
            <Paper className={classes.paper}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleClickCreateVMButton}
                >
                    Create
                </Button>
            </Paper>
        </Container>
    );
}

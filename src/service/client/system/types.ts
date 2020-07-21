import { Meta } from "../meta/meta";

export interface NetworkSpec {
    id: string;
    ipv4CIDR: string;
    ipv6CIDR: string;
}

export interface Network {
    meta: Meta;

    spec: NetworkSpec;
}

export interface BlockStorageFromBaseImage {
    imageName: string;
    tag: string;
}

export interface BlockStorageFromBlockStorage {
    name: string;
}

export interface BlockStorageFromHTTP {
    url: string;
}

export enum BlockStorageFromType {
    BaseImage = "BaseImage",
    BlockStorage = "BlockStorage",
    HTTP = "BlockStorage",
    Empty = "Empty",
}

export interface BlockStorageFrom {
    type: string;
    baseImage: BlockStorageFromBaseImage;
    blockStorage: BlockStorageFromBlockStorage;
    HTTP: BlockStorageFromHTTP;
}

export interface BlockStorageSpec {
    requestSize: string;
    limitSize: string;
    from: BlockStorageFrom;
}

export enum BlockStorageState {
    Active = "Active",
    Used = "Used",
    Pending = "Pending",
    Deleting = "Deleting",
}

export interface BlockStorageStatus {
    state: BlockStorageState;
}

export interface BlockStorage {
    meta: Meta;

    spec: BlockStorageSpec;
    status: BlockStorageStatus;
}

export interface VirtualMachineLoginUser {
    username: string;
    sshAuthorizedKeys: string[];
}

export interface VirtualMachineNIC {
    networkID: string;
    macAddress: string;
    ipv4Address: string;
    ipv6Address: string;
    nameservers: string[];
    defaultGateway: string;
}

export enum VirtualMachineActionState {
    PowerOn = "PowerOn",
    PowerOff = "PowerOff",
}

export interface VirtualMachineSpec {
    uuid: string;

    requestVcpus: string;
    limitVcpus: string;

    requestMemory: string;
    limitMemory: string;

    blockStorageIDs: string[];

    nics: VirtualMachineNIC[];

    loginUsers: VirtualMachineLoginUser[];

    actionState: VirtualMachineActionState;
}

export enum VirtualmachineState {
    Running = "Running",
    Pending = "Pending",
    Stopping = "Stopping",
    Stopped = "Stopped",
}

export interface VirtualMachineStatus {
    state: VirtualmachineState;
}

export interface VirtualMachine {
    meta: Meta;

    spec: VirtualMachineSpec;
    status: VirtualMachineStatus;
}

export interface NodeSpec {
    limitVcpus: string;
    limitMemory: string;
}

export enum NodeState {
    NotReady = "NotReady",
    Ready = "Ready",
}

export interface NodeStatus {
    state: NodeState;
    requestedVcpus: string;
    requestedMemory: string;
}

export interface Node {
    meta: Meta;

    spec: NodeSpec;
    status: NodeStatus;
}

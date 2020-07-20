export enum APIType {
    NodeV0 = "systemv0/node",
    NetworkV0 = "systemv0/network",
    BlockStorageV0 = "systemv0/blockstorage",
    VirtualMachineV0 = "systemv0/virtualmachine",
    NamespaceV0 = "corev0/namespace",
    GroupV0 = "corev0/group",
}

export type ResourceType = string;
export enum DeleteState {
    None = "None",
    Delete = "Delete",
    Done = "Done",
}

export interface Meta {
    id: string;
    name?: string;
    namespace?: string;
    group?: string;
    annotations?: { [key: string]: string };
    labels?: { [key: string]: string };
    resourceHash?: string;
    deleteState?: DeleteState;
    apiType?: APIType;
}

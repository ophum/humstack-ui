import {
    VirtualMachine,
    VirtualMachineNIC,
    VirtualMachineActionState,
    VirtualMachineLoginUser,
    VirtualmachineState,
    Network,
    BlockStorage,
    BlockStorageFromType,
    BlockStorageState,
    VirtualRouterSpec,
    VirtualRouter,
    VirtualRouterNIC,
    DNATRule,
    VirtualRouterState,
    VirtualRouterExternalIP,
} from "./types";
import { skelMeta } from "../meta/utils";

export function skelNetwork(): Network {
    return {
        meta: skelMeta(),
        spec: {
            ipv4CIDR: "",
            ipv6CIDR: "",
            id: "",
        },
    };
}

export function skelBlockStorage(): BlockStorage {
    return {
        meta: skelMeta(),
        spec: {
            requestSize: "",
            limitSize: "",
            from: {
                type: BlockStorageFromType.Empty,
                baseImage: {
                    imageName: "",
                    tag: "",
                },
                http: {
                    url: "",
                },
            },
        },
        status: {
            state: BlockStorageState.Unknown,
        },
    };
}

export function skelVirtualMachine(): VirtualMachine {
    return {
        meta: skelMeta(),
        spec: {
            uuid: "",
            requestVcpus: "",
            requestMemory: "",
            limitVcpus: "",
            limitMemory: "",
            blockStorageIDs: [] as string[],
            nics: [] as VirtualMachineNIC[],
            loginUsers: [
                {
                    username: "",
                    sshAuthorizedKeys: [""],
                },
            ] as VirtualMachineLoginUser[],
            actionState: VirtualMachineActionState.PowerOn,
        },
        status: {
            state: VirtualmachineState.Pending,
        },
    };
}

export function skelVirtualRouter(): VirtualRouter {
    return {
        meta: skelMeta(),
        spec: {
            externalGateway: "",
            externalIPs: [] as VirtualRouterExternalIP[],
            natGatewayIP: "",
            nics: [] as VirtualRouterNIC[],
            dnatRules: [] as DNATRule[],
        },
        status: {
            state: VirtualRouterState.Pending,
        },
    };
}

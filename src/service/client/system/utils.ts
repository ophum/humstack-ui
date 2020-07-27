import {
    VirtualMachine,
    VirtualMachineNIC,
    VirtualMachineActionState,
    VirtualMachineLoginUser,
    VirtualmachineState,
} from "./types";
import { skelMeta } from "../meta/utils";

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

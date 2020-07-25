import { Meta, DeleteState, APIType } from "./meta";

export function skelMeta(): Meta {
    return {
        id: "",
        name: "",
        namespace: "",
        group: "",
        annotations: {} as { [key: string]: string },
        labels: {} as { [key: string]: string },
        resourceHash: "",
        deleteState: DeleteState.None,
    };
}

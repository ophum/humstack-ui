import { GroupClient } from "./group/v0/groupClient";

export class CoreV0Clients {
    private groupV0Client: GroupClient;

    constructor(baseURL: string) {
        this.groupV0Client = new GroupClient(baseURL);
    }

    GroupV0() {
        return this.groupV0Client;
    }
}

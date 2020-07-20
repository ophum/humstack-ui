import { GroupClient } from "./group/v0/groupClient";
import { NamespaceClient } from "./namespace/v0/namespaceClient";

export class CoreV0Clients {
    private groupClient: GroupClient;
    private namespaceClient: NamespaceClient;

    constructor(baseURL: string) {
        this.groupClient = new GroupClient(baseURL);
        this.namespaceClient = new NamespaceClient(baseURL);
    }

    Group() {
        return this.groupClient;
    }

    Namespace() {
        return this.namespaceClient;
    }
}

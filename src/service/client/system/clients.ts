import { NodeClient } from "./node/v0/nodeClient";
import { NetworkClient } from "./network/v0/networkClient";
import { BlockStorageClient } from "./blockstorage/v0/blockStorageClient";
import { VirtualMachineClient } from "./virtualmachine/v0/virtualMachineClient";
import { VirtualRouterClient } from "./virtualrouter/v0/virtualRouterClient";

export class SystemV0Clients {
    private nodeClient: NodeClient;
    private networkClient: NetworkClient;
    private blockStorageClient: BlockStorageClient;
    private virtualMachineClient: VirtualMachineClient;
    private virtualRouterClient: VirtualRouterClient;

    constructor(baseURL: string) {
        this.nodeClient = new NodeClient(baseURL);
        this.networkClient = new NetworkClient(baseURL);
        this.blockStorageClient = new BlockStorageClient(baseURL);
        this.virtualMachineClient = new VirtualMachineClient(baseURL);
        this.virtualRouterClient = new VirtualRouterClient(baseURL);
    }

    Node() {
        return this.nodeClient;
    }

    Network() {
        return this.networkClient;
    }

    BlockStorage() {
        return this.blockStorageClient;
    }

    VirtualMachine() {
        return this.virtualMachineClient;
    }

    VirtualRouter() {
        return this.virtualRouterClient;
    }
}

import { CoreV0Clients } from "./core/clients";

export class Clients {
    private coreV0Clients: CoreV0Clients;

    constructor(baseURL: string) {
        this.coreV0Clients = new CoreV0Clients(baseURL + "/api/v0");
    }

    CoreV0() {
        return this.coreV0Clients;
    }
}

import { CoreV0Clients } from "./core/clients";
import { SystemV0Clients } from "./system/clients";

export class Clients {
    private coreV0Clients: CoreV0Clients;
    private systemV0Clients: SystemV0Clients;

    constructor(baseURL: string) {
        this.coreV0Clients = new CoreV0Clients(baseURL + "/api/v0");
        this.systemV0Clients = new SystemV0Clients(baseURL + "/api/v0");
    }

    CoreV0() {
        return this.coreV0Clients;
    }

    SystemV0() {
        return this.systemV0Clients;
    }
}

import HTTPClient from "../../../base/http";
import { Response } from "../../../meta/response";
import { VirtualMachine } from "../../types";
import { APIType } from "../../../meta/meta";

export class VirtualMachineClient extends HTTPClient {
    private getPath(
        groupID: string,
        namespaceID: string,
        virtualmachineID: string
    ): string {
        if (virtualmachineID !== "") virtualmachineID = `/${virtualmachineID}`;
        return `groups/${groupID}/namespaces/${namespaceID}/virtualmachines${virtualmachineID}`;
    }

    async List(
        groupID: string,
        namespaceID: string
    ): Promise<VirtualMachineListResponse> {
        const res = await this._get(this.getPath(groupID, namespaceID, ""));

        return {
            ok: res.ok,
            ...(await res.json()),
        };
    }

    async Get(
        groupID: string,
        namespaceID: string,
        virtualmachineID: string
    ): Promise<VirtualMachineGetResponse> {
        const res = await this._get(
            this.getPath(groupID, namespaceID, virtualmachineID)
        );

        return {
            ok: res.ok,
            ...(await res.json()),
        };
    }

    async Create(
        request: VirtualMachineCreateRequest
    ): Promise<VirtualMachineCreateResponse> {
        const groupID = request.meta.group!;
        const namespaceID = request.meta.namespace!;
        request.meta.apiType = APIType.VirtualMachineV0;
        const res = await this._post(
            this.getPath(groupID, namespaceID, ""),
            request
        );

        return {
            ok: res.ok,
            ...(await res.json()),
        };
    }

    async Update(
        request: VirtualMachineUpdateRequest
    ): Promise<VirtualMachineUpdateResponse> {
        const groupID = request.meta.group!;
        const namespaceID = request.meta.namespace!;
        const virtualmachineID = request.meta.id;
        request.meta.apiType = APIType.VirtualMachineV0;
        const res = await this._put(
            this.getPath(groupID, namespaceID, virtualmachineID),
            request
        );

        return {
            ok: res.ok,
            ...(await res.json()),
        };
    }

    async Delete(
        groupID: string,
        namespaceID: string,
        virtualmachineID: string
    ): Promise<VirtualMachineDeleteResponse> {
        const res = await this._delete(
            this.getPath(groupID, namespaceID, virtualmachineID),
            {}
        );

        return {
            ok: res.ok,
            ...(await res.json()),
        };
    }
}

/**
 * Request
 */

// Create
export type VirtualMachineCreateRequest = VirtualMachine;

// Update
export type VirtualMachineUpdateRequest = VirtualMachine;

/**
 * Response
 */

// List
export type VirtualMachineListResponse = Response<
    VirtualMachineListData,
    VirtualMachineListError
>;

export interface VirtualMachineListData {
    virtualmachines: VirtualMachine[];
}

export interface VirtualMachineListError {}

// Get
export type VirtualMachineGetResponse = Response<
    VirtualMachineGetData,
    VirtualMachineGetError
>;

export interface VirtualMachineGetData {
    virtualmachine: VirtualMachine;
}

export interface VirtualMachineGetError {}

// Create
export type VirtualMachineCreateResponse = Response<
    VirtualMachineCreateData,
    VirtualMachineCreateError
>;

export interface VirtualMachineCreateData {
    virtualmachine: VirtualMachine;
}

export interface VirtualMachineCreateError {}

// Update
export type VirtualMachineUpdateResponse = Response<
    VirtualMachineUpdateData,
    VirtualMachineUpdateError
>;

export interface VirtualMachineUpdateData {
    virtualmachine: VirtualMachine;
}

export interface VirtualMachineUpdateError {}

// Delete
export type VirtualMachineDeleteResponse = Response<
    VirtualMachineDeleteData,
    VirtualMachineDeleteError
>;

export interface VirtualMachineDeleteData {}

export interface VirtualMachineDeleteError {}

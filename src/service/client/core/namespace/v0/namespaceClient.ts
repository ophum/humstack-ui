import HTTPClient from "../../../base/http";
import { Namespace } from "../../types";
import { Response } from "../../../meta/response";

export class NamespaceClient extends HTTPClient {
    private getPath(groupID: string, namespaceID: string): string {
        if (namespaceID !== "") namespaceID = `/${namespaceID}`;
        return `groups/${groupID}/namespaces${namespaceID}`;
    }

    async List(groupID: string): Promise<NamespaceListResponse> {
        const res = await this._get(this.getPath(groupID, ""));

        return {
            ok: res.ok,
            ...(await res.json()),
        };
    }

    async Get() {}

    async Create(
        request: NamespaceCreateRequest
    ): Promise<NamespaceCreateResponse> {
        const res = await this._post(
            this.getPath(request.meta.group!, ""),
            request
        );

        return {
            ok: res.ok,
            ...(await res.json()),
        };
    }

    async Update() {}

    async Delete() {}
}

/**
 * Request
 */

// Create
export type NamespaceCreateRequest = Namespace;

/**
 * Response
 */

// List
export type NamespaceListResponse = Response<
    NamespaceListData,
    NamespaceListError
>;
export interface NamespaceListData {
    namespaces: Namespace[];
}
export interface NamespaceListError {}

// Create
export type NamespaceCreateResponse = Response<
    NamespaceCreateData,
    NamespaceCreateError
>;

export interface NamespaceCreateData {
    namespace: Namespace;
}

export interface NamespaceCreateError {}

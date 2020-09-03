import HTTPClient from "../../../base/http";
import { Namespace } from "../../types";
import { Response } from "../../../meta/response";
import { APIType } from "../../../meta/meta";

export class NamespaceClient extends HTTPClient {
    private getPath(groupID: string, namespaceID: string): string {
        if (namespaceID !== "") namespaceID = `/${namespaceID}`;
        return `groups/${groupID}/namespaces${namespaceID}`;
    }

    async List(groupID: string): Promise<NamespaceListResponse> {
        const res = await this._get(this.getPath(groupID, ""));

        return HTTPClient._response(res);
    }

    async Get(
        groupID: string,
        namespaceID: string
    ): Promise<NamespaceGetResponse> {
        const res = await this._get(this.getPath(groupID, namespaceID));

        return HTTPClient._response(res);
    }

    async Create(
        request: NamespaceCreateRequest
    ): Promise<NamespaceCreateResponse> {
        request.meta.apiType = APIType.NamespaceV0;
        const res = await this._post(
            this.getPath(request.meta.group!, ""),
            request
        );
        return HTTPClient._response(res);
    }

    async Update(
        request: NamespaceUpdateRequest
    ): Promise<NamespaceUpdateResponse> {
        const res = await this._put(
            this.getPath(request.meta.group!, request.meta.id),
            request
        );
        return HTTPClient._response(res);
    }

    async Delete(
        groupID: string,
        namespaceID: string
    ): Promise<NamespaceDeleteResponse> {
        const res = await this._delete(this.getPath(groupID, namespaceID), {});
        return HTTPClient._response(res);
    }
}

/**
 * Request
 */

// Create
export type NamespaceCreateRequest = Namespace;

// Update
export type NamespaceUpdateRequest = Namespace;

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

// Get
export type NamespaceGetResponse = Response<
    NamespaceGetData,
    NamespaceGetError
>;
export interface NamespaceGetData {
    namespace: Namespace;
}
export interface NamespaceGetError {}

// Create
export type NamespaceCreateResponse = Response<
    NamespaceCreateData,
    NamespaceCreateError
>;

export interface NamespaceCreateData {
    namespace: Namespace;
}

export interface NamespaceCreateError {}

// Update
export type NamespaceUpdateResponse = Response<
    NamespaceUpdateData,
    NamespaceUpdateError
>;
export interface NamespaceUpdateData {
    namespace: Namespace;
}

export interface NamespaceUpdateError {}

// Delete
export type NamespaceDeleteResponse = Response<
    NamespaceDeleteData,
    NamespaceDeleteError
>;

export interface NamespaceDeleteData {}
export interface NamespaceDeleteError {}

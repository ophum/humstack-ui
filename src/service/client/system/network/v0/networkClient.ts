import HTTPClient from "../../../base/http";
import { Response } from "../../../meta/response";
import { Network } from "../../types";
import { APIType } from "../../../meta/meta";

export class NetworkClient extends HTTPClient {
    private getPath(
        groupID: string,
        namespaceID: string,
        networkID: string
    ): string {
        if (networkID !== "") networkID = `/${networkID}`;
        return `groups/${groupID}/namespaces/${namespaceID}/networks${networkID}`;
    }

    async List(
        groupID: string,
        namespaceID: string
    ): Promise<NetworkListResponse> {
        const res = await this._get(this.getPath(groupID, namespaceID, ""));

        return HTTPClient._response(res);
    }

    async Get(
        groupID: string,
        namespaceID: string,
        networkID: string
    ): Promise<NetworkGetResponse> {
        const res = await this._get(
            this.getPath(groupID, namespaceID, networkID)
        );

        return HTTPClient._response(res);
    }

    async Create(
        request: NetworkCreateRequest
    ): Promise<NetworkCreateResponse> {
        const groupID = request.meta.group!;
        const namespaceID = request.meta.namespace!;
        request.meta.apiType = APIType.NetworkV0;
        const res = await this._post(
            this.getPath(groupID, namespaceID, ""),
            request
        );

        return HTTPClient._response(res);
    }

    async Update(
        request: NetworkUpdateRequest
    ): Promise<NetworkUpdateResponse> {
        const groupID = request.meta.group!;
        const namespaceID = request.meta.namespace!;
        const networkID = request.meta.id;
        request.meta.apiType = APIType.NetworkV0;
        const res = await this._put(
            this.getPath(groupID, namespaceID, networkID),
            request
        );

        return HTTPClient._response(res);
    }

    async Delete(
        groupID: string,
        namespaceID: string,
        networkID: string
    ): Promise<NetworkDeleteResponse> {
        const res = await this._delete(
            this.getPath(groupID, namespaceID, networkID),
            {}
        );

        return HTTPClient._response(res);
    }
}

/**
 * Request
 */

// Create
export type NetworkCreateRequest = Network;

// Update
export type NetworkUpdateRequest = Network;

/**
 * Response
 */

// List
export type NetworkListResponse = Response<NetworkListData, NetworkListError>;

export interface NetworkListData {
    networks: Network[];
}

export interface NetworkListError {}

// Get
export type NetworkGetResponse = Response<NetworkGetData, NetworkGetError>;

export interface NetworkGetData {
    network: Network;
}

export interface NetworkGetError {}

// Create
export type NetworkCreateResponse = Response<
    NetworkCreateData,
    NetworkCreateError
>;

export interface NetworkCreateData {
    network: Network;
}

export interface NetworkCreateError {}

// Update
export type NetworkUpdateResponse = Response<
    NetworkUpdateData,
    NetworkUpdateError
>;

export interface NetworkUpdateData {
    network: Network;
}

export interface NetworkUpdateError {}

// Delete
export type NetworkDeleteResponse = Response<
    NetworkDeleteData,
    NetworkDeleteError
>;

export interface NetworkDeleteData {}

export interface NetworkDeleteError {}

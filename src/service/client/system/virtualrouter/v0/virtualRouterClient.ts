import HTTPClient from "../../../base/http";
import { Response } from "../../../meta/response";
import { VirtualRouter } from "../../types";
import { APIType } from "../../../meta/meta";

export class VirtualRouterClient extends HTTPClient {
    private getPath(
        groupID: string,
        namespaceID: string,
        virtualrouterID: string
    ): string {
        if (virtualrouterID !== "") virtualrouterID = `/${virtualrouterID}`;
        return `groups/${groupID}/namespaces/${namespaceID}/virtualrouters${virtualrouterID}`;
    }

    async List(
        groupID: string,
        namespaceID: string
    ): Promise<VirtualRouterListResponse> {
        const res = await this._get(this.getPath(groupID, namespaceID, ""));

        return HTTPClient._response(res);
    }

    async Get(
        groupID: string,
        namespaceID: string,
        virtualrouterID: string
    ): Promise<VirtualRouterGetResponse> {
        const res = await this._get(
            this.getPath(groupID, namespaceID, virtualrouterID)
        );

        return HTTPClient._response(res);
    }

    async Create(
        request: VirtualRouterCreateRequest
    ): Promise<VirtualRouterCreateResponse> {
        const groupID = request.meta.group!;
        const namespaceID = request.meta.namespace!;
        request.meta.apiType = APIType.VirtualRouterV0;
        const res = await this._post(
            this.getPath(groupID, namespaceID, ""),
            request
        );

        return HTTPClient._response(res);
    }

    async Update(
        request: VirtualRouterUpdateRequest
    ): Promise<VirtualRouterUpdateResponse> {
        const groupID = request.meta.group!;
        const namespaceID = request.meta.namespace!;
        const virtualrouterID = request.meta.id;
        request.meta.apiType = APIType.VirtualRouterV0;
        const res = await this._put(
            this.getPath(groupID, namespaceID, virtualrouterID),
            request
        );

        return HTTPClient._response(res);
    }

    async Delete(
        groupID: string,
        namespaceID: string,
        virtualrouterID: string
    ): Promise<VirtualRouterDeleteResponse> {
        const res = await this._delete(
            this.getPath(groupID, namespaceID, virtualrouterID),
            {}
        );

        return HTTPClient._response(res);
    }
}

/**
 * Request
 */

// Create
export type VirtualRouterCreateRequest = VirtualRouter;

// Update
export type VirtualRouterUpdateRequest = VirtualRouter;

/**
 * Response
 */

// List
export type VirtualRouterListResponse = Response<
    VirtualRouterListData,
    VirtualRouterListError
>;

export interface VirtualRouterListData {
    virtualrouters: VirtualRouter[];
}

export interface VirtualRouterListError {}

// Get
export type VirtualRouterGetResponse = Response<
    VirtualRouterGetData,
    VirtualRouterGetError
>;

export interface VirtualRouterGetData {
    virtualrouter: VirtualRouter;
}

export interface VirtualRouterGetError {}

// Create
export type VirtualRouterCreateResponse = Response<
    VirtualRouterCreateData,
    VirtualRouterCreateError
>;

export interface VirtualRouterCreateData {
    virtualrouter: VirtualRouter;
}

export interface VirtualRouterCreateError {}

// Update
export type VirtualRouterUpdateResponse = Response<
    VirtualRouterUpdateData,
    VirtualRouterUpdateError
>;

export interface VirtualRouterUpdateData {
    virtualrouter: VirtualRouter;
}

export interface VirtualRouterUpdateError {}

// Delete
export type VirtualRouterDeleteResponse = Response<
    VirtualRouterDeleteData,
    VirtualRouterDeleteError
>;

export interface VirtualRouterDeleteData {}

export interface VirtualRouterDeleteError {}

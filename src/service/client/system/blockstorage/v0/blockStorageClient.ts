import HTTPClient from "../../../base/http";
import { Response } from "../../../meta/response";
import { BlockStorage } from "../../types";
import { APIType } from "../../../meta/meta";

export class BlockStorageClient extends HTTPClient {
    private getPath(
        groupID: string,
        namespaceID: string,
        blockstorageID: string
    ): string {
        if (blockstorageID !== "") blockstorageID = `/${blockstorageID}`;
        return `groups/${groupID}/namespaces/${namespaceID}/blockstorages${blockstorageID}`;
    }

    async List(
        groupID: string,
        namespaceID: string
    ): Promise<BlockStorageListResponse> {
        const res = await this._get(this.getPath(groupID, namespaceID, ""));

        return {
            ok: res.ok,
            ...(await res.json()),
        };
    }

    async Get(
        groupID: string,
        namespaceID: string,
        blockstorageID: string
    ): Promise<BlockStorageGetResponse> {
        const res = await this._get(
            this.getPath(groupID, namespaceID, blockstorageID)
        );

        return {
            ok: res.ok,
            ...(await res.json()),
        };
    }

    async Create(
        request: BlockStorageCreateRequest
    ): Promise<BlockStorageCreateResponse> {
        const groupID = request.meta.group!;
        const namespaceID = request.meta.namespace!;
        request.meta.apiType = APIType.BlockStorageV0;
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
        request: BlockStorageUpdateRequest
    ): Promise<BlockStorageUpdateResponse> {
        const groupID = request.meta.group!;
        const namespaceID = request.meta.namespace!;
        const blockstorageID = request.meta.id;
        request.meta.apiType = APIType.BlockStorageV0;
        const res = await this._put(
            this.getPath(groupID, namespaceID, blockstorageID),
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
        blockstorageID: string
    ): Promise<BlockStorageDeleteResponse> {
        const res = await this._delete(
            this.getPath(groupID, namespaceID, blockstorageID),
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
export type BlockStorageCreateRequest = BlockStorage;

// Update
export type BlockStorageUpdateRequest = BlockStorage;

/**
 * Response
 */

// List
export type BlockStorageListResponse = Response<
    BlockStorageListData,
    BlockStorageListError
>;

export interface BlockStorageListData {
    blockstorages: BlockStorage[];
}

export interface BlockStorageListError {}

// Get
export type BlockStorageGetResponse = Response<
    BlockStorageGetData,
    BlockStorageGetError
>;

export interface BlockStorageGetData {
    blockstorage: BlockStorage;
}

export interface BlockStorageGetError {}

// Create
export type BlockStorageCreateResponse = Response<
    BlockStorageCreateData,
    BlockStorageCreateError
>;

export interface BlockStorageCreateData {
    blockstorage: BlockStorage;
}

export interface BlockStorageCreateError {}

// Update
export type BlockStorageUpdateResponse = Response<
    BlockStorageUpdateData,
    BlockStorageUpdateError
>;

export interface BlockStorageUpdateData {
    blockstorage: BlockStorage;
}

export interface BlockStorageUpdateError {}

// Delete
export type BlockStorageDeleteResponse = Response<
    BlockStorageDeleteData,
    BlockStorageDeleteError
>;

export interface BlockStorageDeleteData {}

export interface BlockStorageDeleteError {}

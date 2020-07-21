import HTTPClient from "../../../base/http";
import { Response } from "../../../meta/response";
import { Node } from "../../types";

export class NodeClient extends HTTPClient {
    constructor(baseURL: string) {
        super(baseURL + "/nodes");
    }

    async List(): Promise<NodeListResponse> {
        const res = await this._get("");
        return {
            ok: res.ok,
            ...(await res.json()),
        };
    }

    async Get(nodeID: string): Promise<NodeGetResponse> {
        const res = await this._get(`${nodeID}`);
        return {
            ok: res.ok,
            ...(await res.json()),
        };
    }

    async Create() {}

    async Update() {}

    async Delete() {}
}

// request

// response
export type NodeListResponse = Response<NodeListData, NodeListError>;
export interface NodeListData {
    nodes: Node[];
}

export interface NodeListError {}

export type NodeGetResponse = Response<NodeGetData, NodeGetError>;
export interface NodeGetData {
    node: Node;
}

export interface NodeGetError {}

export type NodeCreateResponse = Response<NodeCreateData, NodeCreateError>;
export interface NodeCreateData {
    node: Node;
}
export interface NodeCreateError {}

export type NodeUpdateResponse = Response<NodeGetData, NodeUpdateError>;
export interface NodeUpdateDate {
    node: Node;
}

export interface NodeUpdateError {}

export type NodeDeleteResponse = Response<NodeDeleteData, NodeDeleteError>;
export interface NodeDeleteData {}
export interface NodeDeleteError {}

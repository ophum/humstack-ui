import HTTPClient from "../../../base/http";
import { Response } from "../../../meta/response";
import { Group } from "../../types";

export class GroupClient extends HTTPClient {
    constructor(baseURL: string) {
        super(baseURL + "/groups");
    }

    async List() {}

    async Get(groupID: string): Promise<GroupGetResponse> {
        const res = await this._get(`${groupID}`);
        return {
            ok: res.ok,
            ...(await res.json()),
        };
    }

    async Create(request: GroupCreateRequest): Promise<GroupCreateResponse> {
        const res = await this._post("", request);
        return {
            ok: res.ok,
            ...(await res.json()),
        };
    }

    async Update() {}

    async Delete() {}
}

// request
export type GroupCreateRequest = Group;

// response
export type GroupListResponse = Response<
    GroupListSuccessData,
    GroupListErrorData
>;
export interface GroupListSuccessData {
    groups: Group[];
}

export interface GroupListErrorData {}

export type GroupGetResponse = Response<GroupGetSuccessData, GroupGetErrorData>;
export interface GroupGetSuccessData {
    group: Group;
}

export interface GroupGetErrorData {}

export type GroupCreateResponse = Response<
    GroupCreateSuccessData,
    GroupCreateErrorData
>;
export interface GroupCreateSuccessData {}
export interface GroupCreateErrorData {}

export type GroupUpdateResponse = Response<
    GroupGetSuccessData,
    GroupUpdateErrorData
>;
export interface GroupUpdateErrorData {}

export type GroupDeleteResponse = Response<
    GroupDeleteSuccessData,
    GroupDeleteErrorData
>;
export interface GroupDeleteSuccessData {}
export interface GroupDeleteErrorData {}

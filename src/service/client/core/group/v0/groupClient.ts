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
export type GroupListResponse = Response<GroupListData, GroupListError>;
export interface GroupListData {
    groups: Group[];
}

export interface GroupListError {}

export type GroupGetResponse = Response<GroupGetData, GroupGetError>;
export interface GroupGetData {
    group: Group;
}

export interface GroupGetError {}

export type GroupCreateResponse = Response<GroupCreateData, GroupCreateError>;
export interface GroupCreateData {
    group: Group;
}
export interface GroupCreateError {}

export type GroupUpdateResponse = Response<GroupGetData, GroupUpdateError>;
export interface GroupUpdateDate {
    group: Group;
}

export interface GroupUpdateError {}

export type GroupDeleteResponse = Response<GroupDeleteData, GroupDeleteError>;
export interface GroupDeleteData {}
export interface GroupDeleteError {}

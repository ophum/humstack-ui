import HTTPClient from "../../../base/http";
import { Response } from "../../../meta/response";
import { Group } from "../../types";
import { APIType } from "../../../meta/meta";

export class GroupClient extends HTTPClient {
    constructor(baseURL: string) {
        super(baseURL + "/groups");
    }

    async List() {}

    async Get(groupID: string): Promise<GroupGetResponse> {
        const res = await this._get(`${groupID}`);
        return HTTPClient._response(res);
    }

    async Create(request: GroupCreateRequest): Promise<GroupCreateResponse> {
        request.meta.apiType = APIType.GroupV0;
        const res = await this._post("", request);
        return HTTPClient._response(res);
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

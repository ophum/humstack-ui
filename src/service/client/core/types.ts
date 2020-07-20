import { Meta } from "../meta/meta";

export interface GroupSpec {}
export interface Group {
    meta: Meta;

    spec: GroupSpec;
}

export interface NamespaceSpec {}

export interface Namespace {
    meta: Meta;
    spec: NamespaceSpec;
}

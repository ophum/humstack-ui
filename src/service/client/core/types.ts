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

export interface ExternalIPPoolSpec {
    ipv4CIDR: string;
    ipv6CIDR: string;

    bridgeName: string;
    defaultGateway: string;
}

export interface ExternalIPPoolUsed {
    usedExternalIPID: string;
}

export interface ExternalIPPoolStatus {
    usedIPv4Addresses: { [key: string]: ExternalIPPoolUsed };
    usedIPv6Addresses: { [key: string]: ExternalIPPoolUsed };
}

export interface ExternalIPPool {
    meta: Meta;

    Spec: ExternalIPPoolSpec;
    Status: ExternalIPPoolStatus;
}

export interface ExternalIPSpec {
    poolID: string;

    ipv4Address: string;
    ipv4Prefix: number;
    ipv6Address: string;
    ipv6Prefix: number;
}

export interface ExternalIP {
    meta: Meta;

    spec: ExternalIPSpec;
}

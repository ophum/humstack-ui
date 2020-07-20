import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router";
import { useGlobalState } from "../../App";
import { Namespace } from "../../service/client/core/types";
import { Container, Typography } from "@material-ui/core";
import { Meta } from "../../service/client/meta/meta";

export interface NamespacePageProps {}

export function NamespacePage(props: NamespacePageProps) {
    const history = useHistory();
    const { groupID, namespaceID } = useParams();
    const [client] = useGlobalState("client");
    const [ns, setNS] = useState({} as Namespace);

    const reload = () => {
        (async () => {
            const nsRes = await client
                .CoreV0()
                .Namespace()
                .Get(groupID, namespaceID);
            if (!nsRes.ok || !nsRes.data) {
                history.push(`/groups/${groupID}/namespaces`);
                return;
            }

            setNS(nsRes.data.namespace);
        })();
    };
    useEffect(() => reload(), []);

    return ns.meta === undefined ? (
        <></>
    ) : (
        <Container>
            <Typography variant="h4">Namespace: {ns.meta.id}</Typography>
        </Container>
    );
}

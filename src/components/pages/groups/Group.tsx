import React, { useEffect, useState } from "react";
import { Container, Button } from "@material-ui/core";
import { useParams, useHistory } from "react-router";
import { useGlobalState } from "../../../App";
import { Group } from "../../../service/client/core/types";

export interface GroupPageProps {}

export function GroupPage(props: GroupPageProps) {
    const { groupID } = useParams();
    const history = useHistory();

    const [clinet] = useGlobalState("client");
    const [, setIsLogin] = useGlobalState("isLogin");
    const [group, setGroup] = useState<Group | undefined>(undefined);

    useEffect(() => {
        if (groupID) {
            clinet
                .CoreV0()
                .Group()
                .Get(groupID!)
                .then((res) => {
                    if (!res.ok || res.data === undefined) {
                        history.push("/login");
                        return;
                    }

                    setIsLogin(true);
                    setGroup({
                        meta: res.data.group.meta,
                        spec: {},
                    });
                });
        }
    }, [groupID]);

    const clickNamespaceListButton = () => {
        history.push(`/groups/${groupID}/namespaces`);
    };

    return (
        <Container>
            {group !== undefined && group.meta !== undefined && group.meta.id}
            <Button variant="contained" onClick={clickNamespaceListButton}>
                NamespaceList
            </Button>
        </Container>
    );
}

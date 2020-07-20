import React, { useState } from "react";
import { useHistory } from "react-router";
import { useGlobalState } from "../../App";
import { Container, TextField, Button } from "@material-ui/core";

export interface RegisterPageProps {}

export function RegisterPage(props: RegisterPageProps) {
    const history = useHistory();
    const [client] = useGlobalState("client");

    const [groupID, setGroupID] = useState("");

    const changeGroupID = (e: React.ChangeEvent<HTMLInputElement>) => {
        setGroupID(e.target.value);
    };

    const clickRegisterButton = async () => {
        const res = await client
            .CoreV0()
            .GroupV0()
            .Create({
                meta: {
                    id: groupID,
                    name: groupID,
                },
                spec: {},
            });
        if (res.ok) {
            history.push(`/login`);
        }
    };

    return (
        <Container>
            <TextField
                variant="outlined"
                label="GroupID"
                value={groupID}
                onChange={changeGroupID}
            />
            <Button variant="contained" onClick={clickRegisterButton}>
                Register
            </Button>
        </Container>
    );
}

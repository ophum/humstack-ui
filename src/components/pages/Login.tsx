import React, { useState } from "react";
import { useHistory } from "react-router";
import { useGlobalState } from "../../App";
import { Container, TextField, Button } from "@material-ui/core";

export interface LoginPageProps {}

export function LoginPage(props: LoginPageProps) {
    const history = useHistory();
    const [client] = useGlobalState("client");
    const [, setIsLogin] = useGlobalState("isLogin");

    const [groupID, setGroupID] = useState("");

    const changeGroupID = (e: React.ChangeEvent<HTMLInputElement>) => {
        setGroupID(e.target.value);
    };

    const clickLoginButton = async () => {
        const res = await client.CoreV0().Group().Get(groupID);
        if (res.ok) {
            setIsLogin(true);
            history.push(`/groups/${groupID}`);
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
            <Button variant="contained" onClick={clickLoginButton}>
                Login
            </Button>
        </Container>
    );
}

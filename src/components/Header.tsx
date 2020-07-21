import { AppBar, Button, Toolbar, Typography } from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import * as React from "react";
import { useHistory } from "react-router";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flexGrow: 1,
        },
        menuButton: {
            marginRight: theme.spacing(2),
        },
        title: {
            flexGrow: 1,
        },
        loginButton: {
            marginRight: 5,
        },
    })
);

export interface HeaderProps {
    title: string;

    isLogin: boolean;
    logoutProcess: () => void;
}

export const Header = (props: HeaderProps) => {
    const classes = useStyles();
    const history = useHistory();

    const handleClickLoginButton = () => {
        history.push("/login");
    };

    const handleClickRegisterButton = () => {
        history.push("/register");
    };

    const handleClickLogoutButton = () => {
        props.logoutProcess();
        history.push("/");
    };
    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" className={classes.title}>
                    humstack
                </Typography>

                {props.isLogin ? (
                    <Button
                        variant="text"
                        color="inherit"
                        onClick={handleClickLogoutButton}
                    >
                        Logout
                    </Button>
                ) : (
                    <>
                        <Button
                            className={classes.loginButton}
                            color="inherit"
                            onClick={handleClickLoginButton}
                        >
                            Login
                        </Button>
                        <Button
                            variant="outlined"
                            color="inherit"
                            onClick={handleClickRegisterButton}
                        >
                            Register
                        </Button>
                    </>
                )}
            </Toolbar>
        </AppBar>
    );
};

import React from "react";
import { makeStyles, Theme, createStyles, Button } from "@material-ui/core";
import { useHistory } from "react-router";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        menuButton: {
            marginRight: theme.spacing(2),
        },
    })
);

export enum HeadMenuActive {
    NamespaceList,
    Namespace,
    NetworkList,
    Network,
    BlockStorageList,
    BlockStorage,
    VirtualMachineList,
    VirtualMachine,
    VirtualMachineCreate,
}

export interface HeadMenuProps {
    active: HeadMenuActive;
    groupID: string;
    namespaceID: string;
}

export function HeadMenu(props: HeadMenuProps) {
    const classes = useStyles();
    const history = useHistory();

    const handleClickNamespaceListButton = () => {
        history.push(`/groups/${props.groupID}/namespaces`);
    };

    const handleClickNamespaceButton = () => {
        history.push(
            `/groups/${props.groupID}/namespaces/${props.namespaceID}/`
        );
    };

    const handleClickNetworkListButton = () => {
        history.push(
            `/groups/${props.groupID}/namespaces/${props.namespaceID}/networks`
        );
    };

    const handleClickBlockStorageListButton = () => {
        history.push(
            `/groups/${props.groupID}/namespaces/${props.namespaceID}/blockstorages`
        );
    };

    const handleClickVirtualMachineListButton = () => {
        history.push(
            `/groups/${props.groupID}/namespaces/${props.namespaceID}/virtualmachines`
        );
    };
    return (
        <>
            {props.active !== HeadMenuActive.NamespaceList && (
                <Button
                    variant="outlined"
                    onClick={handleClickNamespaceListButton}
                    className={classes.menuButton}
                >
                    NamespaceList
                </Button>
            )}
            <Button
                variant="contained"
                onClick={handleClickNamespaceButton}
                className={classes.menuButton}
                color={
                    props.active === HeadMenuActive.Namespace
                        ? "primary"
                        : "default"
                }
            >
                Namespace: {props.namespaceID}
            </Button>
            <Button
                variant="contained"
                onClick={handleClickVirtualMachineListButton}
                className={classes.menuButton}
                color={
                    props.active === HeadMenuActive.VirtualMachineList
                        ? "primary"
                        : "default"
                }
            >
                VirtualMachineList
            </Button>
            <Button
                variant="contained"
                onClick={handleClickBlockStorageListButton}
                className={classes.menuButton}
                color={
                    props.active === HeadMenuActive.BlockStorageList
                        ? "primary"
                        : "default"
                }
            >
                BlockStorageList
            </Button>
            <Button
                variant="contained"
                onClick={handleClickNetworkListButton}
                className={classes.menuButton}
                color={
                    props.active === HeadMenuActive.NetworkList
                        ? "primary"
                        : "default"
                }
            >
                NetworkList
            </Button>
        </>
    );
}

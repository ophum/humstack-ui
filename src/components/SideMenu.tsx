import React from "react";
import {
    makeStyles,
    createStyles,
    Drawer,
    Toolbar,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Theme,
} from "@material-ui/core";

const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        drawer: {
            width: drawerWidth,
            flexShrink: 0,
        },
        drawerPaper: {
            width: drawerWidth,
        },
        drawerContainer: {
            overflow: "auto",
        },
    })
);

export interface SideMenuItem {
    text: string;
    icon?: any;
}

export interface SideMenuProps {
    items: SideMenuItem[];
}

export function SideMenu(props: SideMenuProps) {
    const classes = useStyles();

    return (
        <Drawer
            className={classes.drawer}
            variant="permanent"
            classes={{
                paper: classes.drawerPaper,
            }}
        >
            <Toolbar />
            <div className={classes.drawerContainer}>
                <List>
                    {props.items.map((item, k) => (
                        <ListItem button key={k}>
                            {item.icon && (
                                <ListItemIcon>{item.icon}</ListItemIcon>
                            )}
                            <ListItemText primary={item.text} />
                        </ListItem>
                    ))}
                </List>
            </div>
        </Drawer>
    );
}

import { CssBaseline } from "@material-ui/core";
import { createBrowserHistory } from "history";
import React from "react";
import { createGlobalState } from "react-hooks-global-state";
import { Route, Router, Switch } from "react-router-dom";
import { Header } from "./components/Header";
import { GroupPage } from "./components/pages/groups/Group";
import { NamespacePage } from "./components/pages/groups/namespaces/Namespace";
import { NamespaceListPage } from "./components/pages/groups/namespaces/NamespaceList";
import { NetworkListPage } from "./components/pages/groups/namespaces/NetworkList";
import { LoginPage } from "./components/pages/Login";
import { RegisterPage } from "./components/pages/Register";
import { TopPage } from "./components/pages/Top";
import { Clients } from "./service/client/clients";
import { BlockStorageListPage } from "./components/pages/groups/namespaces/BlockStorageList";
import { VirtualMachineListPage } from "./components/pages/groups/namespaces/VirtualMachineList";
import { VirtualMachineCreatePage } from "./components/pages/groups/namespaces/VirtualMachineCreate";
import { NetworkPage } from "./components/pages/groups/namespaces/Network";
import { BlockStoragePage } from "./components/pages/groups/namespaces/BlockStorage";
import { VirtualMachinePage } from "./components/pages/groups/namespaces/VirtualMachine";
import { VirtualRouterPage } from "./components/pages/groups/namespaces/VirtualRouter";
import { VirtualRouterListPage } from "./components/pages/groups/namespaces/VirtualRouterList";
import { VirtualRouterCreatePage } from "./components/pages/groups/namespaces/VirtualRouterCreate";

export const { useGlobalState } = createGlobalState({
    client: new Clients(
        !process.env.REACT_APP_API_URL || process.env.REACT_APP_API_URL === ""
            ? "http://localhost:8080"
            : process.env.REACT_APP_API_URL
    ),
    isLogin: false,
    selectedIDs: {
        groupID: "",
        namespaceID: "",
    },
});

const history = createBrowserHistory();

function App() {
    const [client] = useGlobalState("client");
    const [isLogin, setIsLogin] = useGlobalState("isLogin");

    const logout = () => {
        setIsLogin(false);
    };

    return (
        <>
            <CssBaseline />
            <Router history={history}>
                <Header
                    title="humstack"
                    isLogin={isLogin}
                    logoutProcess={logout}
                />
                <Switch>
                    <Route exact path="/" component={TopPage} />
                    <Route exact path="/login" component={LoginPage} />
                    <Route exact path="/register" component={RegisterPage} />
                    <Route
                        exact
                        path="/groups/:groupID"
                        component={GroupPage}
                    />
                    <Route
                        exact
                        path="/groups/:groupID/namespaces"
                        component={NamespaceListPage}
                    />
                    <Route
                        exact
                        path="/groups/:groupID/namespaces/:namespaceID"
                        component={NamespacePage}
                    />
                    <Route
                        exact
                        path="/groups/:groupID/namespaces/:namespaceID/networks"
                        component={NetworkListPage}
                    />
                    <Route
                        exact
                        path="/groups/:groupID/namespaces/:namespaceID/networks/:networkID"
                        component={NetworkPage}
                    />
                    <Route
                        exact
                        path="/groups/:groupID/namespaces/:namespaceID/blockstorages"
                        component={BlockStorageListPage}
                    />
                    <Route
                        exact
                        path="/groups/:groupID/namespaces/:namespaceID/blockstorages/:blockstorageID"
                        component={BlockStoragePage}
                    />
                    <Route
                        exact
                        path="/groups/:groupID/namespaces/:namespaceID/virtualmachines"
                        component={VirtualMachineListPage}
                    />
                    <Route
                        exact
                        path="/groups/:groupID/namespaces/:namespaceID/virtualmachines/new"
                        component={VirtualMachineCreatePage}
                    />
                    <Route
                        exact
                        path="/groups/:groupID/namespaces/:namespaceID/virtualmachines/show/:virtualmachineID"
                        component={VirtualMachinePage}
                    />
                    <Route
                        exact
                        path="/groups/:groupID/namespaces/:namespaceID/virtualrouters"
                        component={VirtualRouterListPage}
                    />
                    <Route
                        exact
                        path="/groups/:groupID/namespaces/:namespaceID/virtualrouters/new"
                        component={VirtualRouterCreatePage}
                    />
                    <Route
                        exact
                        path="/groups/:groupID/namespaces/:namespaceID/virtualrouters/show/:virtualrouterID"
                        component={VirtualRouterPage}
                    />
                </Switch>
            </Router>
        </>
    );
}

export default App;

import { CssBaseline } from "@material-ui/core";
import { createBrowserHistory } from "history";
import React from "react";
import { createGlobalState } from "react-hooks-global-state";
import { Route, Router, Switch } from "react-router-dom";
import { Header } from "./components/Header";
import { LoginPage } from "./components/pages/Login";
import { RegisterPage } from "./components/pages/Register";
import { TopPage } from "./components/pages/Top";
import { Clients } from "./service/client/clients";
import { GroupPage } from "./components/pages/Group";
import { NamespaceListPage } from "./components/pages/NamespaceList";
import { NamespacePage } from "./components/pages/Namespace";

export const { useGlobalState } = createGlobalState({
    client: new Clients("http://localhost:8080"),
    isLogin: false,
});

const history = createBrowserHistory();
function App() {
    const [isLogin, setIsLogin] = useGlobalState("isLogin");

    const logout = () => {
        setIsLogin(false);
    };

    return (
        <>
            <Router history={history}>
                <Header
                    title="humstack"
                    isLogin={isLogin}
                    logoutProcess={logout}
                />
                <CssBaseline />
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
                    />
                    <Route
                        exact
                        path="/groups/:groupID/namespaces/:namespaceID/networks/:networkID"
                    />
                    <Route
                        exact
                        path="/groups/:groupID/namespaces/:namespaceID/blockstorages"
                    />
                    <Route
                        exact
                        path="/groups/:groupID/namespaces/:namespaceID/blockstorages/:blockstorageID"
                    />
                    <Route
                        exact
                        path="/groups/:groupID/namespaces/:namespaceID/virtualmachines"
                    />
                    <Route
                        exact
                        path="/groups/:groupID/namespaces/:namespaceID/virtualmachines/:virtualmachineID"
                    />
                </Switch>
            </Router>
        </>
    );
}

export default App;

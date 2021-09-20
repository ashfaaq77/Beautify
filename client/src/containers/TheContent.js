import React, { Suspense, useContext, useState, useEffect } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { CContainer, CFade } from '@coreui/react';
import AuthContext from "../context/AuthContext";

// routes config
import { adminRoutes, routes } from '../routes';


const loading = (
    <div className="pt-3 text-center">
        <div className="sk-spinner sk-spinner-pulse"></div>
    </div>
)

const TheContent = () => {

    const { loggedIn } = useContext(AuthContext);
    // const [allRoutes, setAllRoutes] = useState(routes);
    // const allRoutes = useState(routes);

    var allRoutes = [...routes];

    if (loggedIn) {
        allRoutes = [...routes, ...adminRoutes];
    }

    return (
        <main className="c-main">
            <CContainer fluid>
                <Suspense fallback={loading}>
                    <Switch>
                        {allRoutes.map((route, idx) => {
                            return route.component && (
                                <Route
                                    key={idx}
                                    path={route.path}
                                    exact={route.exact}
                                    name={route.name}
                                    render={props => (
                                        <CFade>
                                            <route.component {...props} />
                                        </CFade>
                                    )} />
                            )
                        })}
                        {/* <Redirect from="/" to="/" /> */}
                    </Switch>
                </Suspense>
            </CContainer>
        </main>
    )
}

export default React.memo(TheContent)

import { Redirect, Route } from 'react-router-dom'
import AuthService from "./AuthService";

const PrivateRoute = ({ component: Component, ...rest }) => {
    const isLoggedIn = AuthService.isLoggedIn()

    return (
        <Route
            {...rest}
            render={props =>
                isLoggedIn ? (
                    <Component {...props} />
                ) : (
                    <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
                )
            }
        />
    )
}

export default PrivateRoute
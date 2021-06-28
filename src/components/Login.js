import {Redirect} from "react-router-dom";
import {useAuth} from "../service/AuthContext";
import React, {useState} from 'react';
import Button from "react-bootstrap/Button";
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Login(props) {

    const [isLoggedIn, setLoggedIn] = useState(false);
    const [isError, setIsError] = useState(false);
    const [data, setData] = useState({});
    const {setTokens} = useAuth();

    const handleInputChange = (event) => {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        data[name] = value;
        setData({...data});
    };

    function postLogin(e) {
        e.preventDefault()

        fetch(process.env.REACT_APP_BASE_URI + '/authenticate',
            {
                method: 'POST', // *GET, POST, PUT, DELETE, etc.
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data) // body data type must match "Content-Type" header
            })
            .then(response => {
                if (response.ok) {
                    return response.json()
                }
                throw new Error(`Unable to get data: ${response.statusText}`)
            })
            .then(json => {
                setTokens(json.token);
                setLoggedIn(true);
            })
            .catch((err) => {
                setIsError(err.message)
            })
    }

    if (isLoggedIn) {
        return <Redirect to="/about"/>;
    }

    // alert(process.env.REACT_APP_BASE_URI)

    return (
        <div>
            <br/>
            <h1>Log in form</h1>
            <hr/>
            <form onSubmit={postLogin}>
                <div>
                    <label>User name</label>
                    <br/>
                    <input type={"text"} name={"username"} onChange={handleInputChange}/>
                </div>
                <br/>
                <div>
                    <label>Password</label>
                    <br/>
                    <input type={"password"} name={"password"} onChange={handleInputChange}/>
                </div>
                <br/>
                <Button variant="primary" type="submit">Login</Button>
                {isError}
            </form>
        </div>
    )

}

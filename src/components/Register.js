import React, {useState} from 'react';
import Button from "react-bootstrap/Button";
import 'bootstrap/dist/css/bootstrap.min.css';
import Form from "react-bootstrap/Form";

export default function Register(props) {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");


    function postRegister(e) {
        e.preventDefault()

        const reqBody = {
            username: username,
            password: password,
            firstName: firstName,
            lastName: lastName

        };

        const request = ({
            url: process.env.REACT_APP_BASE_URI + '/registration',
            method: 'POST',
            headers: new Headers({
                'Content-Type': 'application/json',
            }),
            body: JSON.stringify(reqBody)
        });

        fetch(request.url, request)
            .then(response =>
                response.json().then(json => {
                    if (!response.ok) {
                        return Promise.reject(json)
                    }

                    return json
                })
            )
            .then(result => {
                props.history.push({
                    pathname: '/login',
                    state: {message: "Success!", title: result.message}
                });
            })
            .catch(result => {
                alert(result.message)
            })
    }

    return (
        <div className="col-xs-1 col-sm-4 center">
            <h1>Register form</h1>
            <hr/>
            <Form onSubmit={postRegister}>
                <Form.Group>
                    <Form.Label>User name</Form.Label>
                    <Form.Control type="username" placeholder="Enter username" value={username}
                                  onChange={(e) => setUsername(e.target.value)}/>
                </Form.Group>

                <Form.Group>
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Enter password" value={password}
                                  onChange={(e) => setPassword(e.target.value)}/>
                </Form.Group>

                <Form.Group>
                    <Form.Label>First name</Form.Label>
                    <Form.Control type="firstName" placeholder="Enter first name" value={firstName}
                                  onChange={(e) => setFirstName(e.target.value)}/>
                </Form.Group>

                <Form.Group>
                    <Form.Label>Last name</Form.Label>
                    <Form.Control type="LastName" placeholder="Enter last name" value={lastName}
                                  onChange={(e) => setLastName(e.target.value)}/>
                </Form.Group>

                <Button variant="primary" type="submit">Register</Button>
            </Form>
        </div>
    )
}
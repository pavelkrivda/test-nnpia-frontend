import React, {useEffect, useState} from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import jwt_decode from "jwt-decode";

export default function UserForm(props) {

    const [user, setUser] = useState([]);
    const [firstName, setFistName] = useState([]);
    const [lastName, setLastName] = useState([]);
    const [userId, setUserId] = useState(null);

    useEffect(() => {

        async function fetchData() {
            setUserId(props.location.state.userID);

            const request = ({
                url: process.env.REACT_APP_BASE_URI + '/user/' + jwt_decode(localStorage.getItem('tokens')).sub,
                method: 'GET',
                headers: new Headers({
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('tokens')
                })
            });

            await fetch(request.url, request)
                .then(response =>
                    response.json().then(json => {
                        if (!response.ok) {
                            return Promise.reject(json)
                        }

                        return json
                    })
                )
                .then(result => {
                    setUser(result)
                })
        }

        fetchData();
    }, [props.location.state.userID])

    const editUser = () => {
        const reqBody = {
            id: userId,
            username: user.username,
            firstName: firstName,
            lastName: lastName,
            password: "fake"
        };

        // alert(postId)

        const request = ({
            url: process.env.REACT_APP_BASE_URI + '/user/' + userId,
            method: 'PUT',
            headers: new Headers({
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('tokens')
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
                    pathname: '/response',
                    state: {message: "Success!", title: result.message}
                });
            })
    };

    const sendUser = (e) => {
        e.preventDefault();
        editUser();
    };

    return (
        <div class="col-xs-1 col-sm-4 center">
            <br/>
            <h1>Edit your profile</h1>
            <hr/>

            <Form onSubmit={sendUser}>
                <Form.Group>
                    <Form.Label>User name : {user.username}</Form.Label>
                </Form.Group>

                <Form.Group>
                    <Form.Label>First name</Form.Label>
                    <Form.Control type="title" className="form-control" value={firstName} onChange={(e) => {
                        setFistName(e.target.value)
                    }}/>
                </Form.Group>

                <Form.Group>
                    <Form.Label>Last name</Form.Label>
                    <Form.Control type="title" className="form-control" value={lastName} onChange={(e) => {
                        setLastName(e.target.value)
                    }}/>
                </Form.Group>

                <Button variant="primary" type="submit">Submit</Button>
            </Form>
        </div>
    )
}

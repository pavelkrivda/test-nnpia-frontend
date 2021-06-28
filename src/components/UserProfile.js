import React, {useState, useEffect} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from "react-bootstrap/Button";
import jwt_decode from "jwt-decode";

export default function UserProfile(props) {
    const [user, setUser] = useState([]);

    useEffect(() => {
        async function fetchData() {
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
                    setUser(result);
                })
        }

        fetchData();
    }, []);

    const renderUserOptions = (userName) => {
        if (jwt_decode(localStorage.getItem('tokens')).sub === userName) {
            return (
                <div>
                    <Button variant="primary" onClick={openLinkEdit}>Edit profile</Button>
                </div>
            )
        }
    };

    const openLinkEdit = () => {
        props.history.push({
            pathname: '/edit/user',
            state: {userID: user.id}
        })
    };

    const {username, firstName, lastName} = user;

    return (
        <div>
            <br/>
            <h1>Your profile</h1>
            <br/>
            <br/>
            <h5 class="absolute">Username:&emsp;&emsp;{username}</h5>
            <br/>
            <br/>
            <h5 class="absolute">Fist name:&nbsp;&emsp;&emsp;{firstName}</h5>
            <br/>
            <br/>
            <h5 class="absolute">Last name:&emsp;&emsp;{lastName}</h5>
            <br/>
            <br/>
            {renderUserOptions(jwt_decode(localStorage.getItem('tokens')).sub)}
        </div>
    );
}

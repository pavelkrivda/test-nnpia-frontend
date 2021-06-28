import React from "react";
import jwt_decode from "jwt-decode";
import {Button, Card} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const Comment = ({props, comment}) => {
    const {id, userName, body} = comment || {};

    const CustomComment = ({userName, text}) => {
        if (jwt_decode(localStorage.getItem('tokens')).sub === userName) {
            return (
                <div className="commentCard">
                    <span>{text}</span>
                    <div>
                        <Button variant="outline-danger" onClick={() => removeComment(id)}>✕</Button>
                    </div>
                </div>
            );
        } else {
            return (
                <div className="commentCard">
                    <span>{text}</span>
                </div>
            );
        }
    }

    const removeComment = async (id) => {
        const reqBody = {
            id: id
        };

        const request = ({
            url: process.env.REACT_APP_BASE_URI + '/comment/' + id,
            method: 'DELETE',
            headers: new Headers({
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('tokens')
            }),
            body: JSON.stringify(reqBody)
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
                props.history.push({
                    pathname: '/response',
                    state: {message: "Success!", title: result.message}
                });
            })
            .catch(result => {
                props.history.push({
                    pathname: '/response',
                    state: {title: "ERROR!", message: "Something went wrong."}
                });
            })
    };

    return (
        <div className="App">
            <div className="container">
                <div>
                    <Card>
                        <br/>
                        <h6 className="mt-0 mb-1 text-muted">Author: {userName}</h6>
                        <hr/>
                        <Card.Body>
                            <CustomComment userName={userName} text={body}/>
                        </Card.Body>
                    </Card>
                </div>
                <br/>
            </div>
        </div>
    );
};
export default Comment;
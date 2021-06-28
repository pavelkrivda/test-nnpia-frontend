import React, {useEffect, useState} from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

export default function PostForm(props) {

    const [title, setTitle] = useState([]);
    const [body, setBody] = useState([]);
    const [postId, setPostId] = useState(null);

    useEffect(() => {
        async function fetchData() {
            setPostId(props.location.state.postID);

            if (props.location.state.postID !== -1) {
                const request = ({
                    url: process.env.REACT_APP_BASE_URI + '/post/' + props.location.state.postID,
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
                        setTitle(result.title);
                        setBody(result.body);
                    })
            }
        }

        fetchData();
        }, [props.location.state.postID])

    const addPost = () => {
        const reqBody = {
            title: title,
            body: body,
        };

        const request = ({
            url: process.env.REACT_APP_BASE_URI + '/post',
            method:'POST',
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

    const editPost = () => {
        const reqBody = {
            id: postId,
            title: title,
            body: body,
        };

        // alert(postId)

        const request = ({
            url: process.env.REACT_APP_BASE_URI + '/post/' + postId,
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


    const sendPost = (e) => {
        e.preventDefault();
        // alert(postId)

        if (postId === -1) {
            addPost();
        } else {
            editPost();
        }
    };

    return (
        <div class="col-xs-1 col-sm-8 center">
            <br/>
            <h1>Add / Edit a post</h1>
            <hr/>

            <Form onSubmit={sendPost}>
                <Form.Group>
                    <Form.Label>Post title</Form.Label>
                    <Form.Control type="title" className="form-control" value={title} onChange={(e) => {
                        setTitle(e.target.value)
                    }}/>
                </Form.Group>

                <Form.Group>
                    <Form.Label>Write here</Form.Label>
                    <Form.Control as="textarea" rows={20} value={body} onChange={(e) => {
                        setBody(e.target.value)
                    }}/>
                </Form.Group>

                <Button variant="primary" type="submit">Submit</Button>
            </Form>
        </div>
    )
}

import React, {useEffect, useState, useCallback} from 'react';
import Comment from "./Comment";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import jwt_decode from "jwt-decode";
import {Form} from "react-bootstrap";

function FormComment({addComment}) {
    const [value, setValue] = React.useState("");

    const handleSubmit = e => {
        e.preventDefault();
        if (!value) return;
        addComment(value);
        setValue("");
    };

    return (
        <div className="col-xs-1 col-sm-9 center">
            <br/>
            <Form onSubmit={handleSubmit}>
                <Form.Group>
                    <Form.Control type="text" className="input" value={value} onChange={e => setValue(e.target.value)}
                                  placeholder="Write comment"/>
                </Form.Group>
                <Button variant="primary mb-3" type="submit">
                    Add comment
                </Button>
            </Form>
        </div>
    );
}

export default function Post(props) {
    const postId = props.location.state.postID;
    const [post, setPost] = useState([]);
    const [comments, setComments] = useState([]);


    const getComments = useCallback(async () => {
        const requestComments = ({
            url: process.env.REACT_APP_BASE_URI + '/comments/' + postId,
            method: 'GET',
            headers: new Headers({
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('tokens')
            })
        });

        await fetch(requestComments.url, requestComments)
            .then(response =>
                response.json().then(json => {
                    if (!response.ok) {
                        return Promise.reject(json)
                    }

                    return json
                })
            )
            .then(result => {
                setComments(result);
            })
    },[postId]);

    useEffect(() => {
        async function fetchData() {
            const requestPost = ({
                url: process.env.REACT_APP_BASE_URI + '/post/' + postId,
                method: 'GET',
                headers: new Headers({
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('tokens')
                })
            });

            await fetch(requestPost.url, requestPost)
                .then(response =>
                    response.json().then(json => {
                        if (!response.ok) {
                            return Promise.reject(json)
                        }

                        return json
                    })
                )
                .then(result => {
                    setPost(result);
                });
        }
        fetchData();
        getComments();
    }, [getComments, postId]);

    const renderComments = (comments) => {
        const commentsList = [];
        comments.forEach((comment) => {
            const {id} = comment;
            commentsList.push(<Comment props={props} comment={comment} id={id}/>)
        });
        return commentsList;
    };

    const renderPostOptions = (userName) => {
        if (jwt_decode(localStorage.getItem('tokens')).sub === userName) {
            return (
                <div>
                    <Table responsive borderless>
                        <thead>
                        <tr>
                            <th><Button variant="primary" onClick={openLinkEdit}>Edit post</Button></th>
                            <th><Button variant="primary" onClick={() => removePost(id)}>Delete post</Button></th>
                        </tr>
                        </thead>
                    </Table>
                </div>
            )
        }
    };

    const openLinkEdit = () => {
        props.history.push({
            pathname: '/add/post',
            state: {postID: post.id}
        })
    };

    const removePost = async (id) => {
        const reqBody = {
            id: id
        };

        const request = ({
            url: process.env.REACT_APP_BASE_URI + '/post/' + id,
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

    const addComment = text => {
        if (text !== "") {
            const reqBody = {
                body: text,
                postId: props.location.state.postID
            };

            const request = ({
                url: process.env.REACT_APP_BASE_URI + '/comment',
                method: 'POST',
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
                    getComments();
                    // window.location.reload();
                })
        }
    };

    const {id, userName, title, body} = post;

    return (
        <div id={id} className="text-center">
            <br/>
            <h1>{title}</h1>
            <br/>
            <small>Author: {userName}</small>
            <div>{body}</div>
            <br/>
            <div>
                {renderPostOptions(userName)}
            </div>
            <hr/>
            <div>
                {renderComments(comments ? comments : [])}
            </div>
            <br/>
            <FormComment addComment={addComment}/>
        </div>
    );
}

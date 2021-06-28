import React, {useState, useEffect} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";

export default function PostList(props) {
    const [postList, setPostList] = useState([]);

    useEffect( () => {
        async function fetchData() {
        const request = ({
            url: process.env.REACT_APP_BASE_URI + '/post/getAll',
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
                setPostList(result);
            })}
        fetchData();
    }, [])

    const renderAvailableLinks = (postList) => {
        const postLinks = [];

        postList.forEach((post) => {
            const {id, title, body}  = post;
            postLinks.push(
                <div>
                    <Card id={id} className="text-center">
                        <Card.Header>{title}</Card.Header>
                        <Card.Body>
                            <Card.Text>{body.substring(0,500) + "..."}</Card.Text>
                            <Button variant="primary" onClick={() => openLink(id)}>Read</Button>
                        </Card.Body>
                    </Card>
                    <br/>
                    <br/>
                </div>
            );
        });

        return postLinks;
    };

    const openLink = (postId) => {
        props.history.push({
            pathname: '/post/' + postId,
            state: {postID: postId}
        })
    };

    return (
        <div>
            <br/>
            <h1>Posts:</h1>
            <br/>
            <ul>
                {renderAvailableLinks(postList)}
            </ul>
        </div>
    );
}

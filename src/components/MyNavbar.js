import React from 'react';
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import 'bootstrap/dist/css/bootstrap.min.css';
import {useHistory} from 'react-router-dom';
import {Link} from 'react-router-dom';
import AuthService from "../service/AuthService";

export default function MyNavbar(props) {
    var navItems = [];

    const history = useHistory();

    const isLoggedIn = AuthService.isLoggedIn();

    navItems.push(<li className="nav-item">
        <Nav.Link href="/#/home">Home</Nav.Link>
    </li>);

    navItems.push(<li className="nav-item">
        <Nav.Link href="/#/about">About</Nav.Link>
    </li>);

    if (!isLoggedIn) {
        navItems.push(<li className="nav-item">
            <Nav.Link href="/#/login">Login</Nav.Link>
        </li>);

        navItems.push(<li className="nav-item">
            <Nav.Link href="/#/register">Register</Nav.Link>
        </li>);
    } else {
        navItems.push(<li className="nav-item">
            <Nav.Link href="/#/post-list">Posts</Nav.Link>
        </li>);

        navItems.push(<li className="nav-item">
            <Link to={{pathname: "/add/post", state: {postID: -1}}} >
                <Nav.Link href="/add/post">Create post</Nav.Link>
            </Link>
        </li>);

        navItems.push(<li className="nav-item">
            <Nav.Link href="/#/user-profile">My profile</Nav.Link>
        </li>);

        navItems.push(<li className="nav-item">
            <Nav.Link onClick={props.logoutMethod.bind(null, history)}>Logout</Nav.Link>
        </li>);
    }

    return (
        <div>
            <Navbar bg="dark" variant="dark">
                <Navbar.Brand href="/#/home">My Blog</Navbar.Brand>
                <Nav className="mr-auto">
                    <ul className="nav">
                        {navItems}
                    </ul>
                </Nav>
            </Navbar>
        </div>
    );
}

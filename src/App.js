import './App.css';
import {HashRouter, Switch, Route} from "react-router-dom";
import About from "./components/About";
import Comment from "./components/Comment";
import React, {useState} from "react";
import MyNavbar from "./components/MyNavbar";
import Home from "./components/Home";
import Login from "./components/Login";
import ResponsePage from "./components/ResponsePage";
import Post from "./components/Post";
import PostList from "./components/PostList";
import PostForm from "./components/PostForm";
import {useAuth} from "./service/AuthContext";
import Register from "./components/Register";
import UserProfile from "./components/UserProfile";
import UserForm from "./components/UserForm";
import PrivateRoute from "./service/PrivateRoute";

function App() {
    const {removeTokens} = useAuth()
    const [isLoggedIn, setLoggedIn] = useState(false);

    const userLogOut = (setLoggedIn, history) => {
        setLoggedIn(false);
        removeTokens();
        history.push("/");
        window.location.reload();
    };

    return (
        <HashRouter>
            <div className="App">

                <MyNavbar isLoggedIn={isLoggedIn} logoutMethod={userLogOut.bind(null, setLoggedIn)}/>

                <Switch>
                    <Route path="/login">
                        <Login loginMethod={setLoggedIn}/>
                    </Route>

                    <PrivateRoute path="/comment" component={Comment}/>
                    <PrivateRoute path="/post-list" component={PostList}/>
                    <PrivateRoute path="/post/:postId" component={Post}/>
                    <PrivateRoute path="/add/post" component={PostForm}/>
                    <PrivateRoute path="/response" component={ResponsePage}/>
                    <PrivateRoute path="/user-profile" component={UserProfile}/>
                    <PrivateRoute path="/edit/user" component={UserForm}/>

                    <Route path="/about" component={About}/>
                    <Route path="/register" component={Register}/>
                    <Route path="/" component={Home}/>

                </Switch>
            </div>
        </HashRouter>
    );

}

export default App;

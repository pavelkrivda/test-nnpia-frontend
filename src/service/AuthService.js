import axios from 'axios';
import {WEB_ADDRESS} from "../components/Constants";

const USER_API_BASE_URL = WEB_ADDRESS + 'token/';

const AuthService = {

    isLoggedIn: function(){
        return !!localStorage.getItem("tokens"); // vrati true kdyz je token nastaven
    },

    login: function(credentials) {
        return axios.post(USER_API_BASE_URL + "generate-token", credentials);
    },

    setUserInfo: function(value) {
        localStorage.setItem("userInfo", JSON.stringify(value));
    },

    getUserInfo: function() {
        return JSON.parse(localStorage.getItem("userInfo"));
    },

    getUserIdUser: function() {
        let userInfo = JSON.parse(localStorage.getItem("userInfo"));
        return userInfo != null ? userInfo.id : userInfo;
    },

    getUserRole: function() {
        let userInfo = JSON.parse(localStorage.getItem("userInfo"));
        return userInfo != null ? userInfo.role : userInfo;
    },

    getAuthHeader: function() {
        return {headers: {Authorization: 'Bearer ' + this.getUserInfo().token}};
    },

    logOut: function() {
        return axios.post(USER_API_BASE_URL + 'logout', {}, this.getAuthHeader());
    },

};

export default  AuthService;
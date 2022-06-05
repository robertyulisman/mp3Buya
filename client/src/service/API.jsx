import axios from 'axios'
import Auth from './Auth';
require('dotenv').config()
// const BASE_URL = process.env.REACT_APP_BASE_URL;
// const BASE_URL = "https://api-lagu.masyadi.com";
const BASE_URL = "http://localhost:5000";
// const BASE_URL = "https://cryptic-everglades-82283.herokuapp.com";
// const BASE_URL = "https://api.mejormusica.xyz";
// console.log(process.env)

function getUser() {
    try {
        var user = JSON.parse(Auth.getUser());
        console.log('user', user)
        return user;
    } catch (err) {
        return "";
    }
}

const GET = (path) => {
    return new Promise((resolve, reject) => {
        axios.get(`${BASE_URL}/${path}`, {
            headers: {
                'access-token': getUser().token,
            }
        }).then(result => {
            resolve(result.data);
        }, (err) => {
            var msgError = err.response ? err.response.data : err;
            reject(msgError);
        })
    })
}

const POST = (path, data) => {
    return new Promise((resolve, reject) => {
        axios.post(`${BASE_URL}/${path}`, data, {
            headers: {
                'access-token': getUser().token,
            }
        }).then(result => {
            resolve(result.data);
        }, (err) => {
            var msgError = err.response ? err.response.data : err;
            reject(msgError);
        })
    })
}

const POST_MULTI = (path, data) => {
    return new Promise((resolve, reject) => {
        axios.post(`${BASE_URL}/${path}`, data, {
            headers: {
                'access-token': getUser().token,
                'content-type': 'multipart/form-data'
            }
        }).then(result => {
            resolve(result.data);
        }, (err) => {
            var msgError = err.response ? err.response.data : err;
            reject(msgError);
        })
    })
}

const PATCH = (path, data) => {
    return new Promise((resolve, reject) => {
        axios.patch(`${BASE_URL}/${path}`, data, {
            headers: {
                'access-token': getUser().token,
            }
        }).then(result => {
            resolve(result.data);
        }, (err) => {
            var msgError = err.response ? err.response.data : err;
            reject(msgError);
        })
    })
}

const PATCH_MULTI = (path, data) => {
    return new Promise((resolve, reject) => {
        axios.patch(`${BASE_URL}/${path}`, data, {
            headers: {
                'access-token': getUser().token,
                'content-type': 'multipart/form-data'
            }
        }).then(result => {
            resolve(result.data);
        }, (err) => {
            var msgError = err.response ? err.response.data : err;
            reject(msgError);
        })
    })
}

const DELETE = (path) => {
    return new Promise((resolve, reject) => {
        axios.delete(`${BASE_URL}/${path}`,{
            headers: {
                'access-token': getUser().token,
            }
        }).then(result => {
            resolve(result.data);
        }, (err) => {
            var msgError = err.response ? err.response.data : err;
            reject(msgError);
        })
    })
}

const Login = (params) => POST(`auth?userName=${params.userName}&pass=${params.pass}`)

//Godev
const getGodevs = ()=> GET(`api/godevs/many?user=${getUser()._id}`);
const getGodevById = (id, isPopulate)=> GET(`api/godevs?id=${id}&isPopulate=${isPopulate}`);
const addGodev = (data) => POST(`api/godevs?user=${getUser()._id}`, data);
const updateGodev = (id, data) =>PATCH(`api/godevs?id=${id}`, data);
const deleteGodev = (id)=>DELETE(`api/godevs?_id=${id}`);

//Application
const initDataApp = ()=> GET(`api/apps/initData?user=${getUser()._id}`);
const getAppsByUser = ()=> GET(`api/apps/many?user=${getUser()._id}`);
const getAppsByGodev = (idGodev)=> GET(`api/apps/many?godev=${idGodev}`);
const addApp = (data) =>POST(`api/apps`, data);
const updateApp = (id, data) =>PATCH(`api/apps?_id=${id}`, data);
const deleteApp = (id, idGodev)=>DELETE(`api/apps?id=${id}&idGodev=${idGodev}`);
const addArtistToApp = (id_app, id_artist)=>POST(`api/apps/addArtist?id_app=${id_app}&id_artist=${id_artist}`);
const deleteArtistFromApp = (id_app, id_artist)=>DELETE(`api/apps/deleteArtist?id_app=${id_app}&id_artist=${id_artist}`);

//music
const initDataMusic = () =>GET(`api/musics/initData`);
const getMusics = () =>GET(`api/musics/many`);
const getMusicsByArtist = (id_artist) =>GET(`api/musics/many?artist=${id_artist}`);
const addMusic = (data) =>POST(`api/musics`, data);
const deleteMusic = (id)=>DELETE(`api/musics?id=${id}`);
const updateMusic = (id, data) =>PATCH(`api/musics?id=${id}`, data);

//artist
const getArtists = ()=> GET(`api/artists/many`);
const addArtist = (data) =>POST_MULTI(`api/artists`, data);
const updateArtist = (id, data) =>PATCH_MULTI(`api/artists?id=${id}`, data);
const deleteArtist = (id)=>DELETE(`api/artists?id=${id}`);

//User
const getUsers = ()=> GET(`api/users/all`);
const addUser = (data) =>POST(`api/users`, data);
const updateUser = (id, data) =>PATCH(`api/users?id=${id}`, data);
const deleteUser = (id)=>DELETE(`api/users?id=${id}`);

//YrScrapper
const scrapeSingleYt = (id)=> GET(`yt-scrapper/data?id=${id}`);
const scrapePlaylistYt = (idPlaylist)=> GET(`yt-scrapper/playlist?idPlaylist=${idPlaylist}`)


const API = {
    BASE_URL,
    Login,
    getGodevs,
    getGodevById,
    addGodev,
    updateGodev,
    deleteGodev,
    getAppsByUser,
    getAppsByGodev,
    addApp,
    updateApp,
    deleteApp,
    getMusics,
    getMusicsByArtist,
    initDataMusic,
    addMusic,
    updateMusic,
    deleteMusic,
    addArtistToApp,
    deleteArtistFromApp,
    getArtists,
    addArtist,
    updateArtist,
    deleteArtist,
    getUsers,
    initDataApp,
    addUser,
    updateUser,
    deleteUser,
    scrapeSingleYt,
    scrapePlaylistYt
}

export default API;
import Cookies from 'js-cookie'

const getUser = () => Cookies.get('user');
const isAuthenticated = () => {
    try {
        var user = JSON.parse(getUser());
        return user.login === true;
    } catch (err) {
        return false;
    }
}

var authNoRemeber = false;

const setAuthNoRemember = (p)=>{
    authNoRemeber = p;
}

const isAuthenticatedNoRemember = ()=>{
    return authNoRemeber;
}

const Login = (dataUser, isLogin) => {

    var user = {
        ...dataUser,
        login: isLogin
    }
    Cookies.set('user', user);
}

const LogOut = () => {
    authNoRemeber = false;
    Cookies.remove('user');
}

const Auth = {
    Login,
    LogOut,
    getUser,
    isAuthenticated,
    setAuthNoRemember,
    isAuthenticatedNoRemember
}

export default Auth;

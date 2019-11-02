import * as types from './authTypes';
import Config from '../config';
import history from '../history';

export function onGetToken(data) {
    return {
        type: types.ON_GET_TOKEN,
        payload: {
            client: 'system',
            request:{
                method: 'GET',
                url: "/oauth/token?client_id=" 
                    + Config.clientId + "&client_secret=" 
                    + Config.clientSecret + "&grant_type=password" 
                    + "&username=" + data.username 
                    + "&password="
            }
        }
    };
}

export function onLogin(data) {
    return {
        type: types.ON_LOGIN,
        payload: {
            client: 'system',
            request:{
                method: 'POST',
                url:'/oauth/login',
                data: data
            }
        }
    };
}

export function onLogout(params) {
    return {
        type: types.ON_LOGOUT,
        payload: {
            client: 'system',
            request: {
                    method: 'POST',
                    url: "/oauth/logout"
            },
            options: {
                onSuccess({ getState, dispatch, response }) {
                    localStorage.clear();
                    if (params.isExpiredToken) {
                        localStorage.setItem('is_expired_token', "true");
                    } else {
                        localStorage.setItem('is_expired_token', "false");
                    }
                    const locationState = history.location;
                    localStorage.setItem('current_location_state', locationState.pathname);
                    history.push('/login');
                },
                onError({ getState, dispatch, error }) {
                    localStorage.clear();
                    if (params.isExpiredToken) {
                        localStorage.setItem('is_expired_token', "true");
                    } else {
                        localStorage.setItem('is_expired_token', "false");
                    }
                    const locationState = history.location;
                    localStorage.setItem('current_location_state', locationState.pathname);
                    history.push('/login');
                },
            }
        }
    };
}

export function onValidateToken() {
    return {
      type: types.ON_VALIDATE_TOKEN,
        payload: {
            client: 'system',
            request:{
                method: 'POST',
                url:'/oauth/validateToken'
            }
        }
    };
}

export function onValidateTokenVsa() {
    return {
      type: types.ON_VALIDATE_TOKEN_VSA,
        payload: {
            client: 'system',
            request:{
                method: 'POST',
                url:'/oauthVsa/validateTokenVsa'
            }
        }
    };
}

export function onLogoutVsa() {
    return {
      type: types.ON_LOGOUT_VSA,
        payload: {
            client: 'system',
            request:{
                method: 'GET',
                url:'/oauthVsa/logoutVsa'
            },
            options: {
                onSuccess({ getState, dispatch, response }) {
                    localStorage.clear();
                    const locationState = history.location;
                    localStorage.setItem('current_location_state', locationState.pathname);
                    window.location = Config.apiUrl + "/oauthVsa/logoutVsa";
                },
                onError({ getState, dispatch, error }) {
                    localStorage.clear();
                    const locationState = history.location;
                    localStorage.setItem('current_location_state', locationState.pathname);
                    window.location = Config.apiUrl + "/oauthVsa/logoutVsa";
                },
            }
        }
    };
}
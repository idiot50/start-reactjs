import {createStore, applyMiddleware, compose} from 'redux';
import reduxThunk from 'redux-thunk';
// Reducers
import reducers from '../reducers';
// Initial state
import initialState from './initialState';
import { multiClientMiddleware } from 'redux-axios-middleware';
import apiMiddleware from './../utils/apiMiddleware';
import Base64 from 'base-64';
import Config from './../config';
import history from './../history';
import { onShowLoading, onHideLoading } from './loading';

const axiosMiddlewareOptions = {
    returnRejectedPromiseOnError: true,
    interceptors: {
        request: [{
            success: ({ getState, dispatch, getSourceAction }, request) => {
                onShowLoading();
                // Request interception
                // request.headers.common['Authorization'] = 'Basic ' + Base64.encode(Config.clientId + ':' + Config.clientSecret);
                const authorization = localStorage.getItem('authorization');
                if (authorization) {
                    request.headers.common['Authorization'] = authorization;
                }
                //Language and timezone
                const language = localStorage.getItem('default_locale') ? localStorage.getItem('default_locale') : Config.defaultLocale;
                const timezoneOffset = sessionStorage.getItem('default_timezone_offset') ? sessionStorage.getItem('default_timezone_offset') : Config.defaultTimezoneOffset;
                if (language && timezoneOffset) {
                    if(request.url.indexOf("?") !== -1) {
                        request.url = request.url + '&language=' + language + '&utcOffset=' + timezoneOffset;
                    } else {
                        request.url = request.url + '?language=' + language + '&utcOffset=' + timezoneOffset;
                    }
                }
                //Ticket VSA
                const ticketVsa = localStorage.getItem('ticket_vsa');
                if (ticketVsa && ticketVsa !== "null") {
                    if(request.url.indexOf("?") !== -1) {
                        request.url = request.url + '&ticket=' + ticketVsa;
                    } else {
                        request.url = request.url + '?ticket=' + ticketVsa;
                    }
                }
                //Token oauth2
                const accessToken = localStorage.getItem('access_token');
                const refreshToken = localStorage.getItem('refresh_token');
                const isAuthenticated = localStorage.getItem('is_authenticated') === "true" ? true : false;
                if (accessToken && refreshToken && isAuthenticated) {
                    if(request.url.indexOf("?") !== -1) {
                        request.url = request.url + '&access_token=' + accessToken;
                    } else {
                        request.url = request.url + '?access_token=' + accessToken;
                    }
                }
                return request;
            },
            error: ({ getState, dispatch, getSourceAction }, error) => {
                //...
            }
        }],
        response: [{
            success: ({ getState, dispatch, getSourceAction }, response) => {
                onHideLoading();
                // Response interception
                return response;
            },
            error: ({ getState, dispatch, getSourceAction }, error) => {
                onHideLoading();
                // Response Error Interception
                if (error.response !== undefined) {
                    if (error.response.status === 401) {
                        history.push('/401');
                    }
                    // if (error.response.status === 503) {
                    //     history.push('/500');
                    // }
                }
                return Promise.reject(error);
            }
        }]
    }
};

const configureStore = () => {
    return createStore(
        reducers,
        initialState,
        // Apply thunk middleware and add support for Redux dev tools in Google Chrome
        process.env.NODE_ENV !== 'production' && window.devToolsExtension ?
            compose(applyMiddleware(reduxThunk, 
                multiClientMiddleware(
                    apiMiddleware, // described below
                    axiosMiddlewareOptions // optional, this will be used for all middleware if not overriden by upper options layer
                )
            ), window.devToolsExtension())
            :
            applyMiddleware(reduxThunk, 
                multiClientMiddleware(
                    apiMiddleware, // described below
                    axiosMiddlewareOptions // optional, this will be used for all middleware if not overriden by upper options layer
                )
            )
    );
};

export default configureStore;

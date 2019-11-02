import * as types from '../actions/authTypes';
import initialState from '../stores/initialState';

export default function authReducer(state = initialState.auth, action) {
    switch (action.type) {
        case `${types.ON_GET_TOKEN}_SUCCESS`:
            return { ...state, token: action };
        case `${types.ON_GET_TOKEN}_FAIL`:
            return { ...state, token: action };
        case `${types.ON_LOGIN}_SUCCESS`:
            return { ...state, login: action, isAuthenticated: true };
        case `${types.ON_LOGIN}_FAIL`:
            return { ...state, login: action, isAuthenticated: false };
        case `${types.ON_LOGOUT}_SUCCESS`:
            return { ...state, logout: action, isAuthenticated: false };
        case `${types.ON_LOGOUT}_FAIL`:
            return { ...state, logout: action, isAuthenticated: false };
        case `${types.ON_VALIDATE_TOKEN}_SUCCESS`:
            return { ...state, validateToken: action };
        case `${types.ON_VALIDATE_TOKEN}_FAIL`:
            return { ...state, validateToken: action };
        
        case `${types.ON_VALIDATE_TOKEN_VSA}_SUCCESS`:
            return { ...state, validateTokenVsa: action };
        case `${types.ON_VALIDATE_TOKEN_VSA}_FAIL`:
            return { ...state, validateTokenVsa: action };
        case `${types.ON_LOGOUT_VSA}_SUCCESS`:
            return { ...state, logoutVsa: action };
        case `${types.ON_LOGOUT_VSA}_FAIL`:
            return { ...state, logoutVsa: action };
        
        case `${types.ON_SAVE_COORDS}_SUCCESS`:
            return { ...state, saveCoords: action };
        case `${types.ON_SAVE_COORDS}_FAIL`:
            return { ...state, saveCoords: action };
        default:
            return state;
    }
}
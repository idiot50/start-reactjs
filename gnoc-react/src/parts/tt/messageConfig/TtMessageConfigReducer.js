import initialState from '../../../stores/initialState';
import * as types from './TtMessageConfigTypes';

export default function ttMessageConfigReducers(state = initialState.ttMessageConfig, action) {
    switch (action.type) {
        case `${types.TT_MESSAGECONFIG_SEARCH}_SUCCESS`:
            return { ...state, dataTable: action };
        case `${types.TT_MESSAGECONFIG_SEARCH}_FAIL`:
            return { ...state, dataTable: action };
        case `${types.TT_MESSAGECONFIG_GET_DETAIL}_SUCCESS`:
            return { ...state, detail: action };
        case `${types.TT_MESSAGECONFIG_GET_DETAIL}_FAIL`:
            return { ...state, detail: action };
        case `${types.TT_MESSAGECONFIG_ADD}_SUCCESS`:
            return { ...state, add: action };
        case `${types.TT_MESSAGECONFIG_ADD}_FAIL`:
            return { ...state, add: action };
        case `${types.TT_MESSAGECONFIG_EDIT}_SUCCESS`:
            return { ...state, edit: action };
        case `${types.TT_MESSAGECONFIG_EDIT}_FAIL`:
            return { ...state, edit: action };
        case `${types.TT_MESSAGECONFIG_DELETE}_SUCCESS`:
            return { ...state, delete: action };
        case `${types.TT_MESSAGECONFIG_DELETE}_FAIL`:
            return { ...state, delete: action };
        default:
            return state;
    }
}
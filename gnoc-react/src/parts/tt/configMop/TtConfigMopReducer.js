import initialState from '../../../stores/initialState';
import * as types from './TtConfigMopTypes';

export default function ttConfigMopReducers(state = initialState.ttConfigMop, action) {
    switch (action.type) {
        case `${types.TT_CONFIGMOP_SEARCH}_SUCCESS`:
            return { ...state, dataTable: action };
        case `${types.TT_CONFIGMOP_SEARCH}_FAIL`:
            return { ...state, dataTable: action };
        case `${types.TT_CONFIGMOP_GET_DETAIL}_SUCCESS`:
            return { ...state, detail: action };
        case `${types.TT_CONFIGMOP_GET_DETAIL}_FAIL`:
            return { ...state, detail: action };
        case `${types.TT_CONFIGMOP_ADD}_SUCCESS`:
            return { ...state, add: action };
        case `${types.TT_CONFIGMOP_ADD}_FAIL`:
            return { ...state, add: action };
        case `${types.TT_CONFIGMOP_EDIT}_SUCCESS`:
            return { ...state, edit: action };
        case `${types.TT_CONFIGMOP_EDIT}_FAIL`:
            return { ...state, edit: action };
        case `${types.TT_CONFIGMOP_DELETE}_SUCCESS`:
            return { ...state, delete: action };
        case `${types.TT_CONFIGMOP_DELETE}_FAIL`:
            return { ...state, delete: action };
        case `${types.TT_CONFIGMOP_GETGROUP}_SUCCESS`:
            return { ...state, mopGroup: action }
        case `${types.TT_CONFIGMOP_GETGROUP}_FAIL`:
            return { ...state, mopGroup: action }
        default:
            return state;
    }
}
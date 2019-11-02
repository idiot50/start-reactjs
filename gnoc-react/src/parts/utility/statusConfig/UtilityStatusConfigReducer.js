import initialState from '../../../stores/initialState';
import * as types from './UtilityStatusConfigTypes';

export default function utilityStatusConfigReducers(state = initialState.utilityStatusConfig, action) {
    switch (action.type) {
        case `${types.UTILITY_STATUSCONFIG_SEARCH}_SUCCESS`:
            return { ...state, dataTable: action };
        case `${types.UTILITY_STATUSCONFIG_SEARCH}_FAIL`:
            return { ...state, dataTable: action };
        case `${types.UTILITY_STATUSCONFIG_GET_DETAIL}_SUCCESS`:
            return { ...state, detail: action };
        case `${types.UTILITY_STATUSCONFIG_GET_DETAIL}_FAIL`:
            return { ...state, detail: action };
        case `${types.UTILITY_STATUSCONFIG_ADD}_SUCCESS`:
            return { ...state, add: action };
        case `${types.UTILITY_STATUSCONFIG_ADD}_FAIL`:
            return { ...state, add: action };
        case `${types.UTILITY_STATUSCONFIG_EDIT}_SUCCESS`:
            return { ...state, edit: action };
        case `${types.UTILITY_STATUSCONFIG_EDIT}_FAIL`:
            return { ...state, edit: action };
        case `${types.UTILITY_STATUSCONFIG_DELETE}_SUCCESS`:
            return { ...state, delete: action };
        case `${types.UTILITY_STATUSCONFIG_DELETE}_FAIL`:
            return { ...state, delete: action };
        case `${types.UTILITY_STATUSCONFIG_GET_STATE}_SUCCESS`:
            return { ...state, listState: action };
        case `${types.UTILITY_STATUSCONFIG_GET_STATE}_FAIL`:
            return { ...state, listState: action };
        case `${types.UTILITY_STATUSCONFIG_GET_PROCESS}_SUCCESS`:
            return { ...state, listProcess: action };
        case `${types.UTILITY_STATUSCONFIG_GET_PROCESS}_FAIL`:
            return { ...state, listProcess: action };
        default:
            return state;
    }
}
import initialState from '../../../stores/initialState';
import * as types from './UtilityCrCabUsersTypes';

export default function utilityCrCabUsersReducers(state = initialState.utilityCrCabUsers, action) {
    switch (action.type) {
        case `${types.UTILITY_CRCABUSERS_SEARCH}_SUCCESS`:
            return { ...state, dataTable: action };
        case `${types.UTILITY_CRCABUSERS_SEARCH}_FAIL`:
            return { ...state, dataTable: action };
        case `${types.UTILITY_CRCABUSERS_GET_DETAIL}_SUCCESS`:
            return { ...state, detail: action };
        case `${types.UTILITY_CRCABUSERS_GET_DETAIL}_FAIL`:
            return { ...state, detail: action };
        case `${types.UTILITY_CRCABUSERS_ADD}_SUCCESS`:
            return { ...state, add: action };
        case `${types.UTILITY_CRCABUSERS_ADD}_FAIL`:
            return { ...state, add: action };
        case `${types.UTILITY_CRCABUSERS_EDIT}_SUCCESS`:
            return { ...state, edit: action };
        case `${types.UTILITY_CRCABUSERS_EDIT}_FAIL`:
            return { ...state, edit: action };
        case `${types.UTILITY_CRCABUSERS_DELETE}_SUCCESS`:
            return { ...state, delete: action };
        case `${types.UTILITY_CRCABUSERS_DELETE}_FAIL`:
            return { ...state, delete: action };
        case `${types.UTILITY_CRCABUSERS_GET_ALL_USER}_SUCCESS`:
            return { ...state, users: action };
        case `${types.UTILITY_CRCABUSERS_GET_ALL_USER}_FAIL`:
            return { ...state, users: action };
        case `${types.UTILITY_CRCABUSERS_LIST_IMPACT}_SUCCESS`:
            return { ...state, listImpact: action };
        case `${types.UTILITY_CRCABUSERS_LIST_IMPACT}_FAIL`:
            return { ...state, listImpact: action };
        default:
            return state;
    }
}
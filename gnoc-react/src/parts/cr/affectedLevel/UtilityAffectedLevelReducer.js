import initialState from '../../../stores/initialState';
import * as types from './UtilityAffectedLevelTypes';

export default function utilityAffectedLevelReducers(state = initialState.utilityAffectedLevel, action) {
    switch (action.type) {
        case `${types.UTILITY_AFFECTEDLEVEL_SEARCH}_SUCCESS`:
            return { ...state, dataTable: action };
        case `${types.UTILITY_AFFECTEDLEVEL_SEARCH}_FAIL`:
            return { ...state, dataTable: action };
        case `${types.UTILITY_AFFECTEDLEVEL_GET_DETAIL}_SUCCESS`:
            return { ...state, detail: action };
        case `${types.UTILITY_AFFECTEDLEVEL_GET_DETAIL}_FAIL`:
            return { ...state, detail: action };
        case `${types.UTILITY_AFFECTEDLEVEL_ADD}_SUCCESS`:
            return { ...state, add: action };
        case `${types.UTILITY_AFFECTEDLEVEL_ADD}_FAIL`:
            return { ...state, add: action };
        case `${types.UTILITY_AFFECTEDLEVEL_EDIT}_SUCCESS`:
            return { ...state, edit: action };
        case `${types.UTILITY_AFFECTEDLEVEL_EDIT}_FAIL`:
            return { ...state, edit: action };
        case `${types.UTILITY_AFFECTEDLEVEL_DELETE}_SUCCESS`:
            return { ...state, delete: action };
        case `${types.UTILITY_AFFECTEDLEVEL_DELETE}_FAIL`:
            return { ...state, delete: action };
        case `${types.UTILITY_AFFECTEDLEVEL_EXPORT}_SUCCESS`:
            return { ...state, export: action };
        case `${types.UTILITY_AFFECTEDLEVEL_EXPORT}_FAIL`:
            return { ...state, export: action };
        default:
            return state;
    }
}
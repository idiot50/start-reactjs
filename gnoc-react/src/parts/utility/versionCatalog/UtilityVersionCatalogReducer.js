import initialState from '../../../stores/initialState';
import * as types from './UtilityVersionCatalogTypes';

export default function utilityVersionCatalogReducers(state = initialState.utilityVersionCatalog, action) {
    switch (action.type) {
        case `${types.UTILITY_VERSIONCATALOG_SEARCH}_SUCCESS`:
            return { ...state, dataTable: action };
        case `${types.UTILITY_VERSIONCATALOG_SEARCH}_FAIL`:
            return { ...state, dataTable: action };
        case `${types.UTILITY_VERSIONCATALOG_GET_DETAIL}_SUCCESS`:
            return { ...state, detail: action };
        case `${types.UTILITY_VERSIONCATALOG_GET_DETAIL}_FAIL`:
            return { ...state, detail: action };
        case `${types.UTILITY_VERSIONCATALOG_ADD}_SUCCESS`:
            return { ...state, add: action };
        case `${types.UTILITY_VERSIONCATALOG_ADD}_FAIL`:
            return { ...state, add: action };
        case `${types.UTILITY_VERSIONCATALOG_EDIT}_SUCCESS`:
            return { ...state, edit: action };
        case `${types.UTILITY_VERSIONCATALOG_EDIT}_FAIL`:
            return { ...state, edit: action };
        default:
            return state;
    }
}
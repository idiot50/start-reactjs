import initialState from '../../../stores/initialState';
import * as types from './KedbManagementTypes';

export default function kedbManagementReducers(state = initialState.kedbManagement, action) {
    switch (action.type) {
        case `${types.KEDB_MANAGEMENT_SEARCH}_SUCCESS`:
            return { ...state, dataTable: action };
        case `${types.KEDB_MANAGEMENT_SEARCH}_FAIL`:
            return { ...state, dataTable: action };
        case `${types.KEDB_MANAGEMENT_GET_DETAIL}_SUCCESS`:
            return { ...state, detail: action };
        case `${types.KEDB_MANAGEMENT_GET_DETAIL}_FAIL`:
            return { ...state, detail: action };
        case `${types.KEDB_MANAGEMENT_ADD}_SUCCESS`:
            return { ...state, add: action };
        case `${types.KEDB_MANAGEMENT_ADD}_FAIL`:
            return { ...state, add: action };
        case `${types.KEDB_MANAGEMENT_EDIT}_SUCCESS`:
            return { ...state, edit: action };
        case `${types.KEDB_MANAGEMENT_EDIT}_FAIL`:
            return { ...state, edit: action };
        case `${types.KEDB_MANAGEMENT_DELETE}_SUCCESS`:
            return { ...state, delete: action };
        case `${types.KEDB_MANAGEMENT_DELETE}_FAIL`:
            return { ...state, delete: action };
        case `${types.KEDB_GETLIST_DEVICEVERSION}_SUCCESS`:
            return { ...state, version: action }
        case `${types.KEDB_GETLIST_DEVICEVERSION}_FAIL`:
            return { ...state, version: action }
        case `${types.KEDB_GETLIST_SUBCATEGORY}_SUCCESS`:
            return { ...state, subcategory: action }
        case `${types.KEDB_GETLIST_SUBCATEGORY}_FAIL`:
            return { ...state, subcategory: action }
        case `${types.KEDB_GETLIST_HISTORY}_SUCCESS`:
            return { ...state, history: action }
        case `${types.KEDB_GETLIST_HISTORY}_FAIL`:
            return { ...state, history: action }
        case `${types.KEDB_UPDATE_FROM_PT}_SUCCESS`:
            return { ...state, history: action }
        case `${types.KEDB_UPDATE_FROM_PT}_FAIL`:
            return { ...state, history: action }
        case `${types.KEDB_DOWNLOAD_FILE}_SUCCESS`:
            return { ...state, files: action }
        case `${types.KEDB_DOWNLOAD_FILE}_FAIL`:
            return { ...state, files: action }
        default:
            return state;
    }
}
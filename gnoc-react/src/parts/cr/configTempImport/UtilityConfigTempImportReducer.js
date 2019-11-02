import initialState from '../../../stores/initialState';
import * as types from './UtilityConfigTempImportTypes';

export default function utilityConfigTempImportReducers(state = initialState.utilityConfigTempImport, action) {
    switch (action.type) {
        case `${types.UTILITY_CONFIGTEMPIMPORT_SEARCH}_SUCCESS`:
            return { ...state, dataTable: action };
        case `${types.UTILITY_CONFIGTEMPIMPORT_SEARCH}_FAIL`:
            return { ...state, dataTable: action };
        case `${types.UTILITY_CONFIGTEMPIMPORT_GET_DETAIL}_SUCCESS`:
            return { ...state, detail: action };
        case `${types.UTILITY_CONFIGTEMPIMPORT_GET_DETAIL}_FAIL`:
            return { ...state, detail: action };
        case `${types.UTILITY_CONFIGTEMPIMPORT_ADD}_SUCCESS`:
            return { ...state, add: action };
        case `${types.UTILITY_CONFIGTEMPIMPORT_ADD}_FAIL`:
            return { ...state, add: action };
        case `${types.UTILITY_CONFIGTEMPIMPORT_EDIT}_SUCCESS`:
            return { ...state, edit: action };
        case `${types.UTILITY_CONFIGTEMPIMPORT_EDIT}_FAIL`:
            return { ...state, edit: action };
        case `${types.UTILITY_CONFIGTEMPIMPORT_DELETE}_SUCCESS`:
            return { ...state, delete: action };
        case `${types.UTILITY_CONFIGTEMPIMPORT_DELETE}_FAIL`:
            return { ...state, delete: action };
        case `${types.UTILITY_CONFIGTEMPIMPORT_GETLIST_METHODPRAMETER}_SUCCESS`:
            return { ...state, methodList: action };
        case `${types.UTILITY_CONFIGTEMPIMPORT_GETLIST_METHODPRAMETER}_FAILs`:
            return { ...state, methodList: action };
        case `${types.UTILITY_CONFIGTEMPIMPORT_GETLIST_WEBSERVICEMETHOD}_SUCCESS`:
            return { ...state, webserviceMethod: action };
        case `${types.UTILITY_CONFIGTEMPIMPORT_GETLIST_WEBSERVICEMETHOD}_FAIL`:
            return { ...state, webserviceMethod: action };
        default:
            return state;
    }
}
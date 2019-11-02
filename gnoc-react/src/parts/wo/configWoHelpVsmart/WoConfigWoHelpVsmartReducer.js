import initialState from '../../../stores/initialState';
import * as types from './WoConfigWoHelpVsmartTypes';

export default function woConfigWoHelpVsmartReducers(state = initialState.woConfigWoHelpVsmart, action) {
    switch (action.type) {
        case `${types.WO_CONFIGWOHELPVSMART_SEARCH}_SUCCESS`:
            return { ...state, dataTable: action };
        case `${types.WO_CONFIGWOHELPVSMART_SEARCH}_FAIL`:
            return { ...state, dataTable: action };
        case `${types.WO_CONFIGWOHELPVSMART_GET_DETAIL}_SUCCESS`:
            return { ...state, detail: action };
        case `${types.WO_CONFIGWOHELPVSMART_GET_DETAIL}_FAIL`:
            return { ...state, detail: action };
        case `${types.WO_CONFIGWOHELPVSMART_ADD}_SUCCESS`:
            return { ...state, add: action };
        case `${types.WO_CONFIGWOHELPVSMART_ADD}_FAIL`:
            return { ...state, add: action };
        case `${types.WO_CONFIGWOHELPVSMART_EDIT}_SUCCESS`:
            return { ...state, edit: action };
        case `${types.WO_CONFIGWOHELPVSMART_EDIT}_FAIL`:
            return { ...state, edit: action };
        case `${types.WO_CONFIGWOHELPVSMART_DELETE}_SUCCESS`:
            return { ...state, delete: action };
        case `${types.WO_CONFIGWOHELPVSMART_DELETE}_FAIL`:
            return { ...state, delete: action };
        case `${types.WO_CONFIGWOHELPVSMART_GETLIST_SYSTEM}_SUCCESS`:
            return { ...state, listSystem: action };
        case `${types.WO_CONFIGWOHELPVSMART_GETLIST_SYSTEM}_FAIL`:
            return { ...state, listSystem: action };
        case `${types.WO_CONFIGWOHELPVSMART_GETLIST_VSMART}_SUCCESS`:
            return { ...state, listVsmart: action };
        case `${types.WO_CONFIGWOHELPVSMART_GETLIST_VSMART}_FAIL`:
            return { ...state, listVsmart: action };
        case `${types.ON_DOWNLOAD_FILE_TEMPLATE}_SUCCESS`:
            return { ...state, downloadTemplate: action };
        case `${types.ON_DOWNLOAD_FILE_TEMPLATE}_FAIL`:
            return { ...state, downloadTemplate: action };
        case `${types.ON_DOWNLOAD_FILE_ATTACH}_SUCCESS`:
            return { ...state, downloadAttach: action };
        case `${types.ON_DOWNLOAD_FILE_ATTACH}_FAIL`:
            return { ...state, downloadAttach: action };
        default:
            return state;
    }
}
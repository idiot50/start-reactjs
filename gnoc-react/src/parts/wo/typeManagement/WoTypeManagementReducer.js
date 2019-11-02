import initialState from '../../../stores/initialState';
import * as types from './WoTypeManagementTypes';

export default function woTypeManagementReducers(state = initialState.woTypeManagement, action) {
    switch (action.type) {
        case `${types.WO_TYPEMANAGEMENT_SEARCH}_SUCCESS`:
            return { ...state, dataTable: action };
        case `${types.WO_TYPEMANAGEMENT_SEARCH}_FAIL`:
            return { ...state, dataTable: action };
        case `${types.WO_TYPEMANAGEMENT_GET_DETAIL}_SUCCESS`:
            return { ...state, detail: action };
        case `${types.WO_TYPEMANAGEMENT_GET_DETAIL}_FAIL`:
            return { ...state, detail: action };
        case `${types.WO_TYPEMANAGEMENT_ADD}_SUCCESS`:
            return { ...state, add: action };
        case `${types.WO_TYPEMANAGEMENT_ADD}_FAIL`:
            return { ...state, add: action };
        case `${types.WO_TYPEMANAGEMENT_EDIT}_SUCCESS`:
            return { ...state, edit: action };
        case `${types.WO_TYPEMANAGEMENT_EDIT}_FAIL`:
            return { ...state, edit: action };
        case `${types.WO_TYPEMANAGEMENT_DELETE}_SUCCESS`:
            return { ...state, delete: action };
        case `${types.WO_TYPEMANAGEMENT_DELETE}_FAIL`:
            return { ...state, delete: action };
        case `${types.WO_TYPEMANAGEMENT_GET_LIST_WO_GROUP_TYPE}_SUCCESS`:
            return { ...state, getListWoGroupType: action };
        case `${types.WO_TYPEMANAGEMENT_GET_LIST_WO_GROUP_TYPE}_FAIL`:
            return { ...state, getListWoGroupType: action };
        case `${types.WO_TYPEMANAGEMENT_GET_LIST_REQUIRED_INFO}_SUCCESS`:
            return { ...state, getListInfo: action };
        case `${types.WO_TYPEMANAGEMENT_GET_LIST_REQUIRED_INFO}_FAIL`:
            return { ...state, getListInfo: action };
        case `${types.WO_TYPEMANAGEMENT_GET_LIST_REQUIRED_CONFIG}_SUCCESS`:
            return { ...state, getListRequire: action };
        case `${types.WO_TYPEMANAGEMENT_GET_LIST_REQUIRED_CONFIG}_FAIL`:
            return { ...state, getListRequire: action };
        case `${types.WO_TYPEMANAGEMENT_GET_LIST_PRIORITY_BYID}_SUCCESS`:
            return { ...state, getListPriority: action };
        case `${types.WO_TYPEMANAGEMENT_GET_LIST_PRIORITY_BYID}_FAIL`:
            return { ...state, getListPriority: action };
        case `${types.WO_TYPEMANAGEMENT_EDIT_LIST_PRIORITY}_SUCCESS`:
            return { ...state, editListPriority: action };
        case `${types.WO_TYPEMANAGEMENT_EDIT_LIST_PRIORITY}_FAIL`:
            return { ...state, editListPriority: action };
        case `${types.WO_TYPEMANAGEMENT_DOWNLOAD_FILE_CREATE}_SUCCESS`:
            return { ...state, downloadFileCreate: action };
        case `${types.WO_TYPEMANAGEMENT_DOWNLOAD_FILE_CREATE}_FAIL`:
            return { ...state, downloadFileCreate: action };
        case `${types.WO_TYPEMANAGEMENT_DELETE_PRIORITY}_SUCCESS`:
            return { ...state, deletePriority: action };
        case `${types.WO_TYPEMANAGEMENT_DELETE_PRIORITY}_FAIL`:
            return { ...state, deletePriority: action };
        case `${types.WO_TYPEMANAGEMENT_GET_LIST_WO_CHECKLIST}_SUCCESS`:
            return { ...state, getListWoChecklist: action };
        case `${types.WO_TYPEMANAGEMENT_GET_LIST_WO_CHECKLIST}_FAIL`:
            return { ...state, getListWoChecklist: action };
        case `${types.WO_TYPEMANAGEMENT_UPDATE_WO_CHECKLIST}_SUCCESS`:
            return { ...state, updateWoChecklist: action };
        case `${types.WO_TYPEMANAGEMENT_UPDATE_WO_CHECKLIST}_FAIL`:
            return { ...state, updateWoChecklist: action };
        case `${types.WO_TYPEMANAGEMENT_DOWNLOAD_FILE_GUIDE}_SUCCESS`:
            return { ...state, downloadFilesGuide: action };
        case `${types.WO_TYPEMANAGEMENT_DOWNLOAD_FILE_GUIDE}_FAIL`:
            return { ...state, downloadFilesGuide: action };
        case `${types.WO_TYPEMANAGEMENT_GET_LIST_WO_TYPE_TIME}_SUCCESS`:
            return { ...state, getListWoTypeTime: action };
        case `${types.WO_TYPEMANAGEMENT_GET_LIST_WO_TYPE_TIME}_FAIL`:
            return { ...state, getListWoTypeTime: action };
        default:
            return state;
    }
}
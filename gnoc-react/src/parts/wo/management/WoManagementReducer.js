import initialState from '../../../stores/initialState';
import * as types from './WoManagementTypes';

export default function woManagementReducers(state = initialState.woManagement, action) {
    switch (action.type) {
        case `${types.WO_MANAGEMENT_SEARCH}_SUCCESS`:
            return { ...state, dataTable: action };
        case `${types.WO_MANAGEMENT_SEARCH}_FAIL`:
            return { ...state, dataTable: action };
        case `${types.WO_MANAGEMENT_GET_DETAIL}_SUCCESS`:
            return { ...state, detail: action };
        case `${types.WO_MANAGEMENT_GET_DETAIL}_FAIL`:
            return { ...state, detail: action };
        case `${types.WO_MANAGEMENT_ADD}_SUCCESS`:
            return { ...state, add: action };
        case `${types.WO_MANAGEMENT_ADD}_FAIL`:
            return { ...state, add: action };
        case `${types.WO_MANAGEMENT_EDIT}_SUCCESS`:
            return { ...state, edit: action };
        case `${types.WO_MANAGEMENT_EDIT}_FAIL`:
            return { ...state, edit: action };
        case `${types.WO_MANAGEMENT_DELETE}_SUCCESS`:
            return { ...state, delete: action };
        case `${types.WO_MANAGEMENT_DELETE}_FAIL`:
            return { ...state, delete: action };
        case `${types.WO_MANAGEMENT_VIEW_CALL}_SUCCESS`:
            return { ...state, viewCall: action };
        case `${types.WO_MANAGEMENT_VIEW_CALL}_FAIL`:
            return { ...state, viewCall: action };
        case `${types.WO_MANAGEMENT_CALL_IPCC}_SUCCESS`:
            return { ...state, callIpcc: action };
        case `${types.WO_MANAGEMENT_CALL_IPCC}_FAIL`:
            return { ...state, callIpcc: action };
        case `${types.WO_MANAGEMENT_GET_PRIORITY_BY_WO_TYPE_ID}_SUCCESS`:
            return { ...state, getPriorityByWoType: action };
        case `${types.WO_MANAGEMENT_GET_PRIORITY_BY_WO_TYPE_ID}_FAIL`:
            return { ...state, getPriorityByWoType: action };
        case `${types.WO_MANAGEMENT_GET_LIST_WO_SYSTEM}_SUCCESS`:
            return { ...state, getListWoSystem: action };
        case `${types.WO_MANAGEMENT_GET_LIST_WO_SYSTEM}_FAIL`:
            return { ...state, getListWoSystem: action };
        case `${types.WO_MANAGEMENT_GET_LIST_FILE_FROM_WO}_SUCCESS`:
            return { ...state, getListFileFromWo: action };
        case `${types.WO_MANAGEMENT_GET_LIST_FILE_FROM_WO}_FAIL`:
            return { ...state, getListFileFromWo: action };
        case `${types.WO_MANAGEMENT_GET_LIST_STATION}_SUCCESS`:
            return { ...state, getListStation: action };
        case `${types.WO_MANAGEMENT_GET_LIST_STATION}_FAIL`:
            return { ...state, getListStation: action };
        case `${types.WO_MANAGEMENT_GET_LIST_STATION}_SUCCESS`:
            return { ...state, getListStation: action };
        case `${types.WO_MANAGEMENT_GET_LIST_STATION}_FAIL`:
            return { ...state, getListStation: action };
        case `${types.WO_MANAGEMENT_GET_LIST_KTTS_ACTION}_SUCCESS`:
            return { ...state, getListKTTSAction: action };
        case `${types.WO_MANAGEMENT_GET_LIST_KTTS_ACTION}_FAIL`:
            return { ...state, getListKTTSAction: action };
        case `${types.WO_MANAGEMENT_GET_LIST_CONSTRACT}_SUCCESS`:
            return { ...state, getListConstract: action };
        case `${types.WO_MANAGEMENT_GET_LIST_CONSTRACT}_FAIL`:
            return { ...state, getListConstract: action };
        case `${types.WO_MANAGEMENT_GET_LIST_CONSTRUCTION}_SUCCESS`:
            return { ...state, getListConstruction: action };
        case `${types.WO_MANAGEMENT_GET_LIST_CONSTRUCTION}_FAIL`:
            return { ...state, getListConstruction: action };
        case `${types.WO_MANAGEMENT_GET_LIST_HISTORY}_SUCCESS`:
            return { ...state, getListHistory: action };
        case `${types.WO_MANAGEMENT_GET_LIST_HISTORY}_FAIL`:
            return { ...state, getListHistory: action };
        case `${types.WO_MANAGEMENT_GET_LIST_CD_BY_GROUP}_SUCCESS`:
            return { ...state, getListCdByGroup: action };
        case `${types.WO_MANAGEMENT_GET_LIST_CD_BY_GROUP}_FAIL`:
            return { ...state, getListCdByGroup: action };
        case `${types.WO_MANAGEMENT_GET_LIST_WORKLOG}_SUCCESS`:
            return { ...state, getListWorklog: action };
        case `${types.WO_MANAGEMENT_GET_LIST_WORKLOG}_FAIL`:
            return { ...state, getListWorklog: action };
        case `${types.WO_MANAGEMENT_INSERT_WORKLOG}_SUCCESS`:
            return { ...state, insertWorklog: action };
        case `${types.WO_MANAGEMENT_INSERT_WORKLOG}_FAIL`:
            return { ...state, insertWorklog: action };
        case `${types.WO_MANAGEMENT_GET_LIST_CR}_SUCCESS`:
            return { ...state, getListCr: action };
        case `${types.WO_MANAGEMENT_GET_LIST_CR}_FAIL`:
            return { ...state, getListCr: action };
        case `${types.WO_MANAGEMENT_UPDATE_FILE}_SUCCESS`:
            return { ...state, updateFile: action };
        case `${types.WO_MANAGEMENT_UPDATE_FILE}_FAIL`:
            return { ...state, updateFile: action };
        case `${types.WO_MANAGEMENT_DISPATCH}_SUCCESS`:
            return { ...state, dispatchWo: action };
        case `${types.WO_MANAGEMENT_DISPATCH}_FAIL`:
            return { ...state, dispatchWo: action };
        case `${types.WO_MANAGEMENT_ACCEPT}_SUCCESS`:
            return { ...state, acceptWo: action };
        case `${types.WO_MANAGEMENT_ACCEPT}_FAIL`:
            return { ...state, acceptWo: action };
        case `${types.WO_MANAGEMENT_REJECT}_SUCCESS`:
            return { ...state, rejectWo: action };
        case `${types.WO_MANAGEMENT_REJECT}_FAIL`:
            return { ...state, rejectWo: action };
        case `${types.WO_MANAGEMENT_AUDIT}_SUCCESS`:
            return { ...state, auditWo: action };
        case `${types.WO_MANAGEMENT_AUDIT}_FAIL`:
            return { ...state, auditWo: action };
        case `${types.WO_MANAGEMENT_PENDING}_SUCCESS`:
            return { ...state, pendingWo: action };
        case `${types.WO_MANAGEMENT_PENDING}_FAIL`:
            return { ...state, pendingWo: action };
        case `${types.WO_MANAGEMENT_EXPORT_FILE_WO}_SUCCESS`:
            return { ...state, exportFileWo: action };
        case `${types.WO_MANAGEMENT_EXPORT_FILE_WO}_FAIL`:
            return { ...state, exportFileWo: action };
        case `${types.WO_MANAGEMENT_EXPORT_FILE_CR}_SUCCESS`:
            return { ...state, exportFileCr: action };
        case `${types.WO_MANAGEMENT_EXPORT_FILE_CR}_FAIL`:
            return { ...state, exportFileCr: action };
        case `${types.WO_MANAGEMENT_COMPLETE_WO_SPM}_SUCCESS`:
            return { ...state, completeWoSpm: action };
        case `${types.WO_MANAGEMENT_COMPLETE_WO_SPM}_FAIL`:
            return { ...state, completeWoSpm: action };
        case `${types.WO_MANAGEMENT_UPDATE_PENDING_WO}_SUCCESS`:
            return { ...state, updatePendingWo: action };
        case `${types.WO_MANAGEMENT_UPDATE_PENDING_WO}_FAIL`:
            return { ...state, updatePendingWo: action };
        case `${types.WO_MANAGEMENT_UPDATE_STATUS_WO}_SUCCESS`:
            return { ...state, updateStatusWo: action };
        case `${types.WO_MANAGEMENT_UPDATE_STATUS_WO}_FAIL`:
            return { ...state, updateStatusWo: action };
        case `${types.WO_MANAGEMENT_SPLIT_WO}_SUCCESS`:
            return { ...state, splitWo: action };
        case `${types.WO_MANAGEMENT_SPLIT_WO}_FAIL`:
            return { ...state, splitWo: action };
        case `${types.WO_MANAGEMENT_APPROVE_WO}_SUCCESS`:
            return { ...state, approveWo: action };
        case `${types.WO_MANAGEMENT_APPROVE_WO}_FAIL`:
            return { ...state, approveWo: action };
        case `${types.ON_DOWNLOAD_FILE_WO}_SUCCESS`:
            return { ...state, downloadFileWo: action };
        case `${types.ON_DOWNLOAD_FILE_WO}_FAIL`:
            return { ...state, downloadFileWo: action };
        case `${types.WO_MANAGEMENT_FIND_COMP_CAUSE_BY_ID}_SUCCESS`:
            return { ...state, findCompCauseById: action };
        case `${types.WO_MANAGEMENT_FIND_COMP_CAUSE_BY_ID}_FAIL`:
            return { ...state, findCompCauseById: action };
        case `${types.WO_MANAGEMENT_GET_LIST_WO_DETAIL}_SUCCESS`:
            return { ...state, getListWoDetail: action };
        case `${types.WO_MANAGEMENT_GET_LIST_WO_DETAIL}_FAIL`:
            return { ...state, getListWoDetail: action };
        case `${types.WO_MANAGEMENT_GET_LIST_WO_CHILD}_SUCCESS`:
            return { ...state, getListWoChild: action };
        case `${types.WO_MANAGEMENT_GET_LIST_WO_CHILD}_FAIL`:
            return { ...state, getListWoChild: action };
        case `${types.WO_MANAGEMENT_GET_LIST_WO_TYPE}_SUCCESS`:
            return { ...state, getListWoTypeDTO: action };
        case `${types.WO_MANAGEMENT_GET_LIST_WO_TYPE}_FAIL`:
            return { ...state, getListWoTypeDTO: action };
        default:
            return state;
    }
}
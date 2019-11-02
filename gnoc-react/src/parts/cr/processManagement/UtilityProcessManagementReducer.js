import initialState from '../../../stores/initialState';
import * as types from './UtilityProcessManagementTypes';

export default function utilityProcessManagementReducers(state = initialState.utilityProcessManagement, action) {
    switch (action.type) {
        case `${types.UTILITY_PROCESSMANAGEMENT_SEARCH}_SUCCESS`:
            return { ...state, dataTable: action };
        case `${types.UTILITY_PROCESSMANAGEMENT_SEARCH}_FAIL`:
            return { ...state, dataTable: action };
        case `${types.UTILITY_PROCESSMANAGEMENT_GET_DETAIL}_SUCCESS`:
            return { ...state, detail: action };
        case `${types.UTILITY_PROCESSMANAGEMENT_GET_DETAIL}_FAIL`:
            return { ...state, detail: action };
        case `${types.UTILITY_PROCESSMANAGEMENT_GET_DETAIL_BY_ID}_SUCCESS`:
            return { ...state, detailById: action };
        case `${types.UTILITY_PROCESSMANAGEMENT_GET_DETAIL_BY_ID}_FAIL`:
            return { ...state, detailById: action };
        case `${types.UTILITY_PROCESSMANAGEMENT_GET_DETAIL_WO}_SUCCESS`:
            return { ...state, detailWo: action };
        case `${types.UTILITY_PROCESSMANAGEMENT_GET_DETAIL_WO}_FAIL`:
            return { ...state, detailWo: action };
        case `${types.UTILITY_PROCESSMANAGEMENT_ADD}_SUCCESS`:
            return { ...state, add: action };
        case `${types.UTILITY_PROCESSMANAGEMENT_ADD}_FAIL`:
            return { ...state, add: action };
        case `${types.UTILITY_PROCESSMANAGEMENT_EDIT}_SUCCESS`:
            return { ...state, edit: action };
        case `${types.UTILITY_PROCESSMANAGEMENT_EDIT}_FAIL`:
            return { ...state, edit: action };
        case `${types.UTILITY_PROCESSMANAGEMENT_DELETE}_SUCCESS`:
            return { ...state, delete: action };
        case `${types.UTILITY_PROCESSMANAGEMENT_DELETE}_FAIL`:
            return { ...state, delete: action };
        case `${types.UTILITY_PROCESSMANAGEMENT_GET_LIST_FILE}_SUCCESS`:
            return { ...state, listFile: action };
        case `${types.UTILITY_PROCESSMANAGEMENT_GET_LIST_FILE}_FAIL`:
            return { ...state, listFile: action };
        case `${types.UTILITY_PROCESSMANAGEMENT_GET_LIST_UNIT}_SUCCESS`:
            return { ...state, listUnit: action };
        case `${types.UTILITY_PROCESSMANAGEMENT_GET_LIST_UNIT}_FAIL`:
            return { ...state, listUnit: action };
        case `${types.UTILITY_PROCESSMANAGEMENT_GET_LIST_WO}_SUCCESS`:
            return { ...state, listWo: action };
        case `${types.UTILITY_PROCESSMANAGEMENT_GET_LIST_WO}_FAIL`:
            return { ...state, listWo: action };
        case `${types.UTILITY_PROCESSMANAGEMENT_GET_LIST_WO_TYPE}_SUCCESS`:
            return { ...state, listWoType: action };
        case `${types.UTILITY_PROCESSMANAGEMENT_GET_LIST_WO_TYPE}_FAIL`:
            return { ...state, listWoType: action };
        case `${types.UTILITY_PROCESSMANAGEMENT_GET_LIST_ITEM}_SUCCESS`:
            return { ...state, listItem: action };
        case `${types.UTILITY_PROCESSMANAGEMENT_GET_LIST_ITEM}_FAIL`:
            return { ...state, listItem: action };
        case `${types.UTILITY_PROCESSMANAGEMENT_GENERATE_PROCESS_CODE}_SUCCESS`:
            return { ...state, processCode: action };
        case `${types.UTILITY_PROCESSMANAGEMENT_GENERATE_PROCESS_CODE}_FAIL`:
            return { ...state, processCode: action };
        default:
            return state;
    }
}
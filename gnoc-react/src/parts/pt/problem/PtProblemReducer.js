import initialState from '../../../stores/initialState';
import * as types from './PtProblemTypes';

export default function ptProblemReducers(state = initialState.ptProblem, action) {
    switch (action.type) {
        case `${types.PT_PROBLEM_SEARCH}_SUCCESS`:
            return { ...state, dataTable: action };
        case `${types.PT_PROBLEM_SEARCH}_FAIL`:
            return { ...state, dataTable: action };
        case `${types.PT_PROBLEM_GET_DETAIL}_SUCCESS`:
            return { ...state, detail: action };
        case `${types.PT_PROBLEM_GET_DETAIL}_FAIL`:
            return { ...state, detail: action };
        case `${types.PT_PROBLEM_ADD}_SUCCESS`:
            return { ...state, add: action };
        case `${types.PT_PROBLEM_ADD}_FAIL`:
            return { ...state, add: action };
        case `${types.PT_PROBLEM_EDIT}_SUCCESS`:
            return { ...state, edit: action };
        case `${types.PT_PROBLEM_EDIT}_FAIL`:
            return { ...state, edit: action };
        case `${types.PT_PROBLEM_NODE_SEARCH}_SUCCESS`:
            return { ...state, nodeDatatable: action }
        case `${types.PT_PROBLEM_NODE_SEARCH}_FAIL`:
            return { ...state, nodeDatatable: action }
        case `${types.PT_PROBLEM_NODE_GET_LIST}_SUCCESS`:
            return { ...state, nodeCode: action }
        case `${types.PT_PROBLEM_NODE_GET_LIST}_FAIL`:
            return { ...state, nodeCode: action }
        case `${types.PT_PROBLEM_SEARCH_DUPLICATE}_SUCCESS`:
            return { ...state, duplicate: action }
        case `${types.PT_PROBLEM_SEARCH_DUPLICATE}_FAIL`:
            return { ...state, duplicate: action }
        case `${types.PT_PROBLEM_CR_SEARCH}_SUCCESS`:
            return { ...state, crDatatable: action }
        case `${types.PT_PROBLEM_CR_SEARCH}_FAIL`:
            return { ...state, crDatatable: action }
        case `${types.PT_PROBLEM_WO_SEARCH}_SUCCESS`:
            return { ...state, woDatatable: action }
        case `${types.PT_PROBLEM_WO_SEARCH}_FAIL`:
            return { ...state, woDatatable: action }
        case `${types.PT_PROBLEM_ACTION_LOGS_SEARCH}_SUCCESS`:
            return { ...state, actionLogDatatable: action }
        case `${types.PT_PROBLEM_ACTION_LOGS_SEARCH}_FAIL`:
            return { ...state, actionLogDatatable: action }
        case `${types.PT_PROBLEM_TT_GET_LIST}_SUCCESS`:
            return { ...state, tt: action }
        case `${types.PT_PROBLEM_TT_GET_LIST}_FAIL`:
            return { ...state, tt: action }
        case `${types.ON_GET_TRANSITION_STATUS}_SUCCESS`:
            return { ...state, status: action }
        case `${types.ON_GET_TRANSITION_STATUS}_FAIL`:
            return { ...state, status: action }
        case `${types.ON_GET_DEVICE_TYPE_VERSION}_SUCCESS`:
            return { ...state, deviceTypeVersion: action }
        case `${types.ON_GET_DEVICE_TYPE_VERSION}_FAIL`:
            return { ...state, deviceTypeVersion: action }
        case `${types.ON_GET_LIST_PROBLEM_FILES}_SUCCESS`:
            return { ...state, files: action }
        case `${types.ON_GET_LIST_PROBLEM_FILES}_FAIL`:
            return { ...state, files: action }
        case `${types.ON_GET_LIST_KEDB}_SUCCESS`:
            return { ...state, kedbList: action }
        case `${types.ON_GET_LIST_KEDB}_FAIL`:
            return { ...state, kedbList: action }
        case `${types.PT_PROBLEM_ADD_PROBLEM_FILES}_SUCCESS`:
            return { ...state, addProblemFiles: action }
        case `${types.PT_PROBLEM_ADD_PROBLEM_FILES}_FAIL`:
            return { ...state, addProblemFiles: action }
        case `${types.ON_DELETE_PROBLEM_FILES}_SUCCESS`:
            return { ...state, deleteProblemFiles: action }
        case `${types.ON_DELETE_PROBLEM_FILES}_FAIL`:
            return { ...state, deleteProblemFiles: action }
        case `${types.ON_GET_CHAT_LIST_USERS}_SUCCESS`:
            return { ...state, chatListUser: action }
        case `${types.ON_GET_CHAT_LIST_USERS}_FAIL`:
            return { ...state, chatListUser: action }
        case `${types.ON_GET_LIST_USERS}_SUCCESS`:
            return { ...state, listUser: action }
        case `${types.ON_GET_LIST_USERS}_FAIL`:
            return { ...state, listUser: action }
        case `${types.ON_GET_LIST_USERS_SUPPORT}_SUCCESS`:
            return { ...state, listUserSupport: action }
        case `${types.ON_GET_LIST_USERS_SUPPORT}_FAIL`:
            return { ...state, listUserSupport: action }
        case `${types.ON_SEND_CHAT_LIST_USERS}_SUCCESS`:
            return { ...state, sendChatListUser: action }
        case `${types.ON_SEND_CHAT_LIST_USERS}_FAIL`:
            return { ...state, sendChatListUser: action }
        case `${types.ON_INSERT_PROBLEM_WORKLOG}_SUCCESS`:
            return { ...state, sendChatListUser: action }
        case `${types.ON_INSERT_PROBLEM_WORKLOG}_FAIL`:
            return { ...state, sendChatListUser: action }
        case `${types.PT_PROBLEM_GET_LIST_PT_RELATED}_SUCCESS`:
            return { ...state, ptRelated: action }
        case `${types.PT_PROBLEM_GET_LIST_PT_RELATED}_FAIL`:
            return { ...state, ptRelated: action }
        case `${types.PT_PROBLEM_GET_LIST_TT_RELATED}_SUCCESS`:
            return { ...state, ptRelated: action }
        case `${types.PT_PROBLEM_GET_LIST_TT_RELATED}_FAIL`:
            return { ...state, ptRelated: action }
        case `${types.ON_DOWNLOAD_PROBLEM_FILES}_SUCCESS`:
            return { ...state, downloadFile: action }
        case `${types.ON_DOWNLOAD_PROBLEM_FILES}_FAIL`:
            return { ...state, downloadFile: action }
        case `${types.PT_PROBLEM_GET_LIST_ROLE_PM}_SUCCESS`:
            return { ...state, role: action }
        case `${types.PT_PROBLEM_GET_LIST_ROLE_PM}_FAIL`:
            return { ...state, role: action }
        default:
            return state;
    }
}
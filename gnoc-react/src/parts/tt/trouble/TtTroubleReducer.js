import initialState from '../../../stores/initialState';
import * as types from './TtTroubleTypes';

export default function ttTroubleReducers(state = initialState.ttTrouble, action) {
    switch (action.type) {
        case `${types.TT_TROUBLE_SEARCH}_SUCCESS`:
            return { ...state, dataTable: action };
        case `${types.TT_TROUBLE_SEARCH}_FAIL`:
            return { ...state, dataTable: action };
        case `${types.TT_TROUBLE_GET_DETAIL}_SUCCESS`:
            return { ...state, detail: action };
        case `${types.TT_TROUBLE_GET_DETAIL}_FAIL`:
            return { ...state, detail: action };
        case `${types.TT_TROUBLE_ADD}_SUCCESS`:
            return { ...state, add: action };
        case `${types.TT_TROUBLE_ADD}_FAIL`:
            return { ...state, add: action };
        case `${types.TT_TROUBLE_EDIT}_SUCCESS`:
            return { ...state, edit: action };
        case `${types.TT_TROUBLE_EDIT}_FAIL`:
            return { ...state, edit: action };
        case `${types.TT_TROUBLE_DELETE}_SUCCESS`:
            return { ...state, delete: action };
        case `${types.TT_TROUBLE_DELETE}_FAIL`:
            return { ...state, delete: action };
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
        case `${types.TT_TROUBLE_GET_WORKLOG}_SUCCESS`:
            return { ...state, worklog: action };
        case `${types.TT_TROUBLE_GET_WORKLOG}_FAIL`:
            return { ...state, worklog: action };
        case `${types.TT_TROUBLE_GET_FILE_ATTACH}_SUCCESS`:
            return { ...state, fileAttach: action };
        case `${types.TT_TROUBLE_GET_FILE_ATTACH}_FAIL`:
            return { ...state, fileAttach: action };
        case `${types.TT_TROUBLE_ADD_WORKLOG}_SUCCESS`:
            return { ...state, addWorklog: action };
        case `${types.TT_TROUBLE_ADD_WORKLOG}_FAIL`:
            return { ...state, addWorklog: action };
        case `${types.TT_TROUBLE_COUNT_BY_STATE}_SUCCESS`:
            return { ...state, count: action };
        case `${types.TT_TROUBLE_COUNT_BY_STATE}_FAIL`:
            return { ...state, count: action };
        case `${types.TT_TROUBLE_GET_CONFIG_PROPERTY}_SUCCESS`:
            return { ...state, configProperty: action };
        case `${types.TT_TROUBLE_GET_CONFIG_PROPERTY}_FAIL`:
            return { ...state, configProperty: action };
        case `${types.TT_TROUBLE_GET_NETWORK_LEVEL}_SUCCESS`:
            return { ...state, networkLevel: action };
        case `${types.TT_TROUBLE_GET_NETWORK_LEVEL}_FAIL`:
            return { ...state, networkLevel: action };
        case `${types.TT_TROUBLE_VIEW_CALL}_SUCCESS`:
            return { ...state, viewCall: action };
        case `${types.TT_TROUBLE_VIEW_CALL}_FAIL`:
            return { ...state, viewCall: action };
        case `${types.TT_TROUBLE_GET_REASON_BCCS}_SUCCESS`:
            return { ...state, reasonBccs: action };
        case `${types.TT_TROUBLE_GET_REASON_BCCS}_FAIL`:
            return { ...state, reasonBccs: action };
        case `${types.TT_TROUBLE_GET_REASON_OVERDUE}_SUCCESS`:
            return { ...state, reasonOverdue: action };
        case `${types.TT_TROUBLE_GET_REASON_OVERDUE}_FAIL`:
            return { ...state, reasonOverdue: action };
        case `${types.TT_TROUBLE_GET_TRANS_NW_TYPE}_SUCCESS`:
            return { ...state, lstNWTypes: action };
        case `${types.TT_TROUBLE_GET_TRANS_NW_TYPE}_FAIL`:
            return { ...state, lstNWTypes: action };
        case `${types.TT_TROUBLE_SEARCH_INFRA_CABLE_LANE}_SUCCESS`:
            return { ...state, cableLane: action };
        case `${types.TT_TROUBLE_SEARCH_INFRA_CABLE_LANE}_FAIL`:
            return { ...state, cableLane: action };
        case `${types.TT_TROUBLE_SEARCH_INFRA_SLEEVES}_SUCCESS`:
            return { ...state, infraSleeves: action };
        case `${types.TT_TROUBLE_SEARCH_INFRA_SLEEVES}_FAIL`:
            return { ...state, infraSleeves: action };
        case `${types.TT_TROUBLE_GET_LIST_NW_LEVEL}_SUCCESS`:
            return { ...state, networkLevel: action };
        case `${types.TT_TROUBLE_GET_LIST_NW_LEVEL}_FAIL`:
            return { ...state, networkLevel: action };
        case `${types.TT_TROUBLE_GET_LIST_CAT_REASON_TYPE}_SUCCESS`:
            return { ...state, reasonType: action };
        case `${types.TT_TROUBLE_GET_LIST_CAT_REASON_TYPE}_FAIL`:
            return { ...state, reasonType: action };
        case `${types.TT_TROUBLE_SEARCH_CR}_SUCCESS`:
            return { ...state, CRDatatable: action };
        case `${types.TT_TROUBLE_SEARCH_CR}_FAIL`:
            return { ...state, CRDatatable: action };
        case `${types.TT_TROUBLE_SEARCH_WO}_SUCCESS`:
            return { ...state, WODatatable: action };
        case `${types.TT_TROUBLE_SEARCH_WO}_FAIL`:
            return { ...state, WODatatable: action };
        case `${types.TT_TROUBLE_GET_LIST_MOP}_SUCCESS`:
            return { ...state, mopList: action };
        case `${types.TT_TROUBLE_GET_LIST_MOP}_FAIL`:
            return { ...state, mopList: action };
        case `${types.TT_TROUBLE_GET_BRCD}_SUCCESS`:
            return { ...state, brcd: action };
        case `${types.TT_TROUBLE_GET_BRCD}_FAIL`:
            return { ...state, brcd: action };
        case `${types.TT_TROUBLE_SEARCH_CR_RELATED}_SUCCESS`:
            return { ...state, crRelated: action };
        case `${types.TT_TROUBLE_SEARCH_CR_RELATED}_FAIL`:
            return { ...state, crRelated: action };
        case `${types.TT_TROUBLE_UPDATE_BRCD}_SUCCESS`:
            return { ...state, updateBrcd: action };
        case `${types.TT_TROUBLE_UPDATE_BRCD}_FAIL`:
            return { ...state, updateBrcd: action };
        case `${types.TT_TROUBLE_GET_PRIORITY_BY_PROPS}_SUCCESS`:
            return { ...state, priority: action };
        case `${types.TT_TROUBLE_GET_PRIORITY_BY_PROPS}_FAIL`:
            return { ...state, priority: action };
        case `${types.TT_TROUBLE_GET_LINK_INFO}_SUCCESS`:
            return { ...state, linkInfo: action };
        case `${types.TT_TROUBLE_GET_LINK_INFO}_FAIL`:
            return { ...state, linkInfo: action };
        case `${types.TT_TROUBLE_GET_PRODUCT_LIST}_SUCCESS`:
            return { ...state, product: action };
        case `${types.TT_TROUBLE_GET_PRODUCT_LIST}_FAIL`:
            return { ...state, product: action };
        case `${types.TT_TROUBLE_GET_UNIT_LIST}_SUCCESS`:
            return { ...state, unit: action };
        case `${types.TT_TROUBLE_GET_UNIT_LIST}_FAIL`:
            return { ...state, unit: action };
        case `${types.TT_TROUBLE_ADD_INVOLE_IBM}_SUCCESS`:
            return { ...state, message: action };
        case `${types.TT_TROUBLE_ADD_INVOLE_IBM}_FAIL`:
            return { ...state, message: action };
        case `${types.TT_TROUBLE_GET_IBM_LIST}_SUCCESS`:
            return { ...state, ibmList: action };
        case `${types.TT_TROUBLE_GET_IBM_LIST}_FAIL`:
            return { ...state, ibmList: action };
        case `${types.TT_TROUBLE_GET_LIST_INFOR_HELP}_SUCCESS`:
            return { ...state, inforHelp: action };
        case `${types.TT_TROUBLE_GET_LIST_INFOR_HELP}_FAIL`:
            return { ...state, inforHelp: action };
        case `${types.TT_TROUBLE_DOWNLOAD_INFOR_HELP}_SUCCESS`:
            return { ...state, downloadFile: action };
        case `${types.TT_TROUBLE_DOWNLOAD_INFOR_HELP}_FAIL`:
            return { ...state, downloadFile: action };
        case `${types.TT_TROUBLE_SEARCH_DEVICE_ERROR}_SUCCESS`:
            return { ...state, deviceError: action };
        case `${types.TT_TROUBLE_SEARCH_DEVICE_ERROR}_FAIL`:
            return { ...state, deviceError: action };;
        case `${types.TT_TROUBLE_ADD_DEVICE_ERROR}_SUCCESS`:
            return { ...state, addDeviceError: action };
        case `${types.TT_TROUBLE_ADD_DEVICE_ERROR}_FAIL`:
            return { ...state, addDeviceError: action };
        case `${types.TT_TROUBLE_GET_LIST_HISTORY}_SUCCESS`:
            return { ...state, historyList: action };
        case `${types.TT_TROUBLE_GET_LIST_HISTORY}_FAIL`:
            return { ...state, historyList: action };
        case `${types.TT_TROUBLE_GET_LIST_AFFECTED_NODE}_SUCCESS`:
            return { ...state, affectedNode: action };
        case `${types.TT_TROUBLE_GET_LIST_AFFECTED_NODE}_FAIL`:
            return { ...state, affectedNode: action };
        case `${types.TT_TROUBLE_GET_LIST_NOC_INFOR}_SUCCESS`:
            return { ...state, NOCInfor: action };
        case `${types.TT_TROUBLE_GET_LIST_NOC_INFOR}_FAIL`:
            return { ...state, NOCInfor: action };
        case `${types.TT_TROUBLE_SAVE_FILE_ATTACH}_SUCCESS`:
            return { ...state, saveFileAttach: action };
        case `${types.TT_TROUBLE_SAVE_FILE_ATTACH}_FAIL`:
            return { ...state, saveFileAttach: action };
        case `${types.ON_DOWNLOAD_FILE_ATTACH}_SUCCESS`:
            return { ...state, downloadFileAttach: action };
        case `${types.ON_DOWNLOAD_FILE_ATTACH}_FAIL`:
            return { ...state, downloadFileAttach: action };
        case `${types.TT_TROUBLE_GET_LIST_RELATED_TT}_SUCCESS`:
            return { ...state, relatedTtList: action };
        case `${types.TT_TROUBLE_GET_LIST_RELATED_TT}_FAIL`:
            return { ...state, relatedTtList: action };
        case `${types.TT_TROUBLE_GET_LIST_RELATED_PT}_SUCCESS`:
            return { ...state, relatedPtList: action };
        case `${types.TT_TROUBLE_GET_LIST_RELATED_PT}_FAIL`:
            return { ...state, relatedPtList: action };
        case `${types.TT_TROUBLE_GET_LIST_RELATED_TT_POPUP}_SUCCESS`:
            return { ...state, relatedTtPopupList: action };
        case `${types.TT_TROUBLE_GET_LIST_RELATED_TT_POPUP}_FAIL`:
            return { ...state, relatedTtPopupList: action };
        case `${types.TT_TROUBLE_CALL_IPCC}_SUCCESS`:
            return { ...state, callIPCC: action };
        case `${types.TT_TROUBLE_CALL_IPCC}_FAIL`:
            return { ...state, callIPCC: action };
        case `${types.TT_TROUBLE_LOAD_CR_DETAIL}_SUCCESS`:
            return { ...state, crDetail: action };
        case `${types.TT_TROUBLE_LOAD_CR_DETAIL}_FAIL`:
            return { ...state, crDetail: action };
        case `${types.TT_TROUBLE_GET_LIST_GROUP_SOLUTION}_SUCCESS`:
            return { ...state, groupSolution: action };
        case `${types.TT_TROUBLE_GET_LIST_GROUP_SOLUTION}_FAIL`:
            return { ...state, groupSolution: action };
        case `${types.TT_TROUBLE_GET_LIST_CABLE_TYPE}_SUCCESS`:
            return { ...state, cableType: action };
        case `${types.TT_TROUBLE_GET_LIST_CABLE_TYPE}_FAIL`:
            return { ...state, cableType: action };
        case `${types.TT_TROUBLE_GET_LIST_MOP_DT}_SUCCESS`:
            return { ...state, mopDt: action };
        case `${types.TT_TROUBLE_GET_LIST_MOP_DT}_FAIL`:
            return { ...state, mopDt: action };
        case `${types.TT_TROUBLE_UPDATE_TROUBLE_MOP}_SUCCESS`:
            return { ...state, updateMop: action };
        case `${types.TT_TROUBLE_UPDATE_TROUBLE_MOP}_FAIL`:
            return { ...state, updateMop: action };
        case `${types.TT_TROUBLE_INSERT_CR_FROM_OTHER_SYSTEM}_SUCCESS`:
            return { ...state, insertCr: action };
        case `${types.TT_TROUBLE_INSERT_CR_FROM_OTHER_SYSTEM}_FAIL`:
            return { ...state, insertCr: action };
        case `${types.TT_TROUBLE_UPDATE_TROUBLE_ENTITY}_SUCCESS`:
            return { ...state, updateTroubleEntity: action };
        case `${types.TT_TROUBLE_UPDATE_TROUBLE_ENTITY}_FAIL`:
            return { ...state, updateTroubleEntity: action };
        case `${types.TT_TROUBLE_GET_LIST_CONCAVE}_SUCCESS`:
            return { ...state, listConcave: action };
        case `${types.TT_TROUBLE_GET_LIST_CONCAVE}_FAIL`:
            return { ...state, listConcave: action };
        case `${types.TT_TROUBLE_GET_LIST_CELL_SERVICE}_SUCCESS`:
            return { ...state, listCellService: action };
        case `${types.TT_TROUBLE_GET_LIST_CELL_SERVICE}_FAIL`:
            return { ...state, listCellService: action };
        case `${types.TT_TROUBLE_SEND_TO_TKTU}_SUCCESS`:
            return { ...state, sendTktu: action };
        case `${types.TT_TROUBLE_SEND_TO_TKTU}_FAIL`:
            return { ...state, sendTktu: action };
        case `${types.TT_TROUBLE_GET_ALARM_CLEAR_GNOC}_SUCCESS`:
            return { ...state, alarmClear: action };
        case `${types.TT_TROUBLE_GET_ALARM_CLEAR_GNOC}_FAIL`:
            return { ...state, alarmClear: action };
        case `${types.TT_TROUBLE_CHECK_WO_REQUIRED_CLOSED}_SUCCESS`:
            return { ...state, checkWoRequiredClosed: action };
        case `${types.TT_TROUBLE_CHECK_WO_REQUIRED_CLOSED}_FAIL`:
            return { ...state, checkWoRequiredClosed: action };
        case `${types.TT_TROUBLE_GET_LIST_DATA_SEARCH_WO}_SUCCESS`:
            return { ...state, getListDataSearchWo: action };
        case `${types.TT_TROUBLE_GET_LIST_DATA_SEARCH_WO}_FAIL`:
            return { ...state, getListDataSearchWo: action };
        case `${types.ON_DOWNLOAD_FILE_MOP_DT}_SUCCESS`:
            return { ...state, downloadMopDt: action };
        case `${types.ON_DOWNLOAD_FILE_MOP_DT}_FAIL`:
            return { ...state, downloadMopDt: action };
        case `${types.TT_TROUBLE_CHANGE_STATUS_WO}_SUCCESS`:
            return { ...state, changeStatusWo: action };
        case `${types.TT_TROUBLE_CHANGE_STATUS_WO}_FAIL`:
            return { ...state, changeStatusWo: action };
        default:
            return state;
    }
}
import * as types from '../actions/commonTypes';
import initialState from '../stores/initialState';

export default function commonReducer(state = initialState.common, action) {
    let suffix = action.type.replace(types.OD_TYPE_GET_ITEM_MASTER + "_", "");
    suffix = suffix.includes("_SUCCESS") ? suffix.replace("_SUCCESS", "") : suffix;
    suffix = suffix.includes("_FAIL") ? suffix.replace("_FAIL", "") : suffix;
    let dataNameArr = suffix.split("_");
    let dataName = "";
    for (let index = 0; index < dataNameArr.length; index++) {
        let part = dataNameArr[index].toLowerCase()
        if(index !== 0) {
            dataName += part.charAt(0).toUpperCase() + part.slice(1);
        } else {
            dataName += part;
        }
    }
    switch (action.type) {
        case `${types.OD_TYPE_GET_ITEM_MASTER}_${suffix}_SUCCESS`:
            return { ...state, [dataName]: action };
        case `${types.OD_TYPE_GET_ITEM_MASTER}_${suffix}_FAIL`:
            return { ...state, [dataName]: action };
        case `${types.ON_GET_LIST_COMBOBOX}_SUCCESS`:
            return { ...state, combobox: action };
        case `${types.ON_GET_LIST_COMBOBOX}_FAIL`:
            return { ...state, combobox: action };
        case `${types.ON_GET_TREE_DATA}_SUCCESS`:
            return { ...state, treeData: action };
        case `${types.ON_GET_TREE_DATA}_FAIL`:
            return { ...state, treeData: action };
        case `${types.ON_GET_LIST_TIMEZONE}_SUCCESS`:
            return { ...state, timezone: action };
        case `${types.ON_GET_LIST_TIMEZONE}_FAIL`:
            return { ...state, timezone: action };
        case `${types.ON_UPDATE_USER_TIMEZONE}_SUCCESS`:
            return { ...state, updateTimezone: action };
        case `${types.ON_UPDATE_USER_TIMEZONE}_FAIL`:
            return { ...state, updateTimezone: action };
        case `${types.ON_GET_LIST_LANGUAGE}_SUCCESS`:
            return { ...state, language: action };
        case `${types.ON_GET_LIST_LANGUAGE}_FAIL`:
            return { ...state, language: action };
        case `${types.ON_UPDATE_USER_LANGUAGE}_SUCCESS`:
            return { ...state, updateLanguage: action };
        case `${types.ON_UPDATE_USER_LANGUAGE}_FAIL`:
            return { ...state, updateLanguage: action };
        case `${types.ON_IMPORT_FILE}_SUCCESS`:
            return { ...state, importFile: action };
        case `${types.ON_IMPORT_FILE}_FAIL`:
            return { ...state, importFile: action };
        case `${types.ON_EXPORT_FILE}_SUCCESS`:
            return { ...state, exportFile: action };
        case `${types.ON_EXPORT_FILE}_FAIL`:
            return { ...state, exportFile: action };
        case `${types.ON_DOWNLOAD_FILE_TEMPLATE}_SUCCESS`:
            return { ...state, downloadFileTemplate: action };
        case `${types.ON_DOWNLOAD_FILE_TEMPLATE}_FAIL`:
            return { ...state, downloadFileTemplate: action };
        case `${types.ON_DOWNLOAD_FILE_BY_ID}_SUCCESS`:
            return { ...state, downloadFileById: action };
        case `${types.ON_DOWNLOAD_FILE_BY_ID}_FAIL`:
            return { ...state, downloadFileById: action };
        case `${types.ON_DOWNLOAD_FILE_BY_PATH}_SUCCESS`:
            return { ...state, downloadFileByPath: action };
        case `${types.ON_DOWNLOAD_FILE_BY_PATH}_FAIL`:
            return { ...state, downloadFileByPath: action };
        case `${types.ON_DOWNLOAD_FILE_TEMP_BY_PATH}_SUCCESS`:
            return { ...state, downloadFileTempByPath: action };
        case `${types.ON_DOWNLOAD_FILE_TEMP_BY_PATH}_FAIL`:
            return { ...state, downloadFileTempByPath: action };
        case `${types.ON_THE_SIGN}_SUCCESS`:
            return { ...state, theSign: action };
        case `${types.ON_THE_SIGN}_FAIL`:
            return { ...state, theSign: action };
        case `${types.ON_GET_LIST_TABLE_CONFIG_USER}_SUCCESS`:
            return { ...state, listTableConfigUser: action };
        case `${types.ON_GET_LIST_TABLE_CONFIG_USER}_FAIL`:
            return { ...state, listTableConfigUser: action };
        case `${types.ON_INSERT_TABLE_CONFIG_USER}_SUCCESS`:
            return { ...state, insertTableConfigUser: action };
        case `${types.ON_INSERT_TABLE_CONFIG_USER}_FAIL`:
            return { ...state, insertTableConfigUser: action };
        case `${types.ON_UPDATE_TABLE_CONFIG_USER}_SUCCESS`:
            return { ...state, updateTableConfigUser: action };
        case `${types.ON_UPDATE_TABLE_CONFIG_USER}_FAIL`:
            return { ...state, updateTableConfigUser: action };
        case `${types.ON_DELETE_TABLE_CONFIG_USER}_SUCCESS`:
            return { ...state, deleteTableConfigUser: action };
        case `${types.ON_DELETE_TABLE_CONFIG_USER}_FAIL`:
            return { ...state, deleteTableConfigUser: action };
        case `${types.ON_GET_LIST_SEARCH_CONFIG_USER}_SUCCESS`:
            return { ...state, listSearchConfigUser: action };
        case `${types.ON_GET_LIST_SEARCH_CONFIG_USER}_FAIL`:
            return { ...state, listSearchConfigUser: action };
        case `${types.ON_INSERT_OR_UPDATE_SEARCH_CONFIG_USER}_SUCCESS`:
            return { ...state, insertOrUpdateSearchConfigUser: action };
        case `${types.ON_INSERT_OR_UPDATE_SEARCH_CONFIG_USER}_FAIL`:
            return { ...state, insertOrUpdateSearchConfigUser: action };
        case `${types.ON_DELETE_LIST_SEARCH_CONFIG_USER}_SUCCESS`:
            return { ...state, deleteSearchConfigUser: action };
        case `${types.ON_DELETE_LIST_SEARCH_CONFIG_USER}_FAIL`:
            return { ...state, deleteSearchConfigUser: action };
        case `${types.ON_GET_LIST_CAT_ITEM_DTO}_SUCCESS`:
            return { ...state, catItem: action };
        case `${types.ON_GET_LIST_CAT_ITEM_DTO}_FAIL`:
            return { ...state, catItem: action };
        case `${types.ON_GET_LIST_ITEM_BY_CAT_AND_PARENT}_SUCCESS`:
            return { ...state, itemListByParent: action };
        case `${types.ON_GET_LIST_ITEM_BY_CAT_AND_PARENT}_FAIL`:
            return { ...state, itemListByParent: action };
        case `${types.ON_GET_LIST_ITEM_BY_LIST_PARENT}_SUCCESS`:
            return { ...state, itemListByListParent: action };
        case `${types.ON_GET_LIST_ITEM_BY_LIST_PARENT}_FAIL`:
            return { ...state, itemListByListParent: action };
        case `${types.ON_GET_TRANSITION_STATE}_SUCCESS`:
            return { ...state, transitionState: action };
        case `${types.ON_GET_TRANSITION_STATE}_FAIL`:
            return { ...state, transitionState: action };
        case `${types.ON_GET_UNIT_SEARCH}_SUCCESS`:
            return { ...state, getUnitSearch: action };
        case `${types.ON_GET_UNIT_SEARCH}_FAIL`:
            return { ...state, getUnitSearch: action };
        case `${types.ON_GET_CONFIG_PROPERTY}_SUCCESS`:
            return { ...state, getConfigProperty: action };
        case `${types.ON_GET_CONFIG_PROPERTY}_FAIL`:
            return { ...state, getConfigProperty: action };
        case `${types.ON_GET_LIST_NODE}_SUCCESS`:
            return { ...state, getListNode: action };
        case `${types.ON_GET_LIST_NODE}_FAIL`:
            return { ...state, getListNode: action };
        case `${types.ON_GET_LIST_NODE_V2}_SUCCESS`:
            return { ...state, getListNodeV2: action };
        case `${types.ON_GET_LIST_NODE_V2}_FAIL`:
            return { ...state, getListNodeV2: action };
        case `${types.ON_GET_LIST_LOCATION_BY_LEVEL}_SUCCESS`:
            return { ...state, getListLocationByLevel: action };
        case `${types.ON_GET_LIST_LOCATION_BY_LEVEL}_FAIL`:
            return { ...state, getListLocationByLevel: action };
        case `${types.ON_GET_ITEM_SERVICE_MASTER}_SUCCESS`:
            return { ...state, getItemServiceMaster: action };
        case `${types.ON_GET_ITEM_SERVICE_MASTER}_FAIL`:
            return { ...state, getItemServiceMaster: action };
        case `${types.ON_GET_COMP_CAUSE}_SUCCESS`:
            return { ...state, getCompCause: action };
        case `${types.ON_GET_COMP_CAUSE}_FAIL`:
            return { ...state, getCompCause: action };
        default:
            return state;
    }
}
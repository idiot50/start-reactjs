import initialState from '../../../stores/initialState';
import * as types from './WoCdGroupManagementTypes';

export default function woCdGroupManagementReducers(state = initialState.woCdGroupManagement, action) {
    switch (action.type) {
        case `${types.WO_CDGROUPMANAGEMENT_SEARCH}_SUCCESS`:
            return { ...state, dataTable: action };
        case `${types.WO_CDGROUPMANAGEMENT_SEARCH}_FAIL`:
            return { ...state, dataTable: action };
        case `${types.WO_CDGROUPMANAGEMENT_GET_DETAIL}_SUCCESS`:
            return { ...state, detail: action };
        case `${types.WO_CDGROUPMANAGEMENT_GET_DETAIL}_FAIL`:
            return { ...state, detail: action };
        case `${types.WO_CDGROUPMANAGEMENT_ADD}_SUCCESS`:
            return { ...state, add: action };
        case `${types.WO_CDGROUPMANAGEMENT_ADD}_FAIL`:
            return { ...state, add: action };
        case `${types.WO_CDGROUPMANAGEMENT_EDIT}_SUCCESS`:
            return { ...state, edit: action };
        case `${types.WO_CDGROUPMANAGEMENT_EDIT}_FAIL`:
            return { ...state, edit: action };
        case `${types.WO_CDGROUPMANAGEMENT_DELETE}_SUCCESS`:
            return { ...state, delete: action };
        case `${types.WO_CDGROUPMANAGEMENT_DELETE}_FAIL`:
            return { ...state, delete: action };
        case `${types.WO_CDGROUPMANAGEMENT_GETLIST_GROUPTYPE}_SUCCESS`:
            return { ...state, groupTypeList: action };
        case `${types.WO_CDGROUPMANAGEMENT_GETLIST_GROUPTYPE}_FAIL`:
            return { ...state, groupTypeList: action };
        case `${types.WO_CDGROUPMANAGEMENT_GETLIST_GROUPUNIT_DTO}_SUCCESS`:
            return { ...state, listGroupUnit: action };
        case `${types.WO_CDGROUPMANAGEMENT_GETLIST_GROUPUNIT_DTO}_FAIL`:
            return { ...state, listGroupUnit: action };
        case `${types.WO_CDGROUPMANAGEMENT_UPDATE_GROUPUNIT_DTO}_SUCCESS`:
            return { ...state, updateGroupUnit: action };
        case `${types.WO_CDGROUPMANAGEMENT_UPDATE_GROUPUNIT_DTO}_FAIL`:
            return { ...state, updateGroupUnit: action };
        case `${types.WO_CDGROUPMANAGEMENT_GETLIST_GROUPUSER_DTO}_SUCCESS`:
            return { ...state, listGroupUser: action };
        case `${types.WO_CDGROUPMANAGEMENT_GETLIST_GROUPUSER_DTO}_FAIL`:
            return { ...state, listGroupUser: action };
        case `${types.WO_CDGROUPMANAGEMENT_UPDATE_GROUPUSER_DTO}_SUCCESS`:
            return { ...state, updateGroupUser: action };
        case `${types.WO_CDGROUPMANAGEMENT_UPDATE_GROUPUSER_DTO}_FAIL`:
            return { ...state, updateGroupUser: action };
        case `${types.WO_CDGROUPMANAGEMENT_GETLIST_GROUPWORK_DTO}_SUCCESS`:
            return { ...state, listGroupWork: action };
        case `${types.WO_CDGROUPMANAGEMENT_GETLIST_GROUPWORK_DTO}_FAIL`:
            return { ...state, listGroupWork: action };
        case `${types.WO_CDGROUPMANAGEMENT_UPDATE_GROUPWORK_DTO}_SUCCESS`:
            return { ...state, updateGroupWork: action };
        case `${types.WO_CDGROUPMANAGEMENT_UPDATE_GROUPWORK_DTO}_FAIL`:
            return { ...state, updateGroupWork: action };
        case `${types.WO_CDGROUPMANAGEMENT_EXPORT}_SUCCESS`:
            return { ...state, export: action };
        case `${types.WO_CDGROUPMANAGEMENT_EXPORT}_FAIL`:
            return { ...state, export: action };
        case `${types.WO_CDGROUPMANAGEMENT_UPDATE_STATUS}_SUCCESS`:
            return { ...state, updateStatus: action };
        case `${types.WO_CDGROUPMANAGEMENT_UPDATE_STATUS}_FAIL`:
            return { ...state, updateStatus: action };
        default:
            return state;
    }
}
import initialState from '../../../stores/initialState';
import * as types from './UtilityDepartmentsScopeManagementTypes';

export default function utilityDepartmentsScopeManagementReducers(state = initialState.utilityDepartmentsScopeManagement, action) {
    switch (action.type) {
        case `${types.UTILITY_DEPARTMENTSSCOPEMANAGEMENT_SEARCH}_SUCCESS`:
            return { ...state, dataTable: action };
        case `${types.UTILITY_DEPARTMENTSSCOPEMANAGEMENT_SEARCH}_FAIL`:
            return { ...state, dataTable: action };
        case `${types.UTILITY_DEPARTMENTSSCOPEMANAGEMENT_GET_DETAIL}_SUCCESS`:
            return { ...state, detail: action };
        case `${types.UTILITY_DEPARTMENTSSCOPEMANAGEMENT_GET_DETAIL}_FAIL`:
            return { ...state, detail: action };
        case `${types.UTILITY_DEPARTMENTSSCOPEMANAGEMENT_ADD}_SUCCESS`:
            return { ...state, add: action };
        case `${types.UTILITY_DEPARTMENTSSCOPEMANAGEMENT_ADD}_FAIL`:
            return { ...state, add: action };
        case `${types.UTILITY_DEPARTMENTSSCOPEMANAGEMENT_EDIT}_SUCCESS`:
            return { ...state, edit: action };
        case `${types.UTILITY_DEPARTMENTSSCOPEMANAGEMENT_EDIT}_FAIL`:
            return { ...state, edit: action };
        case `${types.UTILITY_DEPARTMENTSSCOPEMANAGEMENT_DELETE}_SUCCESS`:
            return { ...state, delete: action };
        case `${types.UTILITY_DEPARTMENTSSCOPEMANAGEMENT_DELETE}_FAIL`:
            return { ...state, delete: action };
        case `${types.UTILITY_DEPARTMENTSSCOPEMANAGEMENT_EXPORT}_SUCCESS`:
            return { ...state, export: action };
        case `${types.UTILITY_DEPARTMENTSSCOPEMANAGEMENT_EXPORT}_FAIL`:
            return { ...state, export: action };
        case `${types.UTILITY_DEPARTMENTSSCOPEMANAGEMENT_GETLIST_SEGMENT}_SUCCESS`:
            return { ...state, listSegment: action };
        case `${types.UTILITY_DEPARTMENTSSCOPEMANAGEMENT_GETLIST_SEGMENT}_FAIL`:
            return { ...state, listSegment: action };
        case `${types.UTILITY_DEPARTMENTSSCOPEMANAGEMENT_GETLIST_DEVICE_BYIMPACTSEGMENT}_SUCCESS`:
            return { ...state, listDevice: action };
        case `${types.UTILITY_DEPARTMENTSSCOPEMANAGEMENT_GETLIST_DEVICE_BYIMPACTSEGMENT}_FAIL`:
            return { ...state, listDevice: action };
        case `${types.UTILITY_DEPARTMENTSSCOPEMANAGEMENT_GETLIST_DEVICETYPES}_SUCCESS`:
            return { ...state, listDevice2: action };
        case `${types.UTILITY_DEPARTMENTSSCOPEMANAGEMENT_GETLIST_DEVICETYPES}_FAIL`:
            return { ...state, listDevice2: action };
        default:
            return state;
    }
}
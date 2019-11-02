import initialState from '../../../stores/initialState';
import * as types from './UtilityGroupDepartmentConfigTypes';

export default function utilityGroupDepartmentConfigReducers(state = initialState.utilityGroupDepartmentConfig, action) {
    switch (action.type) {
        case `${types.UTILITY_GROUPDEPARTMENTCONFIG_SEARCH}_SUCCESS`:
            return { ...state, dataTable: action };
        case `${types.UTILITY_GROUPDEPARTMENTCONFIG_SEARCH}_FAIL`:
            return { ...state, dataTable: action };
        case `${types.UTILITY_GROUPDEPARTMENTCONFIG_GET_DETAIL}_SUCCESS`:
            return { ...state, detail: action };
        case `${types.UTILITY_GROUPDEPARTMENTCONFIG_GET_DETAIL}_FAIL`:
            return { ...state, detail: action };
        case `${types.UTILITY_GROUPDEPARTMENTCONFIG_ADD}_SUCCESS`:
            return { ...state, add: action };
        case `${types.UTILITY_GROUPDEPARTMENTCONFIG_ADD}_FAIL`:
            return { ...state, add: action };
        case `${types.UTILITY_GROUPDEPARTMENTCONFIG_EDIT}_SUCCESS`:
            return { ...state, edit: action };
        case `${types.UTILITY_GROUPDEPARTMENTCONFIG_EDIT}_FAIL`:
            return { ...state, edit: action };
        case `${types.UTILITY_GROUPDEPARTMENTCONFIG_DELETE}_SUCCESS`:
            return { ...state, delete: action };
        case `${types.UTILITY_GROUPDEPARTMENTCONFIG_DELETE}_FAIL`:
            return { ...state, delete: action };
        default:
            return state;
    }
}
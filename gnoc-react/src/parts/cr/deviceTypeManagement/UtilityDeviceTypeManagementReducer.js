import initialState from '../../../stores/initialState';
import * as types from './UtilityDeviceTypeManagementTypes';

export default function utilityDeviceTypeManagementReducers(state = initialState.utilityDeviceTypeManagement, action) {
    switch (action.type) {
        case `${types.UTILITY_DEVICETYPEMANAGEMENT_SEARCH}_SUCCESS`:
            return { ...state, dataTable: action };
        case `${types.UTILITY_DEVICETYPEMANAGEMENT_SEARCH}_FAIL`:
            return { ...state, dataTable: action };
        case `${types.UTILITY_DEVICETYPEMANAGEMENT_GET_DETAIL}_SUCCESS`:
            return { ...state, detail: action };
        case `${types.UTILITY_DEVICETYPEMANAGEMENT_GET_DETAIL}_FAIL`:
            return { ...state, detail: action };
        case `${types.UTILITY_DEVICETYPEMANAGEMENT_ADD}_SUCCESS`:
            return { ...state, add: action };
        case `${types.UTILITY_DEVICETYPEMANAGEMENT_ADD}_FAIL`:
            return { ...state, add: action };
        case `${types.UTILITY_DEVICETYPEMANAGEMENT_EDIT}_SUCCESS`:
            return { ...state, edit: action };
        case `${types.UTILITY_DEVICETYPEMANAGEMENT_EDIT}_FAIL`:
            return { ...state, edit: action };
        case `${types.UTILITY_DEVICETYPEMANAGEMENT_DELETE}_SUCCESS`:
            return { ...state, delete: action };
        case `${types.UTILITY_DEVICETYPEMANAGEMENT_DELETE}_FAIL`:
            return { ...state, delete: action };
        default:
            return state;
    }
}
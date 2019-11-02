import initialState from '../../../stores/initialState';
import * as types from './OdConfigBusinessTypes';

export default function odConfigBusinessReducers(state = initialState.odConfigBusiness, action) {
    switch (action.type) {
        case `${types.OD_CONFIG_BUSINESS_SEARCH}_SUCCESS`:
            return { ...state, dataTable: action };
        case `${types.OD_CONFIG_BUSINESS_SEARCH}_FAIL`:
            return { ...state, dataTable: action };
        case `${types.OD_CONFIG_BUSINESS_GET_DETAIL}_SUCCESS`:
            return { ...state, detail: action };
        case `${types.OD_CONFIG_BUSINESS_GET_DETAIL}_FAIL`:
            return { ...state, detail: action };
        case `${types.OD_CONFIG_BUSINESS_ADD}_SUCCESS`:
            return { ...state, add: action };
        case `${types.OD_CONFIG_BUSINESS_ADD}_FAIL`:
            return { ...state, add: action };
        case `${types.OD_CONFIG_BUSINESS_EDIT}_SUCCESS`:
            return { ...state, edit: action };
        case `${types.OD_CONFIG_BUSINESS_EDIT}_FAIL`:
            return { ...state, edit: action };
        case `${types.OD_CONFIG_BUSINESS_DELETE}_SUCCESS`:
            return { ...state, delete: action };
        case `${types.OD_CONFIG_BUSINESS_DELETE}_FAIL`:
            return { ...state, delete: action };
        default:
            return state;
    }
}
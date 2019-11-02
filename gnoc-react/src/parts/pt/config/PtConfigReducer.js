import initialState from '../../../stores/initialState';
import * as types from './PtConfigTypes';

export default function ptConfigReducers(state = initialState.ptConfig, action) {
    switch (action.type) {
        case `${types.PT_CONFIG_SEARCH}_SUCCESS`:
            return { ...state, dataTable: action };
        case `${types.PT_CONFIG_SEARCH}_FAIL`:
            return { ...state, dataTable: action };
        case `${types.PT_CONFIG_GET_DETAIL}_SUCCESS`:
            return { ...state, detail: action };
        case `${types.PT_CONFIG_GET_DETAIL}_FAIL`:
            return { ...state, detail: action };
        case `${types.PT_CONFIG_ADD}_SUCCESS`:
            return { ...state, add: action };
        case `${types.PT_CONFIG_ADD}_FAIL`:
            return { ...state, add: action };
        case `${types.PT_CONFIG_EDIT}_SUCCESS`:
            return { ...state, edit: action };
        case `${types.PT_CONFIG_EDIT}_FAIL`:
            return { ...state, edit: action };
        case `${types.PT_CONFIG_DELETE}_SUCCESS`:
            return { ...state, delete: action };
        case `${types.PT_CONFIG_DELETE}_FAIL`:
            return { ...state, delete: action };
        case `${types.PT_CONFIG_EXPORT}_SUCCESS`:
            return { ...state, export: action };
        case `${types.PT_CONFIG_EXPORT}_FAIL`:
            return { ...state, export: action };
        case `${types.PT_CONFIG_GET_TIME}_SUCCESS`:
            return { ...state, configTime: action };
        case `${types.PT_CONFIG_GET_TIME}_FAIL`:
            return { ...state, configTime: action };
        default:
            return state;
    }
}
import initialState from '../../../stores/initialState';
import * as types from './TtInfoConfigTypes';

export default function ttInfoConfigReducers(state = initialState.ttInfoConfig, action) {
    switch (action.type) {
        case `${types.TT_INFOCONFIG_SEARCH}_SUCCESS`:
            return { ...state, dataTable: action };
        case `${types.TT_INFOCONFIG_SEARCH}_FAIL`:
            return { ...state, dataTable: action };
        case `${types.TT_INFOCONFIG_GET_DETAIL}_SUCCESS`:
            return { ...state, detail: action };
        case `${types.TT_INFOCONFIG_GET_DETAIL}_FAIL`:
            return { ...state, detail: action };
        case `${types.TT_INFOCONFIG_ADD}_SUCCESS`:
            return { ...state, add: action };
        case `${types.TT_INFOCONFIG_ADD}_FAIL`:
            return { ...state, add: action };
        case `${types.TT_INFOCONFIG_EDIT}_SUCCESS`:
            return { ...state, edit: action };
        case `${types.TT_INFOCONFIG_EDIT}_FAIL`:
            return { ...state, edit: action };
        case `${types.TT_INFOCONFIG_DELETE}_SUCCESS`:
            return { ...state, delete: action };
        case `${types.TT_INFOCONFIG_DELETE}_FAIL`:
            return { ...state, delete: action };
        case `${types.TT_INFOCONFIG_GETLISTALARMGROUP}_SUCCESS`:
            return { ...state, alarmgroup: action };
        case `${types.TT_INFOCONFIG_GETLISTALARMGROUP}_FAIL`:
            return { ...state, alarmgroup: action };
        default:
            return state;
    }
}
import initialState from '../../../stores/initialState';
import * as types from './OdConfigScheduleCreateTypes';

export default function odConfigScheduleCreateReducers(state = initialState.odConfigScheduleCreate, action) {
    switch (action.type) {
        case `${types.OD_CONFIG_SCHEDULE_CREATE_SEARCH}_SUCCESS`:
            return { ...state, dataTable: action };
        case `${types.OD_CONFIG_SCHEDULE_CREATE_SEARCH}_FAIL`:
            return { ...state, dataTable: action };
        case `${types.OD_CONFIG_SCHEDULE_CREATE_GET_OD_TYPE}_SUCCESS`:
            return { ...state, odType: action };
        case `${types.OD_CONFIG_SCHEDULE_CREATE_GET_OD_TYPE}_FAIL`:
            return { ...state, odType: action };
        case `${types.OD_CONFIG_SCHEDULE_CREATE_GET_DETAIL}_SUCCESS`:
            return { ...state, detail: action };
        case `${types.OD_CONFIG_SCHEDULE_CREATE_GET_DETAIL}_FAIL`:
            return { ...state, detail: action };
        case `${types.OD_CONFIG_SCHEDULE_CREATE_ADD}_SUCCESS`:
            return { ...state, add: action };
        case `${types.OD_CONFIG_SCHEDULE_CREATE_ADD}_FAIL`:
            return { ...state, add: action };
        case `${types.OD_CONFIG_SCHEDULE_CREATE_EDIT}_SUCCESS`:
            return { ...state, edit: action };
        case `${types.OD_CONFIG_SCHEDULE_CREATE_EDIT}_FAIL`:
            return { ...state, edit: action };
        case `${types.OD_CONFIG_SCHEDULE_CREATE_DELETE}_SUCCESS`:
            return { ...state, delete: action };
        case `${types.OD_CONFIG_SCHEDULE_CREATE_DELETE}_FAIL`:
            return { ...state, delete: action };
        case `${types.OD_CONFIG_SCHEDULE_CREATE_EXPORT_DATA}_SUCCESS`:
            return { ...state, export: action };
        case `${types.OD_CONFIG_SCHEDULE_CREATE_EXPORT_DATA}_FAIL`:
            return { ...state, export: action };
        case `${types.OD_CONFIG_SCHEDULE_CREATE_GET_RECEIVE_UNIT}_SUCCESS`:
            return { ...state, receiveUnit: action };
        case `${types.OD_CONFIG_SCHEDULE_CREATE_GET_RECEIVE_UNIT}_FAIL`:
            return { ...state, receiveUnit: action };
        case `${types.OD_CONFIG_SCHEDULE_CREATE_INSERT_FILE}_SUCCESS`:
            return { ...state, listId: action };
        case `${types.OD_CONFIG_SCHEDULE_CREATE_INSERT_FILE}_FAIL`:
            return { ...state, listId: action };
        default:
            return state;
    }
}
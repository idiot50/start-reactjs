import initialState from '../../../stores/initialState';
import * as types from './TtConfigTimeTypes';

export default function ttConfigTimeReducers(state = initialState.ttConfigTime, action) {
    switch (action.type) {
        case `${types.TT_CONFIGTIME_SEARCH}_SUCCESS`:
            return { ...state, dataTable: action };
        case `${types.TT_CONFIGTIME_SEARCH}_FAIL`:
            return { ...state, dataTable: action };
        case `${types.TT_CONFIGTIME_GET_DETAIL}_SUCCESS`:
            return { ...state, detail: action };
        case `${types.TT_CONFIGTIME_GET_DETAIL}_FAIL`:
            return { ...state, detail: action };
        case `${types.TT_CONFIGTIME_ADD}_SUCCESS`:
            return { ...state, add: action };
        case `${types.TT_CONFIGTIME_ADD}_FAIL`:
            return { ...state, add: action };
        case `${types.TT_CONFIGTIME_EDIT}_SUCCESS`:
            return { ...state, edit: action };
        case `${types.TT_CONFIGTIME_EDIT}_FAIL`:
            return { ...state, edit: action };
        case `${types.TT_CONFIGTIME_DELETE}_SUCCESS`:
            return { ...state, delete: action };
        case `${types.TT_CONFIGTIME_DELETE}_FAIL`:
            return { ...state, delete: action };
        case `${types.TT_GETLIST_SUBCATEGORY}_SUCCESS`:
            return { ...state, delete: action };
        case `${types.TT_GETLIST_SUBCATEGORY}_FAIL`:
            return { ...state, delete: action };
        default:
            return state;
    }
}
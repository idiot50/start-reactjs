import initialState from '../../../stores/initialState';
import * as types from './OdTypeTypes';

export default function odCategoryReducers(state = initialState.odType, action) {
    switch (action.type) {
        case `${types.OD_TYPE_SEARCH}_SUCCESS`:
            return { ...state, dataTable: action };
        case `${types.OD_TYPE_SEARCH}_FAIL`:
            return { ...state, dataTable: action };
        case `${types.OD_TYPE_GET_DETAIL}_SUCCESS`:
            return { ...state, detail: action };
        case `${types.OD_TYPE_GET_DETAIL}_FAIL`:
            return { ...state, detail: action };
        case `${types.OD_TYPE_ADD}_SUCCESS`:
            return { ...state, add: action };
        case `${types.OD_TYPE_ADD}_FAIL`:
            return { ...state, add: action };
        case `${types.OD_TYPE_EDIT}_SUCCESS`:
            return { ...state, edit: action };
        case `${types.OD_TYPE_EDIT}_FAIL`:
            return { ...state, edit: action };
        case `${types.OD_TYPE_DELETE}_SUCCESS`:
            return { ...state, delete: action };
        case `${types.OD_TYPE_DELETE}_FAIL`:
            return { ...state, delete: action };
        default:
            return state;
    }
}
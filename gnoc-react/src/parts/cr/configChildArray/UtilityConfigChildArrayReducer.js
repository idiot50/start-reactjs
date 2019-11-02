import initialState from '../../../stores/initialState';
import * as types from './UtilityConfigChildArrayTypes';

export default function utilityConfigChildArrayReducers(state = initialState.utilityConfigChildArray, action) {
    switch (action.type) {
        case `${types.UTILITY_CONFIGCHILDARRAY_SEARCH}_SUCCESS`:
            return { ...state, dataTable: action };
        case `${types.UTILITY_CONFIGCHILDARRAY_SEARCH}_FAIL`:
            return { ...state, dataTable: action };
        case `${types.UTILITY_CONFIGCHILDARRAY_GET_DETAIL}_SUCCESS`:
            return { ...state, detail: action };
        case `${types.UTILITY_CONFIGCHILDARRAY_GET_DETAIL}_FAIL`:
            return { ...state, detail: action };
        case `${types.UTILITY_CONFIGCHILDARRAY_ADD}_SUCCESS`:
            return { ...state, add: action };
        case `${types.UTILITY_CONFIGCHILDARRAY_ADD}_FAIL`:
            return { ...state, add: action };
        case `${types.UTILITY_CONFIGCHILDARRAY_EDIT}_SUCCESS`:
            return { ...state, edit: action };
        case `${types.UTILITY_CONFIGCHILDARRAY_EDIT}_FAIL`:
            return { ...state, edit: action };
        case `${types.UTILITY_CONFIGCHILDARRAY_DELETE}_SUCCESS`:
            return { ...state, delete: action };
        case `${types.UTILITY_CONFIGCHILDARRAY_DELETE}_FAIL`:
            return { ...state, delete: action };
        case `${types.UTILITY_CONFIGCHILDARRAY_GETLIST_IMPACTSEGMENT}_SUCCESS`:
            return { ...state, listIS: action };
        case `${types.UTILITY_CONFIGCHILDARRAY_GETLIST_IMPACTSEGMENT}_FAIL`:
            return { ...state, listIS: action };
        default:
            return state;
    }
}
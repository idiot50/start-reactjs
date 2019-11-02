import initialState from '../../../stores/initialState';
import * as types from './WoMapProvinceCdGroupTypes';

export default function woMapProvinceCdGroupReducers(state = initialState.woMapProvinceCdGroup, action) {
    switch (action.type) {
        case `${types.WO_MAPPROVINCECDGROUP_SEARCH}_SUCCESS`:
            return { ...state, dataTable: action };
        case `${types.WO_MAPPROVINCECDGROUP_SEARCH}_FAIL`:
            return { ...state, dataTable: action };
        case `${types.WO_MAPPROVINCECDGROUP_GET_DETAIL}_SUCCESS`:
            return { ...state, detail: action };
        case `${types.WO_MAPPROVINCECDGROUP_GET_DETAIL}_FAIL`:
            return { ...state, detail: action };
        case `${types.WO_MAPPROVINCECDGROUP_ADD}_SUCCESS`:
            return { ...state, add: action };
        case `${types.WO_MAPPROVINCECDGROUP_ADD}_FAIL`:
            return { ...state, add: action };
        case `${types.WO_MAPPROVINCECDGROUP_EDIT}_SUCCESS`:
            return { ...state, edit: action };
        case `${types.WO_MAPPROVINCECDGROUP_EDIT}_FAIL`:
            return { ...state, edit: action };
        case `${types.WO_MAPPROVINCECDGROUP_DELETE}_SUCCESS`:
            return { ...state, delete: action };
        case `${types.WO_MAPPROVINCECDGROUP_DELETE}_FAIL`:
            return { ...state, delete: action };
        case `${types.WO_MAPPROVINCECDGROUP_GETLIST_PROVINCE}_SUCCESS`:
            return { ...state, getListProvince: action };
        case `${types.WO_MAPPROVINCECDGROUP_GETLIST_PROVINCE}_FAIL`:
            return { ...state, getListProvince: action };
        default:
            return state;
    }
}
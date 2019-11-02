import initialState from '../../../stores/initialState';
import * as types from './TtConfigReceiveUnitTypes';

export default function ttConfigReceiveUnitReducers(state = initialState.ttConfigReceiveUnit, action) {
    switch (action.type) {
        case `${types.TT_CONFIGRECEIVEUNIT_SEARCH}_SUCCESS`:
            return { ...state, dataTable: action };
        case `${types.TT_CONFIGRECEIVEUNIT_SEARCH}_FAIL`:
            return { ...state, dataTable: action };
        case `${types.TT_CONFIGRECEIVEUNIT_GET_DETAIL}_SUCCESS`:
            return { ...state, detail: action };
        case `${types.TT_CONFIGRECEIVEUNIT_GET_DETAIL}_FAIL`:
            return { ...state, detail: action };
        case `${types.TT_CONFIGRECEIVEUNIT_ADD}_SUCCESS`:
            return { ...state, add: action };
        case `${types.TT_CONFIGRECEIVEUNIT_ADD}_FAIL`:
            return { ...state, add: action };
        case `${types.TT_CONFIGRECEIVEUNIT_EDIT}_SUCCESS`:
            return { ...state, edit: action };
        case `${types.TT_CONFIGRECEIVEUNIT_EDIT}_FAIL`:
            return { ...state, edit: action };
        case `${types.TT_CONFIGRECEIVEUNIT_DELETE}_SUCCESS`:
            return { ...state, delete: action };
        case `${types.TT_CONFIGRECEIVEUNIT_DELETE}_FAIL`:
            return { ...state, delete: action };
        case `${types.TT_GET_LIST_CAT_ITEM}_SUCCESS`:
            return { ...state, ptType: action };
        case `${types.TT_GET_LIST_CAT_ITEM}_FAIL`:
            return { ...state, ptType: action };
        default:
            return state;
    }
}
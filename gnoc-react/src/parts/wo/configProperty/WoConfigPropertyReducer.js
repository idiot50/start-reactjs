import initialState from '../../../stores/initialState';
import * as types from './WoConfigPropertyTypes';

export default function woConfigPropertyReducers(state = initialState.woConfigProperty, action) {
    switch (action.type) {
        case `${types.WO_CONFIGPROPERTY_SEARCH}_SUCCESS`:
            return { ...state, dataTable: action };
        case `${types.WO_CONFIGPROPERTY_SEARCH}_FAIL`:
            return { ...state, dataTable: action };
        case `${types.WO_CONFIGPROPERTY_GET_DETAIL}_SUCCESS`:
            return { ...state, detail: action };
        case `${types.WO_CONFIGPROPERTY_GET_DETAIL}_FAIL`:
            return { ...state, detail: action };
        case `${types.WO_CONFIGPROPERTY_ADD}_SUCCESS`:
            return { ...state, add: action };
        case `${types.WO_CONFIGPROPERTY_ADD}_FAIL`:
            return { ...state, add: action };
        case `${types.WO_CONFIGPROPERTY_EDIT}_SUCCESS`:
            return { ...state, edit: action };
        case `${types.WO_CONFIGPROPERTY_EDIT}_FAIL`:
            return { ...state, edit: action };
        case `${types.WO_CONFIGPROPERTY_DELETE}_SUCCESS`:
            return { ...state, delete: action };
        case `${types.WO_CONFIGPROPERTY_DELETE}_FAIL`:
            return { ...state, delete: action };
        default:
            return state;
    }
}
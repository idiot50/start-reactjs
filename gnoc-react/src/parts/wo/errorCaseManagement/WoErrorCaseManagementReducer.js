import initialState from '../../../stores/initialState';
import * as types from './WoErrorCaseManagementTypes';

export default function woErrorCaseManagementReducers(state = initialState.woErrorCaseManagement, action) {
    switch (action.type) {
        case `${types.WO_ERRORCASEMANAGEMENT_SEARCH}_SUCCESS`:
            return { ...state, dataTable: action };
        case `${types.WO_ERRORCASEMANAGEMENT_SEARCH}_FAIL`:
            return { ...state, dataTable: action };
        case `${types.WO_ERRORCASEMANAGEMENT_GET_DETAIL}_SUCCESS`:
            return { ...state, detail: action };
        case `${types.WO_ERRORCASEMANAGEMENT_GET_DETAIL}_FAIL`:
            return { ...state, detail: action };
        case `${types.WO_ERRORCASEMANAGEMENT_ADD}_SUCCESS`:
            return { ...state, add: action };
        case `${types.WO_ERRORCASEMANAGEMENT_ADD}_FAIL`:
            return { ...state, add: action };
        case `${types.WO_ERRORCASEMANAGEMENT_EDIT}_SUCCESS`:
            return { ...state, edit: action };
        case `${types.WO_ERRORCASEMANAGEMENT_EDIT}_FAIL`:
            return { ...state, edit: action };
        case `${types.WO_ERRORCASEMANAGEMENT_DELETE}_SUCCESS`:
            return { ...state, delete: action };
        case `${types.WO_ERRORCASEMANAGEMENT_DELETE}_FAIL`:
            return { ...state, delete: action };
        case `${types.WO_ERRORCASEMANAGEMENT_EXPORT}_SUCCESS`:
            return { ...state, export: action };
        case `${types.WO_ERRORCASEMANAGEMENT_EXPORT}_FAIL`:
            return { ...state, export: action };
        default:
            return state;
    }
}
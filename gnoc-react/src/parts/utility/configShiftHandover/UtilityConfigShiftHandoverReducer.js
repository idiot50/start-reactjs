import initialState from '../../../stores/initialState';
import * as types from './UtilityConfigShiftHandoverTypes';

export default function utilityConfigShiftHandoverReducers(state = initialState.utilityConfigShiftHandover, action) {
    switch (action.type) {
        case `${types.UTILITY_CONFIGSHIFTHANDOVER_SEARCH}_SUCCESS`:
            return { ...state, dataTable: action };
        case `${types.UTILITY_CONFIGSHIFTHANDOVER_SEARCH}_FAIL`:
            return { ...state, dataTable: action };
        case `${types.UTILITY_CONFIGSHIFTHANDOVER_GET_DETAIL}_SUCCESS`:
            return { ...state, detail: action };
        case `${types.UTILITY_CONFIGSHIFTHANDOVER_GET_DETAIL}_FAIL`:
            return { ...state, detail: action };
        case `${types.UTILITY_CONFIGSHIFTHANDOVER_ADD}_SUCCESS`:
            return { ...state, add: action };
        case `${types.UTILITY_CONFIGSHIFTHANDOVER_ADD}_FAIL`:
            return { ...state, add: action };
        case `${types.UTILITY_CONFIGSHIFTHANDOVER_EDIT}_SUCCESS`:
            return { ...state, edit: action };
        case `${types.UTILITY_CONFIGSHIFTHANDOVER_EDIT}_FAIL`:
            return { ...state, edit: action };
        case `${types.UTILITY_CONFIGSHIFTHANDOVER_DELETE}_SUCCESS`:
            return { ...state, delete: action };
        case `${types.UTILITY_CONFIGSHIFTHANDOVER_DELETE}_FAIL`:
            return { ...state, delete: action };
        case `${types.UTILITY_CONFIGSHIFTHANDOVER_GETLIST_SHIFT}_SUCCESS`:
            return { ...state, listShift: action };
        case `${types.UTILITY_CONFIGSHIFTHANDOVER_GETLIST_SHIFT}_FAIL`:
            return { ...state, listShift: action };
        case `${types.UTILITY_CONFIGSHIFTHANDOVER_GETLIST_SHIFTUSER}_SUCCESS`:
            return { ...state, listShiftUser: action };
        case `${types.UTILITY_CONFIGSHIFTHANDOVER_GETLIST_SHIFTUSER}_FAIL`:
            return { ...state, listShiftUser: action };
        case `${types.UTILITY_CONFIGSHIFTHANDOVER_GETLIST_SHIFTWORK}_SUCCESS`:
            return { ...state, listWork: action };
        case `${types.UTILITY_CONFIGSHIFTHANDOVER_GETLIST_SHIFTWORK}_FAIL`:
            return { ...state, listWork: action };
        case `${types.UTILITY_CONFIGSHIFTHANDOVER_GETLIST_SHIFTITSERIOUS}_SUCCESS`:
            return { ...state, listItSerious: action };
        case `${types.UTILITY_CONFIGSHIFTHANDOVER_GETLIST_SHIFTITSERIOUS}_FAIL`:
            return { ...state, listItSerious: action };
        case `${types.UTILITY_CONFIGSHIFTHANDOVER_COUNTTICKET}_SUCCESS`:
            return { ...state, countTicket: action };
        case `${types.UTILITY_CONFIGSHIFTHANDOVER_COUNTTICKET}_FAIL`:
            return { ...state, countTicket: action };
        default:
            return state;
    }
}
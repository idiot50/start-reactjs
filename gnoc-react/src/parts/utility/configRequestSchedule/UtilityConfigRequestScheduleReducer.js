import initialState from '../../../stores/initialState';
import * as types from './UtilityConfigRequestScheduleTypes';

export default function utilityConfigRequestScheduleReducers(state = initialState.utilityConfigRequestSchedule, action) {
    switch (action.type) {
        case `${types.UTILITY_CONFIGREQUESTSCHEDULE_SEARCH}_SUCCESS`:
            return { ...state, dataTable: action };
        case `${types.UTILITY_CONFIGREQUESTSCHEDULE_SEARCH}_FAIL`:
            return { ...state, dataTable: action };
        case `${types.UTILITY_CONFIGREQUESTSCHEDULE_GET_DETAIL}_SUCCESS`:
            return { ...state, detail: action };
        case `${types.UTILITY_CONFIGREQUESTSCHEDULE_GET_DETAIL}_FAIL`:
            return { ...state, detail: action };
        case `${types.UTILITY_CONFIGREQUESTSCHEDULE_ADD}_SUCCESS`:
            return { ...state, add: action };
        case `${types.UTILITY_CONFIGREQUESTSCHEDULE_ADD}_FAIL`:
            return { ...state, add: action };
        case `${types.UTILITY_CONFIGREQUESTSCHEDULE_EDIT}_SUCCESS`:
            return { ...state, edit: action };
        case `${types.UTILITY_CONFIGREQUESTSCHEDULE_EDIT}_FAIL`:
            return { ...state, edit: action };
        case `${types.UTILITY_CONFIGREQUESTSCHEDULE_DELETE}_SUCCESS`:
            return { ...state, delete: action };
        case `${types.UTILITY_CONFIGREQUESTSCHEDULE_DELETE}_FAIL`:
            return { ...state, delete: action };
        case `${types.UTILITY_CONFIGREQUESTSCHEDULE_GET_YEAR}_SUCCESS`:
             return { ...state, getYear: action };
        case `${types.UTILITY_CONFIGREQUESTSCHEDULE_GET_YEAR}_FAIL`:
            return { ...state, getYear: action };
        case `${types.UTILITY_CONFIGREQUESTSCHEDULE_GET_EMPLOYEE}_SUCCESS`:
             return { ...state, getEmployee: action };
        case `${types.UTILITY_CONFIGREQUESTSCHEDULE_GET_EMPLOYEE}_FAIL`:
             return { ...state, getEmployee: action };
        case `${types.UTILITY_CONFIGREQUESTSCHEDULE_GET_UNIT}_SUCCESS`:
            return { ...state, getUnit: action };
        case `${types.UTILITY_CONFIGREQUESTSCHEDULE_GET_UNIT}_FAIL`:
             return { ...state, getUnit: action };
        case `${types.UTILITY_CONFIGREQUESTSCHEDULE_GET_CR_BEFORE}_SUCCESS`:
             return { ...state, getCRBefore: action };
        case `${types.UTILITY_CONFIGREQUESTSCHEDULE_GET_CR_BEFORE}_FAIL`:
             return { ...state, getCRBefore: action };
        case `${types.UTILITY_CONFIGREQUESTSCHEDULE_GET_CR_AFTER}_SUCCESS`:
             return { ...state, getCRAfter: action };
        case `${types.UTILITY_CONFIGREQUESTSCHEDULE_GET_CR_AFTER}_FAIL`:
             return { ...state, getCRAfter: action };
        case `${types.UTILITY_CONFIGREQUESTSCHEDULE_GET_CR_AFTER_FAIL}_SUCCESS`:
             return { ...state, getCRAfterFail: action };
         case `${types.UTILITY_CONFIGREQUESTSCHEDULE_GET_CR_AFTER_FAIL}_FAIL`:
             return { ...state, getCRAfterFail: action };
        case `${types.UTILITY_CONFIGREQUESTSCHEDULE_CANCEL}_SUCCESS`:
             return { ...state, cancelSchedule: action };
         case `${types.UTILITY_CONFIGREQUESTSCHEDULE_CANCEL}_FAIL`:
             return { ...state, cancelSchedule: action };
        default:
            return state;
    }
}
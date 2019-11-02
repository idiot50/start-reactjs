import initialState from '../../../stores/initialState';
import * as types from './UtilityWorkLogsTypes';

export default function utilityWorkLogsReducers(state = initialState.utilityWorkLogs, action) {
    switch (action.type) {
        case `${types.UTILITY_WORKLOGS_SEARCH}_SUCCESS`:
            return { ...state, dataTable: action };
        case `${types.UTILITY_WORKLOGS_SEARCH}_FAIL`:
            return { ...state, dataTable: action };
        case `${types.UTILITY_WORKLOGS_GET_DETAIL}_SUCCESS`:
            return { ...state, detail: action };
        case `${types.UTILITY_WORKLOGS_GET_DETAIL}_FAIL`:
            return { ...state, detail: action };
        case `${types.UTILITY_WORKLOGS_ADD}_SUCCESS`:
            return { ...state, add: action };
        case `${types.UTILITY_WORKLOGS_ADD}_FAIL`:
            return { ...state, add: action };
        case `${types.UTILITY_WORKLOGS_EDIT}_SUCCESS`:
            return { ...state, edit: action };
        case `${types.UTILITY_WORKLOGS_EDIT}_FAIL`:
            return { ...state, edit: action };
        case `${types.UTILITY_WORKLOGS_DELETE}_SUCCESS`:
            return { ...state, delete: action };
        case `${types.UTILITY_WORKLOGS_DELETE}_FAIL`:
            return { ...state, delete: action };
        case `${types.UTILITY_WORKLOGS_GET_WORKLOG_TYPE}_SUCCESS`:
            return { ...state, worklogType: action };
        case `${types.UTILITY_WORKLOGS_GET_WORKLOG_TYPE}_FAIL`:
            return { ...state, worklogType: action };
        default:
            return state;
    }
}
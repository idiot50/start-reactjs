import initialState from '../../../stores/initialState';
import * as types from './OdWorkflowTypes';

export default function odWorkflowReducers(state = initialState.odWorkflow, action) {
    switch (action.type) {
        case `${types.OD_WORKFLOW_SEARCH}_SUCCESS`:
            return { ...state, dataTable: action };
        case `${types.OD_WORKFLOW_SEARCH}_FAIL`:
            return { ...state, dataTable: action };
        case `${types.OD_WORKFLOW_GET_DETAIL}_SUCCESS`:
            return { ...state, detail: action };
        case `${types.OD_WORKFLOW_GET_DETAIL}_FAIL`:
            return { ...state, detail: action };
        case `${types.OD_WORKFLOW_ADD}_SUCCESS`:
            return { ...state, add: action };
        case `${types.OD_WORKFLOW_ADD}_FAIL`:
            return { ...state, add: action };
        case `${types.OD_WORKFLOW_EDIT}_SUCCESS`:
            return { ...state, edit: action };
        case `${types.OD_WORKFLOW_EDIT}_FAIL`:
            return { ...state, edit: action };
        case `${types.OD_WORKFLOW_DELETE}_SUCCESS`:
            return { ...state, delete: action };
        case `${types.OD_WORKFLOW_DELETE}_FAIL`:
            return { ...state, delete: action };
        case `${types.OD_WORKFLOW_LINKCODE}_SUCCESS`:
            return { ...state, dataTable: action };
        case `${types.OD_WORKFLOW_LINKCODE}_FAIL`:
            return { ...state, dataTable: action };
        case `${types.OD_WORKFLOW_GET_STATUS_NEXT}_SUCCESS`:
            return { ...state, statusNext: action };
        case `${types.OD_WORKFLOW_GET_STATUS_NEXT}_FAIL`:
            return { ...state, statusNext: action };
        case `${types.OD_WORKFLOW_GET_COLUMN_CHECK}_SUCCESS`:
            return { ...state, columnCheck: action };
        case `${types.OD_WORKFLOW_GET_COLUMN_CHECK}_FAIL`:
            return { ...state, columnCheck: action };
        case `${types.OD_WORKFLOW_GET_CONFIG_PROPERTY}_SUCCESS`:
            return { ...state, configProperty: action };
        case `${types.OD_WORKFLOW_GET_CONFIG_PROPERTY}_FAIL`:
            return { ...state, configProperty: action };
        default:
            return state;
    }
}
import initialState from '../../../stores/initialState';
import * as types from './UtilityConfigEmployeeImpactTypes';

export default function utilityConfigEmployeeImpactReducers(state = initialState.utilityConfigEmployeeImpact, action) {
    switch (action.type) {
        case `${types.UTILITY_CONFIGEMPLOYEEIMPACT_SEARCH}_SUCCESS`:
            return { ...state, dataTable: action };
        case `${types.UTILITY_CONFIGEMPLOYEEIMPACT_SEARCH}_FAIL`:
            return { ...state, dataTable: action };
        case `${types.UTILITY_CONFIGEMPLOYEEIMPACT_GET_DETAIL}_SUCCESS`:
            return { ...state, detail: action };
        case `${types.UTILITY_CONFIGEMPLOYEEIMPACT_GET_DETAIL}_FAIL`:
            return { ...state, detail: action };
        case `${types.UTILITY_CONFIGEMPLOYEEIMPACT_ADD}_SUCCESS`:
            return { ...state, add: action };
        case `${types.UTILITY_CONFIGEMPLOYEEIMPACT_ADD}_FAIL`:
            return { ...state, add: action };
        case `${types.UTILITY_CONFIGEMPLOYEEIMPACT_EDIT}_SUCCESS`:
            return { ...state, edit: action };
        case `${types.UTILITY_CONFIGEMPLOYEEIMPACT_EDIT}_FAIL`:
            return { ...state, edit: action };
        case `${types.UTILITY_CONFIGEMPLOYEEIMPACT_DELETE}_SUCCESS`:
            return { ...state, delete: action };
        case `${types.UTILITY_CONFIGEMPLOYEEIMPACT_DELETE}_FAIL`:
            return { ...state, delete: action };
        case `${types.UTILITY_CONFIGEMPLOYEEIMPACT_GET_PARENT_ARRAY}_SUCCESS`:
            return { ...state, parentArray: action };
        case `${types.UTILITY_CONFIGEMPLOYEEIMPACT_GET_PARENT_ARRAY}_FAIL`:
            return { ...state, parentArray: action };
        case `${types.UTILITY_CONFIGEMPLOYEEIMPACT_GET_CHILD_ARRAY}_SUCCESS`:
             return { ...state, childArray: action };
        case `${types.UTILITY_CONFIGEMPLOYEEIMPACT_GET_CHILD_ARRAY}_FAIL`:
            return { ...state, childArray: action };
        case `${types.UTILITY_CONFIGEMPLOYEEIMPACT_GET_LEVEL}_SUCCESS`:
            return { ...state, listLevel: action };
        case `${types.UTILITY_CONFIGEMPLOYEEIMPACT_GET_LEVEL}_FAIL`:
           return { ...state, listLevel: action };
        default:
            return state;
    }
}
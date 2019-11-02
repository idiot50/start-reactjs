import initialState from '../../../stores/initialState';
import * as types from './UtilityGroupUnitTypes';

export default function utilityGroupUnitReducers(state = initialState.utilityGroupUnit, action) {
    switch (action.type) {
        case `${types.UTILITY_GROUPUNIT_SEARCH}_SUCCESS`:
            return { ...state, dataTable: action };
        case `${types.UTILITY_GROUPUNIT_SEARCH}_FAIL`:
            return { ...state, dataTable: action };
        case `${types.UTILITY_GROUPUNIT_GET_DETAIL}_SUCCESS`:
            return { ...state, detail: action };
        case `${types.UTILITY_GROUPUNIT_GET_DETAIL}_FAIL`:
            return { ...state, detail: action };
        case `${types.UTILITY_GROUPUNIT_ADD}_SUCCESS`:
            return { ...state, add: action };
        case `${types.UTILITY_GROUPUNIT_ADD}_FAIL`:
            return { ...state, add: action };
        case `${types.UTILITY_GROUPUNIT_EDIT}_SUCCESS`:
            return { ...state, edit: action };
        case `${types.UTILITY_GROUPUNIT_EDIT}_FAIL`:
            return { ...state, edit: action };
        case `${types.UTILITY_GROUPUNIT_DELETE}_SUCCESS`:
            return { ...state, delete: action };
        case `${types.UTILITY_GROUPUNIT_DELETE}_FAIL`:
            return { ...state, delete: action };
        case `${types.UTILITY_GROUPUNIT_EXPORT}_SUCCESS`:
            return { ...state, export: action };
        case `${types.UTILITY_GROUPUNIT_EXPORT}_FAIL`:
            return { ...state, export: action };
        default:
            return state;
    }
}
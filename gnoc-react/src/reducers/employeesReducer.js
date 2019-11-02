import * as types from '../actions/employeesTypes';
import initialState from '../stores/initialState';

export default function employeesReducer(state = initialState.employees, action) {
    switch (action.type) {
        case `${types.SEARCH_EMPLOYEE}_SUCCESS`:
            return { ...state, dataTable: action };
        case `${types.SEARCH_EMPLOYEE}_FAIL`:
            return { ...state, dataTable: action };
        case `${types.GET_DETAIL_EMPLOYEE}_SUCCESS`:
            return { ...state, detail: action };
        case `${types.GET_DETAIL_EMPLOYEE}_FAIL`:
            return { ...state, detail: action };
        case `${types.ADD_EMPLOYEE}_SUCCESS`:
            return { ...state, add: action };
        case `${types.ADD_EMPLOYEE}_FAIL`:
            return { ...state, add: action };
        case `${types.EDIT_EMPLOYEE}_SUCCESS`:
            return { ...state, edit: action };
        case `${types.EDIT_EMPLOYEE}_FAIL`:
            return { ...state, edit: action };
        case `${types.DELETE_EMPLOYEE}_SUCCESS`:
            return { ...state, delete: action };
        case `${types.DELETE_EMPLOYEE}_FAIL`:
            return { ...state, delete: action };
        case `${types.CHECK_EXIST_USERNAME}_SUCCESS`:
            return { ...state, existUsername: action };
        case `${types.CHECK_EXIST_USERNAME}_FAIL`:
            return { ...state, existUsername: action };
        case `${types.CHECK_EXIST_EMPLOYEE_CODE}_SUCCESS`:
            return { ...state, existEmployeeCode: action };
        case `${types.CHECK_EXIST_EMPLOYEE_CODE}_FAIL`:
            return { ...state, existEmployeeCode: action };
        default:
            return state;
    }
}
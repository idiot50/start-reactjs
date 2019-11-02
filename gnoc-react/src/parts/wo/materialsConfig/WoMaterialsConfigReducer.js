import initialState from '../../../stores/initialState';
import * as types from './WoMaterialsConfigTypes';

export default function woMaterialsConfigReducers(state = initialState.woMaterialsConfig, action) {
    switch (action.type) {
        case `${types.WO_MATERIALSCONFIG_SEARCH}_SUCCESS`:
            return { ...state, dataTable: action };
        case `${types.WO_MATERIALSCONFIG_SEARCH}_FAIL`:
            return { ...state, dataTable: action };
        case `${types.WO_MATERIALSCONFIG_GET_DETAIL}_SUCCESS`:
            return { ...state, detail: action };
        case `${types.WO_MATERIALSCONFIG_GET_DETAIL}_FAIL`:
            return { ...state, detail: action };
        case `${types.WO_MATERIALSCONFIG_ADD}_SUCCESS`:
            return { ...state, add: action };
        case `${types.WO_MATERIALSCONFIG_ADD}_FAIL`:
            return { ...state, add: action };
        case `${types.WO_MATERIALSCONFIG_EDIT}_SUCCESS`:
            return { ...state, edit: action };
        case `${types.WO_MATERIALSCONFIG_EDIT}_FAIL`:
            return { ...state, edit: action };
        case `${types.WO_MATERIALSCONFIG_DELETE}_SUCCESS`:
            return { ...state, delete: action };
        case `${types.WO_MATERIALSCONFIG_DELETE}_FAIL`:
            return { ...state, delete: action };
        case `${types.WO_MATERIALSCONFIG_GETSERVICE_BYINFRATYPE}_SUCCESS`:
            return { ...state, serviceList: action };
        case `${types.WO_MATERIALSCONFIG_GETSERVICE_BYINFRATYPE}_FAIL`:
            return { ...state, serviceList: action };
        case `${types.WO_MATERIALSCONFIG_GET_ACTIONLIST}_SUCCESS`:
            return { ...state, actionList: action };
        case `${types.WO_MATERIALSCONFIG_GET_ACTIONLIST}_FAIL`:
            return { ...state, actionList: action };
        case `${types.WO_MATERIALSCONFIG_EXPORT}_SUCCESS`:
            return { ...state, export: action };
        case `${types.WO_MATERIALSCONFIG_EXPORT}_FAIL`:
            return { ...state, export: action };
        default:
            return state;
    }
}
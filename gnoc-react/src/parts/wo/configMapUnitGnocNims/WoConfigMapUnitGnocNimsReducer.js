import initialState from '../../../stores/initialState';
import * as types from './WoConfigMapUnitGnocNimsTypes';

export default function woConfigMapUnitGnocNimsReducers(state = initialState.woConfigMapUnitGnocNims, action) {
    switch (action.type) {
        case `${types.WO_CONFIGMAPUNITGNOCNIMS_SEARCH}_SUCCESS`:
            return { ...state, dataTable: action };
        case `${types.WO_CONFIGMAPUNITGNOCNIMS_SEARCH}_FAIL`:
            return { ...state, dataTable: action };
        case `${types.WO_CONFIGMAPUNITGNOCNIMS_GET_DETAIL}_SUCCESS`:
            return { ...state, detail: action };
        case `${types.WO_CONFIGMAPUNITGNOCNIMS_GET_DETAIL}_FAIL`:
            return { ...state, detail: action };
        case `${types.WO_CONFIGMAPUNITGNOCNIMS_ADD}_SUCCESS`:
            return { ...state, add: action };
        case `${types.WO_CONFIGMAPUNITGNOCNIMS_ADD}_FAIL`:
            return { ...state, add: action };
        case `${types.WO_CONFIGMAPUNITGNOCNIMS_EDIT}_SUCCESS`:
            return { ...state, edit: action };
        case `${types.WO_CONFIGMAPUNITGNOCNIMS_EDIT}_FAIL`:
            return { ...state, edit: action };
        case `${types.WO_CONFIGMAPUNITGNOCNIMS_DELETE}_SUCCESS`:
            return { ...state, delete: action };
        case `${types.WO_CONFIGMAPUNITGNOCNIMS_DELETE}_FAIL`:
            return { ...state, delete: action };
        case `${types.WO_CONFIGMAPUNITGNOCNIMS_GET_BUSINESS_NAME}_SUCCESS`:
            return { ...state, businessName: action };
        case `${types.WO_CONFIGMAPUNITGNOCNIMS_GET_BUSINESS_NAME}_FAIL`:
            return { ...state, businessName: action };
        default:
            return state;
    }
}
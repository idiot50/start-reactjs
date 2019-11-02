import initialState from '../../../stores/initialState';
import * as types from './WoUpdateServiceInfraTypes';

export default function woUpdateServiceInfraReducers(state = initialState.woUpdateServiceInfra, action) {
    switch (action.type) {
        case `${types.WO_UPDATESERVICEINFRA_SEARCH}_SUCCESS`:
            return { ...state, dataTable: action };
        case `${types.WO_UPDATESERVICEINFRA_SEARCH}_FAIL`:
            return { ...state, dataTable: action };
        case `${types.WO_UPDATESERVICEINFRA_GET_DETAIL}_SUCCESS`:
            return { ...state, detail: action };
        case `${types.WO_UPDATESERVICEINFRA_GET_DETAIL}_FAIL`:
            return { ...state, detail: action };
        case `${types.WO_UPDATESERVICEINFRA_ADD}_SUCCESS`:
            return { ...state, add: action };
        case `${types.WO_UPDATESERVICEINFRA_ADD}_FAIL`:
            return { ...state, add: action };
        case `${types.WO_UPDATESERVICEINFRA_EDIT}_SUCCESS`:
            return { ...state, edit: action };
        case `${types.WO_UPDATESERVICEINFRA_EDIT}_FAIL`:
            return { ...state, edit: action };
        case `${types.WO_UPDATESERVICEINFRA_GET_SERVICE}_SUCCESS`:
            return { ...state, serviceList: action };
        case `${types.WO_UPDATESERVICEINFRA_GET_SERVICE}_FAIL`:
            return { ...state, serviceList: action };
        case `${types.WO_UPDATESERVICEINFRA_GET_ITEM_TECH}_SUCCESS`:
            return { ...state, itemTech: action };
        case `${types.WO_UPDATESERVICEINFRA_GET_ITEM_TECH}_FAIL`:
            return { ...state, itemTech: action };
        default:
            return state;
    }
}
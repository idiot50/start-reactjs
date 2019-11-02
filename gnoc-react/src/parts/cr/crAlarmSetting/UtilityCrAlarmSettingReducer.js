import initialState from '../../../stores/initialState';
import * as types from './UtilityCrAlarmSettingTypes';

export default function utilityCrAlarmSettingReducers(state = initialState.utilityCrAlarmSetting, action) {
    switch (action.type) {
        case `${types.UTILITY_CRALARMSETTING_SEARCH}_SUCCESS`:
            return { ...state, dataTable: action };
        case `${types.UTILITY_CRALARMSETTING_SEARCH}_FAIL`:
            return { ...state, dataTable: action };
        case `${types.UTILITY_CRALARMSETTING_GET_DETAIL}_SUCCESS`:
            return { ...state, detail: action };
        case `${types.UTILITY_CRALARMSETTING_GET_DETAIL}_FAIL`:
            return { ...state, detail: action };
        case `${types.UTILITY_CRALARMSETTING_GET_DETAIL_BY_CAS_ID}_SUCCESS`:
            return { ...state, detailByCasId: action };
        case `${types.UTILITY_CRALARMSETTING_GET_DETAIL_BY_CAS_ID}_FAIL`:
            return { ...state, detailByCasId: action };
        case `${types.UTILITY_CRALARMSETTING_UPDATE}_SUCCESS`:
            return { ...state, add: action };
        case `${types.UTILITY_CRALARMSETTING_UPDATE}_FAIL`:
            return { ...state, add: action };
        case `${types.UTILITY_CRALARMSETTING_EDIT}_SUCCESS`:
            return { ...state, edit: action };
        case `${types.UTILITY_CRALARMSETTING_EDIT}_FAIL`:
            return { ...state, edit: action };
        case `${types.UTILITY_CRALARMSETTING_DELETE}_SUCCESS`:
            return { ...state, delete: action };
        case `${types.UTILITY_CRALARMSETTING_DELETE}_FAIL`:
            return { ...state, delete: action };
        case `${types.UTILITY_CRALARMSETTING_GETLIST_ALARM}_SUCCESS`:
            return { ...state, alarm: action };
        case `${types.UTILITY_CRALARMSETTING_GETLIST_ALARM}_FAIL`:
            return { ...state, alarm: action };
        case `${types.UTILITY_CRALARMSETTING_GETLIST_CRPROCESS}_SUCCESS`:
            return { ...state, crProcess: action };
        case `${types.UTILITY_CRALARMSETTING_GETLIST_CRPROCESS}_FAIL`:
            return { ...state, crProcess: action };
        case `${types.UTILITY_CRALARMSETTING_GETLIST_DEVICETYPE}_SUCCESS`:
            return { ...state, deviceType: action };
        case `${types.UTILITY_CRALARMSETTING_GETLIST_DEVICETYPE}_FAIL`:
            return { ...state, deviceType: action };
        case `${types.UTILITY_CRALARMSETTING_GETLIST_IMPACTSEGMENT}_SUCCESS`:
            return { ...state, impactSegment: action };
        case `${types.UTILITY_CRALARMSETTING_GETLIST_IMPACTSEGMENT}_FAIL`:
            return { ...state, impactSegment: action };
        case `${types.UTILITY_CRALARMSETTING_GETLIST_VENDOR}_SUCCESS`:
            return { ...state, impactSegment: action };
        case `${types.UTILITY_CRALARMSETTING_GETLIST_VENDOR}_FAIL`:
            return { ...state, impactSegment: action };
        case `${types.UTILITY_CRALARMSETTING_GETLIST_MODULE}_SUCCESS`:
            return { ...state, impactSegment: action };
        case `${types.UTILITY_CRALARMSETTING_GETLIST_MODULE}_FAIL`:
            return { ...state, impactSegment: action };
        case `${types.UTILITY_CRALARMSETTING_GETLIST_COUNTRY}_SUCCESS`:
            return { ...state, countryList: action };
        case `${types.UTILITY_CRALARMSETTING_GETLIST_COUNTRY}_FAIL`:
            return { ...state, countryList: action };
        case `${types.UTILITY_CRALARMSETTING_GETLIST_FAULT}_SUCCESS`:
            return { ...state, faultList: action };
        case `${types.UTILITY_CRALARMSETTING_GETLIST_FAULT}_FAIL`:
            return { ...state, faultList: action };
        case `${types.UTILITY_CRALARMSETTING_GETLIST_GROUPFAULT}_SUCCESS`:
            return { ...state, groupFaultList: action };
        case `${types.UTILITY_CRALARMSETTING_GETLIST_GROUPFAULT}_FAIL`:
            return { ...state, groupFaultList: action };
        case `${types.UTILITY_CRALARMSETTING_GETLIST_NATION}_SUCCESS`:
            return { ...state, nationList: action };
        case `${types.UTILITY_CRALARMSETTING_GETLIST_NATION}_FAIL`:
            return { ...state, nationList: action };
        case `${types.UTILITY_CRALARMSETTING_UPDATEVENDORORMODULE}_SUCCESS`:
            return { ...state, updateVendorOrModule: action };
        case `${types.UTILITY_CRALARMSETTING_UPDATEVENDORORMODULE}_FAIL`:
            return { ...state, updateVendorOrModule: action };
        case `${types.UTILITY_CRALARMSETTING_CHECKROLE}_SUCCESS`:
            return { ...state, role: action };
        case `${types.UTILITY_CRALARMSETTING_CHECKROLE}_FAIL`:
            return { ...state, role: action };
        default:
            return state;
    }
}
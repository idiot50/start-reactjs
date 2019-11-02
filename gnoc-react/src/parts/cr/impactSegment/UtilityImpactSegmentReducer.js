import initialState from '../../../stores/initialState';
import * as types from './UtilityImpactSegmentTypes';

export default function utilityImpactSegmentReducers(state = initialState.utilityImpactSegment, action) {
    switch (action.type) {
        case `${types.UTILITY_IMPACTSEGMENT_SEARCH}_SUCCESS`:
            return { ...state, dataTable: action };
        case `${types.UTILITY_IMPACTSEGMENT_SEARCH}_FAIL`:
            return { ...state, dataTable: action };
        case `${types.UTILITY_IMPACTSEGMENT_GET_DETAIL}_SUCCESS`:
            return { ...state, detail: action };
        case `${types.UTILITY_IMPACTSEGMENT_GET_DETAIL}_FAIL`:
            return { ...state, detail: action };
        case `${types.UTILITY_IMPACTSEGMENT_ADD}_SUCCESS`:
            return { ...state, add: action };
        case `${types.UTILITY_IMPACTSEGMENT_ADD}_FAIL`:
            return { ...state, add: action };
        case `${types.UTILITY_IMPACTSEGMENT_EDIT}_SUCCESS`:
            return { ...state, edit: action };
        case `${types.UTILITY_IMPACTSEGMENT_EDIT}_FAIL`:
            return { ...state, edit: action };
        case `${types.UTILITY_IMPACTSEGMENT_DELETE}_SUCCESS`:
            return { ...state, delete: action };
        case `${types.UTILITY_IMPACTSEGMENT_DELETE}_FAIL`:
            return { ...state, delete: action };
        case `${types.UTILITY_IMPACTSEGMENT_EXPORT}_SUCCESS`:
            return { ...state, export: action };
        case `${types.UTILITY_IMPACTSEGMENT_EXPORT}_FAIL`:
            return { ...state, export: action };
        default:
            return state;
    }
}
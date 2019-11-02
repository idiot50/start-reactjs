import * as types from '../actions/dashboardTypes';
import initialState from '../stores/initialState';

export default function dashboardReducer(state = initialState.dashboard, action) {
    switch (action.type) {
        case `${types.ON_GET_COORDS}_SUCCESS`:
            return { ...state, coords: action };
        case `${types.ON_GET_COORDS}_FAIL`:
            return { ...state, coords: action };
        case `${types.ON_SAVE_COORDS}_SUCCESS`:
            return { ...state, saveCoords: action };
        case `${types.ON_SAVE_COORDS}_FAIL`:
            return { ...state, saveCoords: action };
        default:
            return state;
    }
}
import * as types from './UtilityStatusConfigTypes';

export function searchUtilityStatusConfig(data) {
  return {
    type: types.UTILITY_STATUSCONFIG_SEARCH,
    payload: {
      client: 'stream',
      request: {
        method: 'POST',
        url: '/TransitionStateConfig/getListTransitionStateConfigDTO',
        data: data
      }
    }
  };
}

export function getDetailUtilityStatusConfig(utilityStatusConfigId) {
  return {
    type: types.UTILITY_STATUSCONFIG_GET_DETAIL,
    payload: {
      client: 'stream',
      request: {
        method: 'POST',
        url: '/TransitionStateConfig/findTransitionStateConfigById?id=' + utilityStatusConfigId
      }
    }
  };
}

export function addUtilityStatusConfig(data) {
  return {
    type: types.UTILITY_STATUSCONFIG_ADD,
    payload: {
      client: 'stream',
      request: {
        method: 'POST',
        url: '/TransitionStateConfig/insertTransitionStateConfig',
        data: data
      }
    }
  };
}

export function editUtilityStatusConfig(data) {
  return {
    type: types.UTILITY_STATUSCONFIG_EDIT,
    payload: {
      client: 'stream',
      request: {
        method: 'POST',
        url: '/TransitionStateConfig/updateTransitionStateConfig',
        data: data
      }
    }
  };
}

export function deleteUtilityStatusConfig(utilityStatusConfigId) {
  return {
    type: types.UTILITY_STATUSCONFIG_DELETE,
    payload: {
      client: 'stream',
      request: {
        method: 'GET',
        url: '/TransitionStateConfig/deleteTransitionStateConfig?id=' + utilityStatusConfigId
      }
    }
  };
}

export function getListState(process) {
  return {
    type: types.UTILITY_STATUSCONFIG_GET_STATE,
    payload: {
      client: 'stream',
      request: {
        method: 'POST',
        url: '/TransitionStateConfig/getListState?process=' + process
      }
    }
  }
}

export function getListProcess() {
  return {
    type: types.UTILITY_STATUSCONFIG_GET_PROCESS,
    payload: {
      client: 'stream',
      request: {
        method: 'POST',
        url: '/TransitionStateConfig/getListProcess',
      }
    }
  }
}

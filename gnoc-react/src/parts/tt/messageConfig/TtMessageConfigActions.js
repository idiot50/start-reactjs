import * as types from './TtMessageConfigTypes';

export function searchTtMessageConfig(data) {
  return {
    type: types.TT_MESSAGECONFIG_SEARCH,
    payload: {
      client: 'stream',
      request: {
        method: 'POST',
        url: '/TTCfgSmsGoingOverdueService/getListCfgSmsGoingOverdueDTO',
        data: data
      }
    }
  };
}

export function getDetailTtMessageConfig(ttMessageConfigId) {
  return {
    type: types.TT_MESSAGECONFIG_GET_DETAIL,
    payload: {
      client: 'stream',
      request: {
        method: 'POST',
        url: '/TTCfgSmsGoingOverdueService/findCfgSmsGoingOverdueById?id=' + ttMessageConfigId
      }
    }
  };

}

export function addTtMessageConfig(data) {
  return {
    type: types.TT_MESSAGECONFIG_ADD,
    payload: {
      client: 'stream',
      request: {
        method: 'POST',
        url: '/TTCfgSmsGoingOverdueService/insertCfgSmsGoingOverdue',
        data: data
      }
    }
  };
}

export function editTtMessageConfig(data) {
  return {
    type: types.TT_MESSAGECONFIG_EDIT,
    payload: {
      client: 'stream',
      request: {
        method: 'POST',
        url: '/TTCfgSmsGoingOverdueService/updateCfgSmsGoingOverdue2',
        data: data
      }
    }
  };
}

export function deleteTtMessageConfig(ttMessageConfigId) {
  return {
    type: types.TT_MESSAGECONFIG_DELETE,
    payload: {
      client: 'stream',
      request: {
        method: 'POST',
        url: '/TTCfgSmsGoingOverdueService/deleteCfgSmsGoingOverdue?id=' + ttMessageConfigId,
        data: ttMessageConfigId
      }
    }
  };
}

export function getListCfgSmsUser(ttMessageConfig) {
  return {
    type: types.TT_MESSAGECONFIG_GETSMSUSER,
    payload: {
      client: 'stream',
      request: {
        method: 'POST',
        url: '/TTCfgSmsGoingOverdueService/getListCfgSmsUser',
        data: ttMessageConfig
      }
    }
  }
}

export function getMaxLevelIDByUnitID(id){
  return {
    type: types.TT_MESSAGECONFIG_GETMAXLEVELID,
    payload:{
      client: 'stream',
      request:{
        method:'POST',
        url:'/TTCfgSmsGoingOverdueService/getMaxLevelIDByUnitID',
        data: id
      }
    }
  }
}
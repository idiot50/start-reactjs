import * as types from './TtInfoConfigTypes';

export function searchTtInfoConfig(data) {
  return {
    type: types.TT_INFOCONFIG_SEARCH,
    payload: {
      client: 'stream',
      request:{
        method: 'POST',
        url:'/CfgInfoTtSpm/getListCfgInfoTtSpmDTO2',
        data: data
      }
    }
  };
}

export function getDetailTtInfoConfig(id) {
  return {
    type: types.TT_INFOCONFIG_GET_DETAIL,
    payload: {
      client: 'stream',
      request:{
        method: 'POST',
        url:'/CfgInfoTtSpm/findCfgInfoTtSpmById?id=' + id
      }
    }
  };
}

export function addTtInfoConfig(data) {
  return {
    type: types.TT_INFOCONFIG_ADD,
    payload: {
      client: 'stream',
      request:{
        method: 'POST',
        url:'/CfgInfoTtSpm/insertCfgInfoTtSpm',
        data: data
      }
    }
  };
}

export function editTtInfoConfig(data) {
  return {
    type: types.TT_INFOCONFIG_EDIT,
    payload: {
      client: 'stream',
      request:{
        method: 'POST',
        url:'/CfgInfoTtSpm/updateCfgInfoTtSpm',
        data: data
      }
    }
  };
}

export function deleteTtInfoConfig(ttInfoConfigId) {
  return {
    type: types.TT_INFOCONFIG_DELETE,
    payload: {
      client: 'stream',
      request:{
        method: 'POST',
        url:'/CfgInfoTtSpm/deleteCfgInfoTtSpm?id=' + ttInfoConfigId
      }
    }
  };
}
export function getListAlarmGroup(typeId) {
  return {
    type: types.TT_INFOCONFIG_GETLISTALARMGROUP,
    payload: {
      client: 'stream',
      request:{
        method: 'GET',
        url:'/MapFlowTemplates/getListItemByCategoryAndParent?parentItemId=' + typeId
      }
    }
  };
}

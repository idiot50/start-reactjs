import * as types from './TtConfigReceiveUnitTypes';

export function searchTtConfigReceiveUnit(data) {
  return {
    type: types.TT_CONFIGRECEIVEUNIT_SEARCH,
    payload: {
      client: 'stream',
      request:{
        method: 'POST',
        url:'/CfgUnitTtSpm/getListCfgUnitTtSpmSearchDTO',
        data: data
      }
    }
  };
}

export function getDetailTtConfigReceiveUnit(ttConfigReceiveUnitId) {
  return {
    type: types.TT_CONFIGRECEIVEUNIT_GET_DETAIL,
    payload: {
      client: 'stream',
      request:{
        method: 'GET',
        url:'/CfgUnitTtSpm/findCfgUnitTtSpmById?cfgUnitTtSpmId=' + ttConfigReceiveUnitId
      }
    }
  };
}

export function addTtConfigReceiveUnit(data) {
  return {
    type: types.TT_CONFIGRECEIVEUNIT_ADD,
    payload: {
      client: 'stream',
      request:{
        method: 'POST',
        url:'/CfgUnitTtSpm/insertCfgUnitTtSpm',
        data: data
      }
    }
  };
}

export function editTtConfigReceiveUnit(data) {
  return {
    type: types.TT_CONFIGRECEIVEUNIT_EDIT,
    payload: {
      client: 'stream',
      request:{
        method: 'POST',
        url:'/CfgUnitTtSpm/updateCfgUnitTtSpm',
        data: data
      }
    }
  };
}

export function deleteTtConfigReceiveUnit(ttConfigReceiveUnitId) {
  return {
    type: types.TT_CONFIGRECEIVEUNIT_DELETE,
    payload: {
      client: 'stream',
      request:{
        method: 'GET',
        url:'/CfgUnitTtSpm/deleteCfgUnitTtSpm?cfgUnitTtSpmId=' + ttConfigReceiveUnitId
      }
    }
  };
}

export function getListCatItem() {
  return {
    type: types.TT_GET_LIST_CAT_ITEM,
    payload: {
      client: 'stream',
      request:{
        method: 'POST',
        url:'/CfgUnitTtSpm/getListCatItem'
      }
    }
  };
}
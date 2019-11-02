import * as types from './TtConfigTimeTypes';

export function searchTtConfigTime(data) {
  return {
    type: types.TT_CONFIGTIME_SEARCH,
    payload: {
      client: 'tt_cat',
      request:{
        method: 'POST',
        url:'/CfgTimeTroubleProcess/getListCfgTimeTroubleProcessDTO',
        data: data
      }
    }
  };
}

export function getDetailTtConfigTime(ttConfigTimeId) {
  return {
    type: types.TT_CONFIGTIME_GET_DETAIL,
    payload: {
      client: 'tt_cat',
      request:{
        method: 'POST',
        url:'/CfgTimeTroubleProcess/findCfgTimeTroubleProcessById?id=' + ttConfigTimeId
      }
    }
  };
}

export function addTtConfigTime(data) {
  return {
    type: types.TT_CONFIGTIME_ADD,
    payload: {
      client: 'tt_cat',
      request:{
        method: 'POST',
        url:'/CfgTimeTroubleProcess/insertCfgTimeTroubleProcess',
        data: data
      }
    }
  };
}

export function editTtConfigTime(data) {
  return {
    type: types.TT_CONFIGTIME_EDIT,
    payload: {
      client: 'tt_cat',
      request:{
        method: 'POST',
        url:'/CfgTimeTroubleProcess/updateCfgTimeTroubleProcess',
        data: data
      }
    }
  };
}

export function deleteTtConfigTime(ttConfigTimeId) {
  return {
    type: types.TT_CONFIGTIME_DELETE,
    payload: {
      client: 'tt_cat',
      request:{
        method: 'GET',
        url:'/CfgTimeTroubleProcess/deleteCfgTimeTroubleProcess?id=' + ttConfigTimeId
      }
    }
  };
}

export function getListSubCategory(typeId) {
  return {
    type: types.TT_GETLIST_SUBCATEGORY,
    payload: {
      client: 'tt_cat',
      request:{
        method: 'POST',
        url:'/CfgTimeTroubleProcess/getListSubCategory?typeId=' + typeId
      }
    }
  };
}
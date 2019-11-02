import * as types from './WoConfigMapUnitGnocNimsTypes';

export function searchWoConfigMapUnitGnocNims(data) {
  return {
    type: types.WO_CONFIGMAPUNITGNOCNIMS_SEARCH,
    payload: {
      client: 'wo_cat',
      request:{
        method: 'POST',
        url:'/cfgMapUnitGnocNims/getListCfgMapUnitGnocNims',
        data: data
      }
    }
  };
}

export function getDetailWoConfigMapUnitGnocNims(id) {
  return {
    type: types.WO_CONFIGMAPUNITGNOCNIMS_GET_DETAIL,
    payload: {
      client: 'wo_cat',
      request:{
        method: 'GET',
        url:'/cfgMapUnitGnocNims/getDetailById?id=' + id
      }
    }
  };
}

export function addWoConfigMapUnitGnocNims(data) {
  return {
    type: types.WO_CONFIGMAPUNITGNOCNIMS_ADD,
    payload: {
      client: 'wo_cat',
      request:{
        method: 'POST',
        url:'/cfgMapUnitGnocNims/insert',
        data: data
      }
    }
  };
}

export function editWoConfigMapUnitGnocNims(data) {
  return {
    type: types.WO_CONFIGMAPUNITGNOCNIMS_EDIT,
    payload: {
      client: 'wo_cat',
      request:{
        method: 'POST',
        url:'/cfgMapUnitGnocNims/update',
        data: data
      }
    }
  };
}

export function deleteWoConfigMapUnitGnocNims(id) {
  return {
    type: types.WO_CONFIGMAPUNITGNOCNIMS_DELETE,
    payload: {
      client: 'wo_cat',
      request:{
        method: 'GET',
        url:'/cfgMapUnitGnocNims/delete?id=' + id
      }
    }
  };
}

export function getListBusinessName(categoryCode,itemCode) {
  return {
    type: types.WO_CONFIGMAPUNITGNOCNIMS_GET_BUSINESS_NAME,
    payload: {
      client: 'wo_cat',
      request:{
        method: 'POST',
        url:'/cfgMapUnitGnocNims/getItemBusinessName?categoryCode=' +categoryCode
      }
    }
  };
}
import * as types from './WoMapProvinceCdGroupTypes';

export function searchWoMapProvinceCdGroup(data) {
  return {
    type: types.WO_MAPPROVINCECDGROUP_SEARCH,
    payload: {
      client: 'wo_cat',
      request:{
        method: 'POST',
        url:'/mapProvinceCd/getListDTOSearchWeb',
        data: data
      }
    }
  };
}

export function getDetailWoMapProvinceCdGroup(woMapProvinceCdGroupId) {
  return {
    type: types.WO_MAPPROVINCECDGROUP_GET_DETAIL,
    payload: {
      client: 'wo_cat',
      request:{
        method: 'GET',
        url:'/mapProvinceCd/getDetail?id=' + woMapProvinceCdGroupId
      }
    }
  };
}

export function addWoMapProvinceCdGroup(data) {
  return {
    type: types.WO_MAPPROVINCECDGROUP_ADD,
    payload: {
      client: 'wo_cat',
      request:{
        method: 'POST',
        url:'/mapProvinceCd/add',
        data: data
      }
    }
  };
}

export function editWoMapProvinceCdGroup(data) {
  return {
    type: types.WO_MAPPROVINCECDGROUP_EDIT,
    payload: {
      client: 'wo_cat',
      request:{
        method: 'POST',
        url:'/mapProvinceCd/edit',
        data: data
      }
    }
  };
}

export function deleteWoMapProvinceCdGroup(woMapProvinceCdGroupId) {
  return {
    type: types.WO_MAPPROVINCECDGROUP_DELETE,
    payload: {
      client: 'wo_cat',
      request:{
        method: 'GET',
        url:'/mapProvinceCd/deleteMapProvinceCd?id=' + woMapProvinceCdGroupId
      }
    }
  };
}

export function getListLocationProvince() {
  return {
    type: types.WO_MAPPROVINCECDGROUP_GETLIST_PROVINCE,
    payload: {
      client: 'stream',
      request:{
        method: 'POST',
        url:'/CatLocationService/getListLocationProvince'
      }
    }
  };
}
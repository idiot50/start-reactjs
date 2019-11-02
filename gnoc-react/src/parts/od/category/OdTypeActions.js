import * as types from './OdTypeTypes';

export function searchOdType(data) {
  return {
    type: types.OD_TYPE_SEARCH,
    payload: {
      client: 'od_cat',
      request:{
        method: 'POST',
        url:'/odType/getListOdType',
        data: data
      }
    }
  };
}

export function getDetailOdType(odTypeId) {
  return {
    type: types.OD_TYPE_GET_DETAIL,
    payload: {
      client: 'od_cat',
      request:{
        method: 'GET',
        url:'/odType/getDetail?odTypeId=' + odTypeId
      }
    }
  };
}

export function addOdType(data) {
  return {
    type: types.OD_TYPE_ADD,
    payload: {
      client: 'od_cat',
      request:{
        method: 'POST',
        url:'/odType/add',
        data: data
      }
    }
  };
}

export function editOdType(data) {
  return {
    type: types.OD_TYPE_EDIT,
    payload: {
      client: 'od_cat',
      request:{
        method: 'POST',
        url:'/odType/edit',
        data: data
      }
    }
  };
}

export function deleteOdType(odTypeId) {
  return {
    type: types.OD_TYPE_DELETE,
    payload: {
      client: 'od_cat',
      request:{
        method: 'GET',
        url:'/odType/delete?odTypeId=' + odTypeId
      }
    }
  };
}
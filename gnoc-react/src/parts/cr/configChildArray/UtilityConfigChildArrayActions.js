import * as types from './UtilityConfigChildArrayTypes';

export function searchUtilityConfigChildArray(data) {
  return {
    type: types.UTILITY_CONFIGCHILDARRAY_SEARCH,
    payload: {
      client: 'cr_cat',
      request:{
        method: 'POST',
        url:'/CfgChildArray/getListCfgChildArray',
        data: data
      }
    }
  };
}

export function getDetailUtilityConfigChildArray(CfgChildArrayId) {
  return {
    type: types.UTILITY_CONFIGCHILDARRAY_GET_DETAIL,
    payload: {
      client: 'cr_cat',
      request:{
        method: 'GET',
        url:'/CfgChildArray/getDetail?childrenId=' + CfgChildArrayId
      }
    }
  };
}

export function addUtilityConfigChildArray(data) {
  return {
    type: types.UTILITY_CONFIGCHILDARRAY_ADD,
    payload: {
      client: 'cr_cat',
      request:{
        method: 'POST',
        url:'/CfgChildArray/add',
        data: data
      }
    }
  };
}

export function editUtilityConfigChildArray(data) {
  return {
    type: types.UTILITY_CONFIGCHILDARRAY_EDIT,
    payload: {
      client: 'cr_cat',
      request:{
        method: 'PUT',
        url:'/CfgChildArray/update',
        data: data
      }
    }
  };
}

export function deleteUtilityConfigChildArray(CfgChildArrayId) {
  return {
    type: types.UTILITY_CONFIGCHILDARRAY_DELETE,
    payload: {
      client: 'cr_cat',
      request:{
        method: 'DELETE',
        url:'/CfgChildArray/delete?childrenId=' + CfgChildArrayId
      }
    }
  };
}

export function getListImpactSegmentCBB() {
  return {
    type: types.UTILITY_CONFIGCHILDARRAY_GETLIST_IMPACTSEGMENT,
    payload: {
      client: 'cr_cat',
      request:{
        method: 'GET',
        url:'/CfgChildArray/getListImpactSegmentCBB',
      }
    }
  };
}
import * as types from './UtilityCrActionCodeTypes';

export function searchUtilityCrActionCode(data) {
  return {
    type: types.UTILITY_CRACTIONCODE_SEARCH,
    payload: {
      client: 'cr_cat',
      request:{
        method: 'POST',
        url:'/CfgCrActionCodeController/getListCfgCrActionCode',
        data: data
      }
    }
  };
}

export function getDetailUtilityCrActionCode(crActionCodeId) {
  return {
    type: types.UTILITY_CRACTIONCODE_GET_DETAIL,
    payload: {
      client: 'cr_cat',
      request:{
        method: 'POST',
        url:'/CfgCrActionCodeController/findCfgCrActionCodeById?id=' + crActionCodeId
      }
    }
  };
}

export function addUtilityCrActionCode(data) {
  return {
    type: types.UTILITY_CRACTIONCODE_ADD,
    payload: {
      client: 'cr_cat',
      request:{
        method: 'POST',
        url:'/CfgCrActionCodeController/insertCfgCrActionCode',
        data: data
      }
    }
  };
}

export function editUtilityCrActionCode(data) {
  return {
    type: types.UTILITY_CRACTIONCODE_EDIT,
    payload: {
      client: 'cr_cat',
      request:{
        method: 'POST',
        url:'/CfgCrActionCodeController/updateCfgCrActionCode',
        data: data
      }
    }
  };
}

export function deleteUtilityCrActionCode(crActionCodeId) {
  return {
    type: types.UTILITY_CRACTIONCODE_DELETE,
    payload: {
      client: 'cr_cat',
      request:{
        method: 'POST',
        url:'/CfgCrActionCodeController/deleteCfgCrActionCodeById?id=' + crActionCodeId
      }
    }
  };
}
import * as types from './UtilityCrImpactFrameTypes';

export function searchUtilityCrImpactFrame(data) {
  return {
    type: types.UTILITY_CRIMPACTFRAME_SEARCH,
    payload: {
      client: 'cr_cat',
      request:{
        method: 'POST',
        url:'/CfgCrImpactFrameController/getListCrImpactFrame',
        data: data
      }
    }
  };
}

export function getDetailUtilityCrImpactFrame(impactFrameId) {
  return {
    type: types.UTILITY_CRIMPACTFRAME_GET_DETAIL,
    payload: {
      client: 'cr_cat',
      request:{
        method: 'POST',
        url:'/CfgCrImpactFrameController/findCrImpactFrameById?id=' + impactFrameId
      }
    }
  };
}

export function addUtilityCrImpactFrame(data) {
  return {
    type: types.UTILITY_CRIMPACTFRAME_ADD,
    payload: {
      client: 'cr_cat',
      request:{
        method: 'POST',
        url:'/CfgCrImpactFrameController/insertCrImpactFrame',
        data: data
      }
    }
  };
}

export function editUtilityCrImpactFrame(data) {
  return {
    type: types.UTILITY_CRIMPACTFRAME_EDIT,
    payload: {
      client: 'cr_cat',
      request:{
        method: 'POST',
        url:'/CfgCrImpactFrameController/updateCrImpactFrame',
        data: data
      }
    }
  };
}

export function deleteUtilityCrImpactFrame(impactFrameId) {
  return {
    type: types.UTILITY_CRIMPACTFRAME_DELETE,
    payload: {
      client: 'cr_cat',
      request:{
        method: 'POST',
        url:'/CfgCrImpactFrameController/deleteCrImpactFrameById?id=' + impactFrameId
      }
    }
  };
}
import * as types from './UtilityCrCabUsersTypes';

export function searchUtilityCrCabUsers(data) {
  return {
    type: types.UTILITY_CRCABUSERS_SEARCH,
    payload: {
      client: 'cr_cat',
      request:{
        method: 'POST',
        url:'/CrCabUsersController/getAllInfoCrCABUsers',
        data: data
      }
    }
  };
}

export function getDetailUtilityCrCabUsers(CrCabUsersControllerId) {
  return {
    type: types.UTILITY_CRCABUSERS_GET_DETAIL,
    payload: {
      client: 'cr_cat',
      request:{
        method: 'GET',
        url:'/CrCabUsersController/findById?id=' + CrCabUsersControllerId
      }
    }
  };
}

export function addUtilityCrCabUsers(data) {
  return {
    type: types.UTILITY_CRCABUSERS_ADD,
    payload: {
      client: 'cr_cat',
      request:{
        method: 'POST',
        url:'/CrCabUsersController/insertCrCabUsers',
        data: data
      }
    }
  };
}

export function editUtilityCrCabUsers(data) {
  return {
    type: types.UTILITY_CRCABUSERS_EDIT,
    payload: {
      client: 'cr_cat',
      request:{
        method: 'POST',
        url:'/CrCabUsersController/updateCrCabUsers',
        data: data
      }
    }
  };
}

export function deleteUtilityCrCabUsers(CrCabUsersControllerId) {
  return {
    type: types.UTILITY_CRCABUSERS_DELETE,
    payload: {
      client: 'cr_cat',
      request:{
        method: 'GET',
        url:'/CrCabUsersController/deleteCrCabUsers?id=' + CrCabUsersControllerId
      }
    }
  };
}
export function getAllUserInUnitCrCABUsers(CrCabUsersControllerId) {
  return {
    type: types.UTILITY_CRCABUSERS_GET_ALL_USER,
    payload: {
      client: 'cr_cat',
      request:{
        method: 'GET',
        url:'/CrCabUsersController/getAllUserInUnitCrCABUsers?id=' + CrCabUsersControllerId
      }
    }
  };
}
export function getListImpactSegmentCBB() {
  return {
    type: types.UTILITY_CRCABUSERS_LIST_IMPACT,
    payload: {
      client: 'cr_cat',
      request:{
        method: 'POST',
        url:'/CrCabUsersController/getListImpactSegmentCBB',
      }
    }
  };
}
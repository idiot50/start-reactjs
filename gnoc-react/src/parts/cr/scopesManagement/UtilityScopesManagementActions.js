import * as types from './UtilityScopesManagementTypes';

export function searchUtilityScopesManagement(data) {
  return {
    type: types.UTILITY_SCOPESMANAGEMENT_SEARCH,
    payload: {
      client: 'cr_cat',
      request:{
        method: 'POST',
        url:'/CrManagerScopeController/getListCrManagerScopeSearch',
        data: data
      }
    }
  };
}

export function getDetailUtilityScopesManagement(CrManagerScopeControllerId) {
  return {
    type: types.UTILITY_SCOPESMANAGEMENT_GET_DETAIL,
    payload: {
      client: 'cr_cat',
      request:{
        method: 'GET',
        url:'/CrManagerScopeController/findCrManagerScopeDTOById?id=' + CrManagerScopeControllerId
      }
    }
  };
}

export function addUtilityScopesManagement(data) {
  return {
    type: types.UTILITY_SCOPESMANAGEMENT_ADD,
    payload: {
      client: 'cr_cat',
      request:{
        method: 'POST',
        url:'/CrManagerScopeController/insertCrManagerScope',
        data: data
      }
    }
  };
}

export function editUtilityScopesManagement(data) {
  return {
    type: types.UTILITY_SCOPESMANAGEMENT_EDIT,
    payload: {
      client: 'cr_cat',
      request:{
        method: 'POST',
        url:'/CrManagerScopeController/updateCrManagerScope',
        data: data
      }
    }
  };
}

export function deleteUtilityScopesManagement(CrManagerScopeControllerId) {
  return {
    type: types.UTILITY_SCOPESMANAGEMENT_DELETE,
    payload: {
      client: 'cr_cat',
      request:{
        method: 'GET',
        url:'/CrManagerScopeController/deleteCrManagerScope?id=' + CrManagerScopeControllerId
      }
    }
  };
}
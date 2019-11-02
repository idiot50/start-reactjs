import * as types from './UtilityRolesManagementTypes';

export function searchUtilityRolesManagement(data) {
  return {
    type: types.UTILITY_ROLESMANAGEMENT_SEARCH,
    payload: {
      client: 'cr_cat',
      request:{
        method: 'POST',
        url:'/CrRoles/getListCrRoles',
        data: data
      }
    }
  };
}

export function getDetailUtilityRolesManagement(utilityRolesManagementId) {
  return {
    type: types.UTILITY_ROLESMANAGEMENT_GET_DETAIL,
    payload: {
      client: 'cr_cat',
      request:{
        method: 'GET',
        url:'/CrRoles/getDetail?cmreId=' + utilityRolesManagementId
      }
    }
  };
}

export function addUtilityRolesManagement(data) {
  return {
    type: types.UTILITY_ROLESMANAGEMENT_ADD,
    payload: {
      client: 'cr_cat',
      request:{
        method: 'POST',
        url:'/CrRoles/addCrRoles',
        data: data
      }
    }
  };
}

export function editUtilityRolesManagement(data) {
  return {
    type: types.UTILITY_ROLESMANAGEMENT_EDIT,
    payload: {
      client: 'cr_cat',
      request:{
        method: 'PUT',
        url:'/CrRoles/updateCrRoles',
        data: data
      }
    }
  };
}

export function deleteUtilityRolesManagement(utilityRolesManagementId) {
  return {
    type: types.UTILITY_ROLESMANAGEMENT_DELETE,
    payload: {
      client: 'cr_cat',
      request:{
        method: 'DELETE',
        url:'/CrRoles/deleteCrRoles?cmreId=' + utilityRolesManagementId
      }
    }
  };
}
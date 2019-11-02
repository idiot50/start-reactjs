import * as types from './UtilityRolesScopeManagementTypes';
import FileSaver from 'file-saver';

export function searchUtilityRolesScopeManagement(data) {
  return {
    type: types.UTILITY_ROLESSCOPEMANAGEMENT_SEARCH,
    payload: {
      client: 'cr_cat',
      request: {
        method: 'POST',
        url: '/CrManagerScopesOfRoles/getListCrManagerScopesOfRoles',
        data: data
      }
    }
  };
}

export function getDetailUtilityRolesScopeManagement(utilityRolesScopeManagementId) {
  return {
    type: types.UTILITY_ROLESSCOPEMANAGEMENT_GET_DETAIL,
    payload: {
      client: 'cr_cat',
      request: {
        method: 'GET',
        url: '/CrManagerScopesOfRoles/getDetail?cmsorsId=' + utilityRolesScopeManagementId
      }
    }
  };
}

export function addUtilityRolesScopeManagement(data) {
  return {
    type: types.UTILITY_ROLESSCOPEMANAGEMENT_ADD,
    payload: {
      client: 'cr_cat',
      request: {
        method: 'POST',
        url: '/CrManagerScopesOfRoles/addCrManagerScopesOfRoles',
        data: data
      }
    }
  };
}

export function editUtilityRolesScopeManagement(data) {
  return {
    type: types.UTILITY_ROLESSCOPEMANAGEMENT_EDIT,
    payload: {
      client: 'cr_cat',
      request: {
        method: 'PUT',
        url: '/CrManagerScopesOfRoles/updateCrManagerScopesOfRoles',
        data: data
      }
    }
  };
}

export function deleteUtilityRolesScopeManagement(utilityRolesScopeManagementId) {
  return {
    type: types.UTILITY_ROLESSCOPEMANAGEMENT_DELETE,
    payload: {
      client: 'cr_cat',
      request: {
        method: 'DELETE',
        url: '/CrManagerScopesOfRoles/deleteCrManagerScopesOfRoles?cmsorsId=' + utilityRolesScopeManagementId
      }
    }
  };
}

export function getListManagerScopeCBB() {
  return {
    type: types.UTILITY_ROLESSCOPEMANAGEMENT_GETLIST_SCOPE,
    payload: {
      client: 'cr_cat',
      request: {
        method: 'GET',
        url: '/CrManagerScopesOfRoles/getListManagerScopeCBB'
      }
    }
  }
}

export function getListCrManagerRolesCBB() {
  return {
    type: types.UTILITY_ROLESSCOPEMANAGEMENT_GETLIST_ROLES,
    payload: {
      client: 'cr_cat',
      request: {
        method: 'GET',
        url: '/CrManagerScopesOfRoles/getListCrManagerRolesCBB'
      }
    }
  }
}

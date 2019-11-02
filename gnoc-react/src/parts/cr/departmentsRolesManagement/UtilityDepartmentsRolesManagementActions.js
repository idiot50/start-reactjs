import * as types from './UtilityDepartmentsRolesManagementTypes';

export function searchUtilityDepartmentsRolesManagement(data) {
  return {
    type: types.UTILITY_DEPARTMENTSROLESMANAGEMENT_SEARCH,
    payload: {
      client: 'cr_cat',
      request:{
        method: 'POST',
        url:'/CrRolesDeptController/getListRoleDept',
        data: data
      }
    }
  };
}

export function getDetailUtilityDepartmentsRolesManagement(CrRolesControllerId) {
  return {
    type: types.UTILITY_DEPARTMENTSROLESMANAGEMENT_GET_DETAIL,
    payload: {
      client: 'cr_cat',
      request:{
        method: 'GET',
        url:'/CrRolesDeptController/findCrRoleDeptEntityById?id=' + CrRolesControllerId
      }
    }
  };
}

export function addUtilityDepartmentsRolesManagement(data) {
  return {
    type: types.UTILITY_DEPARTMENTSROLESMANAGEMENT_ADD,
    payload: {
      client: 'cr_cat',
      request:{
        method: 'POST',
        url:'/CrRolesDeptController/insertRoleDept',
        data: data
      }
    }
  };
}

export function editUtilityDepartmentsRolesManagement(data) {
  return {
    type: types.UTILITY_DEPARTMENTSROLESMANAGEMENT_EDIT,
    payload: {
      client: 'cr_cat',
      request:{
        method: 'POST',
        url:'/CrRolesDeptController/updateRoleDept',
        data: data
      }
    }
  };
}

export function deleteUtilityDepartmentsRolesManagement(CrRolesControllerId) {
  return {
    type: types.UTILITY_DEPARTMENTSROLESMANAGEMENT_DELETE,
    payload: {
      client: 'cr_cat',
      request:{
        method: 'GET',
        url:'/CrRolesDeptController/deleteRoleDept?id=' + CrRolesControllerId
      }
    }
  };
}
export function getListCrName(data) {
  return {
    type: types.UTILITY_DEPARTMENTSROLESMANAGEMENT_GETLISTCRNAME,
    payload: {
      client: 'cr_cat',
      request:{
        method: 'POST',
        url:'/CrRolesDeptController/getListCrRolesDTO',
        data: data
      }
    }
  };
}
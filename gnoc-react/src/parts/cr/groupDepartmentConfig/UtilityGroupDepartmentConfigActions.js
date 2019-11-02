import * as types from './UtilityGroupDepartmentConfigTypes';

export function searchUtilityGroupDepartmentConfig(data) {
  return {
    type: types.UTILITY_GROUPDEPARTMENTCONFIG_SEARCH,
    payload: {
      client: 'cr_cat',
      request:{
        method: 'POST',
        url:'/GroupUnitDetailController/getListUnitOfGroup',
        data: data
      }
    }
  };
}

export function getDetailUtilityGroupDepartmentConfig(GroupUnitDetailControllerId) {
  return {
    type: types.UTILITY_GROUPDEPARTMENTCONFIG_GET_DETAIL,
    payload: {
      client: 'cr_cat',
      request:{
        method: 'GET',
        url:'/GroupUnitDetailController/findeGroupUnitDetailById?Id=' + GroupUnitDetailControllerId
      }
    }
  };
}

export function addUtilityGroupDepartmentConfig(data) {
  return {
    type: types.UTILITY_GROUPDEPARTMENTCONFIG_ADD,
    payload: {
      client: 'cr_cat',
      request:{
        method: 'POST',
        url:'/GroupUnitDetailController/insertGroupUnitDetail',
        data: data
      }
    }
  };
}

export function editUtilityGroupDepartmentConfig(data) {
  return {
    type: types.UTILITY_GROUPDEPARTMENTCONFIG_EDIT,
    payload: {
      client: 'cr_cat',
      request:{
        method: 'POST',
        url:'/GroupUnitDetailController/updateGroupUnitDetail',
        data: data
      }
    }
  };
}

export function deleteUtilityGroupDepartmentConfig(GroupUnitDetailControllerId) {
  return {
    type: types.UTILITY_GROUPDEPARTMENTCONFIG_DELETE,
    payload: {
      client: 'cr_cat',
      request:{
        method: 'GET',
        url:'/GroupUnitDetailController/deleteGroupUnitDetail?id=' + GroupUnitDetailControllerId
      }
    }
  };
}
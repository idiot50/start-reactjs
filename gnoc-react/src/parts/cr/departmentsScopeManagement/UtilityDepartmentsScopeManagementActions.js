import * as types from './UtilityDepartmentsScopeManagementTypes';
import FileSaver from 'file-saver';

export function searchUtilityDepartmentsScopeManagement(data) {
  return {
    type: types.UTILITY_DEPARTMENTSSCOPEMANAGEMENT_SEARCH,
    payload: {
      client: 'cr_cat',
      request: {
        method: 'POST',
        url: '/CrManagerUnitsOfScope/getListCrManagerUnitsOfScope',
        data: data
      }
    }
  };
}

export function getDetailUtilityDepartmentsScopeManagement(utilityDepartmentsScopeManagementId) {
  return {
    type: types.UTILITY_DEPARTMENTSSCOPEMANAGEMENT_GET_DETAIL,
    payload: {
      client: 'cr_cat',
      request: {
        method: 'GET',
        url: '/CrManagerUnitsOfScope/getDeatil?cmnoseId=' + utilityDepartmentsScopeManagementId
      }
    }
  };
}

export function addUtilityDepartmentsScopeManagement(data) {
  return {
    type: types.UTILITY_DEPARTMENTSSCOPEMANAGEMENT_ADD,
    payload: {
      client: 'cr_cat',
      request: {
        method: 'POST',
        url: '/CrManagerUnitsOfScope/addCrManagerUnitsOfScope',
        data: data
      }
    }
  };
}

export function editUtilityDepartmentsScopeManagement(data) {
  return {
    type: types.UTILITY_DEPARTMENTSSCOPEMANAGEMENT_EDIT,
    payload: {
      client: 'cr_cat',
      request: {
        method: 'PUT',
        url: '/CrManagerUnitsOfScope/updateCrManagerUnitsOfScope',
        data: data
      }
    }
  };
}

export function deleteUtilityDepartmentsScopeManagement(utilityDepartmentsScopeManagementId) {
  return {
    type: types.UTILITY_DEPARTMENTSSCOPEMANAGEMENT_DELETE,
    payload: {
      client: 'cr_cat',
      request: {
        method: 'DELETE',
        url: '/CrManagerUnitsOfScope/deleteCrManagerUnitsOfScope?cmnoseId=' + utilityDepartmentsScopeManagementId
      }
    }
  };
}

export function getListManagerScopeCBB() {
  return {
    type: types.UTILITY_DEPARTMENTSSCOPEMANAGEMENT_GETLIST_SCOPE,
    payload: {
      client: 'cr_cat',
      request: {
        method: 'GET',
        url: '/CrManagerUnitsOfScope/getListManagerScopeCBB'
      }
    }
  }
}

export function getListImpactSegmentCBB(){
  return {
    type: types.UTILITY_DEPARTMENTSSCOPEMANAGEMENT_GETLIST_SEGMENT,
    payload: {
      client : 'cr_cat',
      request:{
        method: 'GET',
        url:'/CrManagerUnitsOfScope/getListImpactSegmentCBB'
      }
    }
  }
}

export function getListDeviceTypeByImpactSegmentCBB(impactSegmentId){
  return {
    type: types.UTILITY_DEPARTMENTSSCOPEMANAGEMENT_GETLIST_DEVICE_BYIMPACTSEGMENT,
    payload:{
      client : 'cr_cat',
      request:{
        method:'GET',
        url:'/CrManagerUnitsOfScope/getListDeviceTypeByImpactSegmentCBB?impactSegmentId='+impactSegmentId
      }
    }
  }
}

export function getDeviceTypesCBB(){
  return {
    type: types.UTILITY_DEPARTMENTSSCOPEMANAGEMENT_GETLIST_DEVICETYPES,
    payload:{
      client:'cr_cat',
      request:{
        method:'GET',
        url:"/CrManagerUnitsOfScope/getDeviceTypesCBB"
      }
    }
  }
}

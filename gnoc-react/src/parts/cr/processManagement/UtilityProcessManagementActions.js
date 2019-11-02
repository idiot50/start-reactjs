import * as types from './UtilityProcessManagementTypes';

export function searchUtilityProcessManagement(data) {
  return {
    type: types.UTILITY_PROCESSMANAGEMENT_SEARCH,
    payload: {
      client: 'cr_cat',
      request:{
        method: 'POST',
        url:'/CrManagerProcess/getListSearchCrProcess',
        data: data
      }
    }
  };
}

export function getCrProcessDetail(crProcessId) {
  return {
    type: types.UTILITY_PROCESSMANAGEMENT_GET_DETAIL,
    payload: {
      client: 'cr_cat',
      request:{
        method: 'GET',
        url:'/CrManagerProcess/getCrProcessDetail?crProcessId=' + crProcessId
      }
    }
  };
}

export function getCrProcessById(crProcessId) {
  return {
    type: types.UTILITY_PROCESSMANAGEMENT_GET_DETAIL_BY_ID,
    payload: {
      client: 'cr_cat',
      request:{
        method: 'GET',
        url:'/CrManagerProcess/getCrProcessById?crProcessId=' + crProcessId
      }
    }
  };
}

export function generateCrProcessCode(data) {
  return {
    type: types.UTILITY_PROCESSMANAGEMENT_GENERATE_PROCESS_CODE,
    payload: {
      client: 'cr_cat',
      request:{
        method: 'POST',
        url:'/CrManagerProcess/generateCrProcessCode',
        data: data
      }
    }
  };
}

export function getDetailCrProcessWO(crProcessWoId) {
  return {
    type: types.UTILITY_PROCESSMANAGEMENT_GET_DETAIL_WO,
    payload: {
      client: 'cr_cat',
      request:{
        method: 'GET',
        url:'/CrManagerProcess/getCrProcessWoDTO?crProcessWoId=' + crProcessWoId
      }
    }
  };
}
export function getListFile(data){
  return {
    type: types.UTILITY_PROCESSMANAGEMENT_GET_LIST_FILE,
    payload: {
      client: 'cr_cat',
      request:{
        method: 'POST',
        url:'/CrManagerProcess/getLstFileTemplate',
        data:data
      }
    }
  };
}

export function getListGroupUnit(data){
  return {
    type: types.UTILITY_PROCESSMANAGEMENT_GET_LIST_UNIT,
    payload: {
      client: 'cr_cat',
      request:{
        method: 'POST',
        url:'/GroupUnitController/getListGroupUnitDTO',
        data:data
      }
    }
  };
}

export function getLstWoFromProcessId(crProcessId){
  return {
    type: types.UTILITY_PROCESSMANAGEMENT_GET_LIST_WO,
    payload: {
      client: 'cr_cat',
      request:{
        method: 'GET',
        url:'/CrManagerProcess/getLstWoFromProcessId?crProcessId='+ crProcessId
      }
    }
  };
}
export function getListWoType(){
  return {
    type: types.UTILITY_PROCESSMANAGEMENT_GET_LIST_WO_TYPE,
    payload: {
      client: 'cr_cat',
      request:{
        method: 'GET',
        url:'/CrManagerProcess/getListWoType?'
      }
    }
  };
}

export function addUtilityProcessManagement(data) {
  return {
    type: types.UTILITY_PROCESSMANAGEMENT_ADD,
    payload: {
      client: 'cr_cat',
      request:{
        method: 'POST',
        url:'/CrManagerProcess/insertOrUpdateCrProcessDTO',
        data: data
      }
    }
  };
}

export function editUtilityProcessManagement(data) {
  return {
    type: types.UTILITY_PROCESSMANAGEMENT_EDIT,
    payload: {
      client: 'cr_cat',
      request:{
        method: 'POST',
        url:'/CrManagerProcess/saveAllList',
        data: data
      }
    }
  };
}

export function deleteUtilityProcessManagement(utilityProcessManagementId) {
  return {
    type: types.UTILITY_PROCESSMANAGEMENT_DELETE,
    payload: {
      client: 'cr_cat',
      request:{
        method: 'DELETE',
        url:'/CrManagerProcess/deleteCrProcess?lstCrProcessId=' + utilityProcessManagementId
      }
    }
  };
}


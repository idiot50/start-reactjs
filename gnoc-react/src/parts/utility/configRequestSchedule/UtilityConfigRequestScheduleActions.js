import * as types from './UtilityConfigRequestScheduleTypes';

export function searchUtilityConfigRequestSchedule(data) {
  return {
    type: types.UTILITY_CONFIGREQUESTSCHEDULE_SEARCH,
    payload: {
      client: 'stream',
      request:{
        method: 'POST',
        url:'/CfgRequestScheduleController/getListRequestSchedule',
        data: data
      }
    }
  };
}

export function getDetailUtilityConfigRequestSchedule(idSchedule) {
  return {
    type: types.UTILITY_CONFIGREQUESTSCHEDULE_GET_DETAIL,
    payload: {
      client: 'stream',
      request:{
        method: 'POST',
        url:'/CfgRequestScheduleController/findRequestScheduleById?id=' + idSchedule
      }
    }
  };
}

export function addUtilityConfigRequestSchedule(data) {
  return {
    type: types.UTILITY_CONFIGREQUESTSCHEDULE_ADD,
    payload: {
      client: 'stream',
      request:{
        method: 'POST',
        url:'/CfgRequestScheduleController/onSave',
        data: data
      }
    }
  };
}

export function editUtilityConfigRequestSchedule(data) {
  return {
    type: types.UTILITY_CONFIGREQUESTSCHEDULE_EDIT,
    payload: {
      client: 'stream',
      request:{
        method: 'POST',
        url:'/CfgRequestScheduleController/onSave',
        data: data
      }
    }
  };
}

export function deleteUtilityConfigRequestSchedule(utilityConfigRequestScheduleId) {
  return {
    type: types.UTILITY_CONFIGREQUESTSCHEDULE_DELETE,
    payload: {
      client: 'stream',
      request:{
        method: 'GET',
        url:'/CfgRequestScheduleController/deleteRequestSchedule?id=' + utilityConfigRequestScheduleId
      }
    }
  };
}

export function getListYear(data) {
  return {
    type: types.UTILITY_CONFIGREQUESTSCHEDULE_GET_YEAR,
    payload: {
      client: 'stream',
      request:{
        method: 'POST',
        url:'/CfgRequestScheduleController/getListYear',
        data:data
      }
    }
  };
}
export function getListEmployee(data){
  return {
    type: types.UTILITY_CONFIGREQUESTSCHEDULE_GET_EMPLOYEE,
    payload: {
      client: 'stream',
      request:{
        method: 'POST',
        url:'/CfgRequestScheduleController/getListEmployee',
        data:data
      }
    }
  };
}

export function getListUnit(data){
  return {
    type: types.UTILITY_CONFIGREQUESTSCHEDULE_GET_UNIT,
    payload: {
      client: 'stream',
      request:{
        method: 'POST',
        url:'/CfgRequestScheduleController/getListUnit',
        data:data
      }
    }
  };
}

export function getCRBefore(data){
  return {
    type: types.UTILITY_CONFIGREQUESTSCHEDULE_GET_CR_BEFORE,
    payload: {
      client: 'stream',
      request:{
        method: 'POST',
        url:'/CfgRequestScheduleController/getCrBefore',
        data:data
      }
    }
  };
}

export function searchCRAfter(data){
  return {
    type: types.UTILITY_CONFIGREQUESTSCHEDULE_GET_CR_AFTER,
    payload: {
      client: 'stream',
      request:{
        method: 'POST',
        url:'/CfgRequestScheduleController/searchCRAfter2',
        data:data
      }
    }
  };
}

export function searchCRAfterFail(data){
  return {
    type: types.UTILITY_CONFIGREQUESTSCHEDULE_GET_CR_AFTER_FAIL,
    payload: {
      client: 'stream',
      request:{
        method: 'POST',
        url:'/CfgRequestScheduleController/searchCRAfter2Fail',
        data:data
      }
    }
  };
}
export function cancelSchedule(data) {
  return {
    type: types.UTILITY_CONFIGREQUESTSCHEDULE_CANCEL,
    payload: {
      client: 'stream',
      request:{
        method: 'POST',
        url:'/CfgRequestScheduleController/cancelStatus',
        data: data
      }
    }
  };
}
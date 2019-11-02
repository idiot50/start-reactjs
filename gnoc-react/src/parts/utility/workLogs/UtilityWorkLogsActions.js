import * as types from './UtilityWorkLogsTypes';

export function searchUtilityWorkLogs(data) {
  return {
    type: types.UTILITY_WORKLOGS_SEARCH,
    payload: {
      client: 'cr_cat',
      request:{
        method: 'POST',
        url:'/CfgWorkLogCategoryController/getListWorkLogCategory',
        data: data
      }
    }
  };
}

export function getDetailUtilityWorkLogs(wlayId) {
  return {
    type: types.UTILITY_WORKLOGS_GET_DETAIL,
    payload: {
      client: 'cr_cat',
      request:{
        method: 'POST',
        url:'/CfgWorkLogCategoryController/findWorkLogCategoryById?id=' + wlayId
      }
    }
  };
}

export function getListWorkLogType() {
  return {
    type: types.UTILITY_WORKLOGS_GET_DETAIL,
    payload: {
      client: 'cr_cat',
      request:{
        method: 'POST',
        url:'/CfgWorkLogCategoryController/getListWorklogType'
      }
    }
  };
}

export function addUtilityWorkLogs(data) {
  return {
    type: types.UTILITY_WORKLOGS_ADD,
    payload: {
      client: 'cr_cat',
      request:{
        method: 'POST',
        url:'/CfgWorkLogCategoryController/insertWorkLogCategory',
        data: data
      }
    }
  };
}

export function editUtilityWorkLogs(data) {
  return {
    type: types.UTILITY_WORKLOGS_EDIT,
    payload: {
      client: 'cr_cat',
      request:{
        method: 'POST',
        url:'/CfgWorkLogCategoryController/updateWorkLogCategory',
        data: data
      }
    }
  };
}

export function deleteUtilityWorkLogs(wlayId) {
  return {
    type: types.UTILITY_WORKLOGS_DELETE,
    payload: {
      client: 'cr_cat',
      request:{
        method: 'POST',
        url:'/CfgWorkLogCategoryController/deleteWorkLogCategoryById?id=' + wlayId
      }
    }
  };
}

export function getListReturnCategory(data) {
  return {
    type: types.UTILITY_WORKLOGS_GET_WORKLOG_TYPE,
    payload: {
      client: 'cr_cat',
      request:{
        method: 'POST',
        url:'/CfgWorkLogCategoryController/getListReturnCategory',
        data:data
      }
    }
  };
}
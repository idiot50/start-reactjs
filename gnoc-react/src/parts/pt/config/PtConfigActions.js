import * as types from './PtConfigTypes';

export function searchPtConfig(data) {
  return {
    type: types.PT_CONFIG_SEARCH,
    payload: {
      client: 'pt_cat',
      request:{
        method: 'POST',
        url:'/CfgProblemTimeProcess/onSearch',
        data: data
      }
    }
  };
}

export function getDetailPtConfig(ptConfigId) {
  return {
    type: types.PT_CONFIG_GET_DETAIL,
    payload: {
      client: 'pt_cat',
      request:{
        method: 'GET',
        url:'/CfgProblemTimeProcess/getCfgProblemTimeProcess?id=' + ptConfigId,
      }
    }
  };
}

export function addPtConfig(data) {
  return {
    type: types.PT_CONFIG_ADD,
    payload: {
      client: 'pt_cat',
      request:{
        method: 'POST',
        url:'/CfgProblemTimeProcess/onInsert',
        data: data
      }
    }
  };
}

export function editPtConfig(data) {
  return {
    type: types.PT_CONFIG_EDIT,
    payload: {
      client: 'pt_cat',
      request:{
        method: 'POST',
        url:'/CfgProblemTimeProcess/onUpdateList',
        data: data
      }
    }
  };
}

export function deletePtConfig(listId) {
  return {
    type: types.PT_CONFIG_DELETE,
    payload: {
      client: 'pt_cat',
      request:{
        method: 'POST',
        url:'/CfgProblemTimeProcess/onDeleteList',
        data: listId
      }
    }
  };
}

export function getCfgProblemTimeProcess(data) {
  return {
    type: types.PT_CONFIG_GET_TIME,
    payload: {
      client: 'pt_cat',
      request:{
        method: 'POST',
        url:'/CfgProblemTimeProcess/getCfgProblemTimeProcessByDTO',
        data: data
      }
    }
  };
}
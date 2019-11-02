import * as types from './UtilityAffectedLevelTypes';
import FileSaver from 'file-saver';

export function searchUtilityAffectedLevel(data) {
  return {
    type: types.UTILITY_AFFECTEDLEVEL_SEARCH,
    payload: {
      client: 'cr_cat',
      request:{
        method: 'POST',
        url:'/CrAffectedLevel/getListCrAffectedLevel',
        data: data
      }
    }
  };
}

export function getDetailUtilityAffectedLevel(utilityAffectedLevelId) {
  return {
    type: types.UTILITY_AFFECTEDLEVEL_GET_DETAIL,
    payload: {
      client: 'cr_cat',
      request:{
        method: 'GET',
        url:'/CrAffectedLevel/getDetail?affectedLevelId=' + utilityAffectedLevelId
      }
    }
  };
}

export function addUtilityAffectedLevel(data) {
  return {
    type: types.UTILITY_AFFECTEDLEVEL_ADD,
    payload: {
      client: 'cr_cat',
      request:{
        method: 'POST',
        url:'/CrAffectedLevel/addCrAffectedLevel',
        data: data
      }
    }
  };
}

export function editUtilityAffectedLevel(data) {
  return {
    type: types.UTILITY_AFFECTEDLEVEL_EDIT,
    payload: {
      client: 'cr_cat',
      request:{
        method: 'PUT',
        url:'/CrAffectedLevel/updateCrAffectedLevel',
        data: data
      }
    }
  };
}

export function deleteUtilityAffectedLevel(utilityAffectedLevelId) {
  return {
    type: types.UTILITY_AFFECTEDLEVEL_DELETE,
    payload: {
      client: 'cr_cat',
      request:{
        method: 'DELETE',
        url:'/CrAffectedLevel/deleteCrAffectedLevel?affectedLevelId=' + utilityAffectedLevelId
      }
    }
  };
}

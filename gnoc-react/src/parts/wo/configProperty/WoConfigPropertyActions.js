import * as types from './WoConfigPropertyTypes';

export function searchWoConfigProperty(data) {
  return {
    type: types.WO_CONFIGPROPERTY_SEARCH,
    payload: {
      client: 'wo_cat',
      request:{
        method: 'POST',
        url:'/WoConfigProperty/getListWoConfigProperty',
        data: data
      }
    }
  };
}

export function getDetailWoConfigProperty(woConfigPropertyId) {
  return {
    type: types.WO_CONFIGPROPERTY_GET_DETAIL,
    payload: {
      client: 'wo_cat',
      request:{
        method: 'GET',
        url:'/WoConfigProperty/getDetail?Key=' + woConfigPropertyId
      }
    }
  };
}

export function addWoConfigProperty(data) {
  return {
    type: types.WO_CONFIGPROPERTY_ADD,
    payload: {
      client: 'wo_cat',
      request:{
        method: 'POST',
        url:'/WoConfigProperty/addConfigProperty',
        data: data
      }
    }
  };
}

export function editWoConfigProperty(data) {
  return {
    type: types.WO_CONFIGPROPERTY_EDIT,
    payload: {
      client: 'wo_cat',
      request:{
        method: 'PUT',
        url:'/WoConfigProperty/updateConfigProperty',
        data: data
      }
    }
  };
}

export function deleteWoConfigProperty(woConfigPropertyId) {
  return {
    type: types.WO_CONFIGPROPERTY_DELETE,
    payload: {
      client: 'wo_cat',
      request:{
        method: 'DELETE',
        url:'/WoConfigProperty/delete?Key=' + woConfigPropertyId
      }
    }
  };
}
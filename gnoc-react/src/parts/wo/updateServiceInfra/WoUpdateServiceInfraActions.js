import * as types from './WoUpdateServiceInfraTypes';

export function searchWoUpdateServiceInfra(data) {
  return {
    type: types.WO_UPDATESERVICEINFRA_SEARCH,
    payload: {
      client: 'wo_cat',
      request:{
        method: 'POST',
        url:'/woUpdateServiceInfra/getListWoUpdateServiceInfra',
        data: data
      }
    }
  };
}

export function getDetailWoUpdateServiceInfra(woUpdateServiceInfraId) {
  return {
    type: types.WO_UPDATESERVICEINFRA_GET_DETAIL,
    payload: {
      client: 'wo_cat',
      request:{
        method: 'GET',
        url:'/woUpdateServiceInfra/getDetail?woUpdateServiceInfraId=' + woUpdateServiceInfraId
      }
    }
  };
}

export function addWoUpdateServiceInfra(data) {
  return {
    type: types.WO_UPDATESERVICEINFRA_ADD,
    payload: {
      client: 'wo_cat',
      request:{
        method: 'POST',
        url:'/woUpdateServiceInfra/add',
        data: data
      }
    }
  };
}

export function editWoUpdateServiceInfra(data) {
  return {
    type: types.WO_UPDATESERVICEINFRA_EDIT,
    payload: {
      client: 'wo_cat',
      request:{
        method: 'POST',
        url:'/woUpdateServiceInfra/update',
        data: data
      }
    }
  };
}

export function getListService() {
  return {
    type: types.WO_UPDATESERVICEINFRA_GET_SERVICE,
    payload: {
      client: 'wo_cat',
      request:{
        method: 'GET',
        url:'/woUpdateServiceInfra/getListService'
      }
    }
  };
}

export function getItemTech(categoryCode,itemCode){
  return {
    type: types.WO_UPDATESERVICEINFRA_GET_ITEM_TECH,
    payload: {
      client: 'wo_cat',
      request:{
        method: 'POST',
        url:'/woUpdateServiceInfra/getItemTech?categoryCode=' +categoryCode
      }
    }
  };
}
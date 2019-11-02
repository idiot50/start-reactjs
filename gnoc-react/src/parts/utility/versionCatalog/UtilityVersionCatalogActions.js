import * as types from './UtilityVersionCatalogTypes';

export function searchUtilityVersionCatalog(data) {
  return {
    type: types.UTILITY_VERSIONCATALOG_SEARCH,
    payload: {
      client: 'stream',
      request:{
        method: 'POST',
        url:'/DeviceTypeVersionService/getListDeviceTypeVersionDTO',
        data: data
      }
    }
  };
}

export function getDetailUtilityVersionCatalog(utilityVersionCatalogId) {
  return {
    type: types.UTILITY_VERSIONCATALOG_GET_DETAIL,
    payload: {
      client: 'stream',
      request:{
        method: 'GET',
        url:'/DeviceTypeVersionService/getDetailById?id=' + utilityVersionCatalogId
      }
    }
  };
}

export function addUtilityVersionCatalog(data) {
  return {
    type: types.UTILITY_VERSIONCATALOG_ADD,
    payload: {
      client: 'stream',
      request:{
        method: 'POST',
        url:'/DeviceTypeVersionService/onInsert',
        data: data
      }
    }
  };
}

export function editUtilityVersionCatalog(data) {
  return {
    type: types.UTILITY_VERSIONCATALOG_EDIT,
    payload: {
      client: 'stream',
      request:{
        method: 'POST',
        url:'/DeviceTypeVersionService/onUpdate',
        data: data
      }
    }
  };
}

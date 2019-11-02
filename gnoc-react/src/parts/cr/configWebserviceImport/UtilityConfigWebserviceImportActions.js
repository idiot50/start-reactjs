import * as types from './UtilityConfigWebserviceImportTypes';

export function searchUtilityConfigWebserviceImport(data) {
  return {
    type: types.UTILITY_CONFIGWEBSERVICEIMPORT_SEARCH,
    payload: {
      client: 'cr_cat',
      request:{
        method: 'POST',
        url:'/CfgWebServiceController/getListWebService',
        data: data
      }
    }
  };
}

export function getDetailUtilityConfigWebserviceImport(utilityConfigWebserviceImportId) {
  return {
    type: types.UTILITY_CONFIGWEBSERVICEIMPORT_GET_DETAIL,
    payload: {
      client: 'cr_cat',
      request:{
        method: 'POST',
        url:'/CfgWebServiceController/findWebServiceById?id=' + utilityConfigWebserviceImportId
      }
    }
  };
}

export function addUtilityConfigWebserviceImport(data) {
  return {
    type: types.UTILITY_CONFIGWEBSERVICEIMPORT_ADD,
    payload: {
      client: 'cr_cat',
      request:{
        method: 'POST',
        url:'/CfgWebServiceController/insertWebService',
        data: data
      }
    }
  };
}

export function editUtilityConfigWebserviceImport(data) {
  return {
    type: types.UTILITY_CONFIGWEBSERVICEIMPORT_EDIT,
    payload: {
      client: 'cr_cat',
      request:{
        method: 'POST',
        url:'/CfgWebServiceController/updateWebService',
        data: data
      }
    }
  };
}

export function deleteUtilityConfigWebserviceImport(utilityConfigWebserviceImportId) {
  return {
    type: types.UTILITY_CONFIGWEBSERVICEIMPORT_DELETE,
    payload: {
      client: 'cr_cat',
      request:{
        method: 'POST',
        url:'/CfgWebServiceController/updateWebService?id=' + utilityConfigWebserviceImportId
      }
    }
  };
}
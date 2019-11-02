import * as types from './UtilityConfigTempImportTypes';

export function searchUtilityConfigTempImport(data) {
  return {
    type: types.UTILITY_CONFIGTEMPIMPORT_SEARCH,
    payload: {
      client: 'cr_cat',
      request:{
        method: 'POST',
        url:'/CfgTempImportController/getListTempImport',
        data: data
      }
    }
  };
}

export function getDetailUtilityConfigTempImport(utilityConfigTempImportId) {
  return {
    type: types.UTILITY_CONFIGTEMPIMPORT_GET_DETAIL,
    payload: {
      client: 'cr_cat',
      request:{
        method: 'POST',
        url:'/CfgTempImportController/findTempImportById?id=' + utilityConfigTempImportId
      }
    }
  };
}

export function addUtilityConfigTempImport(files, data) {
  var bodyFormData = new FormData();
  bodyFormData.append('formDataJson', new Blob([JSON.stringify(data)], { type: 'application/json' }));
  for (var i = 0; i < files.length; i++) {
    bodyFormData.append('files', files[i]);
  }
  return {
    type: types.UTILITY_CONFIGTEMPIMPORT_ADD,
    payload: {
      client: 'cr_cat',
      request:{
        method: 'POST',
        url:'/CfgTempImportController/insertTempImport',
        data: bodyFormData,
        config: { headers: { 'Content-Type': 'multipart/form-data' } }
      }
    }
  };
}

export function editUtilityConfigTempImport(files, data) {
  var bodyFormData = new FormData();
  bodyFormData.append('formDataJson', new Blob([JSON.stringify(data)], { type: 'application/json' }));
  for (var i = 0; i < files.length; i++) {
    bodyFormData.append('files', files[i]);
  }
  return {
    type: types.UTILITY_CONFIGTEMPIMPORT_EDIT,
    payload: {
      client: 'cr_cat',
      request:{
        method: 'POST',
        url:'/CfgTempImportController/updateTempImport',
        data: bodyFormData,
        config: { headers: { 'Content-Type': 'multipart/form-data' } }
      }
    }
  };
}

export function deleteUtilityConfigTempImport(utilityConfigTempImportId) {
  return {
    type: types.UTILITY_CONFIGTEMPIMPORT_DELETE,
    payload: {
      client: 'cr_cat',
      request:{
        method: 'POST',
        url:'/CfgTempImportController/deleteTempImportById?id=' + utilityConfigTempImportId
      }
    }
  };
}

export function getMethodPrameter(){
  return {
    type: types.UTILITY_CONFIGTEMPIMPORT_GETLIST_METHODPRAMETER,
    payload:{
      client : 'cr_cat',
      request:{
        method: 'POST',
        url:'/CfgTempImportController/getMethodPrameter',
      }
    }
  }
}

export function getFunctionWebServiceMethod(){
  return{
    type: types.UTILITY_CONFIGTEMPIMPORT_GETLIST_WEBSERVICEMETHOD,
    payload:{
      client : 'cr_cat',
      request:{
        method: 'POST',
        url:'/CfgTempImportController/getFunctionWebServiceMethod',
      }
    }
  }
}
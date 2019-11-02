import * as types from './UtilityLanguageConfigTypes';

export function searchUtilityLanguageConfig(data) {
  return {
    type: types.UTILITY_LANGUAGECONFIG_SEARCH,
    payload: {
      client: 'stream',
      request:{
        method: 'POST',
        url:'/GNOC_LANGUAGEGnocLanguageService/getListGnocLanguage',
        data: data
      }
    }
  };
}

export function getDetailUtilityLanguageConfig(gnocLanguageId) {
 
  return {
    type: types.UTILITY_LANGUAGECONFIG_GET_DETAIL,
    payload: {
      client: 'stream',
      request:{
        method: 'POST',
        url:'/GNOC_LANGUAGEGnocLanguageService/findGnocLanguageId?id=' + gnocLanguageId
      }
    }
  };
}

export function addUtilityLanguageConfig(data) {
  return {
    type: types.UTILITY_LANGUAGECONFIG_ADD,
    payload: {
      client: 'stream',
      request:{
        method: 'POST',
        url:'/GNOC_LANGUAGEGnocLanguageService/insertGnocLanguageDTO',
        data: data
      }
    }
  };
}

export function editUtilityLanguageConfig(data) {
  return {
    type: types.UTILITY_LANGUAGECONFIG_EDIT,
    payload: {
      client: 'stream',
      request:{
        method: 'POST',
        url:'/GNOC_LANGUAGEGnocLanguageService/updateGnocLanguageDTO',
        data: data
      }
    }
  };
}

export function deleteUtilityLanguageConfig(gnocLanguageId) {
  return {
    type: types.UTILITY_LANGUAGECONFIG_DELETE,
    payload: {
      client: 'stream',
      request:{
        method: 'POST',
        url:'/GNOC_LANGUAGEGnocLanguageService/deleteGnocLanguageById?id=' + gnocLanguageId
      }
    }
  };
}
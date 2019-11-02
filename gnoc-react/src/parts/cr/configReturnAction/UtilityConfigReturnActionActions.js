import * as types from './UtilityConfigReturnActionTypes';

export function searchUtilityConfigReturnAction(data) {
  return {
    type: types.UTILITY_CONFIGRETURNACTION_SEARCH,
    payload: {
      client: 'cr_cat',
      request:{
        method: 'POST',
        url:'/CfgReturnCodeCatalogController/getListReturnCodeCatalog',
        data: data
      }
    }
  };
}

export function getDetailUtilityConfigReturnAction(utilityConfigReturnActionId) {
  return {
    type: types.UTILITY_CONFIGRETURNACTION_GET_DETAIL,
    payload: {
      client: 'cr_cat',
      request:{
        method: 'POST',
        url:'/CfgReturnCodeCatalogController/findCfgReturnCodeCatalogById?id=' + utilityConfigReturnActionId
      }
    }
  };
}

// export function getListReturnCategory(utilityConfigReturnActionId) {
//   return {
//     type: types.UTILITY_CONFIGRETURNACTION_GET_LIST_RETURN_CATEGORY,
//     payload: {
//       client: 'cr_cat',
//       request:{
//         method: 'POST',
//         url:'/CfgReturnCodeCatalogController/getListReturnCategory'
//       }
//     }
//   };
// }
export function addUtilityConfigReturnAction(data) {
  return {
    type: types.UTILITY_CONFIGRETURNACTION_ADD,
    payload: {
      client: 'cr_cat',
      request:{
        method: 'POST',
        url:'/CfgReturnCodeCatalogController/insertCfgReturnCodeCatalog',
        data: data
      }
    }
  };
}

export function editUtilityConfigReturnAction(data) {
  return {
    type: types.UTILITY_CONFIGRETURNACTION_EDIT,
    payload: {
      client: 'cr_cat',
      request:{
        method: 'POST',
        url:'/CfgReturnCodeCatalogController/updateCfgReturnCodeCatalog',
        data: data
      }
    }
  };
}

export function deleteUtilityConfigReturnAction(utilityConfigReturnActionId) {
  return {
    type: types.UTILITY_CONFIGRETURNACTION_DELETE,
    payload: {
      client: 'cr_cat',
      request:{
        method: 'POST',
        url:'/CfgReturnCodeCatalogController/deleteCfgReturnCodeCatalogById?id=' + utilityConfigReturnActionId
      }
    }
  };
}

export function getListReturnCategory() {
  return {
    type: types.UTILITY_CONFIGRETURNACTION_GET_RETURN_CATEGORY,
    payload: {
      client: 'cr_cat',
      request:{
        method: 'POST',
        url:'/CfgReturnCodeCatalogController/getListReturnCategory'
      }
    }
  };
}
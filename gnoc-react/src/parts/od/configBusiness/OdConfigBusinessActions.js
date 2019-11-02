import * as types from './OdConfigBusinessTypes';

export function searchOdConfigBusiness(data) {
  return {
    type: types.OD_CONFIG_BUSINESS_SEARCH,
    payload: {
      client: 'od_cat',
      request:{
        method: 'POST',
        url:'/odCfgBusiness/getListOdCfgBusiness',
        data: data
      }
    }
  };
}

export function getDetailOdConfigBusiness(id) {
  return {
    type: types.OD_CONFIG_BUSINESS_GET_DETAIL,
    payload: {
      client: 'od_cat',
      request:{
        method: 'GET',
        url:'/odCfgBusiness/getDetail?Id=' + id
      }
    }
  };
}

export function addOdConfigBusiness(data) {
  return {
    type: types.OD_CONFIG_BUSINESS_ADD,
    payload: {
      client: 'od_cat',
      request:{
        method: 'POST',
        url:'/odCfgBusiness/add',
        data: data
      }
    }
  };
}

export function editOdConfigBusiness(data) {
  return {
    type: types.OD_CONFIG_BUSINESS_EDIT,
    payload: {
      client: 'od_cat',
      request:{
        method: 'POST',
        url:'/odCfgBusiness/edit',
        data: data
      }
    }
  };
}

export function deleteOdConfigBusiness(odConfigBusinessId) {
  return {
    type: types.OD_CONFIG_BUSINESS_DELETE,
    payload: {
      client: 'od_cat',
      request:{
        method: 'GET',
        url:'/odCfgBusiness/delete?Id=' + odConfigBusinessId
      }
    }
  };
}
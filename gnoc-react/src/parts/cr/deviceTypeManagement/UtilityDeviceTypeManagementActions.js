import * as types from './UtilityDeviceTypeManagementTypes';

export function searchUtilityDeviceTypeManagement(data) {
  return {
    type: types.UTILITY_DEVICETYPEMANAGEMENT_SEARCH,
    payload: {
      client: 'cr_cat',
      request:{
        method: 'POST',
        url:'/DeviceTypesController/getLisDeviceTypesSearch',
        data: data
      }
    }
  };
}

export function getDetailUtilityDeviceTypeManagement(DeviceTypesControllerId) {
  return {
    type: types.UTILITY_DEVICETYPEMANAGEMENT_GET_DETAIL,
    payload: {
      client: 'cr_cat',
      request:{
        method: 'GET',
        url:'/DeviceTypesController/findDeviceTypesById?Id=' + DeviceTypesControllerId
      }
    }
  };
}

export function addUtilityDeviceTypeManagement(data) {
  return {
    type: types.UTILITY_DEVICETYPEMANAGEMENT_ADD,
    payload: {
      client: 'cr_cat',
      request:{
        method: 'POST',
        url:'/DeviceTypesController/insertDeviceTypes',
        data: data
      }
    }
  };
}

export function editUtilityDeviceTypeManagement(data) {
  return {
    type: types.UTILITY_DEVICETYPEMANAGEMENT_EDIT,
    payload: {
      client: 'cr_cat',
      request:{
        method: 'POST',
        url:'/DeviceTypesController/updateDeviceTypes',
        data: data
      }
    }
  };
}

export function deleteUtilityDeviceTypeManagement(DeviceTypesControllerId) {
  return {
    type: types.UTILITY_DEVICETYPEMANAGEMENT_DELETE,
    payload: {
      client: 'cr_cat',
      request:{
        method: 'GET',
        url:'/DeviceTypesController/deleteDeviceTypes?Id=' + DeviceTypesControllerId
      }
    }
  };
}
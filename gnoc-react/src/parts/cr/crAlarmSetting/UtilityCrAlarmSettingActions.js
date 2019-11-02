import * as types from './UtilityCrAlarmSettingTypes';

export function searchUtilityCrAlarmSetting(data) {
  return {
    type: types.UTILITY_CRALARMSETTING_SEARCH,
    payload: {
      client: 'cr_cat',
      request:{
        method: 'POST',
        url:'/CrAlarmSetting/getCrAlarmSetting',
        data: data
      }
    }
  };
}

export function getDetailUtilityCrAlarmSetting(data) {
  return {
    type: types.UTILITY_CRALARMSETTING_GET_DETAIL,
    payload: {
      client: 'cr_cat',
      request:{
        method: 'POST',
        url:'/CrAlarmSetting/findAlarmSettingByProcessId',
        data: data
      }
    }
  };
}

export function getDetailUtilityCrAlarmSettingByCasId(data) {
  return {
    type: types.UTILITY_CRALARMSETTING_GET_DETAIL_BY_CAS_ID,
    payload: {
      client: 'cr_cat',
      request:{
        method: 'POST',
        url:'/CrAlarmSetting/findAlarmSettingById',
        data: data
      }
    }
  };
}

export function updateUtilityCrAlarmSetting(data) {
  return {
    type: types.UTILITY_CRALARMSETTING_UPDATE,
    payload: {
      client: 'cr_cat',
      request:{
        method: 'PUT',
        url:'/CrAlarmSetting/updateAlarmSetting',
        data: data
      }
    }
  };
}

export function editUtilityCrAlarmSetting(data) {
  return {
    type: types.UTILITY_CRALARMSETTING_EDIT,
    payload: {
      client: 'cr_cat',
      request:{
        method: 'POST',
        url:'/CrAlarmSetting/saveOrUpdateAlarmSetting',
        data: data
      }
    }
  };
}


export function updateVendorOrModuleAlarmSetting(data) {
  return {
    type: types.UTILITY_CRALARMSETTING_UPDATEVENDORORMODULE,
    payload: {
      client: 'cr_cat',
      request:{
        method: 'POST',
        url:'/CrAlarmSetting/updateVendorOrModuleAlarmSetting',
        data: data
      }
    }
  };
}

export function deleteUtilityCrAlarmSetting(CrAlarmSettingId) {
  return {
    type: types.UTILITY_CRALARMSETTING_DELETE,
    payload: {
      client: 'cr_cat',
      request:{
        method: 'DELETE',
        url:'/CrAlarmSetting/deleteAlarmSetting?casId=' + CrAlarmSettingId
      }
    }
  };
}

export function getListImpactSegmentCBB() {
  return {
    type: types.UTILITY_CRALARMSETTING_GETLIST_IMPACTSEGMENT,
    payload: {
      client: 'cr_cat',
      request:{
        method: 'GET',
        url:'/CrAlarmSetting/getListImpactSegmentCBB'
      }
    }
  };
}

export function getListDeviceType(impactSegmentId) {
  return {
    type: types.UTILITY_CRALARMSETTING_GETLIST_DEVICETYPE,
    payload: {
      client: 'cr_cat',
      request:{
        method: 'GET',
        url:'/CrAlarmSetting/getListDeviceTypeByImpactSegmentCBB?impactSegmentId=' + impactSegmentId
      }
    }
  };
}

export function getListCrProcessCBB(data) {
  return {
    type: types.UTILITY_CRALARMSETTING_GETLIST_CRPROCESS,
    payload: {
      client: 'cr_cat',
      request:{
        method: 'POST',
        url:'/CrAlarmSetting/getListCrProcessCBB',
        data: data
      }
    }
  };
}

export function getListAlarmSetting(data) {
  return {
    type: types.UTILITY_CRALARMSETTING_GETLIST_ALARM,
    payload: {
      client: 'cr_cat',
      request:{
        method: 'POST',
        url:'/CrAlarmSetting/getAlarmList',
        data: data
      }
    }
  };
}

export function getVendorList(data) {
  return {
    type: types.UTILITY_CRALARMSETTING_GETLIST_VENDOR,
    payload: {
      client: 'cr_cat',
      request:{
        method: 'POST',
        url:'/CrAlarmSetting/getVendorList',
        data: data
      }
    }
  };
}

export function getModuleList(data) {
  return {
    type: types.UTILITY_CRALARMSETTING_GETLIST_MODULE,
    payload: {
      client: 'cr_cat',
      request:{
        method: 'POST',
        url:'/CrAlarmSetting/getModuleList',
        data: data
      }
    }
  };
}

export function getListCountry(categoryCode,itemCode) {
  return {
    type: types.UTILITY_CRALARMSETTING_GETLIST_COUNTRY,
    payload: {
      client: 'cr_cat',
      request:{
        method: 'POST',
        url:`/CrAlarmSetting/getListItemByCategory?categoryCode=${categoryCode}&itemCode=${itemCode}`
      }
    }
  };
}

export function getListFaultSrc(nationCode) {
  return {
    type: types.UTILITY_CRALARMSETTING_GETLIST_COUNTRY,
    payload: {
      client: 'cr_cat',
      request:{
        method: 'GET',
        url:`/CrAlarmSetting/getListFaultSrc?nationCode=${nationCode}`
      }
    }
  };
}

export function getListGroupFaultSrc(faultSrc,nationCode) {
  return {
    type: types.UTILITY_CRALARMSETTING_GETLIST_GROUPFAULT,
    payload: {
      client: 'cr_cat',
      request:{
        method: 'GET',
        url:`/CrAlarmSetting/getListGroupFaultSrc?faultSrc=${faultSrc}&nationCode=${nationCode}`
      }
    }
  };
}

export function getNationMap() {
  return {
    type: types.UTILITY_CRALARMSETTING_GETLIST_NATION,
    payload: {
      client: 'cr_cat',
      request:{
        method: 'GET',
        url:`/CrAlarmSetting/getNationMap`
      }
    }
  };
}

export function checkRole() {
  return {
    type: types.UTILITY_CRALARMSETTING_CHECKROLE,
    payload: {
      client: 'cr_cat',
      request:{
        method: 'GET',
        url:`/CrAlarmSetting/checkRole`
      }
    }
  };
}
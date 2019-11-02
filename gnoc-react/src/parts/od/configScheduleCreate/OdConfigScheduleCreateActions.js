import * as types from './OdConfigScheduleCreateTypes';

export function getOdTypeOdConfigScheduleCreate(data) {
  return {
    type: types.OD_CONFIG_SCHEDULE_CREATE_GET_OD_TYPE,
    payload: {
      client: 'od_cat',
      request:{
        method: 'POST',
        url:'/odType/getListOdType',
        data: data
      }
    }
  };
}

export function searchOdConfigScheduleCreate(data) {
  return {
    type: types.OD_CONFIG_SCHEDULE_CREATE_SEARCH,
    payload: {
      client: 'od_cat',
      request:{
        method: 'POST',
        url:'/OdCfgScheduleCreate/getListOdCfgScheduleCreateDTOSearchWeb',
        data: data
      }
    }
  };
}

export function findOdConfigScheduleCreateById(id) {
  return {
    type: types.OD_CONFIG_SCHEDULE_CREATE_GET_DETAIL,
    payload: {
      client: 'od_cat',
      request:{
        method: 'GET',
        url:'/OdCfgScheduleCreate/findOdCfgScheduleCreateById?id=' + id
      }
    }
  };
}

export function insertOdConfigScheduleCreate(files, data) {
  var bodyFormData = new FormData();
  bodyFormData.append('formDataJson', new Blob([JSON.stringify(data)], {type: 'application/json'}));
  for (var i = 0; i < files.length; i++) {
    bodyFormData.append('files', files[i]);
  }
  return {
    type: types.OD_CONFIG_SCHEDULE_CREATE_ADD,
    payload: {
      client: 'od_cat',
      request:{
        method: 'POST',
        url:'/OdCfgScheduleCreate/insertOdCfgScheduleCreate',
        data: bodyFormData,
        config: { headers: {'Content-Type': 'multipart/form-data' }}
      }
    }
  };
}

export function updateOdConfigScheduleCreate(files, data) {
  var bodyFormData = new FormData();
  bodyFormData.append('formDataJson', new Blob([JSON.stringify(data)], {type: 'application/json'}));
  for (var i = 0; i < files.length; i++) {
    bodyFormData.append('files', files[i]);
  }
  return {
    type: types.OD_CONFIG_SCHEDULE_CREATE_EDIT,
    payload: {
      client: 'od_cat',
      request:{
        method: 'POST',
        url:'/OdCfgScheduleCreate/updateOdCfgScheduleCreate',
        data: bodyFormData,
        config: { headers: {'Content-Type': 'multipart/form-data' }}
      }
    }
  };
}

export function deleteOdConfigScheduleCreate(id) {
  return {
    type: types.OD_CONFIG_SCHEDULE_CREATE_DELETE,
    payload: {
      client: 'od_cat',
      request:{
        method: 'GET',
        url:'/OdCfgScheduleCreate/deleteOdCfgScheduleCreate?id=' + id
      }
    }
  };
}

export function insertFileOdSchedule(files, data) {
  var bodyFormData = new FormData();
  bodyFormData.append('formDataJson', JSON.stringify(data));
  bodyFormData.append('files', files);
  return {
    type: types.OD_CONFIG_SCHEDULE_CREATE_INSERT_FILE,
    payload: {
      client: 'od_cat',
      request:{
        method: 'POST',
        url:'/OdCfgScheduleCreate/insertFileOdSchedule',
        data: bodyFormData,
        config: { headers: {'Content-Type': 'multipart/form-data' }}
      }
    }
  };
}
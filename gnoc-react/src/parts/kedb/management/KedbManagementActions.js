import * as types from './KedbManagementTypes';
import FileSaver from 'file-saver';

export function searchKedbManagement(data) {
  return {
    type: types.KEDB_MANAGEMENT_SEARCH,
    payload: {
      client: 'kedb',
      request:{
        method: 'POST',
        url:'/KedbService/getListKedbDTO',
        data: data
      }
    }
  };
}

export function getDetailKedbManagement(kedbManagementId) {
  return {
    type: types.KEDB_MANAGEMENT_GET_DETAIL,
    payload: {
      client: 'kedb',
      request:{
        method: 'GET',
        url:'/kedbManagement/getDetail?kedbManagementId=' + kedbManagementId
      }
    }
  };
}

export function addKedbManagement(files, data) {
  var bodyFormData = new FormData();
  bodyFormData.append('formDataJson', new Blob([JSON.stringify(data)], { type: 'application/json' }));
  for (var i = 0; i < files.length; i++) {
    bodyFormData.append('files', files[i]);
  }
  return {
    type: types.KEDB_MANAGEMENT_ADD,
    payload: {
      client: 'kedb',
      request: {
        method: 'POST',
        url: '/KedbService/insertKedb',
        data: bodyFormData,
        config: { headers: { 'Content-Type': 'multipart/form-data' } }
      }
    }
  };
}

export function editKedbManagement(files,data) {
  var bodyFormData = new FormData();
  bodyFormData.append('formDataJson', new Blob([JSON.stringify(data)], { type: 'application/json' }));
  for (var i = 0; i < files.length; i++) {
    bodyFormData.append('files', files[i]);
  }
  return {
    type: types.KEDB_MANAGEMENT_ADD,
    payload: {
      client: 'kedb',
      request: {
        method: 'POST',
        url: '/KedbService/updateKedb',
        data: bodyFormData,
        config: { headers: { 'Content-Type': 'multipart/form-data' } }
      }
    }
  };
}

export function deleteKedbManagement(kedbManagementId) {
  return {
    type: types.KEDB_MANAGEMENT_DELETE,
    payload: {
      client: 'kedb',
      request:{
        method: 'GET',
        url:'/kedbManagement/delete?kedbManagementId=' + kedbManagementId
      }
    }
  };
}

export function getListDeviceVersion(data){
  return {
    type: types.KEDB_GETLIST_DEVICEVERSION,
    payload:{
      client: 'stream',
      request:{
        method: 'POST',
        url:'/DeviceTypeVersionService/getListDeviceTypeVersion',
        data:data
      }
    }
  }
}

export function getKedbById(kedbId){
  return {
    type: types.KEDB_GETKEDB_BYID,
    payload:{
      client:'kedb',
      request:{
        method: 'POST',
        url:`/KedbService/findKedbById?kedbId=${kedbId}`,
        
      }
    }
  }
}

export function getListSubCategory(typeId){
  return {
    type: types.KEDB_GETLIST_SUBCATEGORY,
    payload:{
      client:'kedb',
      request:{
        method: 'POST',
        url:`/KedbService/getListSubCategory?typeId=${typeId}`,
        
      }
    }
  }
}

export function getListKedbActionLogsDTO(data){
  return {
    type: types.KEDB_GETLIST_HISTORY,
    payload:{
      client:'kedb',
      request:{
        method: 'POST',
        url:`/KedbActionLogsService/searchKedbActionLogs`,
        data: data
      }
    }
  }
}

export function updateKedbFromPt(files, data) {
  var bodyFormData = new FormData();
  bodyFormData.append('formDataJson', new Blob([JSON.stringify(data)], { type: 'application/json' }));
  for (var i = 0; i < files.length; i++) {
    bodyFormData.append('files', files[i]);
  }
  return {
    type: types.KEDB_UPDATE_FROM_PT,
    payload:{
      client:'kedb',
      request:{
        method: 'POST',
        url:`/KedbService/updateKedbFromPt`,
        data: bodyFormData,
        config: { headers: { 'Content-Type': 'multipart/form-data' } }
      }
    }
  }
}

export function getListUnitCheckKedb(data){
  return {
    type: types.KEDB_GETLIST_HISTORY,
    payload:{
      client:'kedb',
      request:{
        method: 'POST',
        url:`/KedbService/getListUnitCheckKedb`,
        data: data
      }
    }
  }
}

export function downloadKedbFiles(data) {
  var bodyFormData = new FormData();
  bodyFormData.append('formDataJson', JSON.stringify(data));
  return {
    type: types.KEDB_DOWNLOAD_FILE,
    payload:{
      client:'kedb',
      request:{
        method: 'POST',
        url:"/download/downloadKedbFiles",
        data: bodyFormData,
        responseType: 'blob'
        },
        options: {
          onSuccess({ getState, dispatch, response }) {
              const contentDisposition = response.headers["content-disposition"];
              const fileName = contentDisposition.split(";")[2].split("=")[1].split("\"").join("");
              FileSaver.saveAs(new Blob([response.data]), fileName);
          },
          onError({ getState, dispatch, error }) {

          },
        }
    }
  }
}
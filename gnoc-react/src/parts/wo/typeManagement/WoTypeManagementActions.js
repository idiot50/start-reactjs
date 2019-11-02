import * as types from './WoTypeManagementTypes';
import FileSaver from 'file-saver';

export function searchWoTypeManagement(data) {
  return {
    type: types.WO_TYPEMANAGEMENT_SEARCH,
    payload: {
      client: 'wo_cat',
      request:{
        method: 'POST',
        url:'/woType/getListWoTypeByLocalePage',
        data: data
      }
    }
  };
}

export function getDetailWoTypeManagement(woTypeId) {
  return {
    type: types.WO_TYPEMANAGEMENT_GET_DETAIL,
    payload: {
      client: 'wo_cat',
      request:{
        method: 'GET',
        url:'/woType/findByWoTypeId?woTypeId=' + woTypeId
      }
    }
  };
}

export function addWoTypeManagement(filesAttach, filesCreate, data) {
  var bodyFormData = new FormData();
  bodyFormData.append('formDataJson', new Blob([JSON.stringify(data)], {type: 'application/json'}));
  for (var i = 0; i < filesAttach.length; i++) {
    bodyFormData.append('filesGuideline', filesAttach[i]);
  }
  for (var i = 0; i < filesCreate.length; i++) {
    bodyFormData.append('filesAttached', filesCreate[i]);
  }
  return {
    type: types.WO_TYPEMANAGEMENT_ADD,
    payload: {
      client: 'wo_cat',
      request:{
        method: 'POST',
        url:'/woType/insert',
        data: bodyFormData,
        config: { headers: {'Content-Type': 'multipart/form-data' }}
      }
    }
  };
}

export function editWoTypeManagement(filesAttach, filesCreate, data) {
  var bodyFormData = new FormData();
  bodyFormData.append('formDataJson', new Blob([JSON.stringify(data)], {type: 'application/json'}));
  for (var i = 0; i < filesAttach.length; i++) {
    bodyFormData.append('filesGuideline', filesAttach[i]);
  }
  for (var i = 0; i < filesCreate.length; i++) {
    bodyFormData.append('filesAttached', filesCreate[i]);
  }
  return {
    type: types.WO_TYPEMANAGEMENT_EDIT,
    payload: {
      client: 'wo_cat',
      request:{
        method: 'POST',
        url:'/woType/update',
        data: bodyFormData,
        config: { headers: {'Content-Type': 'multipart/form-data' }}
      }
    }
  };
}

export function deleteWoTypeManagement(woTypeId) {
  return {
    type: types.WO_TYPEMANAGEMENT_DELETE,
    payload: {
      client: 'wo_cat',
      request:{
        method: 'GET',
        url:'/woType/delete?woTypeId=' + woTypeId
      }
    }
  };
}

export function getListWoGroupType(catCode, itemCode) {
  return {
    type: types.WO_TYPEMANAGEMENT_GET_LIST_WO_GROUP_TYPE,
    payload: {
      client: 'wo_cat',
      request:{
        method: 'POST',
        url:'/woType/getItemWoTypeGroup?categoryCode='+ catCode +'&itemCode='+ itemCode
      }
    }
  };
}

export function getListRequiredInfo(catCode, itemCode) {
  return {
    type: types.WO_TYPEMANAGEMENT_GET_LIST_REQUIRED_INFO,
    payload: {
      client: 'wo_cat',
      request:{
        method: 'POST',
        url:'/woType/getListRequiredInfo?categoryCode='+ catCode +'&itemCode='+ itemCode
      }
    }
  };
}

export function getListRequiredConfigById(data) {
  return {
    type: types.WO_TYPEMANAGEMENT_GET_LIST_REQUIRED_CONFIG,
    payload: {
      client: 'wo_cat',
      request:{
        method: 'POST',
        url:'/woTypeCfgRequired/findByWoTypeId',
        data: data
      }
    }
  };
}

export function getListPriority(id) {
  return {
    type: types.WO_TYPEMANAGEMENT_GET_LIST_PRIORITY_BYID,
    payload: {
      client: 'wo_cat',
      request:{
        method: 'GET',
        url:'/woType/findPriorityByWoTypeId?woTypeId=' + id,
      }
    }
  };
}

export function editListPriority(data) {
  return {
    type: types.WO_TYPEMANAGEMENT_EDIT_LIST_PRIORITY,
    payload: {
      client: 'wo_cat',
      request:{
        method: 'POST',
        url:'/woType/insertListPriority',
        data: data
      }
    }
  };
}

export function downloadFileCreate(fileId) {
  return {
    type: types.WO_TYPEMANAGEMENT_DOWNLOAD_FILE_CREATE,
    payload: {
      client: 'wo_cat',
      request: {
        method: 'GET',
        url: '/woType/downloadFileCreate?fileId=' + fileId,
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

export function deletePriority(priorityId) {
  return {
    type: types.WO_TYPEMANAGEMENT_DELETE_PRIORITY,
    payload: {
      client: 'wo_cat',
      request:{
        method: 'GET',
        url:'/woType/deletePriority?priorityId=' + priorityId
      }
    }
  };
}

export function getListWoChecklistDetailDTO(data) {
  return {
    type: types.WO_TYPEMANAGEMENT_GET_LIST_WO_CHECKLIST,
    payload: {
      client: 'wo_cat',
      request:{
        method: 'POST',
        url:'/woType/getListWoChecklistDetailDTO',
        data: data
      }
    }
  };
}

export function updateWoChecklistDetail(data) {
  return {
    type: types.WO_TYPEMANAGEMENT_UPDATE_WO_CHECKLIST,
    payload: {
      client: 'wo_cat',
      request:{
        method: 'POST',
        url:'/woType/updateWoChecklistDetail',
        data: data
      }
    }
  };
}

export function downloadFilesGuide(fileId) {
  return {
    type: types.WO_TYPEMANAGEMENT_DOWNLOAD_FILE_GUIDE,
    payload: {
      client: 'wo_cat',
      request: {
        method: 'GET',
        url: '/woType/downloadFilesGuide?fileId=' + fileId,
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

export function getListWoTypeTimeDTO(data) {
  return {
    type: types.WO_TYPEMANAGEMENT_GET_LIST_WO_TYPE_TIME,
    payload: {
      client: 'wo_cat',
      request:{
        method: 'POST',
        url:'/woType/getListWoTypeTimeDTO',
        data: data
      }
    }
  };
}
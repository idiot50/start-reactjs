import * as types from './WoConfigWoHelpVsmartTypes';
import FileSaver from 'file-saver';

export function searchWoConfigWoHelpVsmart(data) {
  return {
    type: types.WO_CONFIGWOHELPVSMART_SEARCH,
    payload: {
      client: 'wo_cat',
      request:{
        method: 'POST',
        url:'/CfgWoHelpVsmart/getListCfgWoHelpVsmartDTOSearchWeb',
        data: data
      }
    }
  };
}

export function getDetailWoConfigWoHelpVsmart(CfgWoHelpVsmartId) {
  return {
    type: types.WO_CONFIGWOHELPVSMART_GET_DETAIL,
    payload: {
      client: 'wo_cat',
      request:{
        method: 'GET',
        url:'/CfgWoHelpVsmart/findCfgWoHelpVsmartsById?Id=' + CfgWoHelpVsmartId
      }
    }
  };
}

export function addWoConfigWoHelpVsmart(files, data) {
  var bodyFormData = new FormData();
  bodyFormData.append('formDataJson', new Blob([JSON.stringify(data)], { type: 'application/json' }));
  bodyFormData.append('files', files[0]);
  return {
    type: types.WO_CONFIGWOHELPVSMART_ADD,
    payload: {
      client: 'wo_cat',
      request: {
        method: 'POST',
        url:'/CfgWoHelpVsmart/insertCfgWoHelpVsmart',
        data: bodyFormData,
        config: { headers: { 'Content-Type': 'multipart/form-data' } }
      }
    }
  };
}

export function editWoConfigWoHelpVsmart(files, data) {
  var bodyFormData = new FormData();
  bodyFormData.append('formDataJson', new Blob([JSON.stringify(data)], { type: 'application/json' }));
  if (files.length > 0 && typeof files[0].name === 'string') {
    bodyFormData.append('files', files[0]);
  }
  return {
    type: types.WO_CONFIGWOHELPVSMART_ADD,
    payload: {
      client: 'wo_cat',
      request: {
        method: 'POST',
        url:'/CfgWoHelpVsmart/updateCfgWoHelpVsmart',
        data: bodyFormData,
        config: { headers: { 'Content-Type': 'multipart/form-data' } }
      }
    }
  };
}

export function deleteWoConfigWoHelpVsmart(CfgWoHelpVsmartId) {
  return {
    type: types.WO_CONFIGWOHELPVSMART_DELETE,
    payload: {
      client: 'wo_cat',
      request:{
        method: 'GET',
        url:'/CfgWoHelpVsmart/deleteCfgWoHelpVsmart?Id=' + CfgWoHelpVsmartId
      }
    }
  };
}

export function getListCbbSystem() {
  return {
    type: types.WO_CONFIGWOHELPVSMART_GETLIST_SYSTEM,
    payload: {
      client: 'wo_cat',
      request:{
        method: 'POST',
        url:'/CfgWoHelpVsmart/getListCbbSystem',
      }
    }
  };
}

export function getListTypeCbb(id) {
  return {
    type: types.WO_CONFIGWOHELPVSMART_GETLIST_VSMART,
    payload: {
      client: 'wo_cat',
      request:{
        method: 'GET',
        url:'/CfgWoHelpVsmart/getListTypeCbb?systemId='+ id,
      }
    }
  };
}

export function onDownloadFileCfgWoHelpVsmartById(id) {
  return {
    type: types.ON_DOWNLOAD_FILE_ATTACH,
    payload: {
      client: 'wo_cat',
      request: {
        method: 'GET',
        url: '/download/onDownloadFileCfgWoHelpVsmartById?id=' + id,
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
  };
}

export function onDownloadFileTemplateCfgWoHelpVsmart(data) {
  return {
    type: types.ON_DOWNLOAD_FILE_TEMPLATE,
    payload: {
      client: 'wo_cat',
      request: {
        method: 'POST',
        url: '/download/onDownloadFileTemplateCfgWoHelpVsmart',
        data: data,
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
  };
}
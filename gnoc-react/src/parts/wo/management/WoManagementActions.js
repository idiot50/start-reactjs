import * as types from './WoManagementTypes';
import FileSaver from 'file-saver';

export function searchWoManagement(data) {
  return {
    type: types.WO_MANAGEMENT_SEARCH,
    payload: {
      client: 'wo',
      request:{
        method: 'POST',
        url:'/Wo/getListDataSearchWeb',
        data: data
      }
    }
  };
}

export function getDetailWoManagement(woId) {
  return {
    type: types.WO_MANAGEMENT_GET_DETAIL,
    payload: {
      client: 'wo',
      request:{
        method: 'POST',
        url:'/Wo/findWoById?woId=' + woId
      }
    }
  };
}

export function addWoManagement(files, filesCreate, data) {
  var bodyFormData = new FormData();
  bodyFormData.append('formDataJson', new Blob([JSON.stringify(data)], { type: 'application/json' }));
  for (var i = 0; i < files.length; i++) {
    bodyFormData.append('fileAttacks', files[i]);
  }
  for (var i = 0; i < filesCreate.length; i++) {
    bodyFormData.append('fileCfgAttacks', filesCreate[i]);
  }
  return {
    type: types.WO_MANAGEMENT_ADD,
    payload: {
      client: 'wo',
      request: {
        method: 'POST',
        url: '/Wo/insertWoFromWeb',
        data: bodyFormData,
        config: { headers: { 'Content-Type': 'multipart/form-data' } }
      }
    }
  };
}

export function editWoManagement(files, filesCreate, data) {
  var bodyFormData = new FormData();
  bodyFormData.append('formDataJson', new Blob([JSON.stringify(data)], { type: 'application/json' }));
  for (var i = 0; i < files.length; i++) {
    bodyFormData.append('fileAttacks', files[i]);
  }
  for (var i = 0; i < filesCreate.length; i++) {
    bodyFormData.append('fileCfgAttacks', filesCreate[i]);
  }
  return {
    type: types.WO_MANAGEMENT_EDIT,
    payload: {
      client: 'wo',
      request: {
        method: 'POST',
        url: '/Wo/updateWo',
        data: bodyFormData,
        config: { headers: { 'Content-Type': 'multipart/form-data' } }
      }
    }
  };
}

export function deleteWoManagement(listWo) {
  return {
    type: types.WO_MANAGEMENT_DELETE,
    payload: {
      client: 'wo',
      request:{
        method: 'POST',
        url:'/Wo/deleteListWo',
        data: listWo
      }
    }
  };
}

export function viewCall(data) {
  return {
    type: types.WO_MANAGEMENT_VIEW_CALL,
    payload: {
      client: 'wo',
      request: {
        method: 'POST',
        url: '/Wo/getListLogCallIpccDTO',
        data: data
      }
    }
  };
}

export function callIPCC(data) {
  return {
    type: types.WO_MANAGEMENT_CALL_IPCC,
    payload: {
      client: 'wo',
      request: {
        method: 'POST',
        url: '/Wo/callIPCC',
        data: data
      }
    }
  }
}

export function getPriorityByWoTypeId(woTypeId) {
  return {
    type: types.WO_MANAGEMENT_GET_PRIORITY_BY_WO_TYPE_ID,
    payload: {
      client: 'wo',
      request: {
        method: 'GET',
        url: '/Wo/getWoPriorityByWoTypeID?woTypeId=' + woTypeId
      }
    }
  }
}

export function getListWoSystemInsertWeb() {
  return {
    type: types.WO_MANAGEMENT_GET_LIST_WO_SYSTEM,
    payload: {
      client: 'wo',
      request: {
        method: 'GET',
        url: '/Wo/getListWoSystemInsertWeb'
      }
    }
  }
}

export function getListFileFromWo(woId) {
  return {
    type: types.WO_MANAGEMENT_GET_LIST_FILE_FROM_WO,
    payload: {
      client: 'wo',
      request: {
        method: 'GET',
        url: '/Wo/getListFileFromWo?woId=' + woId
      }
    }
  }
}

export function getStationListNation(stationCode, date) {
  return {
    type: types.WO_MANAGEMENT_GET_LIST_STATION,
    payload: {
      client: 'wo',
      request: {
        method: 'GET',
        url: '/Wo/getStationListNation?stationCode=' + stationCode + '&date=' + date
      }
    }
  }
}

export function getListWarehouseNation(warehouseCode, warehouseName, woType, staffCode) {
  return {
    type: types.WO_MANAGEMENT_GET_LIST_WAREHOUSE,
    payload: {
      client: 'wo',
      request: {
        method: 'GET',
        url: '/Wo/getListWarehouseNation?warehouseCode=' + warehouseCode + '&warehouseName=' + warehouseName + '&woType=' + woType + '&staffCode=' + staffCode
      }
    }
  }
}

export function getListWoKttsAction(key) {
  return {
    type: types.WO_MANAGEMENT_GET_LIST_KTTS_ACTION,
    payload: {
      client: 'wo',
      request: {
        method: 'GET',
        url: '/Wo/getListWoKttsAction?key=' + key
      }
    }
  }
}

export function getListContractFromConstrNation(constrtCode) {
  return {
    type: types.WO_MANAGEMENT_GET_LIST_CONSTRACT,
    payload: {
      client: 'wo',
      request: {
        method: 'GET',
        url: '/Wo/getListContractFromConstrNation?constrtCode=' + constrtCode
      }
    }
  }
}

export function getConstructionListNation(stationCode) {
  return {
    type: types.WO_MANAGEMENT_GET_LIST_CONSTRUCTION,
    payload: {
      client: 'wo',
      request: {
        method: 'GET',
        url: '/Wo/getConstructionListNation?stationCode=' + stationCode
      }
    }
  }
}

export function getListWoHistoryByWoId(data) {
  return {
    type: types.WO_MANAGEMENT_GET_LIST_HISTORY,
    payload: {
      client: 'wo',
      request: {
        method: 'POST',
        url: '/Wo/getListWoHistoryByWoId',
        data: data
      }
    }
  }
}

export function getListCdByGroup(woGroupId) {
  return {
    type: types.WO_MANAGEMENT_GET_LIST_CD_BY_GROUP,
    payload: {
      client: 'wo_cat',
      request: {
        method: 'GET',
        url: '/WoCd/getListCdByGroup?woGroupId=' + woGroupId
      }
    }
  }
}

export function getListWorklogByWoId(data) {
  return {
    type: types.WO_MANAGEMENT_GET_LIST_WORKLOG,
    payload: {
      client: 'wo',
      request: {
        method: 'POST',
        url: '/Wo/getListWorklogByWoIdPaging',
        data: data
      }
    }
  }
}

export function insertWoWorklog(data) {
  return {
    type: types.WO_MANAGEMENT_INSERT_WORKLOG,
    payload: {
      client: 'wo',
      request: {
        method: 'POST',
        url: '/Wo/insertWoWorklog',
        data: data
      }
    }
  }
}

export function loadDataOfTabCr(data) {
  return {
    type: types.WO_MANAGEMENT_GET_LIST_CR,
    payload: {
      client: 'wo',
      request: {
        method: 'POST',
        url: '/Wo/loadDataOfTabCr',
        data: data
      }
    }
  }
}

export function updateFileAttack(files, data) {
  var bodyFormData = new FormData();
  bodyFormData.append('formDataJson', new Blob([JSON.stringify(data)], { type: 'application/json' }));
  for (var i = 0; i < files.length; i++) {
    bodyFormData.append('fileAttacks', files[i]);
  }
  return {
    type: types.WO_MANAGEMENT_UPDATE_FILE,
    payload: {
      client: 'wo',
      request: {
        method: 'POST',
        url: '/Wo/updateFileAttack',
        data: bodyFormData,
        config: { headers: { 'Content-Type': 'multipart/form-data' } }
      }
    }
  };
}

export function dispatchWo(data) {
  return {
    type: types.WO_MANAGEMENT_DISPATCH,
    payload: {
      client: 'wo',
      request: {
        method: 'POST',
        url: '/Wo/dispatchWoFromWeb',
        data: data
      }
    }
  }
}

export function acceptWoForWeb(data) {
  return {
    type: types.WO_MANAGEMENT_ACCEPT,
    payload: {
      client: 'wo',
      request: {
        method: 'POST',
        url: '/Wo/acceptWoFromWeb',
        data: data
      }
    }
  }
}

export function rejectWoForWeb(data) {
  return {
    type: types.WO_MANAGEMENT_REJECT,
    payload: {
      client: 'wo',
      request: {
        method: 'POST',
        url: '/Wo/rejectWoFromWeb',
        data: data
      }
    }
  }
}

export function auditWo(data) {
  return {
    type: types.WO_MANAGEMENT_AUDIT,
    payload: {
      client: 'wo',
      request: {
        method: 'POST',
        url: '/Wo/auditWoFromWeb',
        data: data
      }
    }
  }
}

export function pendingWoFromWeb(data) {
  return {
    type: types.WO_MANAGEMENT_PENDING,
    payload: {
      client: 'wo',
      request: {
        method: 'POST',
        url: '/Wo/pendingWoFromWeb',
        data: data
      }
    }
  }
}

export function onExportFileWoTestService(files, fromDate, toDate, moduleName) {
  var bodyFormData = new FormData();
  bodyFormData.append('startTimeFrom', fromDate);
  bodyFormData.append('startTimeTo', toDate);
  bodyFormData.append('moduleName', moduleName);
  for (var i = 0; i < files.length; i++) {
    bodyFormData.append('filesAttach', files[i]);
  }
  return {
    type: types.WO_MANAGEMENT_EXPORT_FILE_WO,
    payload: {
      client: 'wo',
      request: {
        method: 'POST',
        url: '/export/onExportFileWoTestService',
        data: bodyFormData,
        responseType: 'blob'
      },
      options: {
        onSuccess({ getState, dispatch, response }) {
          const contentDisposition = response.headers["content-disposition"];
          const content = contentDisposition.split(";")[2].split("=")[1].split("\"").join("");
          const resultObject = JSON.parse(decodeURIComponent(content));
          if (resultObject.key === "SUCCESS") {
            FileSaver.saveAs(new Blob([response.data]), resultObject.fileName);
          }
          return response;
        },
        onError({ getState, dispatch, error }) {
          return error;
        },
      }
    }
  };
}

// export function getListFileFromCr(files, fromDate, toDate) {
//   var bodyFormData = new FormData();
//   bodyFormData.append('fromDate', fromDate);
//   bodyFormData.append('toDate', toDate);
//   for (var i = 0; i < files.length; i++) {
//     bodyFormData.append('fileAttacks', files[i]);
//   }
//   return {
//     type: types.WO_MANAGEMENT_EXPORT_FILE_CR,
//     payload: {
//       client: 'wo',
//       request: {
//         method: 'POST',
//         url: '/Wo/getListFileFromCr',
//         data: bodyFormData,
//         responseType: 'blob'
//       },
//       options: {
//         onSuccess({ getState, dispatch, response }) {
//           const contentDisposition = response.headers["content-disposition"];
//           const fileName = contentDisposition.split(";")[2].split("=")[1].split("\"").join("");
//           FileSaver.saveAs(new Blob([response.data]), fileName);
//         },
//         onError({ getState, dispatch, error }) {

//         },
//       }
//     }
//   };
// }

export function saveCompleteWoSPM(data) {
  return {
    type: types.WO_MANAGEMENT_COMPLETE_WO_SPM,
    payload: {
      client: 'wo',
      request:{
        method: 'POST',
        url:'/Wo/completeWoSPM',
        data: data
      }
    }
  };
}

export function updatePendingWo(data) {
  return {
    type: types.WO_MANAGEMENT_UPDATE_PENDING_WO,
    payload: {
      client: 'wo',
      request:{
        method: 'POST',
        url:'/Wo/updatePendingWoFromWeb',
        data: data
      }
    }
  };
}

export function updateStatusFromWeb(data) {
  return {
    type: types.WO_MANAGEMENT_UPDATE_STATUS_WO,
    payload: {
      client: 'wo',
      request:{
        method: 'POST',
        url:'/Wo/updateStatusFromWeb',
        data: data
      }
    }
  };
}

export function splitWo(files, data) {
  var bodyFormData = new FormData();
  bodyFormData.append('formDataJson', new Blob([JSON.stringify(data)], { type: 'application/json' }));
  for (var i = 0; i < files.length; i++) {
    bodyFormData.append('fileAttacks', files[i]);
  }
  return {
    type: types.WO_MANAGEMENT_SPLIT_WO,
    payload: {
      client: 'wo',
      request: {
        method: 'POST',
        url: '/Wo/splitWoFromWeb',
        data: bodyFormData,
        config: { headers: { 'Content-Type': 'multipart/form-data' } }
      }
    }
  };
}

export function approveWo(data) {
  return {
    type: types.WO_MANAGEMENT_APPROVE_WO,
    payload: {
      client: 'wo',
      request:{
        method: 'POST',
        url:'/Wo/approveWoFromWeb',
        data: data
      }
    }
  };
}

export function downloadWoFile(woId, fileName) {
  return {
      type: types.ON_DOWNLOAD_FILE_WO,
      payload: {
          client: 'wo',
          request:{
              method: 'GET',
              url: "/download/downloadWoFile?fileName=" + fileName + "&woId=" + woId,
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

export function findCompCauseById(woId) {
  return {
    type: types.WO_MANAGEMENT_FIND_COMP_CAUSE_BY_ID,
    payload: {
      client: 'wo',
      request:{
        method: 'GET',
        url:'/Wo/findCompCauseById?compCauseDTOId=' + woId
      }
    }
  };
}

export function getListWoDetailDTO(data) {
  return {
    type: types.WO_MANAGEMENT_GET_LIST_WO_DETAIL,
    payload: {
      client: 'wo_cat',
      request:{
        method: 'POST',
        url:'/WoDetail/getListWoDetailDTO',
        data: data
      }
    }
  };
}

export function getListWoChild(data) {
  return {
    type: types.WO_MANAGEMENT_GET_LIST_WO_CHILD,
    payload: {
      client: 'wo',
      request:{
        method: 'POST',
        url:'/Wo/getListWoChild',
        data: data
      }
    }
  };
}

export function getListWoTypeDTO(data) {
  return {
    type: types.WO_MANAGEMENT_GET_LIST_WO_TYPE,
    payload: {
      client: 'wo_cat',
      request:{
        method: 'POST',
        url:'/woType/getListWoTypeDTO',
        data: data
      }
    }
  };
}
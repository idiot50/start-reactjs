import * as types from './TtTroubleTypes';
import FileSaver from 'file-saver';

export function searchTtTrouble(data) {
  return {
    type: types.TT_TROUBLE_SEARCH,
    payload: {
      client: 'tt',
      request: {
        method: 'POST',
        url: '/Troubles/onSearch',
        data: data
      }
    }
  };
}

export function getDetailTtTrouble(ttTroubleId) {
  return {
    type: types.TT_TROUBLE_GET_DETAIL,
    payload: {
      client: 'tt',
      request: {
        method: 'GET',
        url: '/Troubles/findTroubleById?id=' + ttTroubleId
      }
    }
  };
}

export function addTtTrouble(files, data) {
  var bodyFormData = new FormData();
  bodyFormData.append('formDataJson', new Blob([JSON.stringify(data)], { type: 'application/json' }));
  for (var i = 0; i < files.length; i++) {
    bodyFormData.append('files', files[i]);
  }
  return {
    type: types.TT_TROUBLE_ADD,
    payload: {
      client: 'tt',
      request: {
        method: 'POST',
        url: '/Troubles/insertTrouble',
        data: bodyFormData,
        config: { headers: { 'Content-Type': 'multipart/form-data' } }
      }
    }
  };
}

export function editTtTrouble(files, data) {
  var bodyFormData = new FormData();
  bodyFormData.append('formDataJson', new Blob([JSON.stringify(data)], { type: 'application/json' }));
  for (var i = 0; i < files.length; i++) {
    bodyFormData.append('files', files[i]);
  }
  return {
    type: types.TT_TROUBLE_EDIT,
    payload: {
      client: 'tt',
      request: {
        method: 'POST',
        url: '/Troubles/onUpdateTrouble',
        data: bodyFormData,
        config: { headers: { 'Content-Type': 'multipart/form-data' } }
      }
    }
  };
}

export function deleteTtTrouble(ttTroubleId) {
  return {
    type: types.TT_TROUBLE_DELETE,
    payload: {
      client: 'tt',
      request: {
        method: 'GET',
        url: '/Troubles/deleteTrouble?id=' + ttTroubleId
      }
    }
  };
}

export function getListChatUsers(data) {
  return {
    type: types.ON_GET_CHAT_LIST_USERS,
    payload: {
      client: 'tt',
      request: {
        method: 'POST',
        url: "/Troubles/getListChatUsers",
        data: data
      }
    }
  };
}

export function getListUsers(data) {
  return {
    type: types.ON_GET_LIST_USERS,
    payload: {
      client: 'stream',
      request: {
        method: 'POST',
        url: "/UsersService/getListUserDTO",
        data: data
      }
    }
  };
}

export function getListUsersSupport(data) {
  return {
    type: types.ON_GET_LIST_USERS_SUPPORT,
    payload: {
      client: 'tt',
      request: {
        method: 'POST',
        url: "/Troubles/loadUserSupportGroup",
        data: data
      }
    }
  };
}

export function sendChatListUsers(data) {
  return {
    type: types.ON_SEND_CHAT_LIST_USERS,
    payload: {
      client: 'tt',
      request: {
        method: 'POST',
        url: '/Troubles/sendChatListUsers',
        data: data
      }
    }
  }
}

export function getWorklogByTroubleId(data) {
  return {
    type: types.TT_TROUBLE_GET_WORKLOG,
    payload: {
      client: 'tt',
      request: {
        method: 'POST',
        url: '/Troubles/getListTroubleWorklogByTroubleId',
        data: data
      }
    }
  };
}

export function insertTroubleWorklog(data) {
  return {
    type: types.TT_TROUBLE_ADD_WORKLOG,
    payload: {
      client: 'tt',
      request: {
        method: 'POST',
        url: '/Troubles/insertTroubleWorklog',
        data: data
      }
    }
  };
}

export function getFileAttachByTroubleId(data) {
  return {
    type: types.TT_TROUBLE_GET_FILE_ATTACH,
    payload: {
      client: 'tt',
      request: {
        method: 'POST',
        url: '/Troubles/getListFileAttachByTroubleId',
        data: data
      }
    }
  };
}

export function countByState(data) {
  return {
    type: types.TT_TROUBLE_COUNT_BY_STATE,
    payload: {
      client: 'tt',
      request: {
        method: 'POST',
        url: '/Troubles/countByState',
        data: data
      }
    }
  };
}

export function getLstNetworkLevel(typeId) {
  return {
    type: types.TT_TROUBLE_GET_NETWORK_LEVEL,
    payload: {
      client: 'tt',
      request: {
        method: 'GET',
        url: '/Troubles/getLstNetworkLevel?typeId=' + typeId
      }
    }
  };
}

export function viewCall(data) {
  return {
    type: types.TT_TROUBLE_VIEW_CALL,
    payload: {
      client: 'tt',
      request: {
        method: 'POST',
        url: '/Troubles/viewCall',
        data: data
      }
    }
  };
}

export function getListReasonBCCS(data) {
  return {
    type: types.TT_TROUBLE_GET_REASON_BCCS,
    payload: {
      client: 'tt',
      request: {
        method: 'POST',
        url: '/Troubles/getListReasonBCCS',
        data: data
      }
    }
  };
}

export function getListReasonOverdue(data) {
  return {
    type: types.TT_TROUBLE_GET_REASON_OVERDUE,
    payload: {
      client: 'tt',
      request: {
        method: 'POST',
        url: '/Troubles/getListReasonOverdue',
        data: data
      }
    }
  };
}

//Tab thông tin truyền dẫn
export function getListTransNWType() {
  return {
    type: types.TT_TROUBLE_GET_TRANS_NW_TYPE,
    payload: {
      client: 'tt',
      request: {
        method: 'POST',
        url: '/Troubles/getListItemByCategory'
      }
    }
  };
}

export function getListNWLevel(typeId) {
  return {
    type: types.TT_TROUBLE_GET_LIST_NW_LEVEL,
    payload: {
      client: 'tt',
      request: {
        method: 'GET',
        url: '/Troubles/getLstNetworkLevel?typeId=' + typeId
      }
    }
  };
}

export function getListCatReasonType(typeId) {
  return {
    type: types.TT_TROUBLE_GET_LIST_CAT_REASON_TYPE,
    payload: {
      client: 'tt',
      request: {
        method: 'GET',
        url: '/Troubles/getListCatReason?itemId=' + typeId
      }
    }
  };
}

export function searchInfraCableLane(data) {
  return {
    type: types.TT_TROUBLE_SEARCH_INFRA_CABLE_LANE,
    payload: {
      client: 'tt',
      request: {
        method: 'POST',
        url: '/Troubles/onSearchInfraCableLaneDTO',
        data: data
      }
    }
  };
}

export function getListTroubleMop(data) {
  return {
    type: types.TT_TROUBLE_GET_LIST_MOP,
    payload: {
      client: 'tt',
      request: {
        method: 'POST',
        url: '/Troubles/getListTroubleMopDTO',
        data: data
      }
    }
  };
}

export function searchInfraSleeves(data) {
  return {
    type: types.TT_TROUBLE_SEARCH_INFRA_CABLE_LANE,
    payload: {
      client: 'tt',
      request: {
        method: 'POST',
        url: '/Troubles/onSearchInfraSleevesDTO',
        data: data
      }
    }
  };
}

export function getInfoBRCDByTroubleId(troubleId) {
  return {
    type: types.TT_TROUBLE_GET_BRCD,
    payload: {
      client: 'tt',
      request: {
        method: 'POST',
        url: '/Troubles/getInfoBRCDByTroubleId?troubleId=' + troubleId,
      }
    }
  };
}

export function getListLinkInfo(codeSnippetOff) {
  return {
    type: types.TT_TROUBLE_GET_LINK_INFO,
    payload: {
      client: 'tt',
      request: {
        method: 'GET',
        url: '/Troubles/getListLinkInfoDTO?codeSnippetOff=' + codeSnippetOff,
      }
    }
  };
}

export function getListSnippetOff(lineCutCode) {
  return {
    type: types.TT_TROUBLE_GET_LIST_SNIPPETOFF,
    payload: {
      client: 'tt',
      request: {
        method: 'GET',
        url: '/Troubles/getListSnippetOff?lineCutCode=' + lineCutCode
      }
    }
  }
}
//End Tab thông tin truyền dẫn

// Tab CR
export function searchProblemCR(data) {
  return {
    type: types.TT_TROUBLE_SEARCH_CR,
    payload: {
      client: 'tt',
      request: {
        method: 'POST',
        url: '/Troubles/loadDataOfTabCr',
        data: data
      }
    }
  };
}
// end CR

export function getInsertOrUpdateInfoBRCD(data) {
  return {
    type: types.TT_TROUBLE_UPDATE_BRCD,
    payload: {
      client: 'tt',
      request: {
        method: 'POST',
        url: '/Troubles/getInsertOrUpdateInfoBRCD',
        data: data
      }
    }
  };
}

// Tab WO
export function searchProblemWO(data) {
  return {
    type: types.TT_TROUBLE_SEARCH_WO,
    payload: {
      client: 'tt',
      request: {
        method: 'POST',
        url: '/Troubles/getListDataSearch',
        data: data
      }
    }
  };
}
// end WO

export function searchCrRelated(data) {
  return {
    type: types.TT_TROUBLE_SEARCH_CR_RELATED,
    payload: {
      client: 'tt',
      request: {
        method: 'POST',
        url: '/Troubles/searchCrRelated',
        data: data
      }
    }
  };
}

export function getPriorityByProps(typeId, alarmId, nationCode) {
  return {
    type: types.TT_TROUBLE_GET_PRIORITY_BY_PROPS,
    payload: {
      client: 'tt_cat',
      request: {
        method: 'GET',
        url: '/CfgTimeTroubleProcess/getItemDTO?typeId=' + typeId + '&alarmId=' + alarmId + '&nationCode=' + nationCode
      }
    }
  };
}

export function getUnitList() {
  return {
    type: types.TT_TROUBLE_GET_UNIT_LIST,
    payload: {
      client: 'tt',
      request: {
        method: 'POST',
        url: 'TroublesIbm/getListUnitIbmDTOCombobox'
      }
    }
  }
}

export function getProductList() {
  return {
    type: types.TT_TROUBLE_GET_PRODUCT_LIST,
    payload: {
      client: 'tt',
      request: {
        method: 'POST',
        url: 'TroublesIbm/getListProductIbmDTOCombobox'
      }
    }
  }
}

export function addTTroubleIBM(files, data) {
  var bodyFormData = new FormData();
  bodyFormData.append('formDataJson', new Blob([JSON.stringify(data)], { type: 'application/json' }));
  for (var i = 0; i < files.length; i++) {
    bodyFormData.append('files', files[i]);
  }
  return {
    type: types.TT_TROUBLE_ADD_INVOLE_IBM,
    payload: {
      client: 'tt',
      request: {
        method: 'POST',
        url: 'TroublesIbm/insertTroublesIbm',
        data: bodyFormData,
        config: { headers: { 'Content-Type': 'multipart/form-data' } }
      }
    }
  }
}

export function searchTtTroubleIBM(objectSearch) {
  return {
    type: types.TT_TROUBLE_GET_IBM_LIST,
    payload: {
      client: 'tt',
      request: {
        method: 'POST',
        url: 'TroublesIbm/getListTroublesIbmDTO',
        data: objectSearch
      }
    }
  }
}
export function getListInfoTickHelpByWoCode(data) {
  return {
    type: types.TT_TROUBLE_GET_LIST_INFOR_HELP,
    payload: {
      client: 'tt',
      request: {
        method: 'POST',
        url: '/Troubles/getListInfoTickHelpByWoCode',
        data: data
      }
    }
  };
}

export function downloadFileInforHelp(data) {
  var bodyFormData = new FormData();
  bodyFormData.append('formDataJson', JSON.stringify(data));
  return {
    type: types.TT_TROUBLE_DOWNLOAD_INFOR_HELP,
    payload: {
      client: 'tt',
      request: {
        method: 'POST',
        url: '/Troubles/downloadFileAttachByWoCodeAndIdFile',
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
  };
}

export function searchTtTroubleDeviceErrorInfo(objectSearch) {
  return {
    type: types.TT_TROUBLE_SEARCH_DEVICE_ERROR,
    payload: {
      client: 'tt',
      request: {
        method: 'POST',
        url: '/Troubles/getListTroubleCardDTO',
        data: objectSearch
      }
    }
  }
}

export function addTtTroubleDeviceErrorInfo(data) {
  return {
    type: types.TT_TROUBLE_ADD_DEVICE_ERROR,
    payload: {
      client: 'tt',
      request: {
        method: 'POST',
        url: '/Troubles/insertlistTroubleCard',
        data: data
      }
    }
  }
}

export function getListTroubleHistorysDTO(data) {
  return {
    type: types.TT_TROUBLE_GET_LIST_HISTORY,
    payload: {
      client: 'tt',
      request: {
        method: 'POST',
        url: '/Troubles/getListTroubleActionLogsDTO',
        data: data
      }
    }
  }
}

export function getListTroubleAffectedNode(data) {
  return {
    type: types.TT_TROUBLE_GET_LIST_AFFECTED_NODE,
    payload: {
      client: 'tt',
      request: {
        method: 'POST',
        url: '/Troubles/loadDataOfTabNetworkNode',
        data: data
      }
    }
  }
}

export function getListTroubleNOCInformation(data) {
  return {
    type: types.TT_TROUBLE_GET_LIST_NOC_INFOR,
    payload: {
      client: 'tt',
      request: {
        method: 'POST',
        url: '/Troubles/loadDataOfTabItAccount',
        data: data
      }
    }
  }
}

export function saveFileAttach(files, data) {
  var bodyFormData = new FormData();
  bodyFormData.append('formDataJson', new Blob([JSON.stringify(data)], { type: 'application/json' }));
  for (var i = 0; i < files.length; i++) {
    bodyFormData.append('files', files[i]);
  }
  return {
    type: types.TT_TROUBLE_SAVE_FILE_ATTACH,
    payload: {
      client: 'tt',
      request: {
        method: 'POST',
        url: '/Troubles/insertTroubleFilesUpload',
        data: bodyFormData,
        config: { headers: { 'Content-Type': 'multipart/form-data' } }
      }
    }
  };
}

export function downloadFileAttach(data) {
  var bodyFormData = new FormData();
  bodyFormData.append('formDataJson', JSON.stringify(data));
  return {
    type: types.ON_DOWNLOAD_FILE_ATTACH,
    payload: {
      client: 'tt',
      request: {
        method: 'POST',
        url: "/Troubles/downloadTroubleFiles",
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
  };
}

export function getListRelatedTT(data) {
  return {
    type: types.TT_TROUBLE_GET_LIST_RELATED_TT,
    payload: {
      client: 'tt',
      request: {
        method: 'POST',
        url: '/Troubles/getListRelatedTT',
        data: data
      }
    }
  }
}

export function getListProblems(data) {
  return {
    type: types.TT_TROUBLE_GET_LIST_RELATED_PT,
    payload: {
      client: 'tt',
      request: {
        method: 'POST',
        url: '/Troubles/getListProblems',
        data: data
      }
    }
  }
}

export function getListRelatedTTByPopup(data) {
  return {
    type: types.TT_TROUBLE_GET_LIST_RELATED_TT_POPUP,
    payload: {
      client: 'tt',
      request: {
        method: 'POST',
        url: '/Troubles/getListRelatedTTByPopup',
        data: data
      }
    }
  }
}

export function callIPCC(data) {
  return {
    type: types.TT_TROUBLE_CALL_IPCC,
    payload: {
      client: 'tt',
      request: {
        method: 'POST',
        url: '/Troubles/callIPCC',
        data: data
      }
    }
  }
}

export function loadCrRelatedDetail(crNumber) {
  return {
    type: types.TT_TROUBLE_LOAD_CR_DETAIL,
    payload: {
      client: 'tt',
      request: {
        method: 'GET',
        url: '/Troubles/loadCrRelatedDetail?crRelatedCode=' + crNumber,
      }
    }
  }
}

export function getListGroupSolution(data) {
  return {
    type: types.TT_TROUBLE_GET_LIST_GROUP_SOLUTION,
    payload: {
      client: 'tt',
      request: {
        method: 'POST',
        url: '/Troubles/getListGroupSolution',
        data: data,
      }
    }
  }
}

export function getListCableType(lineCutCode, codeSnippetOff) {
  return{
    type: types.TT_TROUBLE_GET_LIST_CABLE_TYPE,
    payload:{
      client:'tt',
      request:{
        method:'GET',
        url:'/Troubles/getListCableType?lineCutCode=' + lineCutCode + '&codeSnippetOff=' + codeSnippetOff
      }
    }
  }
}

export function getListTroubleMopDtDTO(data) {
  return {
    type: types.TT_TROUBLE_GET_LIST_MOP_DT,
    payload: {
      client: 'tt',
      request: {
        method: 'POST',
        url: '/Troubles/getListTroubleMopDtDTO',
        data: data,
      }
    }
  }
}

export function updateTroubleMop(data) {
  return {
    type: types.TT_TROUBLE_UPDATE_TROUBLE_MOP,
    payload: {
      client: 'tt',
      request: {
        method: 'POST',
        url: '/Troubles/updateTroubleMop',
        data: data,
      }
    }
  }
}

export function insertCrCreatedFromOtherSystem(data) {
  return {
    type: types.TT_TROUBLE_INSERT_CR_FROM_OTHER_SYSTEM,
    payload: {
      client: 'tt',
      request: {
        method: 'POST',
        url: '/Troubles/insertCrCreatedFromOtherSystem',
        data: data,
      }
    }
  }
}

export function onUpdateTroubleEntity(data) {
  return {
    type: types.TT_TROUBLE_UPDATE_TROUBLE_ENTITY,
    payload: {
      client: 'tt',
      request: {
        method: 'POST',
        url: '/Troubles/onUpdateTroubleEntity',
        data: data,
      }
    }
  }
}

export function getListConcave(lstCell, lng, lat) {
  return {
    type: types.TT_TROUBLE_GET_LIST_CONCAVE,
    payload: {
      client: 'tt',
      request: {
        method: 'GET',
        url: '/TroublesServiceForCC/getConcaveByCellAndLocation?lng=' + lng + '&lat=' + lat + '&lstCell=' + lstCell.map(item => item).join(",")
      }
    }
  }
}

export function getListCellService(data) {
  return {
    type: types.TT_TROUBLE_GET_LIST_CELL_SERVICE,
    payload: {
      client: 'stream',
      request: {
        method: 'POST',
        url: '/commonStreamAPI/getListCellService',
        data: data
      }
    }
  }
}

export function sendTicketToTKTU(data) {
  return {
    type: types.TT_TROUBLE_SEND_TO_TKTU,
    payload: {
      client: 'tt',
      request: {
        method: 'POST',
        url: '/Troubles/sendTicketToTKTU',
        data: data,
      }
    }
  }
}

export function getAlarmClearGNOC(data) {
  return {
    type: types.TT_TROUBLE_GET_ALARM_CLEAR_GNOC,
    payload: {
      client: 'tt',
      request: {
        method: 'POST',
        url: '/Troubles/getAlarmClearGNOC',
        data: data,
      }
    }
  }
}

export function checkWoRequiredClosed(data) {
  return {
    type: types.TT_TROUBLE_CHECK_WO_REQUIRED_CLOSED,
    payload: {
      client: 'tt',
      request: {
        method: 'POST',
        url: '/Troubles/checkWoRequiredClosed',
        data: data,
      }
    }
  }
}

export function getListDataSearchWo(data) {
  return {
    type: types.TT_TROUBLE_GET_LIST_DATA_SEARCH_WO,
    payload: {
      client: 'tt',
      request: {
        method: 'POST',
        url: '/Troubles/getListDataSearchWo',
        data: data,
      }
    }
  }
}

export function downloadTroubleMopDt(data) {
  var bodyFormData = new FormData();
  bodyFormData.append('formDataJson', JSON.stringify(data));
  return {
    type: types.ON_DOWNLOAD_FILE_MOP_DT,
    payload: {
      client: 'tt',
      request: {
        method: 'POST',
        url: "/Troubles/downloadTroubleMopDt",
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
  };
}

export function changeStatusWo(data) {
  return {
    type: types.TT_TROUBLE_CHANGE_STATUS_WO,
    payload: {
      client: 'tt',
      request: {
        method: 'POST',
        url: '/Troubles/changeStatusWo',
        data: data,
      }
    }
  }
}
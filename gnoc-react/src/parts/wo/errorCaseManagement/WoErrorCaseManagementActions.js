import * as types from './WoErrorCaseManagementTypes';
import FileSaver from 'file-saver';

export function searchWoErrorCaseManagement(data) {
  return {
    type: types.WO_ERRORCASEMANAGEMENT_SEARCH,
    payload: {
      client: 'wo_cat',
      request: {
        method: 'POST',
        url: '/cfgSupportCase/getListCfgSupportCaseDTONew',
        data: data
      }
    }
  };
}

export function getDetailWoErrorCaseManagement(woErrorCaseManagementId) {
  return {
    type: types.WO_ERRORCASEMANAGEMENT_GET_DETAIL,
    payload: {
      client: 'wo_cat',
      request: {
        method: 'GET',
        url: '/cfgSupportCase/getDetail?id=' + woErrorCaseManagementId
      }
    }
  };
}

export function addWoErrorCaseManagement(data) {
  return {
    type: types.WO_ERRORCASEMANAGEMENT_ADD,
    payload: {
      client: 'wo_cat',
      request: {
        method: 'POST',
        url: '/cfgSupportCase/add',
        data: data
      }
    }
  };
}

export function editWoErrorCaseManagement(data) {
  return {
    type: types.WO_ERRORCASEMANAGEMENT_EDIT,
    payload: {
      client: 'wo_cat',
      request: {
        method: 'POST',
        url: '/cfgSupportCase/edit',
        data: data
      }
    }
  };
}

export function deleteWoErrorCaseManagement(woErrorCaseManagementId) {
  return {
    type: types.WO_ERRORCASEMANAGEMENT_DELETE,
    payload: {
      client: 'wo_cat',
      request: {
        method: 'GET',
        url: '/cfgSupportCase/deleteCaseAndCaseTest?id=' + woErrorCaseManagementId
      }
    }
  };
}

export function getListCatServiceCBB(infraType) {
  return {
    type: types.WO_ERRORCASEMANAGEMENT_GETLIST_SERVICE,
    payload: {
      client: 'wo_cat',
      request: {
        method: 'GET',
        url: '/woMaterial/getListCatServiceCBB'
      }
    }
  }
}
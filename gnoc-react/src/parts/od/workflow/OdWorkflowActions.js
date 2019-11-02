import * as odWorkflowTypes from './OdWorkflowTypes';

export function searchOdWorkflow(data) {
  return {
    type: odWorkflowTypes.OD_WORKFLOW_SEARCH,
    payload: {
      client: 'od',
      request:{
        method: 'POST',
        url:'/od/getListDataSearch',
        data: data
      }
    }
  };
}

export function getConfigPropertyOd(key) {
  return {
    type: odWorkflowTypes.OD_WORKFLOW_GET_CONFIG_PROPERTY,
    payload: {
      client: 'od',
      request:{
        method: 'GET',
        url:'/od/getConfigPropertyOd?key=' + key
      }
    }
  };
}

export function getDetailOdWorkflow(odId) {
  return {
    type: odWorkflowTypes.OD_WORKFLOW_GET_DETAIL,
    payload: {
      client: 'od',
      request:{
        method: 'GET',
        url:'/od/getDetailById?odId=' + odId
      }
    }
  };
}

export function addOdWorkflow(files, data) {
  var bodyFormData = new FormData();
  bodyFormData.append('formDataJson', new Blob([JSON.stringify(data)], {type: 'application/json'}));
  for (var i = 0; i < files.length; i++) {
    bodyFormData.append('files', files[i]);
  }
  return {
    type: odWorkflowTypes.OD_WORKFLOW_ADD,
    payload: {
      client: 'od',
      request:{
        method: 'POST',
        url:'/od/insertOdFromWeb',
        data: bodyFormData,
        config: { headers: {'Content-Type': 'multipart/form-data' }}
      }
    }
  };
}

export function editOdWorkflow(files, data, username) {
  var bodyFormData = new FormData();
  bodyFormData.append('formDataJson', new Blob([JSON.stringify(data)], {type: 'application/json'}));
  bodyFormData.append('userName', new Blob([username], {type: 'application/json'}));
  for (var i = 0; i < files.length; i++) {
    bodyFormData.append('files', files[i]);
  }
  return {
    type: odWorkflowTypes.OD_WORKFLOW_EDIT,
    payload: {
      client: 'od',
      request:{
        method: 'POST',
        url:'/od/updateOdFromWeb',
        data: bodyFormData,
        config: { headers: {'Content-Type': 'multipart/form-data' }}
      }
    }
  };
}

export function deleteOdWorkflow(odTypeId) {
  return {
    type: odWorkflowTypes.OD_WORKFLOW_DELETE,
    payload: {
      client: 'od',
      request:{
        method: 'GET',
        url:'/od/delete?odTypeId=' + odTypeId
      }
    }
  };
}

export function getListLinkCodeSearch(data) {
  return {
    type: odWorkflowTypes.OD_WORKFLOW_LINKCODE,
    payload: {
      client: 'od',
      request:{
        method: 'POST',
        url:'/od/searchRelationToUpdate',
        data: data
      }
    }
  };
}

export function getListStatusNext(odId, username) {
  return {
    type: odWorkflowTypes.OD_WORKFLOW_GET_STATUS_NEXT,
    payload: {
      client: 'od',
      request:{
        method: 'GET',
        url:'/od/getListStatusNext?odId=' + odId + '&userName=' + username
      }
    }
  };
}

export function getListColumnCheck(oldStatus, newStatus, priority, odTypeId) {
  return {
    type: odWorkflowTypes.OD_WORKFLOW_GET_COLUMN_CHECK,
    payload: {
      client: 'od',
      request:{
        method: 'POST',
        url:'/od/getListColumnCheck?oldStatus=' + oldStatus + '&newStatus=' + newStatus + '&priority=' + priority + '&odTypeId=' + odTypeId
      }
    }
  };
}
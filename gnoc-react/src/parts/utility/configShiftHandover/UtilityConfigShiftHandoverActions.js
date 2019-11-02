import * as types from './UtilityConfigShiftHandoverTypes';

export function searchUtilityConfigShiftHandover(data) {
  return {
    type: types.UTILITY_CONFIGSHIFTHANDOVER_SEARCH,
    payload: {
      client: 'stream',
      request: {
        method: 'POST',
        url: '/ShiftHandoverController/getListShiftHandover',
        data: data
      }
    }
  };
}

export function getDetailUtilityConfigShiftHandover(utilityConfigShiftHandoverId) {
  return {
    type: types.UTILITY_CONFIGSHIFTHANDOVER_GET_DETAIL,
    payload: {
      client: 'stream',
      request: {
        method: 'POST',
        url: '/ShiftHandoverController/findListShiftHandOverById?id=' + utilityConfigShiftHandoverId
      }
    }
  };
}

export function addUtilityConfigShiftHandover(files, data) {
  var bodyFormData = new FormData();
  bodyFormData.append('formDataJson', new Blob([JSON.stringify(data)], { type: 'application/json' }));
  if (files.length > 0) {
    for (let i = 0; i < files.length; i++) {
      bodyFormData.append('files', files[i]);
    }
  }
  return {
    type: types.UTILITY_CONFIGSHIFTHANDOVER_ADD,
    payload: {
      client: 'stream',
      request: {
        method: 'POST',
        url: '/ShiftHandoverController/insertCfgShiftHandover',
        data: bodyFormData,
        config: { headers: { 'Content-Type': 'multipart/form-data' } }
      }
    }
  };
}

export function editUtilityConfigShiftHandover(files, data) {
  var bodyFormData = new FormData();
  bodyFormData.append('formDataJson', new Blob([JSON.stringify(data)], { type: 'application/json' }));
  if (files.length > 0) {
    for (let i = 0; i < files.length; i++) {
      bodyFormData.append('files', files[i]);
    }
  }
  return {
    type: types.UTILITY_CONFIGSHIFTHANDOVER_EDIT,
    payload: {
      client: 'stream',
      request: {
        method: 'POST',
        url: '/ShiftHandoverController/updateCfgShiftHandover',
        data: bodyFormData,
        config: { headers: { 'Content-Type': 'multipart/form-data' } }
      }
    }
  };
}

export function deleteUtilityConfigShiftHandover(utilityConfigShiftHandoverId) {
  return {
    type: types.UTILITY_CONFIGSHIFTHANDOVER_DELETE,
    payload: {
      client: 'stream',
      request: {
        method: 'GET',
        url: '/ShiftHandoverController/deleteShiftUser?id=' + utilityConfigShiftHandoverId
      }
    }
  };
}

export function getListShiftID() {
  return {
    type: types.UTILITY_CONFIGSHIFTHANDOVER_GETLIST_SHIFT,
    payload: {
      client: 'stream',
      request: {
        method: 'POST',
        url: '/ShiftHandoverController/getListShiftID'
      }
    }
  }
}

export function getListShiftUser(data) {
  return {
    type: types.UTILITY_CONFIGSHIFTHANDOVER_GETLIST_SHIFTUSER,
    payload: {
      client: 'stream',
      request: {
        method: 'POST',
        url: '/ShiftHandoverController/getListShiftUser',
        data: data
      }
    }
  }
}

export function getListShiftWork(data) {
  return {
    type: types.UTILITY_CONFIGSHIFTHANDOVER_GETLIST_SHIFTWORK,
    payload: {
      client: 'stream',
      request: {
        method: 'POST',
        url: '/ShiftHandoverController/getListShiftWork',
        data: data
      }
    }
  }
}

export function countTicketByShift(data) {
  return {
    type: types.UTILITY_CONFIGSHIFTHANDOVER_COUNTTICKET,
    payload: {
      client: 'stream',
      request: {
        method: 'POST',
        url: '/ShiftHandoverController/countTicketByShift',
        data: data
      }
    }
  }
}
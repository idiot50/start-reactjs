import * as types from './UtilityConfigEmployeeDayOffTypes';
import FileSaver from 'file-saver';

export function searchUtilityConfigEmployeeDayOff(data) {
  return {
    type: types.UTILITY_CONFIGEMPLOYEEDAYOFF_SEARCH,
    payload: {
      client: 'stream',
      request: {
        method: 'POST',
        url: '/EmployeeDayOffController/getListEmployeeDayOff',
        data: data
      }
    }
  };
}

export function getDetailUtilityConfigEmployeeDayOff(utilityConfigEmployeeDayOffId) {
  return {
    type: types.UTILITY_CONFIGEMPLOYEEDAYOFF_GET_DETAIL,
    payload: {
      client: 'stream',
      request: {
        method: 'POST',
        url: '/EmployeeDayOffController/findEmployeeDayOffById?id=' + utilityConfigEmployeeDayOffId
      }
    }
  };
}

export function addUtilityConfigEmployeeDayOff(data) {
  return {
    type: types.UTILITY_CONFIGEMPLOYEEDAYOFF_ADD,
    payload: {
      client: 'stream',
      request: {
        method: 'POST',
        url: '/EmployeeDayOffController/insertEmployeeDayOff',
        data: data
      }
    }
  };
}

export function editUtilityConfigEmployeeDayOff(data) {
  return {
    type: types.UTILITY_CONFIGEMPLOYEEDAYOFF_EDIT,
    payload: {
      client: 'stream',
      request: {
        method: 'POST',
        url: '/EmployeeDayOffController/updateEmployeeDayOff',
        data: data
      }
    }
  };
}

export function deleteUtilityConfigEmployeeDayOff(utilityConfigEmployeeDayOffId) {
  return {
    type: types.UTILITY_CONFIGEMPLOYEEDAYOFF_DELETE,
    payload: {
      client: 'stream',
      request: {
        method: 'POST',
        url: '/EmployeeDayOffController/deleteEmployeeDayOffById?id=' + utilityConfigEmployeeDayOffId
      }
    }
  };
}

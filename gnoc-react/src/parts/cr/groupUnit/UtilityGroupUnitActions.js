import * as types from './UtilityGroupUnitTypes';
import FileSaver from 'file-saver';

export function searchUtilityGroupUnit(data) {
  return {
    type: types.UTILITY_GROUPUNIT_SEARCH,
    payload: {
      client: 'cr_cat',
      request: {
        method: 'POST',
        url: '/GroupUnitController/getListGroupUnitDTO',
        data: data
      }
    }
  };
}

export function getDetailUtilityGroupUnit(utilityGroupUnitId) {
  return {
    type: types.UTILITY_GROUPUNIT_GET_DETAIL,
    payload: {
      client: 'cr_cat',
      request: {
        method: 'GET',
        url: '/GroupUnitController/findGroupUnitById?id=' + utilityGroupUnitId
      }
    }
  };
}

export function addUtilityGroupUnit(data) {
  return {
    type: types.UTILITY_GROUPUNIT_ADD,
    payload: {
      client: 'cr_cat',
      request: {
        method: 'POST',
        url: '/GroupUnitController/insertGroupUnit',
        data: data
      }
    }
  };
}

export function editUtilityGroupUnit(data) {
  return {
    type: types.UTILITY_GROUPUNIT_EDIT,
    payload: {
      client: 'cr_cat',
      request: {
        method: 'POST',
        url: '/GroupUnitController/updateGroupUnit',
        data: data
      }
    }
  };
}

export function deleteUtilityGroupUnit(id) {
  return {
    type: types.UTILITY_GROUPUNIT_DELETE,
    payload: {
      client: 'cr_cat',
      request: {
        method: 'GET',
        url: '/GroupUnitController/deleteGroupUnit?id='+id,
      }
    }
  };
}

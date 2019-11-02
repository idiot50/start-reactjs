import * as types from './WoMaterialsConfigTypes';
import FileSaver from 'file-saver'

export function searchWoMaterialsConfig(data) {
  return {
    type: types.WO_MATERIALSCONFIG_SEARCH,
    payload: {
      client: 'wo_cat',
      request: {
        method: 'POST',
        url: '/woMaterial/listWoMaterial',
        data: data
      }
    }
  };
}

export function getDetailWoMaterialsConfig(woMaterialsConfigId) {
  return {
    type: types.WO_MATERIALSCONFIG_GET_DETAIL,
    payload: {
      client: 'wo_cat',
      request: {
        method: 'GET',
        url: '/woMaterial/GetDetailByMaterialThresId?materialThresId=' + woMaterialsConfigId
      }
    }
  };
}

export function addWoMaterialsConfig(data) {
  return {
    type: types.WO_MATERIALSCONFIG_ADD,
    payload: {
      client: 'wo_cat',
      request: {
        method: 'POST',
        url: '/woMaterial/insert',
        data: data
      }
    }
  };
}

export function editWoMaterialsConfig(data) {
  return {
    type: types.WO_MATERIALSCONFIG_EDIT,
    payload: {
      client: 'wo_cat',
      request: {
        method: 'POST',
        url: '/woMaterial/update',
        data: data
      }
    }
  };
}

export function deleteWoMaterialsConfig(woMaterialsConfigId) {
  return {
    type: types.WO_MATERIALSCONFIG_DELETE,
    payload: {
      client: 'wo_cat',
      request: {
        method: 'GET',
        url: '/woMaterial/delete?materialThresId=' + woMaterialsConfigId
      }
    }
  };
}

export function getListCatServiceCBB() {
  return {
    type: types.WO_MATERIALSCONFIG_GETSERVICE_BYINFRATYPE,
    payload: {
      client: 'wo_cat',
      request: {
        method: 'GET',
        url: '/woMaterial/getListCatServiceCBB',
      }
    }
  }
}

export function getActionList(categoryCode) {
  return {
    type: types.WO_MATERIALSCONFIG_GET_ACTIONLIST,
    payload: {
      client: 'wo_cat',
      request: {
        method: 'POST',
        url: '/woMaterial/getItemAction?categoryCode='+categoryCode,
      }
    }
  }
}

import * as types from './WoCdGroupManagementTypes';
import FileSaver from 'file-saver';

export function searchWoCdGroupManagement(data) {
  return {
    type: types.WO_CDGROUPMANAGEMENT_SEARCH,
    payload: {
      client: 'wo_cat',
      request: {
        method: 'POST',
        url: '/WoCdGroup/getListWoCdGroupDTO',
        data: data
      }
    }
  };
}

export function getDetailWoCdGroupManagement(woCdGroupManagementId) {
  return {
    type: types.WO_CDGROUPMANAGEMENT_GET_DETAIL,
    payload: {
      client: 'wo_cat',
      request: {
        method: 'POST',
        url: '/WoCdGroup/findWoCdGroupById?woGroupId=' + woCdGroupManagementId
      }
    }
  };
}

export function addWoCdGroupManagement(data) {
  return {
    type: types.WO_CDGROUPMANAGEMENT_ADD,
    payload: {
      client: 'wo_cat',
      request: {
        method: 'POST',
        url: '/WoCdGroup/insertWoCdGroup',
        data: data
      }
    }
  };
}

export function editWoCdGroupManagement(data) {
  return {
    type: types.WO_CDGROUPMANAGEMENT_EDIT,
    payload: {
      client: 'wo_cat',
      request: {
        method: 'POST',
        url: '/WoCdGroup/updateWoCdGroup',
        data: data
      }
    }
  };
}

export function deleteWoCdGroupManagement(woCdGroupManagementId) {
  return {
    type: types.WO_CDGROUPMANAGEMENT_DELETE,
    payload: {
      client: 'wo_cat',
      request: {
        method: 'GET',
        url: '/WoCdGroup/deleteWoCdGroup?woGroupId=' + woCdGroupManagementId
      }
    }
  };
}

export function getListWoCdGroupType() {
  return {
    type: types.WO_CDGROUPMANAGEMENT_GETLIST_GROUPTYPE,
    payload: {
      client: 'wo_cat',
      request: {
        method: 'POST',
        url: '/WoCdGroup/getListWoCdGroupType'
      }
    }
  }
}

export function getListUserDTO(data) {
  return {
    type: types.WO_CDGROUPMANAGEMENT_GETLIST_USER,
    payload: {
      client: 'stream',
      request: {
        method: 'POST',
        url: '/UsersService/getListUserDTO',
        data: data
      }
    }
  }
}

export function getListWoCdGroupUnitDTO(data) {
  return {
    type: types.WO_CDGROUPMANAGEMENT_GETLIST_GROUPUNIT_DTO,
    payload: {
      client: 'wo_cat',
      request: {
        method: 'POST',
        url: '/WoCdGroup/getListWoCdGroupUnitDTO',
        data: data
      }
    }
  }
}

export function updateWoCdGroupUnit(data) {
  return {
    type: types.WO_CDGROUPMANAGEMENT_UPDATE_GROUPUNIT_DTO,
    payload: {
      client: 'wo_cat',
      request: {
        method: 'POST',
        url: '/WoCdGroup/updateWoCdGroupUnit',
        data: data
      }
    }
  }
}

export function getListWoCdDTO(data) {
  return {
    type: types.WO_CDGROUPMANAGEMENT_GETLIST_GROUPUSER_DTO,
    payload: {
      client: 'wo_cat',
      request: {
        method: 'POST',
        url: '/WoCdGroup/getListWoCdDTO',
        data: data
      }
    }
  }
}

export function updateWoCd(data) {
  return {
    type: types.WO_CDGROUPMANAGEMENT_UPDATE_GROUPUSER_DTO,
    payload: {
      client: 'wo_cat',
      request: {
        method: 'POST',
        url: '/WoCdGroup/updateWoCd',
        data: data
      }
    }
  }
}

export function getListWoTypeAll() {
  return {
    type: types.WO_CDGROUPMANAGEMENT_GETLIST_GROUPALLWORK_DTO,
    payload: {
      client: 'wo_cat',
      request: {
        method: 'POST',
        url: '/WoCdGroup/getListWoTypeAll',
      }
    }
  }
}

export function getListWoTypeGroupDTO(data) {
  return {
    type: types.WO_CDGROUPMANAGEMENT_GETLIST_GROUPWORK_DTO,
    payload: {
      client: 'wo_cat',
      request: {
        method: 'POST',
        url: '/WoCdGroup/getListWoTypeGroupDTO',
        data: data
      }
    }
  }
}

export function updateWoTypeGroup(data) {
  return {
    type: types.WO_CDGROUPMANAGEMENT_UPDATE_GROUPWORK_DTO,
    payload: {
      client: 'wo_cat',
      request: {
        method: 'POST',
        url: '/WoCdGroup/updateWoTypeGroup',
        data: data
      }
    }
  }
}

export function updateStatusWoCdGroupManagement(data) {
  return {
    type: types.WO_CDGROUPMANAGEMENT_UPDATE_STATUS,
    payload: {
      client: 'wo_cat',
      request: {
        method: 'POST',
        url: '/WoCdGroup/updateStatusCdGroup',
        data: data
      }
    }
  };
}
import * as types from './TtConfigMopTypes';

export function searchTtConfigMop(data) {
  return {
    type: types.TT_CONFIGMOP_SEARCH,
    payload: {
      client: 'stream',
      request:{
        method: 'POST',
        url:'/MapFlowTemplates/getListMapFlowTemplatesDTO',
        data: data
      }
    }
  };
}

export function getDetailTtConfigMop(ttConfigMopId) {
  return {
    type: types.TT_CONFIGMOP_GET_DETAIL,
    payload: {
      client: 'stream',
      request:{
        method: 'GET',
        url:'/MapFlowTemplates/findMapFlowTemplatesById?mapFlowTemplatesId=' + ttConfigMopId
      }
    }
  };
}

export function addTtConfigMop(data) {
  return {
    type: types.TT_CONFIGMOP_ADD,
    payload: {
      client: 'stream',
      request:{
        method: 'POST',
        url:'/MapFlowTemplates/insertMapFlowTemplates',
        data: data
      }
    }
  };
}

export function editTtConfigMop(data) {
  return {
    type: types.TT_CONFIGMOP_EDIT,
    payload: {
      client: 'stream',
      request:{
        method: 'POST',
        url:'/MapFlowTemplates/updateMapFlowTemplates',
        data: data
      }
    }
  };
}

export function deleteTtConfigMop(ttConfigMopId) {
  return {
    type: types.TT_CONFIGMOP_DELETE,
    payload: {
      client: 'stream',
      request:{
        method: 'GET',
        url:'/MapFlowTemplates/deleteMapFlowTemplates?mapFlowTemplatesId=' + ttConfigMopId
      }
    }
  };
}
export function getMopGroup(){
  return {
    type: types.TT_CONFIGMOP_GETGROUP,
    payload: {
      client: 'stream',
      request:{
        method: 'POST',
        url:'/CfgUnitTtSpm/getListCatItem',
      }
    }
  };
}
export function getMopArray(itemID){
  return {
    type: types.TT_CONFIGMOP_GETARRAY,
    payload: {
      client: 'stream',
      request:{
        method: 'GET',
        url:`/MapFlowTemplates/getListItemByCategoryAndParent?parentItemId=${itemID}`,
      }
    }
  };
}
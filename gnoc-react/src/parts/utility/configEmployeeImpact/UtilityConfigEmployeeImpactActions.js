import * as types from './UtilityConfigEmployeeImpactTypes';

export function searchUtilityConfigEmployeeImpact(data) {
  return {
    type: types.UTILITY_CONFIGEMPLOYEEIMPACT_SEARCH,
    payload: {
      client: 'stream',
      request:{
        method: 'POST',
        url:'/EmployeeImpactController/getListEmployeeImpact',
        data: data
      }
    }
  };
}

export function getListParentArray() {
  return {
    type: types.UTILITY_CONFIGEMPLOYEEIMPACT_GET_PARENT_ARRAY,
    payload: {
      client: 'cr',
      request:{
        method: 'GET',
        url:'/CrGeneralService/getListImpactSegmentCBB'
      }
    }
  };
}
export function getListChildArray(data) {
  return {
    type: types.UTILITY_CONFIGEMPLOYEEIMPACT_GET_CHILD_ARRAY,
    payload: {
      client: 'stream',
      request:{
        method: 'POST',
        url:'/EmployeeImpactController/getListChildArray',
        data:data
      }
    }
  };
}

export function getListLevel(data) {
  return {
    type: types.UTILITY_CONFIGEMPLOYEEIMPACT_GET_LEVEL,
    payload: {
      client: 'stream',
      request:{
        method: 'POST',
        url:'/EmployeeImpactController/getListLevel',
        data:data
      }
    }
  };
}

export function getDetailUtilityConfigEmployeeImpact(idImpact) {
  return {
    type: types.UTILITY_CONFIGEMPLOYEEIMPACT_GET_DETAIL,
    payload: {
      client: 'stream',
      request:{
        method: 'POST',
        url:'/EmployeeImpactController/findEmpImpactById?id=' + idImpact
      }
    }
  };
}


export function addUtilityConfigEmployeeImpact(data) {
  return {
    type: types.UTILITY_CONFIGEMPLOYEEIMPACT_ADD,
    payload: {
      client: 'stream',
      request:{
        method: 'POST',
        url:'/EmployeeImpactController/insertEmpImpact',
        data: data
      }
    }
  };
}

export function editUtilityConfigEmployeeImpact(data) {
  return {
    type: types.UTILITY_CONFIGEMPLOYEEIMPACT_EDIT,
    payload: {
      client: 'stream',
      request:{
        method: 'POST',
        url:'/EmployeeImpactController/updateEmpImpact',
        data: data
      }
    }
  };
}

export function deleteUtilityConfigEmployeeImpact(idImpact) {
  return {
    type: types.UTILITY_CONFIGEMPLOYEEIMPACT_DELETE,
    payload: {
      client: 'stream',
      request:{
        method: 'POST',
        url:'/EmployeeImpactController/deleteEmpImpact?id=' + idImpact
      }
    }
  };
}
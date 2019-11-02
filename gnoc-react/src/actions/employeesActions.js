import * as types from './employeesTypes';

export function onSearchTable(data) {
  return {
    type: types.SEARCH_EMPLOYEE,
    payload: {
      client: 'default',
      request:{
        method: 'POST',
        url:'/employees/search',
        data: data
      }
    }
  };
}

export function onGetDetail(userId) {
  return {
    type: types.GET_DETAIL_EMPLOYEE,
    payload: {
      client: 'default',
      request:{
        method: 'GET',
        url:'/employees/getDetail?userId=' + userId
      }
    }
  };
}

export function onAdd(formData) {
  return {
    type: types.ADD_EMPLOYEE,
    payload: {
      client: 'default',
      request:{
        method: 'POST',
        url:'/employees/add',
        data: formData,
        config: { headers: {'Content-Type': 'multipart/form-data' }}
      }
    }
  };
}

export function onEdit(formData) {
  return {
    type: types.EDIT_EMPLOYEE,
    payload: {
      client: 'default',
      request:{
        method: 'POST',
        url:'/employees/edit',
        data: formData,
        config: { headers: {'Content-Type': 'multipart/form-data' }}
      }
    }
  };
}

export function onDelete(userId) {
  return {
    type: types.DELETE_EMPLOYEE,
    payload: {
      client: 'default',
      request:{
        method: 'GET',
        url:'/employees/delete?userId=' + userId
      }
    }
  };
}

export function onCheckExistUsername(username, userId) {
  return {
    type: types.CHECK_EXIST_USERNAME,
    payload: {
      client: 'default',
      request:{
        method: 'GET',
        url:'/employees/checkExistUsername?username=' + username + '&userId=' + userId
      }
    }
  };
}

export function onCheckExistEmployeeCode(employeeCode, userId) {
  return {
    type: types.CHECK_EXIST_EMPLOYEE_CODE,
    payload: {
      client: 'default',
      request:{
        method: 'GET',
        url:'/employees/checkExistEmployeeCode?employeeCode=' + employeeCode + '&userId=' + userId
      }
    }
  };
}
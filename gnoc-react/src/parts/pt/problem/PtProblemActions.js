import * as types from './PtProblemTypes';
import FileSaver from 'file-saver';

export function searchPtProblem(data) {
  return {
    type: types.PT_PROBLEM_SEARCH,
    payload: {
      client: 'pt',
      request: {
        method: 'POST',
        url: '/Problems/getListProblemsSearch',
        data: data
      }
    }
  };
}

export function getDetailPtProblem(problemId) {
  return {
    type: types.PT_PROBLEM_GET_DETAIL,
    payload: {
      client: 'pt',
      request: {
        method: 'POST',
        url: '/Problems/findProblemsById?id=' + problemId
      }
    }
  };
}

export function addPtProblem(files, data) {
  var bodyFormData = new FormData();
  bodyFormData.append('formDataJson', new Blob([JSON.stringify(data)], { type: 'application/json' }));
  for (var i = 0; i < files.length; i++) {
    bodyFormData.append('files', files[i]);
  }
  return {
    type: types.PT_PROBLEM_ADD,
    payload: {
      client: 'pt',
      request: {
        method: 'POST',
        url: '/Problems/insertProblems',
        data: bodyFormData,
        config: { headers: { 'Content-Type': 'multipart/form-data' } }
      }
    }
  };
}

export function editPtProblem(data) {
  return {
    type: types.PT_PROBLEM_EDIT,
    payload: {
      client: 'pt',
      request: {
        method: 'POST',
        url: '/Problems/updateProblems',
        data: data
      }
    }
  };
}

export function getListProblemDuplicate(data) {
  return {
    type: types.PT_PROBLEM_SEARCH_DUPLICATE,
    payload: {
      client: 'pt',
      request: {
        method: 'POST',
        url: '/Problems/getListProblemSearchDulidate',
        data: data
      }
    }
  }
}

export function searchProblemNode(data) {
  return {
    type: types.PT_PROBLEM_NODE_SEARCH,
    payload: {
      client: 'pt',
      request: {
        method: 'POST',
        url: '/ProblemNodeService/searchProblemNode',
        data: data
      }
    }
  }
}

export function searchProblemCr(data) {
  return {
    type: types.PT_PROBLEM_CR_SEARCH,
    payload: {
      client: 'pt',
      request: {
        method: 'POST',
        url: '/ProblemCrService/searchProblemCr',
        data: data
      }
    }
  }
}

export function searchProblemWo(data) {
  return {
    type: types.PT_PROBLEM_WO_SEARCH,
    payload: {
      client: 'pt',
      request: {
        method: 'POST',
        url: '/ProblemWo/getListDataSearchWeb',
        data: data
      }
    }
  }
}

export function searchProblemActionLogs(data) {
  return {
    type: types.PT_PROBLEM_ACTION_LOGS_SEARCH,
    payload: {
      client: 'pt',
      request: {
        method: 'POST',
        url: '/ProblemActionLogsService/searchProblemActionLogs',
        data: data
      }
    }
  }
}

export function getListProblemDTOForTT(data) {
  return {
    type: types.PT_PROBLEM_TT_GET_LIST,
    payload: {
      client: 'pt',
      request: {
        method: 'POST',
        url: '/Problems/getListProblemDTOForTT',
        data: data
      }
    }
  }
}

export function getTransitionStatus(data) {
  return {
      type: types.ON_GET_TRANSITION_STATUS,
      payload: {
          client: 'pt',
          request:{
              method: 'POST',
              url: "/Problems/getTransitionStatus",
              data: data
          }
      }
  }
}

export function getListDeviceTypeVersion(data) {
  return {
      type: types.ON_GET_DEVICE_TYPE_VERSION,
      payload: {
          client: 'stream',
          request:{
              method: 'POST',
              url: "/DeviceTypeVersionService/getListDeviceTypeVersion",
              data: data
          }
      }
  };
}

export function getListProblemFiles(data) {
  return {
      type: types.ON_GET_LIST_PROBLEM_FILES,
      payload: {
          client: 'pt',
          request:{
              method: 'POST',
              url: "/ProblemFilesService/getListProblemFilesDTO",
              data: data
          }
      }
  };
}

export function getListKedb(data) {
  return {
      type: types.ON_GET_LIST_KEDB,
      payload: {
          client: 'kedb',
          request:{
              method: 'POST',
              url: "/KedbService/getListKedbDTO",
              data: data
          }
      }
  };
}

export function addProblemFiles(files, data) {
  var bodyFormData = new FormData();
  bodyFormData.append('formDataJson', new Blob([JSON.stringify(data)], { type: 'application/json' }));
  for (var i = 0; i < files.length; i++) {
    bodyFormData.append('files', files[i]);
  }
  return {
    type: types.PT_PROBLEM_ADD_PROBLEM_FILES,
    payload: {
      client: 'pt',
      request: {
        method: 'POST',
        url: '/ProblemFilesService/insertProblemFilesUpload',
        data: bodyFormData,
        config: { headers: { 'Content-Type': 'multipart/form-data' } }
      }
    }
  };
}

export function deleteProblemFiles(id) {
  return {
      type: types.ON_DELETE_PROBLEM_FILES,
      payload: {
          client: 'pt',
          request:{
              method: 'GET',
              url: "/ProblemFilesService/deleteProblemFiles?problemFileId=" + id,
          }
      }
  };
}

export function getListChatUsers(data) {
  return {
      type: types.ON_GET_CHAT_LIST_USERS,
      payload: {
          client: 'pt',
          request:{
              method: 'POST',
              url: "/Problems/getListChatUsers",
              data: data
          }
      }
  };
}

export function getListUsers(data) {
  return {
      type: types.ON_GET_LIST_USERS,
      payload: {
          client: 'stream',
          request:{
              method: 'POST',
              url: "/UsersService/getListUserDTO",
              data: data
          }
      }
  };
}

export function getListUsersSupport(data) {
  return {
      type: types.ON_GET_LIST_USERS_SUPPORT,
      payload: {
          client: 'pt',
          request:{
              method: 'POST',
              url: "/Problems/loadUserSupportGroup",
              data: data
          }
      }
  };
}

export function sendChatListUsers(data) {
  return {
    type: types.ON_SEND_CHAT_LIST_USERS,
    payload: {
      client: 'pt',
      request: {
        method: 'POST',
        url: '/Problems/sendChatListUsers',
        data: data
      }
    }
  }
}

export function insertProblemWorklog(data) {
  return {
      type: types.ON_INSERT_PROBLEM_WORKLOG,
      payload: {
          client: 'pt',
          request:{
              method: 'POST',
              url: "/ProblemWorklog/insertProblemWorklog",
              data: data
          }
      }
  };
}

export function getListProblemWorklog(data) {
  return {
      type: types.ON_GET_LIST_PROBLEM_WORKLOG,
      payload: {
          client: 'pt',
          request:{
              method: 'POST',
              url: "/ProblemWorklog/getListProblemWorklogDTO",
              data: data
          }
      }
  };
}

export function getListPtRelated(data) {
  return {
    type: types.PT_PROBLEM_GET_LIST_PT_RELATED,
    payload: {
      client: 'pt',
      request: {
        method: 'POST',
        url: '/Problems/getListPtRelated',
        data: data
      }
    }
  };
}

export function onSearchTroubleRelated(data) {
  return {
    type: types.PT_PROBLEM_GET_LIST_TT_RELATED,
    payload: {
      client: 'tt',
      request: {
        method: 'POST',
        url: '/Troubles/onSearchTroubleRelated',
        data: data
      }
    }
  };
}

export function downloadProblemFiles(data) {
  var bodyFormData = new FormData();
  bodyFormData.append('formDataJson', JSON.stringify(data));
  return {
      type: types.ON_DOWNLOAD_PROBLEM_FILES,
      payload: {
          client: 'pt',
          request:{
              method: 'POST',
              url: "/ProblemFilesService/downloadProblemFiles",
              data: bodyFormData,
              responseType: 'blob'
          },
          options: {
              onSuccess({ getState, dispatch, response }) {
                  const contentDisposition = response.headers["content-disposition"];
                  const fileName = contentDisposition.split(";")[2].split("=")[1].split("\"").join("");
                  FileSaver.saveAs(new Blob([response.data]), fileName);
              },
              onError({ getState, dispatch, error }) {

              },
          }
      }
  };
}

export function getListRolePmByUser() {
  return {
    type: types.PT_PROBLEM_GET_LIST_ROLE_PM,
    payload: {
      client: 'pt',
      request: {
        method: 'GET',
        url: '/Problems/getListRolePmByUser'
      }
    }
  };
}
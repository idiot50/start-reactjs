import * as types from './commonTypes';
import FileSaver from 'file-saver';

export function getItemMaster(categoryCode, idColName, nameCol, system, type) {
    return {
        type: `${types.OD_TYPE_GET_ITEM_MASTER}_${categoryCode}`,
        payload: {
            client: 'stream',
            request:{
                method: 'POST',
                url: "/commonStreamAPI/getItemMaster?categoryCode=" + categoryCode + "&idColName=" + idColName
                + "&nameCol=" + nameCol + "&system=" + system + "&type=" + type
            }
        }
    };
}

export function getListCombobox(client, moduleName, parent, isHasChildren, param, rownum, value) {
    parent = parent ? parent : "";
    value = value ? value : "";
    isHasChildren = isHasChildren === true ? "1" : "0";
    param = param ? param : "";
    return {
        type: types.ON_GET_LIST_COMBOBOX,
        payload: {
            client: client,
            request:{
                method: 'GET',
                url: "/commonStreamAPI/getListCombobox?moduleName=" + moduleName 
                    + "&parent=" + parent + "&isHasChildren=" + isHasChildren + "&param=" + param + "&rownum=" + rownum + "&value=" + value
            }
        }
    };
}

export function getTreeData(client, moduleName, parent, param) {
    parent = parent ? parent : "";
    param = param ? param : "";
    return {
        type: types.ON_GET_TREE_DATA,
        payload: {
            client: client,
            request:{
                method: 'GET',
                url: "/commonStreamAPI/getTreeData?moduleName=" + moduleName 
                    + "&parent=" + parent + "&param=" + param
            }
        }
    };
}

export function getListTimezone() {
    return {
        type: types.ON_GET_LIST_TIMEZONE,
        payload: {
            client: "stream",
            request:{
                method: 'GET',
                url: "/commonStreamAPI/getAllGnocTimezone"
            }
        }
    };
}

export function updateUserTimeZone(timeZoneId) {
    return {
        type: types.ON_UPDATE_USER_TIMEZONE,
        payload: {
            client: "stream",
            request:{
                method: 'POST',
                url: "/UsersService/updateUserTimeZone?timeZoneId=" + timeZoneId
            }
        }
    };
}

export function getListLanguage() {
    return {
        type: types.ON_GET_LIST_LANGUAGE,
        payload: {
            client: "stream",
            request:{
                method: 'GET',
                url: "/commonStreamAPI/getAllGnocLanguage"
            }
        }
    };
}

export function updateUserLanguage(languageId) {
    return {
        type: types.ON_UPDATE_USER_LANGUAGE,
        payload: {
            client: "stream",
            request:{
                method: 'POST',
                url: "/UsersService/updateUserLanguage?languageId=" + languageId
            }
        }
    };
}

export function onImportFile(client, moduleName, file, filesAttachment, objectSearchUpload) {
    var bodyFormData = new FormData();
    bodyFormData.append('formDataJson', JSON.stringify(objectSearchUpload));
    bodyFormData.append('moduleName', moduleName); 
    bodyFormData.append('file', file);
    for (var i = 0; i < filesAttachment.length; i++) {
        bodyFormData.append('filesAttachment', filesAttachment[i]);
    }
    return {
        type: types.ON_IMPORT_FILE,
        payload: {
            client: client,
            request:{
                method: 'POST',
                config: { headers: {'Content-Type': 'multipart/form-data' }},
                url: "/import/onImportFile",
                data: bodyFormData,
                responseType: 'blob'
            },
            options: {
                onSuccess({ getState, dispatch, response }) {
                    const contentDisposition = response.headers["content-disposition"];
                    const result = contentDisposition.split(";")[1].split("=")[1].split("\"").join("");
                    if (result === "ERROR") {
                        const fileName = contentDisposition.split(";")[2].split("=")[1].split("\"").join("");
                        FileSaver.saveAs(new Blob([response.data]), fileName);
                    }
                    return response;
                },
                onError({ getState, dispatch, error }) {
                    return error;
                },
            }
        }
    };
}

export function onExportFile(client, moduleName, objectSearch) {
    var bodyFormData = new FormData();
    bodyFormData.append('formDataJson', JSON.stringify(objectSearch));
    bodyFormData.append('moduleName', moduleName); 
    return {
        type: types.ON_EXPORT_FILE,
        payload: {
            client: client,
            request:{
                method: 'POST',
                url: "/export/onExportFile",
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

export function onDownloadFileTemplate(client, moduleName) {
    return {
        type: types.ON_DOWNLOAD_FILE_TEMPLATE,
        payload: {
            client: client,
            request:{
                method: 'GET',
                url: "/download/onDownloadFileTemplate?moduleName=" + moduleName,
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

export function onDownloadFileById(client, id) {
    return {
        type: types.ON_DOWNLOAD_FILE_BY_ID,
        payload: {
            client: client,
            request:{
                method: 'GET',
                url: "/download/onDownloadFileById?id=" + id,
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

export function onDownloadFileByPath(client, data) {
    return {
        type: types.ON_DOWNLOAD_FILE_BY_PATH,
        payload: {
            client: client,
            request:{
                method: 'POST',
                url: "/download/onDownloadFileByPath",
                data: data,
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

export function onDownloadFileTempByPath(client, data) {
    return {
        type: types.ON_DOWNLOAD_FILE_TEMP_BY_PATH,
        payload: {
            client: client,
            request:{
                method: 'POST',
                url: "/download/onDownloadFileTempByPath",
                data: data,
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

export function onTheSign(client, moduleName, file, objectSearchTheSign) {
    var bodyFormData = new FormData();
    bodyFormData.append('formDataJson', JSON.stringify(objectSearchTheSign));
    bodyFormData.append('moduleName', moduleName); 
    bodyFormData.append('files', file);
    return {
        type: types.ON_THE_SIGN,
        payload: {
            client: client,
            request:{
                method: 'POST',
                config: { headers: {'Content-Type': 'multipart/form-data' }},
                url: "/theSign/onTheSign",
                data: bodyFormData
            }
        }
    };
}

export function getListTableConfigUser(data) {
    return {
        type: types.ON_GET_LIST_TABLE_CONFIG_USER,
        payload: {
            client: 'stream',
            request:{
                method: 'POST',
                url: "/TableConfigUserService/getListTableConfigUserDTO",
                data: data
            }
        }
    };
}

export function insertTableConfigUser(data) {
    return {
        type: types.ON_INSERT_TABLE_CONFIG_USER,
        payload: {
            client: 'stream',
            request:{
                method: 'POST',
                url: "/TableConfigUserService/insertTableConfigUser",
                data: data
            }
        }
    };
}

export function updateTableConfigUser(data) {
    return {
        type: types.ON_UPDATE_TABLE_CONFIG_USER,
        payload: {
            client: 'stream',
            request:{
                method: 'POST',
                url: "/TableConfigUserService/updateTableConfigUser",
                data: data
            }
        }
    };
}

export function deleteTableConfigUser(id) {
    return {
        type: types.ON_DELETE_TABLE_CONFIG_USER,
        payload: {
            client: 'stream',
            request:{
                method: 'POST',
                url: "/TableConfigUserService/deleteTableConfigUser?id=" + id
            }
        }
    };
}

export function getListSearchConfigUser(data) {
    return {
        type: types.ON_GET_LIST_SEARCH_CONFIG_USER,
        payload: {
            client: 'stream',
            request:{
                method: 'POST',
                url: "/SearchConfigUserService/getListSearchConfigUserDTO",
                data: data
            }
        }
    };
}
  
export function insertOrUpdateListSearchConfigUser(data) {
    return {
        type: types.ON_INSERT_OR_UPDATE_SEARCH_CONFIG_USER,
        payload: {
            client: 'stream',
            request:{
                method: 'POST',
                url: "/SearchConfigUserService/insertOrUpdateListSearchConfigUser",
                data: data
            }
        }
    };
}

export function deleteListSearchConfigUser(data) {
    return {
        type: types.ON_DELETE_LIST_SEARCH_CONFIG_USER,
        payload: {
            client: 'stream',
            request:{
                method: 'POST',
                url: "/SearchConfigUserService/deleteListSearchConfigUser",
                data: data
            }
        }
    };
}

export function getListCatItemDTO(data) {
    return {
        type: types.ON_GET_LIST_CAT_ITEM_DTO,
        payload: {
            client: 'stream',
            request:{
                method: 'GET',
                url: "/commonStreamAPI/getListCatItemDTOByListCategoryLE?categories=" + data
            }
        }
    };
}

export function getListItemByCategoryAndParent(code, parent) {
    return {
        type: types.ON_GET_LIST_ITEM_BY_CAT_AND_PARENT,
        payload: {
            client: 'stream',
            request:{
                method: 'GET',
                url: "/commonStreamAPI/getListItemByCategoryAndParent?categoryCode=" + code + "&parentItemId=" + parent
            }
        }
    };
}

export function getListCatItemByListParent(code, listParent) {
    return {
        type: types.ON_GET_LIST_ITEM_BY_LIST_PARENT,
        payload: {
            client: 'stream',
            request:{
                method: 'GET',
                url: "/commonStreamAPI/getListCatItemByListParent?categoryId=" + code + "&lstParentItemId=" + listParent
            }
        }
    };
}

export function getTransitionState(data) {
    return {
        type: types.ON_GET_TRANSITION_STATE,
        payload: {
            client: 'stream',
            request:{
                method: 'POST',
                url: "/TransitionStateConfig/onSearch",
                data: data
            }
        }
    };
}

export function getListReceiveUnitSearch(data) {
    return {
        type: types.ON_GET_UNIT_SEARCH,
        payload: {
            client: 'stream',
            request:{
                method: 'POST',
                url:'/commonStreamAPI/getListReceiveUnitSearch',
                data: data
            }
        }
    };
}

export function getConfigProperty(key) {
    return {
        type: types.ON_GET_CONFIG_PROPERTY,
        payload: {
            client: 'stream',
            request: {
                method: 'GET',
                url: '/commonStreamAPI/getConfigProperty?key=' + key
            }
        }
    };
}

export function getListNode(data) {
    return {
        type: types.ON_GET_LIST_NODE,
        payload: {
            client: 'stream',
            request: {
                method: 'POST',
                url: '/InfraDeviceService/getInfraDeviceDTO',
                data: data
            }
        }
    }
}

export function getListNodeV2(data) {
    return {
        type: types.ON_GET_LIST_NODE_V2,
        payload: {
            client: 'stream',
            request: {
                method: 'POST',
                url: '/InfraDeviceService/getInfraDeviceDTOV2',
                data: data
            }
        }
    }
}

export function getListLocationByLevelCBB(level, parentId) {
    return {
        type: types.ON_GET_LIST_LOCATION_BY_LEVEL,
        payload: {
            client: 'stream',
            request: {
                method: 'GET',
                url: '/CatLocationService/getListLocationByLevelCBB?level=' + level + '&parentId=' + parentId
            }
        }
    }
}

export function getItemServiceMaster(idColName, nameCol, system, type) {
    return {
        type: types.ON_GET_ITEM_SERVICE_MASTER,
        payload: {
            client: 'stream',
            request:{
                method: 'POST',
                url: "/commonStreamAPI/getItemServiceMaster?idColName=" + idColName
                + "&nameCol=" + nameCol + "&system=" + system + "&type=" + type
            }
        }
    };
}

export function getCompCauseListByMap(data) {
    return {
        type: types.ON_GET_COMP_CAUSE,
        payload: {
            client: 'stream',
            request: {
                method: 'POST',
                url: '/CompCauseService/getCompCauseListByMap',
                data: data
            }
        }
    }
}
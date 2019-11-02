import * as types from './CrManagementTypes';
import FileSaver from 'file-saver';

export function searchCrManagement(data) {
  return {
    type: types.CR_MANAGEMENT_SEARCH,
    payload: {
      client: 'cr',
      request:{
        method: 'POST',
        url:'/CRService/onSearch',
        data: data
      }
    }
  };
}

export function getDetailCrManagement(crManagementId) {
  return {
    type: types.CR_MANAGEMENT_GET_DETAIL,
    payload: {
      client: 'cr',
      request:{
        method: 'GET',
        url:'/CRService/findCrById?id=' + crManagementId
      }
    }
  };
}

export function addCrManagement(data) {
  return {
    type: types.CR_MANAGEMENT_ADD,
    payload: {
      client: 'cr',
      request:{
        method: 'POST',
        url:'/CRService/insertCr',
        data: data
      }
    }
  };
}

export function editCrManagement(data) {
  return {
    type: types.CR_MANAGEMENT_EDIT,
    payload: {
      client: 'cr',
      request:{
        method: 'POST',
        url:'/CRService/updateCr',
        data: data
      }
    }
  };
}

export function deleteCrManagement(crManagementId) {
  return {
    type: types.CR_MANAGEMENT_DELETE,
    payload: {
      client: 'cr',
      request:{
        method: 'GET',
        url:'/CRService/delete?crManagementId=' + crManagementId
      }
    }
  };
}

export function getListSubcategoryCBB() {
  return {
    type: types.CR_MANAGEMENT_GET_SUBCATEGORY,
    payload: {
      client: 'cr',
      request:{
        method: 'GET',
        url:'/CrGeneralService/getListSubcategoryCBB'
      }
    }
  };
}

export function getListImpactSegmentCBB() {
  return {
    type: types.CR_MANAGEMENT_GET_IMPACT_SEGMENT,
    payload: {
      client: 'cr',
      request:{
        method: 'GET',
        url:'/CrGeneralService/getListImpactSegmentCBB'
      }
    }
  };
}

export function getListImpactAffectCBB() {
  return {
    type: types.CR_MANAGEMENT_GET_IMPACT_AFFECT,
    payload: {
      client: 'cr',
      request:{
        method: 'GET',
        url:'/CrGeneralService/getListImpactAffectCBB'
      }
    }
  };
}

export function getListAffectedServiceCBB(form) {
  return {
    type: types.CR_MANAGEMENT_GET_AFFECTED_SERVICE,
    payload: {
      client: 'cr',
      request:{
        method: 'GET',
        url:'/CrGeneralService/getListAffectedServiceCBB?form=' + form
      }
    }
  };
}

export function getListDutyTypeCBB(data) {
  return {
    type: types.CR_MANAGEMENT_GET_DUTY_TYPE,
    payload: {
      client: 'cr',
      request:{
        method: 'POST',
        url:'/CrGeneralService/getListDutyTypeCBB',
        data: data
      }
    }
  };
}

export function getListScopeOfUserForAllRole(data) {
  return {
    type: types.CR_MANAGEMENT_GET_LIST_SCOPE,
    payload: {
      client: 'cr',
      request:{
        method: 'POST',
        url:'/CRService/getListScopeOfUserForAllRole',
        data: data
      }
    }
  };
}

export function getNetworkNodeFromQLTN(json) {
  return {
    type: types.CR_MANAGEMENT_GET_NODE_QLTN,
    payload: {
      client: 'cr',
      request:{
        method: 'POST',
        url:'/CRService/getNetworkNodeFromQLTN?json=' + json
      }
    }
  };
}

export function getSequenseCr(sequenseCr, size) {
  return {
    type: types.CR_MANAGEMENT_GET_SEQUENCE,
    payload: {
      client: 'cr',
      request:{
        method: 'GET',
        url:'/CRService/getSequenseCr?sequenseCr=' + sequenseCr + '&size=' + size
      }
    }
  };
}

export function checkDuplicateCr(data) {
  return {
    type: types.CR_MANAGEMENT_CHECK_DUPLICATE,
    payload: {
      client: 'cr',
      request:{
        method: 'POST',
        url:'/CRService/checkDuplicateCr',
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

export function importCheckCr(file) {
  var bodyFormData = new FormData();
  bodyFormData.append('multipartFile', file);
  return {
    type: types.CR_MANAGEMENT_IMPORT_CHECK,
    payload: {
      client: 'cr',
      request:{
        method: 'POST',
        config: { headers: {'Content-Type': 'multipart/form-data' }},
        url:'/CRService/importCheckCr',
        data: bodyFormData
      }
    }
  };
}

export function actionAssignCabMulti(data) {
  return {
    type: types.CR_MANAGEMENT_ASSIGN_CAB,
    payload: {
      client: 'cr',
      request:{
        method: 'POST',
        url:'/CRService/actionAssignCabMulti',
        data: data
      }
    }
  };
}

export function getListDeviceType(data) {
  return {
    type: types.CR_MANAGEMENT_GET_LIST_DEVICE_TYPE,
    payload: {
      client: 'cr',
      request:{
        method: 'POST',
        url:'/CrGeneralService/getListDeviceTypeByImpactSegmentCBB',
        data: data
      }
    }
  };
}

export function getCbbChildArray(data) {
  return {
    type: types.CR_MANAGEMENT_GET_CHILD_ARRAY,
    payload: {
      client: 'cr',
      request:{
        method: 'POST',
        url:'/CrGeneralService/getCbbChildArray',
        data: data
      }
    }
  };
}

export function getListCrProcessCBB(data) {
  return {
    type: types.CR_MANAGEMENT_GET_LIST_CR_PROCESS,
    payload: {
      client: 'cr',
      request:{
        method: 'POST',
        url:'/CrProcessService/getListCrProcessCBB',
        data: data
      }
    }
  };
}

export function searchAlarmByCr(data) {
  return {
    type: types.CR_MANAGEMENT_SEARCH_ALARM_BY_CR,
    payload: {
      client: 'cr',
      request:{
        method: 'POST',
        url:'/CrAlarmService/getListAlarmByCr',
        data: data
      }
    }
  };
}

export function searchAlarmSetting(data) {
  return {
    type: types.CR_MANAGEMENT_SEARCH_ALARM_SETTING,
    payload: {
      client: 'cr',
      request:{
        method: 'POST',
        url:'/CrAlarmService/getAlarmSetting',
        data: data
      }
    }
  };
}

export function searchAlarmList(data) {
  return {
    type: types.CR_MANAGEMENT_SEARCH_ALARM_LIST,
    payload: {
      client: 'cr',
      request:{
        method: 'POST',
        url:'/CrAlarmService/getAlarmList',
        data: data
      }
    }
  };
}

export function searchAlarmByProcess(data) {
  return {
    type: types.CR_MANAGEMENT_SEARCH_ALARM_BY_CR_PROCESS,
    payload: {
      client: 'cr',
      request:{
        method: 'POST',
        url:'/CrAlarmService/getAlarmSettingByVendor',
        data: data
      }
    }
  };
}

export function getListCrProcessCBBLevel3(data) {
  return {
    type: types.CR_MANAGEMENT_GET_LIST_CR_PROCESS_LEVEL_3,
    payload: {
      client: 'cr',
      request:{
        method: 'POST',
        url:'/CrProcessService/getListCrProcessCBBLevel3',
        data: data
      }
    }
  };
}

export function searchModuleByCr(data) {
  return {
    type: types.CR_MANAGEMENT_SEARCH_MODULE_BY_CR,
    payload: {
      client: 'cr',
      request:{
        method: 'POST',
        url:'/CrAlarmService/getListModuleByCr',
        data: data
      }
    }
  };
}

export function searchModuleList(data) {
  return {
    type: types.CR_MANAGEMENT_SEARCH_MODULE_LIST,
    payload: {
      client: 'cr',
      request:{
        method: 'POST',
        url:'/CrAlarmService/setupModuleData',
        data: data
      }
    }
  };
}

export function searchVendorByCr(data) {
  return {
    type: types.CR_MANAGEMENT_SEARCH_VENDOR_BY_CR,
    payload: {
      client: 'cr',
      request:{
        method: 'POST',
        url:'/CrAlarmService/getListVendorByCr',
        data: data
      }
    }
  };
}

export function searchVendorList(data) {
  return {
    type: types.CR_MANAGEMENT_SEARCH_VENDOR_LIST,
    payload: {
      client: 'cr',
      request:{
        method: 'POST',
        url:'/CrAlarmService/getVendorList',
        data: data
      }
    }
  };
}

export function getListFaultSrc(nationCode) {
  return {
    type: types.CR_MANAGEMENT_GET_FAULT_SRC,
    payload: {
      client: 'cr',
      request:{
        method: 'GET',
        url:'/CrAlarmService/getListFaultSrc?nationCode=' + nationCode
      }
    }
  };
}

export function getListGroupFaultSrc(faultSrc, nationCode) {
  return {
    type: types.CR_MANAGEMENT_GET_GROUP_FAULT_SRC,
    payload: {
      client: 'cr',
      request:{
        method: 'GET',
        url:'/CrAlarmService/getListGroupFaultSrc?faultSrc=' + faultSrc + '&nationCode=' + nationCode
      }
    }
  };
}

export function getListNation() {
  return {
    type: types.CR_MANAGEMENT_GET_NATION,
    payload: {
      client: 'cr',
      request:{
        method: 'GET',
        url:'/CrAlarmService/nationMap'
      }
    }
  };
}

export function getListItemByCategory(categoryCode, itemCode) {
  categoryCode = categoryCode ? categoryCode : "";
  itemCode = itemCode ? itemCode : "";
  return {
    type: types.CR_MANAGEMENT_GET_LIST_ITEM_BY_CATEGORY,
    payload: {
      client: 'cr',
      request:{
        method: 'POST',
        url:'/CrAlarmService/getListItemByCategory?categoryCode=' + categoryCode + '&itemCode=' + itemCode
      }
    }
  };
}

export function getListCrForRelateOrPreApprove(data) {
  return {
    type: types.CR_MANAGEMENT_GET_LIST_CR_FOR_RELATE_OR_PRE_APPROVE,
    payload: {
      client: 'cr',
      request:{
        method: 'POST',
        url:'/CRService/getListCrForRelateOrPreApprove',
        data: data
      }
    }
  };
}

export function searchInfraCable(data) {
  return {
    type: types.CR_MANAGEMENT_SEARCH_INFRA_CABLE,
    payload: {
      client: 'cr',
      request:{
        method: 'POST',
        url:'/CrCableService/GNOC_getInfraCableLane',
        data: data
      }
    }
  };
}

export function searchCableInLane(data) {
  return {
    type: types.CR_MANAGEMENT_SEARCH_CABLE_IN_LANE,
    payload: {
      client: 'cr',
      request:{
        method: 'POST',
        url:'/CrCableService/getAllCableInLane',
        data: data
      }
    }
  };
}

export function searchLinkInfo(data) {
  return {
    type: types.CR_MANAGEMENT_SEARCH_CABLE_LINK_INFO,
    payload: {
      client: 'cr',
      request:{
        method: 'POST',
        url:'/CrCableService/getLinkInfo',
        data: data
      }
    }
  };
}

export function getListCrCableByCondition(data) {
  return {
    type: types.CR_MANAGEMENT_GET_CR_CABLE,
    payload: {
      client: 'cr',
      request:{
        method: 'POST',
        url:'/CrCableService/getListCrCableByCondition',
        data: data
      }
    }
  };
}

export function getListCrRelated(data) {
  return {
    type: types.CR_MANAGEMENT_GET_CR_RELATED,
    payload: {
      client: 'cr',
      request:{
        method: 'POST',
        url:'/CRService/loadCRRelated',
        data: data
      }
    }
  };
}

export function searchHistory(data) {
  return {
    type: types.CR_MANAGEMENT_SEARCH_HISTORY,
    payload: {
      client: 'cr',
      request:{
        method: 'POST',
        url:'/CrHisService/searchSql',
        data: data
      }
    }
  };
}

export function searchWorkLog(data) {
  return {
    type: types.CR_MANAGEMENT_SEARCH_WORK_LOG,
    payload: {
      client: 'cr',
      request:{
        method: 'POST',
        url:'/CRService/getListWorklogSearch',
        data: data
      }
    }
  };
}

export function getListUserGroupBySystem(step, data) {
  return {
    type: types.CR_MANAGEMENT_GET_LIST_USER_GROUP_BY_SYSTEM,
    payload: {
      client: 'cr',
      request:{
        method: 'POST',
        url:'/CRService/getListUserGroupBySystem?step=' + step,
        data: data
      }
    }
  };
}

export function getListWorkLogCategoryDTO(data) {
  return {
    type: types.CR_MANAGEMENT_GET_WORK_LOG_CATEGORY_BY_ID,
    payload: {
      client: 'cr',
      request:{
        method: 'POST',
        url:'/CRService/getListWorkLogCategoryDTO',
        data: data
      }
    }
  };
}

export function insertWorkLog(data) {
  return {
    type: types.CR_MANAGEMENT_INSERT_WORK_LOG,
    payload: {
      client: 'cr',
      request:{
        method: 'POST',
        url:'/CRService/insertWorkLog',
        data: data
      }
    }
  };
}

export function getLisNodeOfCR(data) {
  return {
    type: types.CR_MANAGEMENT_GET_LIST_NODE_CR,
    payload: {
      client: 'cr',
      request:{
        method: 'POST',
        url:'/CrImpactedNodesService/getLisNodeOfCR',
        data: data
      }
    }
  };
}

export function actionImportAndGetNetworkNodeV2(file, crDTO, nationCode, type) {
  var bodyFormData = new FormData();
  bodyFormData.append('fileImport', file);
  bodyFormData.append('String', JSON.stringify(crDTO));
  bodyFormData.append('nationCode', nationCode);
  bodyFormData.append('type', type);
  return {
    type: types.CR_MANAGEMENT_IMPORT_AND_GET_NODE_V2,
    payload: {
      client: 'cr',
      request:{
        method: 'POST',
        config: { headers: {'Content-Type': 'multipart/form-data' }},
        url:'/CrImpactedNodesService/actionImportAndGetNetworkNodeV2',
        data: bodyFormData
      }
    }
  };
}

export function getCreatedBySys(crId) {
  return {
    type: types.CR_MANAGEMENT_GET_CREATED_BY_SYS,
    payload: {
      client: 'cr',
      request:{
        method: 'GET',
        url:'/CrGeneralService/getCreatedBySys?crId=' + crId
      }
    }
  };
}

export function getListReturnCodeByActionCode(actionCode) {
  return {
    type: types.CR_MANAGEMENT_GET_LIST_RETURN_BY_ACTION_CODE,
    payload: {
      client: 'cr',
      request:{
        method: 'GET',
        url:'/CrGeneralService/getListReturnCodeByActionCode?actionCode=' + actionCode
      }
    }
  };
}

export function getListCrFilesSearch(data) {
  return {
    type: types.CR_MANAGEMENT_GET_LIST_CR_FILES,
    payload: {
      client: 'cr',
      request:{
        method: 'POST',
        url:'/CrFilesAttachService/getListFilesSearchDataTable',
        data: data
      }
    }
  };
}

export function insertListFileAttach(data, lstMutilKPI, lstMutilDT, lstMutilTest, lstMutilRoll, lstMutilPlant,
      lstMutilImpactScenario, lstMutilForm, lstMutilFile, lstMutilTxt, lstMutilFileOther, lstMutilProcess) {
  var bodyFormData = new FormData();
  bodyFormData.append('formDataJson', new Blob([JSON.stringify(data)], {type: 'application/json'}));
  for (var i = 0; i < lstMutilKPI.length; i++) {
    bodyFormData.append('lstMutilKPI', lstMutilKPI[i]);
  }
  for (var i = 0; i < lstMutilDT.length; i++) {
    bodyFormData.append('lstMutilDT', lstMutilDT[i]);
  }
  for (var i = 0; i < lstMutilTest.length; i++) {
    bodyFormData.append('lstMutilTest', lstMutilTest[i]);
  }
  for (var i = 0; i < lstMutilRoll.length; i++) {
    bodyFormData.append('lstMutilRoll', lstMutilRoll[i]);
  }
  for (var i = 0; i < lstMutilPlant.length; i++) {
    bodyFormData.append('lstMutilPlant', lstMutilPlant[i]);
  }
  for (var i = 0; i < lstMutilImpactScenario.length; i++) {
    bodyFormData.append('lstMutilImpactScenario', lstMutilImpactScenario[i]);
  }
  for (var i = 0; i < lstMutilForm.length; i++) {
    bodyFormData.append('lstMutilForm', lstMutilForm[i]);
  }
  for (var i = 0; i < lstMutilFile.length; i++) {
    bodyFormData.append('lstMutilFile', lstMutilFile[i]);
  }
  for (var i = 0; i < lstMutilTxt.length; i++) {
    bodyFormData.append('lstMutilTxt', lstMutilTxt[i]);
  }
  for (var i = 0; i < lstMutilFileOther.length; i++) {
    bodyFormData.append('lstMutilFileOther', lstMutilFileOther[i]);
  }
  for (var i = 0; i < lstMutilFileOther.length; i++) {
    bodyFormData.append('lstMutilProcess', lstMutilProcess[i]);
  }
  return {
    type: types.CR_MANAGEMENT_INSERT_LIST_FILES_ATTACH,
    payload: {
      client: 'cr',
      request:{
        method: 'POST',
        url:'/CrFilesAttachService/insertListFileAttach',
        data: bodyFormData,
        config: { headers: {'Content-Type': 'multipart/form-data' }}
      }
    }
  };
}

export function getApprovalDepartmentByProcess(crProcessId) {
  return {
    type: types.CR_MANAGEMENT_GET_APPROVAL_DEPARTMENT_BY_PROCESS,
    payload: {
      client: 'cr',
      request:{
        method: 'GET',
        url:'/CrApprovalDepartmentService/getApprovalDepartmentByProcess?crProcessId=' + crProcessId
      }
    }
  };
}

export function getListCrApprovalDepartmentDTO(data) {
  return {
    type: types.CR_MANAGEMENT_GET_LIST_CR_APPROVAL_DEPARTMENT,
    payload: {
      client: 'cr',
      request:{
        method: 'POST',
        url:'/CrApprovalDepartmentService/searchSql',
        data: data
      }
    }
  };
}

export function findCrProcessById(id) {
  return {
    type: types.CR_MANAGEMENT_FIND_CR_PROCESS_BY_ID,
    payload: {
      client: 'cr',
      request:{
        method: 'POST',
        url:'/CrProcessService/findCrProcessById?id=' + id
      }
    }
  };
}

export function searchParentCr(system, code, page, pageSize) {
  return {
    type: types.CR_MANAGEMENT_SEARCH_PARENT_CR,
    payload: {
      client: 'cr',
      request:{
        method: 'GET',
        url:'/CRService/searchParentCr?system=' + system + '&code=' + code + '&page=' + page + '&pageSize=' + pageSize
      }
    }
  };
}

export function getListTemplateFileByProcess(crProcessId, actionRight) {
  return {
    type: types.CR_MANAGEMENT_GET_LIST_TEMPLATE_FILE_BY_PROCESS,
    payload: {
      client: 'cr',
      request:{
        method: 'POST',
        url:'/CrFilesAttachService/getListTemplateFileByProcess?crProcessId=' + crProcessId + '&actionRight=' + actionRight
      }
    }
  };
}

export function actionApproveCR(data) {
  return {
    type: types.CR_MANAGEMENT_APPROVE_CR,
    payload: {
      client: 'cr',
      request:{
        method: 'POST',
        url:'/CRService/actionApproveCR',
        data: data
      }
    }
  };
}

export function actionAppraiseCr(data) {
  return {
    type: types.CR_MANAGEMENT_APPRAISE_CR,
    payload: {
      client: 'cr',
      request:{
        method: 'POST',
        url:'/CRService/actionAppraiseCr',
        data: data
      }
    }
  };
}

export function actionVerify(data) {
  return {
    type: types.CR_MANAGEMENT_VERIFY_CR,
    payload: {
      client: 'cr',
      request:{
        method: 'POST',
        url:'/CRService/actionVerify',
        data: data
      }
    }
  };
}

export function actionScheduleCr(data) {
  return {
    type: types.CR_MANAGEMENT_SCHEDULE_CR,
    payload: {
      client: 'cr',
      request:{
        method: 'POST',
        url:'/CRService/actionScheduleCr',
        data: data
      }
    }
  };
}

export function actionReceiveCr(data) {
  return {
    type: types.CR_MANAGEMENT_RECEIVE_CR,
    payload: {
      client: 'cr',
      request:{
        method: 'POST',
        url:'/CRService/actionReceiveCr',
        data: data
      }
    }
  };
}

export function actionResolveCr(data) {
  return {
    type: types.CR_MANAGEMENT_RESOLVE_CR,
    payload: {
      client: 'cr',
      request:{
        method: 'POST',
        url:'/CRService/actionResolveCr',
        data: data
      }
    }
  };
}

export function actionAssignCab(data) {
  return {
    type: types.CR_MANAGEMENT_ASSIGN_CAB_CR,
    payload: {
      client: 'cr',
      request:{
        method: 'POST',
        url:'/CRService/actionAssignCab',
        data: data
      }
    }
  };
}

export function actionEditCr(data) {
  return {
    type: types.CR_MANAGEMENT_EDIT_CR,
    payload: {
      client: 'cr',
      request:{
        method: 'POST',
        url:'/CRService/actionEditCr',
        data: data
      }
    }
  };
}

export function actionCloseCr(data) {
  return {
    type: types.CR_MANAGEMENT_CLOSE_CR,
    payload: {
      client: 'cr',
      request:{
        method: 'POST',
        url:'/CRService/actionCloseCr',
        data: data
      }
    }
  };
}

export function actionCab(data) {
  return {
    type: types.CR_MANAGEMENT_CAB_CR,
    payload: {
      client: 'cr',
      request:{
        method: 'POST',
        url:'/CRService/actionCab',
        data: data
      }
    }
  };
}

export function loadMop(data) {
  return {
    type: types.CR_MANAGEMENT_LOAD_MOP,
    payload: {
      client: 'cr',
      request:{
        method: 'POST',
        url:'/CRService/loadMop',
        data: data
      }
    }
  };
}

export function getListActionCodeByCode(code) {
  return {
    type: types.CR_MANAGEMENT_GET_LIST_ACTION_CODE_BY_CODE,
    payload: {
      client: 'cr',
      request:{
        method: 'GET',
        url:'/CrGeneralService/getListActionCodeByCode?code=' + code
      }
    }
  };
}

export function insertUserReceiveMsg(data) {
  return {
    type: types.CR_MANAGEMENT_INSERT_USER_RECEIVE_MSG,
    payload: {
      client: 'cr',
      request:{
        method: 'POST',
        url:'/CRService/insertUserReceiveMsg',
        data: data
      }
    }
  };
}

export function actionGetListUser(deptId, userId, userName, fullName, staffCode, deptName, deptCode, isAppraise) {
  return {
    type: types.CR_MANAGEMENT_GET_LIST_USER,
    payload: {
      client: 'cr',
      request:{
        method: 'GET',
        url:'/CrGeneralService/actionGetListUser?deptId=' + deptId + '&userId=' + userId + '&userName=' + userName + '&fullName=' + fullName
        + '&staffCode=' + staffCode + '&deptName=' + deptName + '&deptCode=' + deptCode + '&isAppraise=' + isAppraise
      }
    }
  };
}

export function changeCheckboxAction(data) {
  return {
    type: types.CR_MANAGEMENT_CHANGE_CHECKBOX_ACTION,
    payload: {
      client: 'cr',
      request:{
        method: 'POST',
        url:'/CRService/changeCheckboxAction',
        data: data
      }
    }
  };
}

export function getListUserCab(impactSegmentId, executeUnitId) {
  return {
    type: types.CR_MANAGEMENT_GET_LIST_USER_CAB,
    payload: {
      client: 'cr',
      request:{
        method: 'GET',
        url:'/CrGeneralService/getListUserCab?impactSegmentId=' + impactSegmentId + '&executeUnitId=' + executeUnitId
      }
    }
  };
}

export function actionGetListDuplicateCRImpactedNode(data) {
  return {
    type: types.CR_MANAGEMENT_GET_LIST_DUPLICATE_CR,
    payload: {
      client: 'cr',
      request:{
        method: 'POST',
        url:'/CRService/actionGetListDuplicateCRImpactedNode',
        data: data
      }
    }
  };
}

export function getListCRFromOtherSystem(data) {
  return {
    type: types.CR_MANAGEMENT_GET_LIST_CR_FROM_OTHER_SYSTEM,
    payload: {
      client: 'cr',
      request:{
        method: 'POST',
        url:'/CRService/getListCRFromOtherSystem',
        data: data
      }
    }
  };
}

export function doAssignHandoverCa(files, data) {
  var bodyFormData = new FormData();
  bodyFormData.append('formDataJson', new Blob([JSON.stringify(data)], { type: 'application/json' }));
  for (var i = 0; i < files.length; i++) {
    bodyFormData.append('files', files[i]);
  }
  return {
    type: types.CR_MANAGEMENT_DO_ASSIGN_HANDOVER_CA,
    payload: {
      client: 'cr',
      request: {
        method: 'POST',
        url: '/CRService/doAssignHandoverCa',
        data: bodyFormData,
        config: { headers: { 'Content-Type': 'multipart/form-data' } }
      }
    }
  };
}
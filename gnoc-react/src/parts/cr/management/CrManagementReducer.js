import initialState from '../../../stores/initialState';
import * as types from './CrManagementTypes';

export default function crManagementReducers(state = initialState.crManagement, action) {
    switch (action.type) {
        case `${types.CR_MANAGEMENT_SEARCH}_SUCCESS`:
            return { ...state, dataTable: action };
        case `${types.CR_MANAGEMENT_SEARCH}_FAIL`:
            return { ...state, dataTable: action };
        case `${types.CR_MANAGEMENT_GET_DETAIL}_SUCCESS`:
            return { ...state, detail: action };
        case `${types.CR_MANAGEMENT_GET_DETAIL}_FAIL`:
            return { ...state, detail: action };
        case `${types.CR_MANAGEMENT_ADD}_SUCCESS`:
            return { ...state, add: action };
        case `${types.CR_MANAGEMENT_ADD}_FAIL`:
            return { ...state, add: action };
        case `${types.CR_MANAGEMENT_EDIT}_SUCCESS`:
            return { ...state, edit: action };
        case `${types.CR_MANAGEMENT_EDIT}_FAIL`:
            return { ...state, edit: action };
        case `${types.CR_MANAGEMENT_DELETE}_SUCCESS`:
            return { ...state, delete: action };
        case `${types.CR_MANAGEMENT_DELETE}_FAIL`:
            return { ...state, delete: action };
        case `${types.CR_MANAGEMENT_GET_SUBCATEGORY}_SUCCESS`:
            return { ...state, getSubcategory: action };
        case `${types.CR_MANAGEMENT_GET_SUBCATEGORY}_FAIL`:
            return { ...state, getSubcategory: action };
        case `${types.CR_MANAGEMENT_GET_IMPACT_SEGMENT}_SUCCESS`:
            return { ...state, getImpactSegment: action };
        case `${types.CR_MANAGEMENT_GET_IMPACT_SEGMENT}_FAIL`:
            return { ...state, getImpactSegment: action };
        case `${types.CR_MANAGEMENT_GET_IMPACT_AFFECT}_SUCCESS`:
            return { ...state, getImpactAffect: action };
        case `${types.CR_MANAGEMENT_GET_IMPACT_AFFECT}_FAIL`:
            return { ...state, getImpactAffect: action };
        case `${types.CR_MANAGEMENT_GET_AFFECTED_SERVICE}_SUCCESS`:
            return { ...state, getAffectedService: action };
        case `${types.CR_MANAGEMENT_GET_AFFECTED_SERVICE}_FAIL`:
            return { ...state, getAffectedService: action };
        case `${types.CR_MANAGEMENT_GET_DUTY_TYPE}_SUCCESS`:
            return { ...state, getDutyType: action };
        case `${types.CR_MANAGEMENT_GET_DUTY_TYPE}_FAIL`:
            return { ...state, getDutyType: action };
        case `${types.CR_MANAGEMENT_GET_LIST_SCOPE}_SUCCESS`:
            return { ...state, getListScope: action };
        case `${types.CR_MANAGEMENT_GET_LIST_SCOPE}_FAIL`:
            return { ...state, getListScope: action };
        case `${types.CR_MANAGEMENT_GET_NODE_QLTN}_SUCCESS`:
            return { ...state, getListNodeQLTN: action };
        case `${types.CR_MANAGEMENT_GET_NODE_QLTN}_FAIL`:
            return { ...state, getListNodeQLTN: action };
        case `${types.CR_MANAGEMENT_GET_SEQUENCE}_SUCCESS`:
            return { ...state, getSequenseCr: action };
        case `${types.CR_MANAGEMENT_GET_SEQUENCE}_FAIL`:
            return { ...state, getSequenseCr: action };
        case `${types.CR_MANAGEMENT_CHECK_DUPLICATE}_SUCCESS`:
            return { ...state, checkDuplicate: action };
        case `${types.CR_MANAGEMENT_CHECK_DUPLICATE}_FAIL`:
            return { ...state, checkDuplicate: action };
        case `${types.CR_MANAGEMENT_IMPORT_CHECK}_SUCCESS`:
            return { ...state, importCheck: action };
        case `${types.CR_MANAGEMENT_IMPORT_CHECK}_FAIL`:
            return { ...state, importCheck: action };
        case `${types.CR_MANAGEMENT_ASSIGN_CAB}_SUCCESS`:
            return { ...state, assignCab: action };
        case `${types.CR_MANAGEMENT_ASSIGN_CAB}_FAIL`:
            return { ...state, assignCab: action };
        case `${types.CR_MANAGEMENT_GET_LIST_DEVICE_TYPE}_SUCCESS`:
            return { ...state, getListDeviceType: action };
        case `${types.CR_MANAGEMENT_GET_LIST_DEVICE_TYPE}_FAIL`:
            return { ...state, getListDeviceType: action };
        case `${types.CR_MANAGEMENT_GET_CHILD_ARRAY}_SUCCESS`:
            return { ...state, getCbbChildArray: action };
        case `${types.CR_MANAGEMENT_GET_CHILD_ARRAY}_FAIL`:
            return { ...state, getCbbChildArray: action };
        case `${types.CR_MANAGEMENT_GET_LIST_CR_PROCESS}_SUCCESS`:
            return { ...state, getListCrProcess: action };
        case `${types.CR_MANAGEMENT_GET_LIST_CR_PROCESS}_FAIL`:
            return { ...state, getListCrProcess: action };
        case `${types.CR_MANAGEMENT_SEARCH_ALARM_BY_CR}_SUCCESS`:
            return { ...state, dataTableAlarmByCr: action };
        case `${types.CR_MANAGEMENT_SEARCH_ALARM_BY_CR}_FAIL`:
            return { ...state, dataTableAlarmByCr: action };
        case `${types.CR_MANAGEMENT_SEARCH_ALARM_SETTING}_SUCCESS`:
            return { ...state, dataTableAlarmSetting: action };
        case `${types.CR_MANAGEMENT_SEARCH_ALARM_SETTING}_FAIL`:
            return { ...state, dataTableAlarmSetting: action };
        case `${types.CR_MANAGEMENT_SEARCH_ALARM_LIST}_SUCCESS`:
            return { ...state, dataTableAlarmList: action };
        case `${types.CR_MANAGEMENT_SEARCH_ALARM_LIST}_FAIL`:
            return { ...state, dataTableAlarmList: action };
        case `${types.CR_MANAGEMENT_SEARCH_ALARM_BY_CR_PROCESS}_SUCCESS`:
            return { ...state, dataTableAlarmByCrProcess: action };
        case `${types.CR_MANAGEMENT_SEARCH_ALARM_BY_CR_PROCESS}_FAIL`:
            return { ...state, dataTableAlarmByCrProcess: action };
        case `${types.CR_MANAGEMENT_GET_LIST_CR_PROCESS_LEVEL_3}_SUCCESS`:
            return { ...state, getListCrProcessLevel3: action };
        case `${types.CR_MANAGEMENT_GET_LIST_CR_PROCESS_LEVEL_3}_FAIL`:
            return { ...state, getListCrProcessLevel3: action };
        case `${types.CR_MANAGEMENT_SEARCH_MODULE_BY_CR}_SUCCESS`:
            return { ...state, dataTableModuleByCr: action };
        case `${types.CR_MANAGEMENT_SEARCH_MODULE_BY_CR}_FAIL`:
            return { ...state, dataTableModuleByCr: action };
        case `${types.CR_MANAGEMENT_SEARCH_MODULE_LIST}_SUCCESS`:
            return { ...state, dataTableModule: action };
        case `${types.CR_MANAGEMENT_SEARCH_MODULE_LIST}_FAIL`:
            return { ...state, dataTableModule: action };
        case `${types.CR_MANAGEMENT_SEARCH_VENDOR_BY_CR}_SUCCESS`:
            return { ...state, dataTableVendorByCr: action };
        case `${types.CR_MANAGEMENT_SEARCH_VENDOR_BY_CR}_FAIL`:
            return { ...state, dataTableVendorByCr: action };
        case `${types.CR_MANAGEMENT_SEARCH_VENDOR_LIST}_SUCCESS`:
            return { ...state, dataTableVendor: action };
        case `${types.CR_MANAGEMENT_SEARCH_VENDOR_LIST}_FAIL`:
            return { ...state, dataTableVendor: action };
        case `${types.CR_MANAGEMENT_GET_FAULT_SRC}_SUCCESS`:
            return { ...state, faultSrc: action };
        case `${types.CR_MANAGEMENT_GET_FAULT_SRC}_FAIL`:
            return { ...state, faultSrc: action };
        case `${types.CR_MANAGEMENT_GET_GROUP_FAULT_SRC}_SUCCESS`:
            return { ...state, groupFaultSrc: action };
        case `${types.CR_MANAGEMENT_GET_GROUP_FAULT_SRC}_FAIL`:
            return { ...state, groupFaultSrc: action };
        case `${types.CR_MANAGEMENT_GET_NATION}_SUCCESS`:
            return { ...state, nation: action };
        case `${types.CR_MANAGEMENT_GET_NATION}_FAIL`:
            return { ...state, nation: action };
        case `${types.CR_MANAGEMENT_GET_LIST_ITEM_BY_CATEGORY}_SUCCESS`:
            return { ...state, listItem: action };
        case `${types.CR_MANAGEMENT_GET_LIST_ITEM_BY_CATEGORY}_FAIL`:
            return { ...state, listItem: action };
        case `${types.CR_MANAGEMENT_GET_LIST_CR_FOR_RELATE_OR_PRE_APPROVE}_SUCCESS`:
            return { ...state, listCrForRelateOrPreApprove: action };
        case `${types.CR_MANAGEMENT_GET_LIST_CR_FOR_RELATE_OR_PRE_APPROVE}_FAIL`:
            return { ...state, listCrForRelateOrPreApprove: action };
        case `${types.CR_MANAGEMENT_SEARCH_INFRA_CABLE}_SUCCESS`:
            return { ...state, infraCable: action };
        case `${types.CR_MANAGEMENT_SEARCH_INFRA_CABLE}_FAIL`:
            return { ...state, infraCable: action };
        case `${types.CR_MANAGEMENT_SEARCH_CABLE_IN_LANE}_SUCCESS`:
            return { ...state, cableInLane: action };
        case `${types.CR_MANAGEMENT_SEARCH_CABLE_IN_LANE}_FAIL`:
            return { ...state, cableInLane: action };
        case `${types.CR_MANAGEMENT_SEARCH_CABLE_LINK_INFO}_SUCCESS`:
            return { ...state, cableLinkInfo: action };
        case `${types.CR_MANAGEMENT_SEARCH_CABLE_LINK_INFO}_FAIL`:
            return { ...state, cableLinkInfo: action };
        case `${types.CR_MANAGEMENT_GET_CR_CABLE}_SUCCESS`:
            return { ...state, crCable: action };
        case `${types.CR_MANAGEMENT_GET_CR_CABLE}_FAIL`:
            return { ...state, crCable: action };
        case `${types.CR_MANAGEMENT_GET_CR_RELATED}_SUCCESS`:
            return { ...state, crRelated: action };
        case `${types.CR_MANAGEMENT_GET_CR_RELATED}_FAIL`:
            return { ...state, crRelated: action };
        case `${types.CR_MANAGEMENT_SEARCH_HISTORY}_SUCCESS`:
            return { ...state, history: action };
        case `${types.CR_MANAGEMENT_SEARCH_HISTORY}_FAIL`:
            return { ...state, history: action };
        case `${types.CR_MANAGEMENT_SEARCH_WORK_LOG}_SUCCESS`:
            return { ...state, workLog: action };
        case `${types.CR_MANAGEMENT_SEARCH_WORK_LOG}_FAIL`:
            return { ...state, workLog: action };
        case `${types.CR_MANAGEMENT_GET_LIST_USER_GROUP_BY_SYSTEM}_SUCCESS`:
            return { ...state, listUserGroupBySystem: action };
        case `${types.CR_MANAGEMENT_GET_LIST_USER_GROUP_BY_SYSTEM}_FAIL`:
            return { ...state, listUserGroupBySystem: action };
        case `${types.CR_MANAGEMENT_GET_WORK_LOG_CATEGORY_BY_ID}_SUCCESS`:
            return { ...state, workLogCategoryById: action };
        case `${types.CR_MANAGEMENT_GET_WORK_LOG_CATEGORY_BY_ID}_FAIL`:
            return { ...state, workLogCategoryById: action };
        case `${types.CR_MANAGEMENT_INSERT_WORK_LOG}_SUCCESS`:
            return { ...state, insertWorkLog: action };
        case `${types.CR_MANAGEMENT_INSERT_WORK_LOG}_FAIL`:
            return { ...state, insertWorkLog: action };
        case `${types.CR_MANAGEMENT_GET_LIST_NODE_CR}_SUCCESS`:
            return { ...state, getListNodeCr: action };
        case `${types.CR_MANAGEMENT_GET_LIST_NODE_CR}_FAIL`:
            return { ...state, getListNodeCr: action };
        case `${types.CR_MANAGEMENT_IMPORT_AND_GET_NODE_V2}_SUCCESS`:
            return { ...state, importAndGetNodeV2: action };
        case `${types.CR_MANAGEMENT_IMPORT_AND_GET_NODE_V2}_FAIL`:
            return { ...state, importAndGetNodeV2: action };
        case `${types.CR_MANAGEMENT_GET_CREATED_BY_SYS}_SUCCESS`:
            return { ...state, getCreatedBySys: action };
        case `${types.CR_MANAGEMENT_GET_CREATED_BY_SYS}_FAIL`:
            return { ...state, getCreatedBySys: action };
        case `${types.CR_MANAGEMENT_GET_LIST_RETURN_BY_ACTION_CODE}_SUCCESS`:
            return { ...state, getListReturn: action };
        case `${types.CR_MANAGEMENT_GET_LIST_RETURN_BY_ACTION_CODE}_FAIL`:
            return { ...state, getListReturn: action };
        case `${types.CR_MANAGEMENT_GET_LIST_CR_FILES}_SUCCESS`:
            return { ...state, listCrFiles: action };
        case `${types.CR_MANAGEMENT_GET_LIST_CR_FILES}_FAIL`:
            return { ...state, listCrFiles: action };
        case `${types.CR_MANAGEMENT_INSERT_LIST_FILES_ATTACH}_SUCCESS`:
            return { ...state, insertListFilesAttach: action };
        case `${types.CR_MANAGEMENT_INSERT_LIST_FILES_ATTACH}_FAIL`:
            return { ...state, insertListFilesAttach: action };
        case `${types.CR_MANAGEMENT_GET_APPROVAL_DEPARTMENT_BY_PROCESS}_SUCCESS`:
            return { ...state, getApprovalDepartmentByProcess: action };
        case `${types.CR_MANAGEMENT_GET_APPROVAL_DEPARTMENT_BY_PROCESS}_FAIL`:
            return { ...state, getApprovalDepartmentByProcess: action };
        case `${types.CR_MANAGEMENT_GET_LIST_CR_APPROVAL_DEPARTMENT}_SUCCESS`:
            return { ...state, getListCrApprovalDepartment: action };
        case `${types.CR_MANAGEMENT_GET_LIST_CR_APPROVAL_DEPARTMENT}_FAIL`:
            return { ...state, getListCrApprovalDepartment: action };
        case `${types.CR_MANAGEMENT_FIND_CR_PROCESS_BY_ID}_SUCCESS`:
            return { ...state, findCrProcessById: action };
        case `${types.CR_MANAGEMENT_FIND_CR_PROCESS_BY_ID}_FAIL`:
            return { ...state, findCrProcessById: action };
        case `${types.CR_MANAGEMENT_SEARCH_PARENT_CR}_SUCCESS`:
            return { ...state, searchParentCr: action };
        case `${types.CR_MANAGEMENT_SEARCH_PARENT_CR}_FAIL`:
            return { ...state, searchParentCr: action };
        case `${types.CR_MANAGEMENT_GET_LIST_TEMPLATE_FILE_BY_PROCESS}_SUCCESS`:
            return { ...state, getListTemplateFileByProcess: action };
        case `${types.CR_MANAGEMENT_GET_LIST_TEMPLATE_FILE_BY_PROCESS}_FAIL`:
            return { ...state, getListTemplateFileByProcess: action };
        case `${types.CR_MANAGEMENT_APPROVE_CR}_SUCCESS`:
            return { ...state, actionApproveCR: action };
        case `${types.CR_MANAGEMENT_APPROVE_CR}_FAIL`:
            return { ...state, actionApproveCR: action };
        case `${types.CR_MANAGEMENT_APPRAISE_CR}_SUCCESS`:
            return { ...state, actionAppraiseCr: action };
        case `${types.CR_MANAGEMENT_APPRAISE_CR}_FAIL`:
            return { ...state, actionAppraiseCr: action };
        case `${types.CR_MANAGEMENT_VERIFY_CR}_SUCCESS`:
            return { ...state, actionVerify: action };
        case `${types.CR_MANAGEMENT_VERIFY_CR}_FAIL`:
            return { ...state, actionVerify: action };
        case `${types.CR_MANAGEMENT_SCHEDULE_CR}_SUCCESS`:
            return { ...state, actionScheduleCr: action };
        case `${types.CR_MANAGEMENT_SCHEDULE_CR}_FAIL`:
            return { ...state, actionScheduleCr: action };
        case `${types.CR_MANAGEMENT_RECEIVE_CR}_SUCCESS`:
            return { ...state, actionReceiveCr: action };
        case `${types.CR_MANAGEMENT_RECEIVE_CR}_FAIL`:
            return { ...state, actionReceiveCr: action };
        case `${types.CR_MANAGEMENT_RESOLVE_CR}_SUCCESS`:
            return { ...state, actionResolveCr: action };
        case `${types.CR_MANAGEMENT_RESOLVE_CR}_FAIL`:
            return { ...state, actionResolveCr: action };
        case `${types.CR_MANAGEMENT_ASSIGN_CAB_CR}_SUCCESS`:
            return { ...state, actionAssignCab: action };
        case `${types.CR_MANAGEMENT_ASSIGN_CAB_CR}_FAIL`:
            return { ...state, actionAssignCab: action };
        case `${types.CR_MANAGEMENT_EDIT_CR}_SUCCESS`:
            return { ...state, actionEditCr: action };
        case `${types.CR_MANAGEMENT_EDIT_CR}_FAIL`:
            return { ...state, actionEditCr: action };
        case `${types.CR_MANAGEMENT_CANCEL_CR}_SUCCESS`:
            return { ...state, actionCancelCr: action };
        case `${types.CR_MANAGEMENT_CANCEL_CR}_FAIL`:
            return { ...state, actionCancelCr: action };
        case `${types.CR_MANAGEMENT_CLOSE_CR}_SUCCESS`:
            return { ...state, actionCloseCr: action };
        case `${types.CR_MANAGEMENT_CLOSE_CR}_FAIL`:
            return { ...state, actionCloseCr: action };
        case `${types.CR_MANAGEMENT_CAB_CR}_SUCCESS`:
            return { ...state, actionCab: action };
        case `${types.CR_MANAGEMENT_CAB_CR}_FAIL`:
            return { ...state, actionCab: action };
        case `${types.CR_MANAGEMENT_LOAD_MOP}_SUCCESS`:
            return { ...state, loadMop: action };
        case `${types.CR_MANAGEMENT_LOAD_MOP}_FAIL`:
            return { ...state, loadMop: action };
        case `${types.CR_MANAGEMENT_GET_LIST_ACTION_CODE_BY_CODE}_SUCCESS`:
            return { ...state, listActionCode: action };
        case `${types.CR_MANAGEMENT_GET_LIST_ACTION_CODE_BY_CODE}_FAIL`:
            return { ...state, listActionCode: action };
        case `${types.CR_MANAGEMENT_INSERT_USER_RECEIVE_MSG}_SUCCESS`:
            return { ...state, insertUserReceiveMsg: action };
        case `${types.CR_MANAGEMENT_INSERT_USER_RECEIVE_MSG}_FAIL`:
            return { ...state, insertUserReceiveMsg: action };
        case `${types.CR_MANAGEMENT_GET_LIST_USER}_SUCCESS`:
            return { ...state, getListUser: action };
        case `${types.CR_MANAGEMENT_GET_LIST_USER}_FAIL`:
            return { ...state, getListUser: action };
        case `${types.CR_MANAGEMENT_CHANGE_CHECKBOX_ACTION}_SUCCESS`:
            return { ...state, changeCheckboxAction: action };
        case `${types.CR_MANAGEMENT_CHANGE_CHECKBOX_ACTION}_FAIL`:
            return { ...state, changeCheckboxAction: action };
        case `${types.CR_MANAGEMENT_GET_LIST_USER_CAB}_SUCCESS`:
            return { ...state, getListUserCab: action };
        case `${types.CR_MANAGEMENT_GET_LIST_USER_CAB}_FAIL`:
            return { ...state, getListUserCab: action };
        case `${types.CR_MANAGEMENT_GET_LIST_DUPLICATE_CR}_SUCCESS`:
            return { ...state, getListDuplicateCr: action };
        case `${types.CR_MANAGEMENT_GET_LIST_DUPLICATE_CR}_FAIL`:
            return { ...state, getListDuplicateCr: action };
        case `${types.CR_MANAGEMENT_GET_LIST_CR_FROM_OTHER_SYSTEM}_SUCCESS`:
            return { ...state, getListCRFromOtherSystem: action };
        case `${types.CR_MANAGEMENT_GET_LIST_CR_FROM_OTHER_SYSTEM}_FAIL`:
            return { ...state, getListCRFromOtherSystem: action };
        case `${types.CR_MANAGEMENT_DO_ASSIGN_HANDOVER_CA}_SUCCESS`:
            return { ...state, doAssignHandoverCa: action };
        case `${types.CR_MANAGEMENT_DO_ASSIGN_HANDOVER_CA}_FAIL`:
            return { ...state, doAssignHandoverCa: action };
        default:
            return state;
    }
}
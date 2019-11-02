import { combineReducers } from 'redux';
import { reducer as toastrReducer } from 'react-redux-toastr';

// Reducers
import auth from './authReducer';
import dashboard from './dashboardReducer';
import ajaxLoading from './ajaxLoadingReducer';
//Apps_start
import common from './commonReducer';
import woConfigMapUnitGnocNims from '../parts/wo/configMapUnitGnocNims/WoConfigMapUnitGnocNimsReducer';
import woUpdateServiceInfra from '../parts/wo/updateServiceInfra/WoUpdateServiceInfraReducer';
import woConfigProperty from '../parts/wo/configProperty/WoConfigPropertyReducer';
import woConfigWoHelpVsmart from '../parts/wo/configWoHelpVsmart/WoConfigWoHelpVsmartReducer';
import woMaterialsConfig from '../parts/wo/materialsConfig/WoMaterialsConfigReducer';
import woTypeManagement from '../parts/wo/typeManagement/WoTypeManagementReducer';
import woCdGroupManagement from '../parts/wo/cdGroupManagement/WoCdGroupManagementReducer';
import woMapProvinceCdGroup from '../parts/wo/mapProvinceCdGroup/WoMapProvinceCdGroupReducer';
import woErrorCaseManagement from '../parts/wo/errorCaseManagement/WoErrorCaseManagementReducer';
import woManagement from '../parts/wo/management/WoManagementReducer';
import utilityCrCabUsers from '../parts/cr/crCabUsers/UtilityCrCabUsersReducer';
import utilityConfigReturnAction from '../parts/cr/configReturnAction/UtilityConfigReturnActionReducer';
import utilityWorkLogs from '../parts/utility/workLogs/UtilityWorkLogsReducer';
import utilityConfigWebserviceImport from '../parts/cr/configWebserviceImport/UtilityConfigWebserviceImportReducer';
import utilityConfigTempImport from '../parts/cr/configTempImport/UtilityConfigTempImportReducer';
import utilityCrImpactFrame from '../parts/cr/crImpactFrame/UtilityCrImpactFrameReducer';
import utilityCrActionCode from '../parts/cr/crActionCode/UtilityCrActionCodeReducer';
import utilityConfigShiftHandover from '../parts/utility/configShiftHandover/UtilityConfigShiftHandoverReducer';
import utilityConfigEmployeeDayOff from '../parts/utility/configEmployeeDayOff/UtilityConfigEmployeeDayOffReducer';
import utilityConfigRequestSchedule from '../parts/utility/configRequestSchedule/UtilityConfigRequestScheduleReducer';
import utilityConfigEmployeeImpact from '../parts/utility/configEmployeeImpact/UtilityConfigEmployeeImpactReducer';
import utilityConfigChildArray from '../parts/cr/configChildArray/UtilityConfigChildArrayReducer';
import utilityGroupUnit from '../parts/cr/groupUnit/UtilityGroupUnitReducer';
import crManagement from '../parts/cr/management/CrManagementReducer';
import utilityCrAlarmSetting from '../parts/cr/crAlarmSetting/UtilityCrAlarmSettingReducer';
import utilityGroupDepartmentConfig from '../parts/cr/groupDepartmentConfig/UtilityGroupDepartmentConfigReducer';
import utilityDeviceTypeManagement from '../parts/cr/deviceTypeManagement/UtilityDeviceTypeManagementReducer';
import utilityScopesManagement from '../parts/cr/scopesManagement/UtilityScopesManagementReducer';
import utilityRolesManagement from '../parts/cr/rolesManagement/UtilityRolesManagementReducer';
import utilityImpactSegment from '../parts/cr/impactSegment/UtilityImpactSegmentReducer';
import utilityAffectedLevel from '../parts/cr/affectedLevel/UtilityAffectedLevelReducer';
import utilityDepartmentsRolesManagement from '../parts/cr/departmentsRolesManagement/UtilityDepartmentsRolesManagementReducer';
import utilityDepartmentsScopeManagement from '../parts/cr/departmentsScopeManagement/UtilityDepartmentsScopeManagementReducer';
import utilityRolesScopeManagement from '../parts/cr/rolesScopeManagement/UtilityRolesScopeManagementReducer';
import utilityProcessManagement from '../parts/cr/processManagement/UtilityProcessManagementReducer';
import ttTrouble from '../parts/tt/trouble/TtTroubleReducer';
import ttConfigMop from '../parts/tt/configMop/TtConfigMopReducer';
import ttConfigReceiveUnit from '../parts/tt/configReceiveUnit/TtConfigReceiveUnitReducer';
import ttInfoConfig from '../parts/tt/infoConfig/TtInfoConfigReducer';
import ttMessageConfig from '../parts/tt/messageConfig/TtMessageConfigReducer';
import ttConfigTime from '../parts/tt/configTime/TtConfigTimeReducer';
import kedbManagement from '../parts/kedb/management/KedbManagementReducer';
import utilityStatusConfig from '../parts/utility/statusConfig/UtilityStatusConfigReducer';
import utilityVersionCatalog from '../parts/utility/versionCatalog/UtilityVersionCatalogReducer';
import utilityLanguageConfig from '../parts/utility/languageConfig/UtilityLanguageConfigReducer';
import ptConfig from '../parts/pt/config/PtConfigReducer';
import ptProblem from '../parts/pt/problem/PtProblemReducer';
import employees from './employeesReducer';
import odType from '../parts/od/category/OdTypeReducer';
import odConfigBusiness from '../parts/od/configBusiness/OdConfigBusinessReducer';
import odConfigScheduleCreate from '../parts/od/configScheduleCreate/OdConfigScheduleCreateReducer';
import odWorkflow from '../parts/od/workflow/OdWorkflowReducer';
//Apps_end
 
const rootReducer = combineReducers({
    auth,
    dashboard,
    ajaxLoading,
    toastr: toastrReducer,
    //Apps_start
    common,
    employees,
    odType,
    odConfigBusiness,
    odConfigScheduleCreate,
    odWorkflow,
    ptProblem,
    ptConfig,
    kedbManagement,
    utilityStatusConfig,
    utilityVersionCatalog,
    utilityLanguageConfig,
    ttTrouble,
    ttConfigMop,
    ttConfigReceiveUnit,
    ttInfoConfig,
    ttMessageConfig,
    ttConfigTime,
    crManagement,
    utilityCrAlarmSetting,
    utilityGroupDepartmentConfig,
    utilityDeviceTypeManagement,
    utilityScopesManagement,
    utilityRolesManagement,
    utilityImpactSegment,
    utilityAffectedLevel,
    utilityDepartmentsRolesManagement,
    utilityDepartmentsScopeManagement,
    utilityRolesScopeManagement,
    utilityProcessManagement,
    utilityConfigReturnAction,
    utilityWorkLogs,
    utilityConfigWebserviceImport,
    utilityConfigTempImport,
    utilityCrImpactFrame,
    utilityCrActionCode,
    utilityConfigShiftHandover,
    utilityConfigEmployeeDayOff,
    utilityConfigRequestSchedule,
    utilityConfigEmployeeImpact,
    utilityConfigChildArray,
    utilityGroupUnit,
    utilityCrCabUsers,
    woManagement,
    woErrorCaseManagement,
    woMapProvinceCdGroup,
    woCdGroupManagement,
    woTypeManagement,
    woMaterialsConfig,
    woConfigWoHelpVsmart,
    woConfigProperty,
    woUpdateServiceInfra,
    woConfigMapUnitGnocNims
    //Apps_end
});

export default rootReducer;
import React from 'react';

const Dashboard = React.lazy(() => import('./containers/Dashboard/Dashboard'));

//Apps_start
// const Employees = React.lazy(() => import('./containers/Apps/Employees/EmployeesContainer'));

const OdType = React.lazy(() => import('./parts/od/category/OdTypeList'));
const OdConfigScheduleCreate = React.lazy(() => import('./parts/od/configScheduleCreate/OdConfigScheduleCreateList'));
const OdConfigBusiness = React.lazy(() => import('./parts/od/configBusiness/OdConfigBusinessList'));
const OdWorkflow = React.lazy(() => import('./parts/od/workflow/OdWorkflowList'));

const PtProblem = React.lazy(() => import('./parts/pt/problem/PtProblemList'));
const PtConfig = React.lazy(() => import('./parts/pt/config/PtConfigList'));

const TtTrouble = React.lazy(() => import('./parts/tt/trouble/TtTroubleList'));
const TtConfigMop = React.lazy(() => import('./parts/tt/configMop/TtConfigMopList'));
const TtConfigReceiveUnit = React.lazy(() => import('./parts/tt/configReceiveUnit/TtConfigReceiveUnitList'));
const TtInfoConfig = React.lazy(() => import('./parts/tt/infoConfig/TtInfoConfigList'));
const TtMessageConfig = React.lazy(() => import('./parts/tt/messageConfig/TtMessageConfigList'));
const TtConfigTime = React.lazy(() => import('./parts/tt/configTime/TtConfigTimeList'));

const KedbManagement = React.lazy(() => import('./parts/kedb/management/KedbManagementList'));

const UtilityStatusConfig = React.lazy(() => import('./parts/utility/statusConfig/UtilityStatusConfigList'));
const UtilityVersionCatalog = React.lazy(() => import('./parts/utility/versionCatalog/UtilityVersionCatalogList'));
const UtilityLanguageConfig = React.lazy(() => import('./parts/utility/languageConfig/UtilityLanguageConfigList'));
const UtilityConfigShiftHandover = React.lazy(() => import('./parts/utility/configShiftHandover/UtilityConfigShiftHandoverList'));
const UtilityConfigEmployeeDayOff = React.lazy(() => import('./parts/utility/configEmployeeDayOff/UtilityConfigEmployeeDayOffList'));
const UtilityConfigRequestSchedule = React.lazy(() => import('./parts/utility/configRequestSchedule/UtilityConfigRequestScheduleList'));
const UtilityConfigEmployeeImpact = React.lazy(() => import('./parts/utility/configEmployeeImpact/UtilityConfigEmployeeImpactList'));
const UtilityWorkLogs = React.lazy(() => import('./parts/utility/workLogs/UtilityWorkLogsList'));

const CrManagement = React.lazy(() => import('./parts/cr/management/CrManagementList'));
const UtilityCrAlarmSetting = React.lazy(() => import('./parts/cr/crAlarmSetting/UtilityCrAlarmSettingList'));
const UtilityGroupDepartmentConfig = React.lazy(() => import('./parts/cr/groupDepartmentConfig/UtilityGroupDepartmentConfigList'));
const UtilityDeviceTypeManagement = React.lazy(() => import('./parts/cr/deviceTypeManagement/UtilityDeviceTypeManagementList'));
const UtilityScopesManagement = React.lazy(() => import('./parts/cr/scopesManagement/UtilityScopesManagementList'));
const UtilityRolesManagement = React.lazy(() => import('./parts/cr/rolesManagement/UtilityRolesManagementList'));
const UtilityImpactSegment = React.lazy(() => import('./parts/cr/impactSegment/UtilityImpactSegmentList'));
const UtilityAffectedLevel = React.lazy(() => import('./parts/cr/affectedLevel/UtilityAffectedLevelList'));
const UtilityDepartmentsRolesManagement = React.lazy(() => import('./parts/cr/departmentsRolesManagement/UtilityDepartmentsRolesManagementList'));
const UtilityDepartmentsScopeManagement = React.lazy(() => import('./parts/cr/departmentsScopeManagement/UtilityDepartmentsScopeManagementList'));
const UtilityRolesScopeManagement = React.lazy(() => import('./parts/cr/rolesScopeManagement/UtilityRolesScopeManagementList'));
const UtilityProcessManagement = React.lazy(() => import('./parts/cr/processManagement/UtilityProcessManagementList'));
const UtilityConfigReturnAction = React.lazy(() => import('./parts/cr/configReturnAction/UtilityConfigReturnActionList'));
const UtilityConfigWebserviceImport = React.lazy(() => import('./parts/cr/configWebserviceImport/UtilityConfigWebserviceImportList'));
const UtilityConfigTempImport = React.lazy(() => import('./parts/cr/configTempImport/UtilityConfigTempImportList'));
const UtilityCrImpactFrame = React.lazy(() => import('./parts/cr/crImpactFrame/UtilityCrImpactFrameList'));
const UtilityCrActionCode = React.lazy(() => import('./parts/cr/crActionCode/UtilityCrActionCodeList'));
const UtilityConfigChildArray = React.lazy(() => import('./parts/cr/configChildArray/UtilityConfigChildArrayList'));
const UtilityGroupUnit = React.lazy(() => import('./parts/cr/groupUnit/UtilityGroupUnitList'));
const UtilityCrCabUsers = React.lazy(() => import('./parts/cr/crCabUsers/UtilityCrCabUsersList'));

const WoManagement = React.lazy(() => import('./parts/wo/management/WoManagementList'));
const WoErrorCaseManagement = React.lazy(() => import('./parts/wo/errorCaseManagement/WoErrorCaseManagementList'));
const WoMapProvinceCdGroup = React.lazy(() => import('./parts/wo/mapProvinceCdGroup/WoMapProvinceCdGroupList'));
const WoCdGroupManagement = React.lazy(() => import('./parts/wo/cdGroupManagement/WoCdGroupManagementList'));
const WoTypeManagement = React.lazy(() => import('./parts/wo/typeManagement/WoTypeManagementList'));
const WoMaterialsConfig = React.lazy(() => import('./parts/wo/materialsConfig/WoMaterialsConfigList'));
const WoConfigWoHelpVsmart = React.lazy(() => import('./parts/wo/configWoHelpVsmart/WoConfigWoHelpVsmartList'));
const WoConfigProperty = React.lazy(() => import('./parts/wo/configProperty/WoConfigPropertyList'));
const WoUpdateServiceInfra = React.lazy(() => import('./parts/wo/updateServiceInfra/WoUpdateServiceInfraList'));
const WoConfigMapUnitGnocNims = React.lazy(() => import('./parts/wo/configMapUnitGnocNims/WoConfigMapUnitGnocNimsList'));

//Apps_end

// import CodeEditors from './views/Editors/CodeEditors'
// const CodeEditors = React.lazy(() => import('./views/Editors/CodeEditors'));
// const TextEditors = React.lazy(() => import('./views/Editors/TextEditors'));

// const Compose = React.lazy(() => import('./views/Apps/Email/Compose'));
// const Inbox = React.lazy(() => import('./views/Apps/Email/Inbox'));
// const Message = React.lazy(() => import('./views/Apps/Email/Message'));
// const Invoice = React.lazy(() => import('./views/Apps/Invoicing/Invoice'));

// const AdvancedForms = React.lazy(() => import('./views/Forms/AdvancedForms'));
// const BasicForms = React.lazy(() => import('./views/Forms/BasicForms'));
// const ValidationForms = React.lazy(() => import('./views/Forms/ValidationForms'));
// const GoogleMaps = React.lazy(() => import('./views/GoogleMaps'));
// const Toastr = React.lazy(() => import('./views/Notifications/Toastr'));
// const Calendar = React.lazy(() => import('./views/Plugins/Calendar'));
// const Draggable = React.lazy(() => import('./views/Plugins/Draggable'));
// const Spinners = React.lazy(() => import('./views/Plugins/Spinners'));
// const DataTable = React.lazy(() => import('./views/Tables/DataTable'));
// const Tables = React.lazy(() => import('./views/Tables/Tables'));
// const LoadingButtons = React.lazy(() => import('./views/Buttons/LoadingButtons'));

// const Breadcrumbs = React.lazy(() => import('./views/Base/Breadcrumbs'));
// const Cards = React.lazy(() => import('./views/Base/Cards'));
// const Carousels = React.lazy(() => import('./views/Base/Carousels'));
// const Collapses = React.lazy(() => import('./views/Base/Collapses'));
// const Dropdowns = React.lazy(() => import('./views/Base/Dropdowns'));

// const Jumbotrons = React.lazy(() => import('./views/Base/Jumbotrons'));
// const ListGroups = React.lazy(() => import('./views/Base/ListGroups'));
// const Navbars = React.lazy(() => import('./views/Base/Navbars'));
// const Navs = React.lazy(() => import('./views/Base/Navs'));
// const Paginations = React.lazy(() => import('./views/Base/Paginations'));
// const Popovers = React.lazy(() => import('./views/Base/Popovers'));
// const ProgressBar = React.lazy(() => import('./views/Base/ProgressBar'));
// const SpinnersB4 = React.lazy(() => import('./views/Base/Spinners'));
// const Switches = React.lazy(() => import('./views/Base/Switches'));

// const Tabs = React.lazy(() => import('./views/Base/Tabs'));
// const Tooltips = React.lazy(() => import('./views/Base/Tooltips'));
// const BrandButtons = React.lazy(() => import('./views/Buttons/BrandButtons'));
// const ButtonDropdowns = React.lazy(() => import('./views/Buttons/ButtonDropdowns'));
// const ButtonGroups = React.lazy(() => import('./views/Buttons/ButtonGroups'));
// const Buttons = React.lazy(() => import('./views/Buttons/Buttons'));
// const Charts = React.lazy(() => import('./views/Charts'));
// const Dashboard = React.lazy(() => import('./views/Dashboard'));
// const CoreUIIcons = React.lazy(() => import('./views/Icons/CoreUIIcons'));
// const Flags = React.lazy(() => import('./views/Icons/Flags'));
// const FontAwesome = React.lazy(() => import('./views/Icons/FontAwesome'));
// const SimpleLineIcons = React.lazy(() => import('./views/Icons/SimpleLineIcons'));
// const Alerts = React.lazy(() => import('./views/Notifications/Alerts'));
// const Badges = React.lazy(() => import('./views/Notifications/Badges'));
// const Modals = React.lazy(() => import('./views/Notifications/Modals'));
// const Colors = React.lazy(() => import('./views/Theme/Colors'));
// const Typography = React.lazy(() => import('./views/Theme/Typography'));
// const Widgets = React.lazy(() => import('./views/Widgets/Widgets'));
// const Users = React.lazy(() => import('./views/Users/Users'));
// const User = React.lazy(() => import('./views/Users/User'));

// https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config
const routes = [
  { path: '/', exact: true, code: 'HOME', name: '' },
  { path: '/dashboard', code: 'DASHBOARD', name: '', component: Dashboard },
  //Apps_start
  // { path: '/employees', exact: true, name: 'Quản lý nhân viên', component: Employees },

  //WO
  { path: '', exact: true, code: 'GNOC_WO_MANAGEMENTS', name: '', component: WoManagement },
  { path: '', code: 'WO_MANAGEMENT', name: '', component: WoManagement },
  { path: '', code: 'WO_ERROR_CASE_MANAGEMENT', name: '', component: WoErrorCaseManagement },
  { path: '', code: 'WO_MAP_PROVINCE_CD_GROUP', name: '', component: WoMapProvinceCdGroup },
  { path: '', code: 'WO_CD_GROUP_MANAGEMENT', name: '', component: WoCdGroupManagement },
  { path: '', code: 'WO_TYPE_MANAGEMENT', name: '', component: WoTypeManagement },
  { path: '', code: 'WO_MATERIALS_CONFIG', name: '', component: WoMaterialsConfig },
  { path: '', code: 'WO_CONFIG_WO_HELP_VSMART', name: '', component: WoConfigWoHelpVsmart },
  { path: '', code: 'WO_CONFIG_PROPERTY', name: '', component: WoConfigProperty },
  { path: '', code: 'WO_UPDATE_SERVICE_INFRA', name: '', component: WoUpdateServiceInfra },
  { path: '', code: 'WO_CONFIG_MAP_UNIT_GNOC_NIMS', name: '', component: WoConfigMapUnitGnocNims },
  
  //CR
  { path: '', exact: true, code: 'GNOC_CR', name: '', component: CrManagement },
  { path: '', code: 'CR_MANAGEMENT', name: '', component: CrManagement },
  { path: '', code: 'CR_ALARM_SETTING', name: '', component: UtilityCrAlarmSetting },
  { path: '', code: 'CR_GROUP_DEPARTMENT_CONFIG', name: '', component: UtilityGroupDepartmentConfig },
  { path: '', code: 'CR_DEVICE_TYPE_MANAGEMENT', name: '', component: UtilityDeviceTypeManagement },
  { path: '', code: 'CR_SCOPES_MANAGEMENT', name: '', component: UtilityScopesManagement },
  { path: '', code: 'CR_ROLES_MANAGEMENT', name: '', component: UtilityRolesManagement },
  { path: '', code: 'CR_CONFIG_IMPACT_SEGMENT', name: '', component: UtilityImpactSegment },
  { path: '', code: 'CR_CONFIG_AFFECTED_LEVEL', name: '', component: UtilityAffectedLevel },
  { path: '', code: 'CR_DEPARTMENTS_ROLES_MANAGEMENT', name: '', component: UtilityDepartmentsRolesManagement },
  { path: '', code: 'CR_DEPARTMENTS_SCOPES_MANAGEMENT', name: '', component: UtilityDepartmentsScopeManagement },
  { path: '', code: 'CR_ROLES_SCOPES_MANAGEMENT', name: '', component: UtilityRolesScopeManagement },
  { path: '', code: 'CR_PROCESS_MANAGEMENT', name: '', component: UtilityProcessManagement },
  { path: '', code: 'CR_CONFIG_RETURN_ACTION', name: '', component: UtilityConfigReturnAction },
  { path: '', code: 'CR_CONFIG_WEBSERVICE_IMPORT', name: '', component: UtilityConfigWebserviceImport },
  { path: '', code: 'CR_CONFIG_TEMP_IMPORT', name: '', component: UtilityConfigTempImport },
  { path: '', code: 'CR_IMPACT_FRAME', name: '', component: UtilityCrImpactFrame },
  { path: '', code: 'CR_ACTION_CODE', name: '', component: UtilityCrActionCode },
  { path: '', code: 'CR_CONFIG_CHILD_ARRAY', name: '', component: UtilityConfigChildArray },
  { path: '', code: 'CR_GROUP_UNIT', name: '', component: UtilityGroupUnit },
  { path: '', code: 'CR_CAB_USERS', name: '', component: UtilityCrCabUsers },

  // TT
  { path: '', exact: true, code: 'GNOC_TT_MANAGEMENT', name: '', component: TtTrouble },
  { path: '', code: 'TT_TROUBLE', name: '', component: TtTrouble },
  { path: '', code: 'TT_CONFIG_TIME', name: '', component: TtConfigTime },
  { path: '', code: 'TT_MESSAGE_CONFIG', name: '', component: TtMessageConfig },
  { path: '', code: 'TT_INFO_CONFIG', name: '', component: TtInfoConfig },
  { path: '', code: 'TT_CONFIG_RECEIVE_UNIT', name: '', component: TtConfigReceiveUnit },
  { path: '', code: 'TT_CONFIG_MOP', name: '', component: TtConfigMop },
  
  // Kedb
  { path: '', exact: true, code: 'GNOC_KEDB', name: '', component: KedbManagement },
  { path: '', code: 'KEDB_MANAGEMENT', name: '', component: KedbManagement },

  // Utility
  { path: '', exact: true, code: 'GNOC_UTILITY', name: '', component: UtilityVersionCatalog },
  { path: '', code: 'UTILITY_VERSION_CATALOG', name: '', component: UtilityVersionCatalog },
  { path: '', code: 'UTILITY_STATUS_CONFIG', name: '', component: UtilityStatusConfig },
  { path: '', code: 'UTILITY_LANGUAGE_CONFIG', name: '', component: UtilityLanguageConfig },
  { path: '', code: 'UTILITY_WORK_LOGS', name: '', component: UtilityWorkLogs },
  { path: '', code: 'UTILITY_CONFIG_SHIFT_HANDOVER', name: '', component: UtilityConfigShiftHandover },
  { path: '', code: 'UTILITY_CONFIG_EMPLOYEE_DAY_OFF', name: '', component: UtilityConfigEmployeeDayOff },
  { path: '', code: 'UTILITY_CONFIG_REQUEST_SCHEDULE', name: '', component: UtilityConfigRequestSchedule },
  { path: '', code: 'UTILITY_CONFIG_EMPLOYEE_IMPACT', name: '', component: UtilityConfigEmployeeImpact },

  // PT
  { path: '', exact: true, code: 'GNOC_PT_MANAGEMENT', name: '', component: PtProblem },
  { path: '', code: 'PT_PROBLEM', name: '', component: PtProblem },
  { path: '', code: 'PT_CONFIG_TIME_HANDLE_PROBLEM', name: '', component: PtConfig },

  // OD
  { path: '', exact: true, code: 'GNOC_OD_MANAGEMENT', name: '', component: OdWorkflow },
  { path: '', code: 'OD_TYPE_MANAGEMENT', name: '', component: OdType },
  { path: '', code: 'OD_SCHEDULE_CREATE', name: '', component: OdConfigScheduleCreate },
  { path: '', code: 'OD_CONFIG_BUSINESS', name: '', component: OdConfigBusiness },
  { path: '', code: 'OD_WORKFLOW_MANAGEMENT', name: '', component: OdWorkflow },

  //Apps_end
  // { path: '/theme', name: 'Theme', component: Colors, exact: true },
  // { path: '/theme/colors', name: 'Colors', component: Colors },
  // { path: '/theme/typography', name: 'Typography', component: Typography },
  // { path: '/base', name: 'Base', component: Cards, exact: true },
  // { path: '/base/breadcrumbs', name: 'Breadcrumbs', component: Breadcrumbs },
  // { path: '/base/cards', name: 'Cards', component: Cards },
  // { path: '/base/carousels', name: 'Carousel', component: Carousels },
  // { path: '/base/collapses', name: 'Collapse', component: Collapses },
  // { path: '/base/dropdowns', name: 'Dropdowns', component: Dropdowns },
  // { path: '/base/jumbotrons', name: 'Jumbotrons', component: Jumbotrons },
  // { path: '/base/list-groups', name: 'List Groups', component: ListGroups },
  // { path: '/base/navbars', name: 'Navbars', component: Navbars },
  // { path: '/base/navs', name: 'Navs', component: Navs },
  // { path: '/base/paginations', name: 'Paginations', component: Paginations },
  // { path: '/base/popovers', name: 'Popovers', component: Popovers },
  // { path: '/base/progress-bar', name: 'Progress Bar', component: ProgressBar },
  // { path: '/base/spinners', name: 'Spinners', component: SpinnersB4 },
  // { path: '/base/switches', name: 'Switches', component: Switches },
  // { path: '/base/tabs', name: 'Tabs', component: Tabs },
  // { path: '/base/tooltips', name: 'Tooltips', component: Tooltips },
  // { path: '/buttons', name: 'Buttons', component: Buttons, exact: true },
  // { path: '/buttons/buttons', name: 'Buttons', component: Buttons },
  // { path: '/buttons/button-dropdowns', name: 'Dropdowns', component: ButtonDropdowns },
  // { path: '/buttons/button-groups', name: 'Button Groups', component: ButtonGroups },
  // { path: '/buttons/brand-buttons', name: 'Brand Buttons', component: BrandButtons },
  // { path: '/buttons/loading-buttons', name: 'Loading Buttons', component: LoadingButtons },
  // { path: '/charts', name: 'Charts', component: Charts },
  // { path: '/editors', name: 'Editors', component: CodeEditors, exact: true },
  // { path: '/editors/code-editors', name: 'Code Editors', component: CodeEditors },
  // { path: '/editors/text-editors', name: 'Text Editors', component: TextEditors },
  // { path: '/forms', name: 'Forms', component: BasicForms, exact: true },
  // { path: '/forms/advanced-forms', name: 'Advanced Forms', component: AdvancedForms },
  // { path: '/forms/basic-forms', name: 'Basic Forms', component: BasicForms },
  // { path: '/forms/validation-forms', name: 'Form Validation', component: ValidationForms },
  // { path: '/google-maps', name: 'Google Maps', component: GoogleMaps },
  // { path: '/icons', exact: true, name: 'Icons', component: CoreUIIcons },
  // { path: '/icons/coreui-icons', name: 'CoreUI Icons', component: CoreUIIcons },
  // { path: '/icons/flags', name: 'Flags', component: Flags },
  // { path: '/icons/font-awesome', name: 'Font Awesome', component: FontAwesome },
  // { path: '/icons/simple-line-icons', name: 'Simple Line Icons', component: SimpleLineIcons },
  // { path: '/notifications', name: 'Notifications', component: Alerts, exact: true },
  // { path: '/notifications/alerts', name: 'Alerts', component: Alerts },
  // { path: '/notifications/badges', name: 'Badges', component: Badges },
  // { path: '/notifications/modals', name: 'Modals', component: Modals },
  // { path: '/notifications/toastr', name: 'Toastr', component: Toastr },
  // { path: '/plugins', name: 'Plugins', component: Calendar, exact: true },
  // { path: '/plugins/calendar', name: 'Calendar', component: Calendar },
  // { path: '/plugins/draggable', name: 'Draggable Cards', component: Draggable },
  // { path: '/plugins/spinners', name: 'Spinners', component: Spinners },
  // { path: '/tables', name: 'Tables', component: Tables, exact: true },
  // { path: '/tables/data-table', name: 'Data Table', component: DataTable },
  // { path: '/tables/tables', name: 'Tables', component: Tables },
  // { path: '/widgets', name: 'Widgets', component: Widgets },
  // { path: '/apps', name: 'Apps', component: Compose, exact: true },
  // { path: '/apps/email', name: 'Email', component: Compose, exact: true },
  // { path: '/apps/email/compose', name: 'Compose', component: Compose },
  // { path: '/apps/email/inbox', name: 'Inbox', component: Inbox },
  // { path: '/apps/email/message', name: 'Message', component: Message },
  // { path: '/apps/invoicing', name: 'Invoice', component: Invoice, exact: true },
  // { path: '/apps/invoicing/invoice', name: 'Invoice', component: Invoice },
  // { path: '/users', exact: true,  name: 'Users', component: Users },
  // { path: '/users/:id', exact: true, name: 'User Details', component: User }
];

export default routes;

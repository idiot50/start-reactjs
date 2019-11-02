import React, { Component } from 'react';
import { Button, Card, CardBody, CardFooter, CardHeader, Col, Collapse, Row } from 'reactstrap';
import { AvForm } from 'availity-reactstrap-validation';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { translate, Trans } from 'react-i18next';
import { toastr } from 'react-redux-toastr';
import LaddaButton, { ZOOM_OUT } from 'react-ladda';
import * as commonActions from './../../../actions/commonActions';
import * as CrManagementActions from './CrManagementActions';
import CrManagementAddEdit from "./CrManagementAddEdit";
import { buildDataCbo } from './CrManagementUtils';
import { convertDateToDDMMYYYYHHMISS, validSubmitForm, invalidSubmitForm } from "../../../containers/Utils/Utils";
import moment from 'moment';
import { CustomDateTimeRangePicker, CustomReactTableSearch, CustomSelectLocal, CustomMultiSelectLocal, SettingTableLocal, CustomAutocomplete, CustomInputFilter, CustomAppSwitch, CustomInputPopup } from '../../../containers/Utils';
import { CustomCSSTransition } from "../../../containers/Utils/CustomCSSTransition";
import CrManagementImport from './CrManagementImport';
import CrManagementNetworkNodePopup from './CrManagementNetworkNodePopup';

class CrManagementList extends Component {
    constructor(props) {
        super(props);

        this.toggleFormSearch = this.toggleFormSearch.bind(this);
        this.onFetchData = this.onFetchData.bind(this);
        this.openPage = this.openPage.bind(this);
        this.closePage = this.closePage.bind(this);
        this.searchCrManagement = this.searchCrManagement.bind(this);
        this.handleKeyDownForm = this.handleKeyDownForm.bind(this);
        this.search = this.search.bind(this);
        this.clearSearchConditions = this.clearSearchConditions.bind(this);
        this.onExport = this.onExport.bind(this);

        this.state = {
            collapseFormSearch: false,
            isSearchClicked: true,
            btnSearchLoading: false,
            btnExportLoading: false,
            isOpenNetworkNodePopup: false,
            searchRange: 90,
            //Object Search
            objectSearch: {},
            //Table
            data: [],
            pages: null,
            loading: true,
            columns: this.buildTableColumns(),
            fieldsProperty: this.buildPropertyFields(),
            //AddOrEditPage
            modalName: null,
            //AddPage
            addModal: false,
            //temp
            selectValueSearchGroup: {value: 1},
            selectValueScope: {},
            selectValueScopeCurrent: {},
            selectValueCrType: {},
            selectValueSubcategory: {},
            selectValueDomain: {},
            selectValueNation: {},
            // selectValuePriority: {},
            selectValueState: buildDataCbo("STATE").map(item => {return {value: item.itemId}}),
            approveCr: false,
            impactNode: [],
            importModal: false,
            earliestStartTime: moment().subtract(60, 'days'),
            earliestStartTimeTo: moment().add(30, 'days'),
            latestStartTime: null,
            latestStartTimeTo: null,
            selectValueOrginatorUnit: {},
            isCheckedOrginatorUnitSub: false,
            selectValueResponsibleUnit: {},
            isCheckedResponsibleUnitSub: false,
            selectValueResponsible: {},
            selectValueOrginator: {},
            nationList: []
        };
    }

    componentDidMount() {
        this.props.actions.getListSubcategoryCBB();
        this.props.actions.getListImpactSegmentCBB();
        this.props.actions.getListLocationByLevelCBB(1, "").then(response => {
            this.setState({
                nationList: response.payload.data || []
            });
        });
        this.props.actions.getListScopeOfUserForAllRole({userLogin: JSON.parse(localStorage.user).userID, userLoginUnit: JSON.parse(localStorage.user).deptId, searchType: this.state.selectValueSearchGroup.value});
        this.setDefaultValue();
    }

    receiveMsg = (d) => {
        const data = {};
        data.userId = JSON.parse(localStorage.user).userID;
        data.userName = JSON.parse(localStorage.user).userName;
        data.crId = d.crId;
        data.crNumber = d.crNumber;
        data.createdDate = d.createdDate;
        data.insertTime = new Date();
        data.earliestStartTime = d.earliestStartTime;
        data.earliestStartTimeTo = this.state.objectSearch.earliestStartTimeTo;
        data.latestStartTime = d.latestStartTime;
        data.isCheckAction = !d.isCheckAction;
        this.props.actions.changeCheckboxAction(data).then(response => {
            if (response.payload.data.key === "SUCCESS") {
                this.customReactTableSearch.resetPage();
                this.searchCrManagement();
                toastr.success(this.props.t("crManagement:crManagement.message.success.save"));
            } else if (response.payload.data.key === "ERROR") {
                toastr.error(response.payload.data.message);
            } else {
                toastr.error(this.props.t("crManagement:crManagement.message.error.save"));
            }
        }).catch(response => {
            try {
                toastr.error(response.error.response.data.errors[0].defaultMessage);
            } catch (error) {
                toastr.error(this.props.t("crManagement:crManagement.message.error.save"));
            }
        });
    }

    handleChangeUserCab = (d, option) => {
        const data = [...this.state.data];
        for (const item of data) {
            if (item.crId === d.crId) {
                item.userCab = option.value;
                break;
            }
        }
        this.setState({
            data
        });
    }

    buildTableColumns() {
        return [
            {
                Header: <Trans i18nKey="crManagement:crManagement.label.action"/>,
                id: "action",
                sortable: false,
                fixed: "left",
                width: 90,
                accessor: d => {
                    let html = <div></div>;
                    const iconProperty = this.checkIconTable(d.actionRight);
                    const actionType = iconProperty.iconName === "file-text-o" ? "VIEW" : "EDIT";
                    html = <div className="text-center">
                        <span title={this.findTitleIcon(d.actionRight)}>
                            <Button type="button" size="sm" className="btn-info icon mr-2" onClick={() => this.openPage(actionType, d)}><i className={iconProperty.visible ? "fa fa-" + iconProperty.iconName : "class-hidden"}></i></Button>
                        </span>
                        <span title={d.isCheckAction ? this.props.t("crManagement:crManagement.label.unReceiveMsg") : this.props.t("crManagement:crManagement.label.receiveMsg")}>
                            <input type="checkbox" checked={d.isCheckAction ? true : false} name={"receiveMsg-" + d.crId} onChange={() => this.receiveMsg(d)} style={{ zoom: '1.5', verticalAlign: 'middle' }} />
                        </span>
                    </div>;
                    return html;
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{height: '2.7em'}}></div>
                )
            },
            {
                Header: <Trans i18nKey="crManagement:crManagement.label.orginatorUnit"/>,
                id: "changeOrginatorUnitName",
                width: 200,
                accessor: d => {
                    return d.changeOrginatorUnitName ? <span title={d.changeOrginatorUnitName}>{d.changeOrginatorUnitName}</span>
                    : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <span title={this.props.t("crManagement:crManagement.placeholder.unit")}>
                        <CustomAutocomplete
                            name={"changeOrginatorUnitId"}
                            label={""}
                            placeholder={this.props.t("crManagement:crManagement.placeholder.unit")}
                            isRequired={false}
                            closeMenuOnSelect={false}
                            handleItemSelectChange={(d) => this.setState({ selectValueOrginatorUnit: d })}
                            selectValue={this.state.selectValueOrginatorUnit}
                            moduleName={"UNIT"}
                            isOnlyInputSelect={true}
                            isHasCheckbox={true}
                            nameCheckbox={"checkChangeOrginatorUnitId"}
                            isCheckedCheckbox={this.state.isCheckedOrginatorUnitSub}
                            handleOnChangeCheckbox={() => this.setState({ isCheckedOrginatorUnitSub: !this.state.isCheckedOrginatorUnitSub })}
                            titleCheckbox={this.props.t("crManagement:crManagement.label.subdept")}
                        />
                    </span>
                )
            },
            {
                Header: <Trans i18nKey="crManagement:crManagement.label.crNumber"/>,
                id: "crNumber",
                minWidth: 250,
                accessor: d => {
                    return d.crNumber ?
                    <span title={d.crNumber} style={{ cursor: 'pointer', color: 'rgb(32, 168, 216)', textDecoration: 'underline' }}
                            onClick={() => this.openPage("VIEW", d)}>
                        {d.crNumber}
                    </span>
                    : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <span title={this.props.t("crManagement:crManagement.placeholder.crNumber")}>
                        <CustomInputFilter name="crNumber" placeholder={this.props.t("crManagement:crManagement.placeholder.crNumber")} />
                    </span>
                )
            },
            {
                Header: <Trans i18nKey="crManagement:crManagement.label.userCAB"/>,
                id: "userCAB",
                minWidth: 200,
                Cell: ({ original }) => {
                    return <CustomSelectLocal
                                name={"userCAB"}
                                label={""}
                                isRequired={false}
                                options={original.lstUserCab.map(item => {return {itemId: item.valueStr, itemName: item.displayStr, itemCode: item.secondValue}})}
                                closeMenuOnSelect={true}
                                handleItemSelectChange={(option) => this.handleChangeUserCab(original, option)}
                                selectValue={{value: original.userCab}}
                                isOnlyInputSelect={true}
                                isDisabled={this.state.objectSearch.searchType + "" === "9" ? false : true}
                            />;
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{height: '2.7em'}}></div>
                )
            },
            {
                Header: <Trans i18nKey="crManagement:crManagement.label.crName"/>,
                id: "title",
                minWidth: 200,
                accessor: d => {
                    return d.title ? <span title={d.title}>{d.title}</span>
                    : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <CustomInputFilter name="title" placeholder={this.props.t("crManagement:crManagement.placeholder.title")} />
                )
            },
            {
                Header: <Trans i18nKey="crManagement:crManagement.label.state"/>,
                id: "state",
                minWidth: 200,
                accessor: d => {
                    const state = buildDataCbo("STATE").find(item => item.itemId + "" === d.state + "") || {};
                    return d.state ? <span title={state.itemName}>{state.itemName}</span>
                    : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => {
                    const stateList = buildDataCbo("STATE");
                    return (
                        <CustomMultiSelectLocal
                            name={"state"}
                            label={""}
                            isRequired={false}
                            options={stateList}
                            closeMenuOnSelect={false}
                            handleItemSelectChange={(d) => this.setState({ selectValueState: d })}
                            selectValue={this.state.selectValueState}
                            isOnlyInputSelect={true}
                            isDisabled={this.state.fieldsProperty.status.disable}
                        />
                    );
                }
            },
            {
                Header: <Trans i18nKey="crManagement:crManagement.label.startTime"/>,
                id: "earliestStartTime",
                minWidth: 200,
                accessor: d => {
                    return d.earliestStartTime ? <span title={convertDateToDDMMYYYYHHMISS(d.earliestStartTime)}>{convertDateToDDMMYYYYHHMISS(d.earliestStartTime)}</span>
                    : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <CustomDateTimeRangePicker
                        name={"earliestStartTime"}
                        label={""}
                        isRequired={true}
                        startDate={this.state.earliestStartTime}
                        endDate={this.state.earliestStartTimeTo}
                        handleApply={this.handleApplyStartTime}
                        dateFormat="DD/MM/YYYY HH:mm:ss"
                        isOnlyInputSelect={true}
                    />
                )
            },
            {
                Header: <Trans i18nKey="crManagement:crManagement.label.endTime"/>,
                id: "latestStartTime",
                minWidth: 200,
                accessor: d => {
                    return d.latestStartTime ? <span title={convertDateToDDMMYYYYHHMISS(d.latestStartTime)}>{convertDateToDDMMYYYYHHMISS(d.latestStartTime)}</span>
                    : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <CustomDateTimeRangePicker
                        name={"latestStartTime"}
                        label={""}
                        isRequired={false}
                        startDate={this.state.latestStartTime}
                        endDate={this.state.latestStartTimeTo}
                        handleApply={this.handleApplyEndTime}
                        dateFormat="DD/MM/YYYY HH:mm:ss"
                        isOnlyInputSelect={true}
                    />
                )
            },
            {
                Header: <Trans i18nKey="crManagement:crManagement.label.responseTime"/>,
                id: "responeTime",
                minWidth: 200,
                accessor: d => {
                    return d.responeTime ? <span title={d.responeTime}>{d.responeTime}</span>
                    : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{height: '2.7em'}}></div>
                )
            },
            {
                Header: <Trans i18nKey="crManagement:crManagement.label.priority"/>,
                id: "priority",
                minWidth: 200,
                accessor: d => {
                    const priority = buildDataCbo("PRIORITY").find(item => item.itemId + "" === d.priority + "") || {};
                    return d.priority ? <span title={priority.itemName}>{priority.itemName}</span>
                    : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{height: '2.7em'}}></div>
                    // <CustomSelectLocal
                    //     name={"priorityId"}
                    //     label={""}
                    //     isRequired={false}
                    //     options={buildDataCbo("PRIORITY")}
                    //     closeMenuOnSelect={true}
                    //     handleItemSelectChange={(d) => this.setState({ selectValuePriority: d })}
                    //     selectValue={this.state.selectValuePriority}
                    //     isOnlyInputSelect={true}
                    // />
                )
            },
            {
                Header: <Trans i18nKey="crManagement:crManagement.label.lastUpdateTime"/>,
                id: "updateTime",
                minWidth: 200,
                accessor: d => {
                    return d.updateTime ? <span title={convertDateToDDMMYYYYHHMISS(d.updateTime)}>{convertDateToDDMMYYYYHHMISS(d.updateTime)}</span>
                    : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{height: '2.7em'}}></div>
                )
            },
            {
                Header: <Trans i18nKey="crManagement:crManagement.label.orginator"/>,
                id: "changeOrginatorName",
                minWidth: 200,
                accessor: d => {
                    return d.changeOrginatorName ? <span title={d.changeOrginatorName}>{d.changeOrginatorName}</span>
                    : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <span title={this.props.t("crManagement:crManagement.placeholder.unit")}>
                        <CustomAutocomplete
                            name={"changeOrginatorId"}
                            label={""}
                            placeholder={this.props.t("crManagement:crManagement.placeholder.orginator")}
                            isRequired={false}
                            closeMenuOnSelect={false}
                            handleItemSelectChange={(d) => this.setState({ selectValueOrginator: d })}
                            selectValue={this.state.selectValueOrginator}
                            moduleName={"USERS"}
                            isOnlyInputSelect={true}
                            isHasChildren={true}
                        />
                    </span>
                )
            },
            {
                Header: <Trans i18nKey="crManagement:crManagement.label.responsible"/>,
                id: "changeResponsibleName",
                minWidth: 200,
                accessor: d => {
                    return d.changeResponsibleName ? <span title={d.changeResponsibleName}>{d.changeResponsibleName}</span>
                    : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <CustomAutocomplete
                        name={"changeResponsibleId"}
                        label={""}
                        placeholder={this.props.t("crManagement:crManagement.placeholder.responsible")}
                        isRequired={false}
                        closeMenuOnSelect={false}
                        handleItemSelectChange={(d) => this.setState({ selectValueResponsible: d })}
                        selectValue={this.state.selectValueResponsible}
                        moduleName={"USERS"}
                        isOnlyInputSelect={true}
                        isHasChildren={true}
                    />
                )
            },
            {
                Header: <Trans i18nKey="crManagement:crManagement.label.responsibleUnit"/>,
                id: "changeResponsibleUnitName",
                minWidth: 200,
                accessor: d => {
                    return d.changeResponsibleUnitName ? <span title={d.changeResponsibleUnitName}>{d.changeResponsibleUnitName}</span>
                    : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <CustomAutocomplete
                        name={"changeResponsibleUnitId"}
                        label={""}
                        placeholder={this.props.t("crManagement:crManagement.placeholder.unit")}
                        isRequired={false}
                        closeMenuOnSelect={false}
                        handleItemSelectChange={(d) => this.setState({ selectValueResponsibleUnit: d })}
                        selectValue={this.state.selectValueResponsibleUnit}
                        moduleName={"UNIT"}
                        isOnlyInputSelect={true}
                        isHasCheckbox={true}
                        nameCheckbox={"checkChangeResponsibleUnitId"}
                        isCheckedCheckbox={this.state.isCheckedResponsibleUnitSub}
                        handleOnChangeCheckbox={() => this.setState({ isCheckedResponsibleUnitSub: !this.state.isCheckedResponsibleUnitSub })}
                        titleCheckbox={this.props.t("crManagement:crManagement.label.subdept")}
                    />
                )
            },
            {
                Header: <Trans i18nKey="crManagement:crManagement.label.considerUnitName"/>,
                id: "considerUnitName",
                minWidth: 200,
                accessor: d => {
                    return d.considerUnitName ? <span title={d.considerUnitName}>{d.considerUnitName}</span>
                    : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{height: '2.7em'}}></div>
                )
            },
            {
                Header: <Trans i18nKey="crManagement:crManagement.label.considerUserName"/>,
                id: "considerUserName",
                minWidth: 200,
                accessor: d => {
                    return d.considerUserName ? <span title={d.considerUserName}>{d.considerUserName}</span>
                    : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{height: '2.7em'}}></div>
                )
            },
            {
                Header: <Trans i18nKey="crManagement:crManagement.label.expireTime"/>,
                id: "onTimeAmount",
                minWidth: 200,
                accessor: d => {
                    return d.onTimeAmount ? <span title={d.onTimeAmount}>{d.onTimeAmount}</span>
                    : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{height: '2.7em'}}></div>
                )
            }
        ];
    }

    buildPropertyFields() {
        return {
            scope: {
                required: false, disable: true, visible: true
            },
            status: {
                required: false, disable: true, visible: true
            },
            childDept: {
                required: false, disable: false, visible: true
            },
            btnAssignCab: {
                required: false, disable: false, visible: false
            },
            crType: {
                required: false, disable: false, visible: true
            }
        };
    }

    findTitleIcon(key) {
        const titleList = buildDataCbo("TITLE_ICON");
        const object = titleList.find(item => item.itemId === key) || {};
        return object.itemName || "";
    }

    checkIconTable(actionRight) {
        let icon = "edit";
        let visible = false;
        if (actionRight && actionRight.trim() === "1") {
            icon = "edit";
            visible = true;
        } else if (actionRight && (["2", "3", "16", "4", "9", "10", "28", "29", "30", "5", "20", "19", "22", "23", "24", "27",
        "21", "8", "26", "7", "6", "11", "12", "13", "14", "15", "17", "18"].includes(actionRight.trim()))) {
            icon = "gear";
            visible = true;
        } else if (actionRight !== null) {
            icon = "file-text-o";
            visible = true;
        }
        return {iconName: icon, visible: visible, title: ""};
    }

    setDefaultValue = () => {

    }

    handleApplyStartTime = (event, picker) => {
        this.setState({
            earliestStartTime: picker.startDate,
            earliestStartTimeTo: picker.endDate,
        });
    }

    handleApplyEndTime = (event, picker) => {
        this.setState({
            latestStartTime: picker.startDate,
            latestStartTimeTo: picker.endDate,
        });
    }

    handleChangeSearchGroup = (d) => {
        this.setState({
            selectValueSearchGroup: d
        }, () => {
            this.validateSearchTypeChange();
        });
    }

    validateSearchTypeChange = () => {
        if (this.state.selectValueSearchGroup.value !== null || this.state.selectValueSearchGroup.value !== undefined) {
            const value = this.state.selectValueSearchGroup.value;
            const fieldsProperty = Object.assign({}, this.state.fieldsProperty);
            if (value === 0) {
                fieldsProperty.scope.disable = true;
                fieldsProperty.status.disable = false;
                this.setState({
                    selectValueScope: {}
                });
            } else if ([2, 4, 9, 12, 8, 11].includes(value)) {
                fieldsProperty.scope.disable = false;
                fieldsProperty.status.disable = true;
                this.props.actions.getListScopeOfUserForAllRole({userLogin: JSON.parse(localStorage.user).userID, userLoginUnit: JSON.parse(localStorage.user).deptId, searchType: value});
                this.setState({
                    selectValueScope: Object.assign({}, this.state.selectValueScopeCurrent)
                });
            } else {
                fieldsProperty.scope.disable = true;
                fieldsProperty.status.disable = true;
                this.setState({
                    selectValueScope: {}
                });
            }

            if (value === 1) {
                fieldsProperty.childDept.visible = true;
            } else {
                fieldsProperty.childDept.visible = false;
                this.setState({
                    approveCr: false
                });
            }

            if (value === 9) {
                fieldsProperty.btnAssignCab.visible = true;
            } else {
                fieldsProperty.btnAssignCab.visible = false;
            }

            if (!fieldsProperty.scope.disable && value !== 8 && value !== 4) {
                    fieldsProperty.scope.required = true;
            } else {
                fieldsProperty.scope.required = false;
            }

            if (value === 4) {
                    fieldsProperty.crType.required = true;
            } else {
                fieldsProperty.crType.required = false;
            }
            this.setState({
                fieldsProperty
            });
        }
    }

    toggleFormSearch() {
        this.setState({ collapseFormSearch: !this.state.collapseFormSearch });
    }

    onFetchData(state, instance) {
        let sortName = null;
        let sortType = null;
        if (state.sorted.length > 0) {
            if (state.sorted[0].id !== null && state.sorted[0].id !== undefined) {
                sortName = state.sorted[0].id;
                sortType = state.sorted[0].desc ? "desc" : "asc";
            }
        }

        let values = {
            page: state.page + 1,
            pageSize: state.pageSize,
            sortName: sortName,
            sortType: sortType
        }

        const objectSearch = Object.assign({}, this.state.objectSearch, values);
        this.setDataToObject(objectSearch);

        this.setState({
            loading: true,
            objectSearch
        }, () => {
            this.searchCrManagement();
        });
    }

    handleKeyDownForm(event) {
        if(event.key === 'Enter'){
            this.setState({
                isSearchClicked: false
            });
        }
    }

    search(event, values) {
        const checkValidate = this.validateSearch();
        if (!checkValidate) return;
        validSubmitForm(event, values, "idFormSearchCr");
        const objectSearch = Object.assign({}, this.state.objectSearch, values);
        this.setDataToObject(objectSearch);
        objectSearch.page = 1;
        this.setState({
            btnSearchLoading: this.state.isSearchClicked,
            loading: true,
            objectSearch: objectSearch
        }, () => {
            this.customReactTableSearch.resetPage();
            this.searchCrManagement();
        });
    }

    handleInvalidSubmitAddOrEdit = (event, errors, values) => {
        if (errors.length > 0) {
            this.setState({
                collapseFormSearch: true
            });
        }
        toastr.warning(this.props.t("common:common.message.required.allFields"));
        invalidSubmitForm(event, errors, values, "idFormSearchCr");
    }

    setDataToObject(object) {
        object.userLogin = JSON.parse(localStorage.user).userID;
        object.userLoginUnit = JSON.parse(localStorage.user).deptId;
        object.searchType = this.state.selectValueSearchGroup.value;
        object.state = this.state.selectValueState.map(item => item.value).join(",");
        object.earliestStartTime = this.state.earliestStartTime ? this.state.earliestStartTime.toDate() : null;
        object.earliestStartTimeTo = this.state.earliestStartTimeTo ? convertDateToDDMMYYYYHHMISS(this.state.earliestStartTimeTo.toDate()) : null;
        object.latestStartTime = this.state.latestStartTime ? this.state.latestStartTime.toDate() : null;
        object.latestStartTimeTo = this.state.latestStartTimeTo ? convertDateToDDMMYYYYHHMISS(this.state.latestStartTimeTo.toDate()) : null;
        object.crNumber = object.crNumber ? object.crNumber.trim() : "";
        object.title = object.title ? object.title.trim() : "";
        object.crType = this.state.selectValueCrType.value || null;
        object.subcategory = this.state.selectValueSubcategory.value || null;
        object.scopeId = this.state.selectValueScope.value || null;
        object.impactSegment = this.state.selectValueDomain.value || null;
        object.country = this.state.selectValueNation.value || null;
        object.changeOrginatorUnit = this.state.selectValueOrginatorUnit ? this.state.selectValueOrginatorUnit.value : null;
        object.changeOrginator = this.state.selectValueOrginator ? this.state.selectValueOrginator.value : null;
        object.changeResponsibleUnit = this.state.selectValueResponsibleUnit ? this.state.selectValueResponsibleUnit.value : null;
        object.changeResponsible = this.state.selectValueResponsible ? this.state.selectValueResponsible.value : null;
        object.subDeptOri = this.state.isCheckedOrginatorUnitSub ? "1" : "0";
        object.subDeptResp = this.state.isCheckedResponsibleUnitSub ? "1" : "0";
        object.isSearchChildDeptToApprove = this.state.approveCr ? "1" : "0";
        object.searchImpactedNodeIpIds = this.state.impactNode.map(item => parseInt(item.ipId, 10));
    }

    validateSearch = () => {
        if (this.state.impactNode.length > 0) {
            if (this.state.earliestStartTimeTo.toDate() - this.state.earliestStartTime.toDate() > 7*24*60*60*1000) {
                toastr.warning(this.props.t("crManagement:crManagement.message.error.searchDateNotOver", {day: 7}));
                // document.getElementById("custom-input-earliestStartTime").focus();
                return false;
            }
        }

        if (Math.floor((this.state.earliestStartTimeTo.toDate() - this.state.earliestStartTime.toDate())/1000) > this.state.searchRange*24*60*60) {
            toastr.warning(this.props.t("crManagement:crManagement.message.error.searchDateNotOver", {day: this.state.searchRange}));
            // document.getElementById("custom-input-earliestStartTime").focus();
            return false;
        }
        return true;
    }

    searchCrManagement() {
        this.props.actions.searchCrManagement(this.state.objectSearch).then((response) => {
            this.setState({
                data: response.payload.data.data ? response.payload.data.data : [],
                pages: response.payload.data.pages,
                isSearchClicked: true,
                btnSearchLoading: false,
                loading: false
            });
        }).catch((response) => {
            this.setState({
                isSearchClicked: true,
                btnSearchLoading: false,
                loading: false
            });
            toastr.error(this.props.t("crManagement:crManagement.message.error.search"));
        });
    }

    clearSearchConditions() {
        this.setState({
            selectValueSearchGroup: {value: 1},
            selectValueScope: {},
            selectValueScopeCurrent: {},
            selectValueCrType: {},
            selectValueSubcategory: {},
            selectValueDomain: {},
            selectValueNation: {},
            selectValueUserCab: {},
            // selectValuePriority: {},
            selectValueState: buildDataCbo("STATE").map(item => {return {value: item.itemId}}),
            approveCr: false,
            impactNode: [],
            importModal: false,
            earliestStartTime: moment().subtract(60, 'days'),
            earliestStartTimeTo: moment().add(30, 'days'),
            latestStartTime: null,
            latestStartTimeTo: null,
            selectValueOrginatorUnit: {},
            isCheckedOrginatorUnitSub: false,
            selectValueResponsibleUnit: {},
            isCheckedResponsibleUnitSub: false,
            selectValueResponsible: {},
            selectValueOrginator: {}
        }, () => {
            this.validateSearchTypeChange();
            try {
                document.getElementById("input-filter-crNumber").value = "";
                document.getElementById("input-filter-title").value = "";
            } catch (error) {
                
            }
        });
    }

    onExport() {
        this.setState({
            btnExportLoading: true
        }, () => {
            this.props.actions.onExportFile("cr", "CR", this.state.objectSearch).then((response) => {
                this.setState({ btnExportLoading: false });
                toastr.success(this.props.t("common:common.message.success.export"));
            }).catch((response) => {
                this.setState({ btnExportLoading: false });
                toastr.error(this.props.t("common:common.message.error.export"));
            });
        });
    }

    openPage(name, object) {
        if (name === "ADD") {
            this.props.actions.getSequenseCr("cr_seq", 1).then((response) => {
                if (response.payload && response.payload.data) {
                    this.setState({
                        addModal: true,
                        editModal: false,
                        modalName: name,
                        selectedData: { crId: response.payload.data[0], actionRight: "1", searchType: this.state.objectSearch.searchType },
                    });
                }
            });
        } else if (name === "EDIT" || name === "VIEW") {
            this.props.actions.getDetailCrManagement(object.crId).then((response) => {
                if (response.payload && response.payload.data) {
                    this.setState({
                        addModal: true,
                        editModal: false,
                        modalName: name,
                        selectedData: Object.assign(response.payload.data, {actionRight: object.actionRight, searchType: this.state.objectSearch.searchType, lstUserCab: object.lstUserCab}),
                        titleUpdate: name === "EDIT" ? {icon: this.checkIconTable(object.actionRight).iconName, title: this.findTitleIcon(object.actionRight)}
                        : {icon: "file-text-o", title: this.props.t("crManagement:crManagement.title.viewDetail")}
                    });
                } else {
                    toastr.error(this.props.t("crManagement:crManagement.message.error.getDetail"));
                }
            }).catch((response) => {
                toastr.error(this.props.t("crManagement:crManagement.message.error.getDetail"));
            });
        } else if (name === "CLONE") {
            this.props.actions.getDetailCrManagement(object.crId).then((response) => {
                this.props.actions.getSequenseCr("cr_seq", 1).then((res) => {
                    if (res.payload && res.payload.data) {
                        this.setState({
                            addModal: true,
                            editModal: false,
                            modalName: name,
                            selectedData: Object.assign(response.payload.data, { crId: res.payload.data[0], actionRight: "1", searchType: this.state.objectSearch.searchType }),
                        });
                    } else {
                        toastr.error(this.props.t("crManagement:crManagement.message.error.getDetail"));
                    }
                });
            }).catch((response) => {
                toastr.error(this.props.t("crManagement:crManagement.message.error.getDetail"));
            });
        } 
    }

    closePage(name, isChange) {
        if (name === "ADD" || name === "EDIT" || name === "CLONE" || name === "VIEW") {
            this.setState({
                addModal: false,
                moduleName: null
            }, () => {
                if (isChange) {
                    if (name === "ADD" || name === "CLONE") {
                        const objectSearch = Object.assign({}, this.state.objectSearch);
                        objectSearch.page = 1;
                        this.setState({
                            objectSearch
                        },() => {
                            this.customReactTableSearch.resetPage();
                            this.searchCrManagement();
                        });
                    } else {
                        this.searchCrManagement();
                    }
                }
            });
        }
    }

    openImportModal = () => {
        const crNumber = document.getElementById("input-filter-crNumber").value;
        if (crNumber === null || crNumber === "" || crNumber.split(",").length < 1) {
            this.setState({
                importModal: true
            });
        } else {
            this.props.actions.checkDuplicateCr({crNumber: crNumber, state: this.state.selectValueState.map(item => item.value).join(",")}).then((response) => {
            }).catch((response) => {
                toastr.error(this.props.t("crManagement:crManagement.message.error.notDuplicate"));
            });
        }
    }

    closeImportModal = () => {
        this.setState({
            importModal: false
        });
    }

    openNetworkNodePopup = () => {
        this.setState({
            isOpenNetworkNodePopup: true
        });
    }

    closeNetworkNodePopup = () => {
        this.setState({
            isOpenNetworkNodePopup: false
        });
    }

    setValueNetworkNodePopup = (data) => {
        this.setState({
            impactNode: data
        });
    }

    handleAssignCab = () => {
        if (this.state.selectValueScope.value) {
            this.props.actions.actionAssignCabMulti(this.state.data).then((response) => {
                toastr.success(this.props.t("crManagement:crManagement.message.success.msgSuccess") + ": " + response.payload.data.message);
            }).catch((response) => {
                toastr.error(this.props.t("crManagement:crManagement.message.error.msgUnsuccess"));
            });
        } else {
            this.myFormRef.submit();
        }
    }

    render() {
        const { t, response } = this.props;
        const { columns, data, pages, loading, fieldsProperty, nationList } = this.state;
        const searchTypeList = buildDataCbo("CR_SEARCH_TYPE");
        const crTypeList = buildDataCbo("CR_TYPE");
        const subcategoryList = (response.crManagement.getSubcategory && response.crManagement.getSubcategory.payload) ? response.crManagement.getSubcategory.payload.data : [];
        const impactSegmentList = (response.crManagement.getImpactSegment && response.crManagement.getImpactSegment.payload) ? response.crManagement.getImpactSegment.payload.data : [];
        const scopeList = (response.crManagement.getListScope && response.crManagement.getListScope.payload) ? response.crManagement.getListScope.payload.data : [];
        const objectSearch = {};
        return (
            <CustomCSSTransition
                isVisible={this.state.addModal || this.state.editModal}
                content={
                    this.state.addModal ?
                    <CrManagementAddEdit
                        closePage={this.closePage}
                        parentState={this.state}
                        isShowPopup={false} /> : ""
                }>
                <div>
                    <AvForm id="idFormSearchCr" onKeyDown={this.handleKeyDownForm} onValidSubmit={this.search} onInvalidSubmit={this.handleInvalidSubmitAddOrEdit} model={objectSearch} ref={el => this.myFormRef = el}>
                        <div className="animated fadeIn">
                            <Row>
                                <Col xs="12">
                                    <Card>
                                        <CardHeader>
                                            <i className="fa fa-search"></i>{t("common:common.title.advancedSearch")}
                                            <div className="card-header-actions">
                                                <Button type="button" color="link" className="card-header-action btn-minimize" data-target="#collapseFormSearch" onClick={this.toggleFormSearch}><i className={this.state.collapseFormSearch ? "icon-arrow-up" : "icon-arrow-down"}></i></Button>
                                            </div>
                                        </CardHeader>
                                        <Collapse isOpen={this.state.collapseFormSearch} id="collapseFormSearch">
                                            <CardBody>
                                                <Row>
                                                    <Col xs="12" sm="4">
                                                        <CustomSelectLocal
                                                            name={"searchGroup"}
                                                            label={t("crManagement:crManagement.label.searchGroup")}
                                                            isRequired={true}
                                                            messageRequire={t("crManagement:crManagement.message.required.searchGroup")}
                                                            options={searchTypeList}
                                                            closeMenuOnSelect={true}
                                                            handleItemSelectChange={this.handleChangeSearchGroup}
                                                            selectValue={this.state.selectValueSearchGroup}
                                                        />
                                                    </Col>
                                                    <Col xs="12" sm="4">
                                                        <CustomSelectLocal
                                                            name={"scope"}
                                                            label={t("crManagement:crManagement.label.scope")}
                                                            isRequired={fieldsProperty.scope.required}
                                                            messageRequire={t("crManagement:crManagement.message.required.scope")}
                                                            options={scopeList.map(item => {return {itemId: item.valueStr, itemName: item.displayStr, itemCode: item.secondValue}})}
                                                            closeMenuOnSelect={true}
                                                            handleItemSelectChange={(d) => this.setState({ selectValueScope: d, selectValueScopeCurrent: d })}
                                                            selectValue={this.state.selectValueScope}
                                                            isDisabled={fieldsProperty.scope.disable}
                                                        />
                                                    </Col>
                                                    <Col xs="12" sm="4">
                                                        <CustomSelectLocal
                                                            name={"crType"}
                                                            label={t("crManagement:crManagement.label.crType")}
                                                            isRequired={fieldsProperty.crType.required}
                                                            messageRequire={t("crManagement:crManagement.message.required.crType")}
                                                            options={crTypeList}
                                                            closeMenuOnSelect={true}
                                                            handleItemSelectChange={(d) => this.setState({ selectValueCrType: d })}
                                                            selectValue={this.state.selectValueCrType}
                                                        />
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col xs="12" sm="4">
                                                        <CustomSelectLocal
                                                            name={"subcategory"}
                                                            label={t("crManagement:crManagement.label.subcategory")}
                                                            isRequired={false}
                                                            options={subcategoryList.map(item => {return {itemId: item.valueStr, itemName: item.displayStr, itemCode: item.secondValue}})}
                                                            closeMenuOnSelect={true}
                                                            handleItemSelectChange={(d) => this.setState({ selectValueSubcategory: d })}
                                                            selectValue={this.state.selectValueSubcategory}
                                                        />
                                                    </Col>
                                                    <Col xs="12" sm="4">
                                                        <CustomSelectLocal
                                                            name={"domain"}
                                                            label={t("crManagement:crManagement.label.domain")}
                                                            isRequired={false}
                                                            options={impactSegmentList.map(item => {return {itemId: item.valueStr, itemName: item.displayStr, itemCode: item.secondValue}})}
                                                            closeMenuOnSelect={true}
                                                            handleItemSelectChange={(d) => this.setState({ selectValueDomain: d })}
                                                            selectValue={this.state.selectValueDomain}
                                                        />
                                                    </Col>
                                                    <Col xs="12" sm="4">
                                                        <CustomSelectLocal
                                                            name={"nation"}
                                                            label={t("crManagement:crManagement.label.nation")}
                                                            isRequired={false}
                                                            options={nationList.map(item => {return {itemId: item.valueStr, itemName: item.displayStr, itemCode: item.secondValue}})}
                                                            closeMenuOnSelect={true}
                                                            handleItemSelectChange={(d) => this.setState({ selectValueNation: d })}
                                                            selectValue={this.state.selectValueNation}
                                                        />
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col xs="12" sm="4">
                                                        <CustomInputPopup
                                                            name={"impactNode"}
                                                            label={t("crManagement:crManagement.label.impactNode")}
                                                            placeholder={t("crManagement:crManagement.placeholder.doubleClick")}
                                                            value={this.state.impactNode.map(item => item.ip + " - " + item.deviceCode + " - " + item.nationCode).join(",") || ""}
                                                            handleRemove={() => this.setState({ impactNode: [] })}
                                                            handleDoubleClick={this.openNetworkNodePopup}
                                                            isRequired={false}
                                                        />
                                                    </Col>
                                                    <Col xs="12" sm="4" className={fieldsProperty.childDept.visible ? "" : "class-hidden"}>
                                                        <CustomAppSwitch
                                                            name={"approveCr"}
                                                            label={t("crManagement:crManagement.label.approveCr")}
                                                            checked={this.state.approveCr}
                                                            handleChange={(checked) => this.setState({ approveCr: checked })}
                                                            isDisabled={false}
                                                        />
                                                    </Col>
                                                </Row>
                                            </CardBody>
                                            <CardFooter className="text-center">
                                                <LaddaButton type="submit"
                                                    className="btn btn-primary btn-md mr-1"
                                                    loading={this.state.btnSearchLoading}
                                                    data-style={ZOOM_OUT}>
                                                    <i className="fa fa-search"></i> {t("common:common.title.search")}
                                                </LaddaButton>
                                                <Button type="button" size="md" color="secondary" className="mr-1" onClick={this.clearSearchConditions}><i className="fa fa-refresh"></i> {t("common:common.button.clear")}</Button>
                                            </CardFooter>
                                        </Collapse>
                                    </Card>
                                </Col>
                            </Row>
                        </div>
                        {/* </editor-fold> */}

                        {/* <editor-fold desc="Datatable"> */}
                        <div className="animated fadeIn">
                            <Row>
                                <Col>
                                    <Card>
                                        <CardHeader>
                                            {/* <div className="card-header-search-actions">
                                                <SearchBar placeholder={t("common:common.placeholder.quickSearch")}
                                                title={t("crManagement:crManagement.placeholder.searchAll")} />
                                            </div> */}
                                            <div className="card-header-actions card-header-search-actions-button">
                                                <Button type="button" size="md" color="primary" className="custom-btn btn-pill mr-2"
                                                    title={t("crManagement:crManagement.button.add")}
                                                    onClick={() => this.openPage("ADD")}><i className="fa fa-plus"></i></Button>
                                                <LaddaButton type="button"
                                                    className="btn btn-primary btn-md custom-btn btn-pill mr-2"
                                                    title={t("crManagement:crManagement.button.export")}
                                                    loading={this.state.btnExportLoading}
                                                    data-style={ZOOM_OUT}
                                                    onClick={() => this.onExport()}>
                                                    <i className="fa fa-download"></i>
                                                </LaddaButton>
                                                <Button type="button" size="md" color="primary" className="custom-btn btn-pill mr-2"
                                                    title={t("crManagement:crManagement.button.checkDuplicate")}
                                                    onClick={() => this.openImportModal()}><i className="fa fa-clone"></i></Button>
                                                <Button type="button" size="md" color="primary" className={fieldsProperty.btnAssignCab.visible ? "custom-btn btn-pill mr-2" : "class-hidden"}
                                                    title={t("crManagement:crManagement.button.assignCab")} id="assignCab"
                                                    onClick={this.handleAssignCab}><i className="fa fa-send"></i></Button>
                                                <SettingTableLocal
                                                    columns={columns}
                                                    onChange={(columns) => this.setState({ columns })}
                                                />
                                            </div>
                                        </CardHeader>
                                        <CardBody>
                                            <CustomReactTableSearch
                                                onRef={ref => (this.customReactTableSearch = ref)}
                                                columns={columns}
                                                data={data}
                                                pages={pages}
                                                loading={loading}
                                                onFetchData={this.onFetchData}
                                                defaultPageSize={10}
                                                isCheckbox={false}
                                            />
                                        </CardBody>
                                    </Card>
                                </Col>
                            </Row>
                        </div>
                        {/* </editor-fold> */}
                    </AvForm>
                    <CrManagementImport
                        closeImportModal={this.closeImportModal}
                        reloadGridData={this.searchCrManagement}
                        parentState={this.state}
                        moduleName="CR_NUMBER" />
                    <CrManagementNetworkNodePopup
                        parentState={this.state}
                        closePopup={this.closeNetworkNodePopup}
                        setValue={this.setValueNetworkNodePopup} />
                </div>
            </CustomCSSTransition>
        );
    }
}

function mapStateToProps(state, ownProps) {
    const { crManagement, common } = state;
    return {
        response: { crManagement, common }
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(Object.assign({}, CrManagementActions, commonActions), dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(translate()(CrManagementList));
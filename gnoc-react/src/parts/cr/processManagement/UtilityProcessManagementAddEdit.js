import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Col, Card, CardBody, CardHeader, Collapse, Row, Label, ButtonGroup, FormGroup } from 'reactstrap';
import { AvForm } from 'availity-reactstrap-validation';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { translate, Trans } from 'react-i18next';
import LaddaButton, { ZOOM_OUT } from 'react-ladda';
import { toastr } from 'react-redux-toastr';
import * as commonActions from './../../../actions/commonActions';
import * as UtilityProcessManagementActions from './UtilityProcessManagementActions';
import { CustomSelect, CustomReactTableLocal, CustomAutocomplete, CustomSelectLocal, CustomSticky, CustomAvField, CustomAppSwitch, CustomInputMultiLanguage, CustomRcTreeSelect } from "../../../containers/Utils";
import { invalidSubmitForm, validSubmitForm } from '../../../containers/Utils/Utils';
import UtilityProcessManagementAddEditPopupListFile from './UtilityProcessManagementAddEditPopupListFile';
import UtilityProcessManagementAddEditPopupGroupUnit from './UtilityProcessManagementAddEditPopupGroupUnit'
import UtilityProcessManagementAddEditPopupListWo from './UtilityProcessManagementAddEditPopupListWo';
class UtilityProcessManagementAddEdit extends Component {
    constructor(props) {
        super(props);
        this.openPopupListFile = this.openPopupListFile.bind(this);
        this.closePopupListFile = this.closePopupListFile.bind(this);
        this.addListFile = this.addListFile.bind(this);
        this.clearListFile = this.clearListFile.bind(this);
        this.handleDataCheckboxListFile = this.handleDataCheckboxListFile.bind(this);
        this.handleOnChangeOtherDept = this.handleOnChangeOtherDept.bind(this);
        this.openPopupGroupUnit = this.openPopupGroupUnit.bind(this);
        this.closePopupGroupUnit = this.closePopupGroupUnit.bind(this);
        this.addGroupUnit = this.addGroupUnit.bind(this);
        this.clearGroupUnit = this.clearGroupUnit.bind(this);
        this.handleDataCheckboxGroupUnit = this.handleDataCheckboxGroupUnit.bind(this);
        this.handleChangeParent = this.handleChangeParent.bind(this);
        this.openPopupListWo = this.openPopupListWo.bind(this);
        this.closePopupListWo = this.closePopupListWo.bind(this);
        this.addOrEditWo = this.addOrEditWo.bind(this);
        this.clearListWo = this.clearListWo.bind(this);
        this.handleDataCheckboxWo = this.handleDataCheckboxWo.bind(this);
        // this.handleDataCheckboxListWo = this.handleDataCheckboxListWo.bind(this);

        this.toggleFormAddEdit = this.toggleFormAddEdit.bind(this);
        this.handleValidSubmitAddOrEdit = this.handleValidSubmitAddOrEdit.bind(this);
        this.handleInvalidSubmitAddOrEdit = this.handleInvalidSubmitAddOrEdit.bind(this);

        this.handleItemSelectChangeCrType = this.handleItemSelectChangeCrType.bind(this);
        this.handleItemSelectChangeDeviceType = this.handleItemSelectChangeDeviceType.bind(this);
        this.handleItemSelectChangeImpactCharacteristic = this.handleItemSelectChangeImpactCharacteristic.bind(this);
        this.handleItemSelectChangeImpactSegment = this.handleItemSelectChangeImpactSegment.bind(this);
        this.handleItemSelectChangeImpactType = this.handleItemSelectChangeImpactType.bind(this);
        this.handleItemSelectChangeRiskLevel = this.handleItemSelectChangeRiskLevel.bind(this)
        this.handleChangeProcessName = this.handleChangeProcessName.bind(this)
        this.state = {
            btnAddOrEditLoading: false,
            collapseFormAddEdit: true,
            //AddOrEditModal
            isAddOrEdit: props.parentState.isAddOrEdit,
            selectedData: props.parentState.selectedData,
            dataParent: props.parentState.data,
            //Table
            data: [],
            approvalLevel: 0,

            //File list table
            listFile: [],
            listFileTable: {
                loading: true,
                columns: this.buildTableListFileColumns()
            },
            isOpenPopupListFile: false,
            dataCheckedListFile: [],
            //group unit table 
            groupUnit: [],
            groupUnitTable: {
                loading: true,
                columns: this.buildTableGroupUnitColumns()
            },
            isOpenPopupGroupUnit: false,
            dataCheckedGroupUnit: [],
            //List wo table 
            listWo: [],
            listWoTable: {
                loading: true,
                columns: this.buildTableListWoColumns()
            },
            isOpenPopupListWo: false,
            isAddOrEditWo: null,
            dataCheckedListWo: [],
            //select value
            selectValueCrType: {},
            selectValueDeviceType: {},
            selectValueImpactCharacteristic: {},
            selectValueImpactSegment: {},
            selectValueImpactType: {},
            selectValueRiskLevel: {},
            isVMSAActiveCellProcess: false,
            requireMop: false,
            requireFileLog: false,
            requireApprove: false,
            closeCrWhenResolveSuccess: false,
            isLaneImpact: false,
            selectOtherDept: {},
            //Select list
            crTypeListSelect: [],
            riskLevelListSelect: [],
            impactCharacteristicListSelect: [
                { itemId: 1, itemName: props.t("utilityProcessManagement:utilityProcessManagement.dropdown.impactCharacteristic.logic") },
                { itemId: 2, itemName: props.t("utilityProcessManagement:utilityProcessManagement.dropdown.impactCharacteristic.physic") }
            ],
            listWoType: [],
            listCrProcessName: [],
            level: 1,
            valueInput: "",
            crProcessIndex: null,
            selectValueParentId: (props.parentState.parentId.value) ? { value: props.parentState.parentId.value, label: props.parentState.parentId.label } : null
        };
    }
    componentDidMount() {
        // tạo mã quy trình theo parent khi thêm mới
        // Khi thêm mới thì nếu parent =2, hoặc lớn hơn thì load 1 số trường tự động
        if (this.props.parentState.parentId.value && this.state.isAddOrEdit === 'ADD') {
            this.props.actions.getCrProcessById(this.props.parentState.parentId.value).then((response) => {
                if (response.payload && response.payload.data) {
                    const data = response.payload.data;
                    this.props.actions.generateCrProcessCode({ parentId: data.crProcessId, parentCode: data.crProcessCode }).then((response) => {
                        this.setState({
                            valueInput: response.payload.data.crProcessCode,
                            crProcessIndex: response.payload.data.crProcessIndex
                        })
                    })
                    if (data.crProcessLevel !== 1) {
                        this.setState({
                            level: data.crProcessLevel,
                            selectOtherDept: data.otherDept ? { value: data.otherDept } : {},
                            approvalLevel: data.approvalLevel,
                            selectValueCrType: { value: data.crTypeId },
                            selectValueDeviceType: { value: data.deviceTypeId },
                            selectValueImpactCharacteristic: { value: data.impactCharacteristic },
                            selectValueImpactSegment: { value: data.impactSegmentId },
                            selectValueImpactType: { value: data.impactType },
                            selectValueRiskLevel: { value: data.riskLevel },
                        })
                    }

                }
            })
        }
        // get list combobox
        this.props.actions.getListWoType();
        this.props.actions.getItemMaster("CR_TYPE", "itemId", "itemName", "1", "3").then((response) => {
            let crTypeListSelect = (response.payload && response.payload.data && response.payload.data.data) ? response.payload.data.data.map(e => { return { itemId: e.itemValue, itemName: e.itemName } }) : []
            this.setState({
                crTypeListSelect
            })
        }).catch((response) => {
            toastr.error(this.props.t("utilityProcessManagement:utilityProcessManagement.message.error.searchCrType"));
        });

        this.props.actions.getItemMaster("RISK_PRIORITY", "itemId", "itemName", "1", "3").then((response) => {
            let riskLevelListSelect = (response.payload && response.payload.data && response.payload.data.data) ? response.payload.data.data.map(e => { return { itemId: e.itemValue, itemName: e.itemName } }) : []
            this.setState({
                riskLevelListSelect
            })
        }).catch((response) => {
            toastr.error(this.props.t("utilityProcessManagement:utilityProcessManagement.message.error.searchRiskLevel"));
        });

        // Load data khi chỉnh sửa 
        if (this.state.isAddOrEdit === 'EDIT' || this.state.isAddOrEdit === 'COPY') {
            this.setState({
                selectOtherDept: this.state.selectedData.otherDept ? { value: this.state.selectedData.otherDept } : {},
                approvalLevel: this.state.selectedData.approvalLevel,
                selectValueCrType: { value: this.state.selectedData.crTypeId },
                selectValueDeviceType: { value: this.state.selectedData.deviceTypeId },
                selectValueImpactCharacteristic: { value: this.state.selectedData.impactCharacteristic },
                selectValueImpactSegment: { value: this.state.selectedData.impactSegmentId },
                selectValueImpactType: { value: this.state.selectedData.impactType },
                selectValueRiskLevel: { value: this.state.selectedData.riskLevel },
                isVMSAActiveCellProcess: this.state.selectedData.isVMSAActiveCellProcess,
                requireMop: this.state.selectedData.requireMop,
                requireFileLog: this.state.selectedData.requireFileLog,
                requireApprove: this.state.selectedData.requireApprove,
                closeCrWhenResolveSuccess: this.state.selectedData.closeCrWhenResolveSuccess,
                isLaneImpact: this.state.selectedData.isLaneImpact,
                listCrProcessName: this.state.selectedData.listCrProcessName,
                selectValueParentId: this.state.selectedData.parentId ? { value: this.state.selectedData.parentId } : {},
                crProcessIndex: this.state.selectedData.crProcessIndex
            })
            // Xét quy trình có nhánh không để hiển thị List file, group unit, wo khi chỉnh sửa
            if (this.state.selectedData.parentId) {
                this.props.actions.getCrProcessDetail(this.state.selectedData.parentId).then((response) => {
                    const data = response.payload.data
                    if (data.crProcessLevel !== 1) {
                        this.setState({
                            level: data.crProcessLevel
                        })
                    }
                    if (this.state.selectedData.isLeaf) {
                        let dataCheck = (data.crProcessLevel > 1) ? data : this.state.selectedData
                        this.props.actions.getCrProcessDetail(this.state.selectedData.crProcessId).then((response) => {
                            const self = response.payload.data;
                            if (self.listCrProcessTemplate.length > 0) {
                                this.setState({
                                    listFile: self.listCrProcessTemplate
                                })
                            } else if (dataCheck.listCrProcessTemplate.length > 0) {
                                this.setState({
                                    listFile: dataCheck.listCrProcessTemplate
                                })
                            }

                            if (self.listCrProcessDeptGroup.length > 0) {
                                this.setState({
                                    groupUnit: self.listCrProcessDeptGroup
                                })
                            } else if (dataCheck.listCrProcessDeptGroup.length > 0) {
                                this.setState({
                                    groupUnit: dataCheck.listCrProcessDeptGroup
                                })
                            }
                            if (self.listCrProcessWo.length > 0) {
                                let tempList = self.listCrProcessWo ? self.listCrProcessWo.map((item, index) => ({ ...item, id: 'EDIT-' + index })) : []
                                this.setState({
                                    listWo: tempList
                                })
                            } else if (dataCheck.listCrProcessWo.length > 0) {
                                let tempList = dataCheck.listCrProcessWo ? dataCheck.listCrProcessWo.map((item, index) => ({ ...item, id: 'EDIT-' + index })) : []
                                this.setState({
                                    listWo: tempList
                                })
                            }
                        })
                    }
                })
            } else if (this.state.selectedData.isLeaf) {
                const self = this.state.selectedData;
                if (self.listCrProcessTemplate.length > 0) {
                    this.setState({
                        listFile: self.listCrProcessTemplate
                    })
                }
                if (self.listCrProcessDeptGroup.length > 0) {
                    this.setState({
                        groupUnit: self.listCrProcessDeptGroup
                    })
                }
                let tempList = self.listCrProcessWo ? self.listCrProcessWo.map((item, index) => ({ ...item, id: 'EDIT-' + index })) : []
                this.setState({
                    listWo: tempList
                })
            }
        }
    }

    componentWillUnmount() {
        this.setState({
            isAddOrEdit: null,
            selectValueParentId: {},
        });
    }

    //List file
    closePopupListFile() {
        this.setState({
            isOpenPopupListFile: false,
        });
    }

    openPopupListFile() {
        this.setState({
            isOpenPopupListFile: true,
        });
    }


    addListFile(dataChecked) {
        const checkedTemp = [...dataChecked];
        checkedTemp.forEach(element => {
            if (this.state.listFile.some(el => el.cpteId === element.cpteId)) {
                dataChecked.splice(dataChecked.indexOf(element), 1);
            }
        });
        this.setState({
            listFile: [...this.state.listFile, ...dataChecked]
        });
    }

    clearListFile(dataChecked) {
        if (dataChecked.length < 1) {
            toastr.warning(this.props.t("common:common.message.error.removeSelect"));
        }
        let listTemp = [...this.state.listFile];
        dataChecked.forEach(element => {
            listTemp = listTemp.filter(el => el.cpteId !== element.cpteId);
        });
        this.setState({
            listFile: listTemp,
            dataCheckedListFile: []
        });
    }


    handleDataCheckboxListFile(data) {
        this.setState({
            dataCheckedListFile: data
        });
    }
    //end list file

    //Group Unit
    closePopupGroupUnit() {
        this.setState({
            isOpenPopupGroupUnit: false,
        });
    }

    openPopupGroupUnit() {
        this.setState({
            isOpenPopupGroupUnit: true,
        });
    }

    addGroupUnit(dataChecked) {
        const checkedTemp = [...dataChecked];
        checkedTemp.forEach(element => {
            if (this.state.groupUnit.some(el => el.groupUnitId === element.groupUnitId)) {
                dataChecked.splice(dataChecked.indexOf(element), 1);
            }
        });
        this.setState({
            groupUnit: [...this.state.groupUnit, ...dataChecked]
        });

    }

    clearGroupUnit(dataChecked) {
        if (dataChecked.length < 1) {
            toastr.warning(this.props.t("common:common.message.error.removeSelect"));
        }
        let listTemp = [...this.state.groupUnit];
        dataChecked.forEach(element => {
            listTemp = listTemp.filter(el => el.groupUnitId !== element.groupUnitId);
        });
        this.setState({
            groupUnit: listTemp,
            dataCheckedGroupUnit: []
        });
    }

    handleDataCheckboxGroupUnit(data) {
        this.setState({
            dataCheckedGroupUnit: data
        });
    }
    // End list unit

    //List wo
    handleDataCheckboxWo(data) {
        this.setState({
            dataCheckedListWo: data
        });
    }
    closePopupListWo() {
        this.setState({
            isOpenPopupListWo: false,
        });
    }

    openPopupListWo(value, original) {
        this.setState({
            listWoType: (this.props.response.utilityProcessManagement.listWoType && this.props.response.utilityProcessManagement.listWoType.payload) ? this.props.response.utilityProcessManagement.listWoType.payload.data.map(i => { return ({ itemId: i.woTypeId, itemName: i.woTypeName }) }) : []
        })
        if (value === "ADD") {
            this.setState({
                isAddOrEditWo: value,
                isOpenPopupListWo: true
            });
        } else if (value === "EDIT") {
            const objWo = this.state.listWo.find((ch) => ch.id === original.id);
            this.setState({
                isAddOrEditWo: value,
                isOpenPopupListWo: true,
                selectedWoData: objWo
            });
        }
    }

    addOrEditWo(data, isAddOrEditWo) {
        if (isAddOrEditWo === "ADD") {
            this.setState({
                listWo: [...this.state.listWo, data]
            });
        } else {
            const objWo = this.state.listWo;
            const index = objWo.findIndex(({ id }) => id === data.id);
            if (index === -1) {
                objWo.push(data);
            } else {
                objWo[index] = data;
            }
        }
    }

    clearListWo(dataChecked) {
        if (dataChecked.length < 1) {
            toastr.warning(this.props.t("common:common.message.error.removeSelect"));
        }
        let listTemp = [...this.state.listWo];
        dataChecked.forEach(element => {
            listTemp = listTemp.filter(el => el.id !== element.id);
        });
        this.setState({
            listWo: listTemp,
            dataCheckedListWo: []
        });
    }

    //end Wo

    handleItemSelectChangeCrType(option) {
        this.setState({
            selectValueCrType: option
        });
    }

    handleItemSelectChangeDeviceType(option) {
        this.setState({
            selectValueDeviceType: option
        });
    }
    handleItemSelectChangeImpactCharacteristic(option) {
        this.setState({
            selectValueImpactCharacteristic: option
        });
    }
    handleItemSelectChangeImpactSegment(option) {
        this.setState({
            selectValueImpactSegment: option
        });
    }

    handleItemSelectChangeImpactType(option) {
        this.setState({
            selectValueImpactType: option
        });
    }

    handleItemSelectChangeRiskLevel(option) {
        this.setState({
            selectValueRiskLevel: option
        });
    }
    buildTableListFileColumns() {
        return [
            {
                Header: <Trans i18nKey="utilityProcessManagement:utilityProcessManagement.label.fileCode" />,
                id: "code",
                accessor: d => d.code ? <span title={d.code}>{d.code}</span> : <span>&nbsp;</span>
            },
            {
                Header: <Trans i18nKey="utilityProcessManagement:utilityProcessManagement.label.fileName" />,
                id: "name",
                accessor: d => d.name ? <span title={d.name}>{d.name}</span> : <span>&nbsp;</span>
            }
        ];
    }

    buildTableGroupUnitColumns() {
        return [
            {
                Header: <Trans i18nKey="utilityProcessManagement:utilityProcessManagement.label.groupCode" />,
                id: "groupUnitCode",
                accessor: d => d.groupUnitCode ? <span title={d.groupUnitCode}>{d.groupUnitCode}</span> : <span>&nbsp;</span>
            },
            {
                Header: <Trans i18nKey="utilityProcessManagement:utilityProcessManagement.label.groupName" />,
                id: "groupUnitName",
                accessor: d => d.groupUnitName ? <span title={d.groupUnitName}>{d.groupUnitName}</span> : <span>&nbsp;</span>
            }
        ];
    }
    buildTableListWoColumns() {
        return [
            {
                Header: <Trans i18nKey="utilityProcessManagement:utilityProcessManagement.label.action" />,
                sortable: false,
                fixed: "left",
                width: 100,
                accessor: "action",
                Cell: ({ original }) => {
                    let html = <div></div>;
                    html = <div className="text-center">
                        <span title={this.props.t("common:common.button.edit")} onClick={() => this.openPopupListWo("EDIT", original)}>
                            <Button type="button" size="sm" className="btn-info icon mr-1"><i className="fa fa-edit"></i></Button>
                        </span>
                    </div>;
                    return html;
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{ height: '2.7em' }}></div>
                )
            },
            {
                Header: <Trans i18nKey="utilityProcessManagement:utilityProcessManagement.label.woName" />,
                id: "woName",
                width: 250,
                accessor: d => d.woName ? <span title={d.woName}>{d.woName}</span> : <span>&nbsp;</span>
            },
            {
                Header: <Trans i18nKey="utilityProcessManagement:utilityProcessManagement.label.woType" />,
                id: "woTypeName",
                accessor: d => d.woTypeName ? <span title={d.woTypeName}>{d.woTypeName}</span> : <span>&nbsp;</span>
            },
            {
                Header: <Trans i18nKey="utilityProcessManagement:utilityProcessManagement.label.processTime" />,
                id: "durationWo",
                width: 120,
                accessor: d => d.durationWo ? <span title={d.durationWo}>{d.durationWo}</span> : <span>&nbsp;</span>
            },
            {
                Header: <Trans i18nKey="utilityProcessManagement:utilityProcessManagement.label.isForceCreateWo" />,
                className: "text-center",
                sortable: false,
                width: 120,
                accessor: "isRequire",
                Cell: ({ original }) => {
                    const objWo = this.state.listWo.find((ch) => ch.id === original.id);
                    return (
                        <input type="checkbox" checked={objWo.isRequire} disabled />
                    );
                },
            },
            {
                Header: <Trans i18nKey="utilityProcessManagement:utilityProcessManagement.label.isCloseWoWhenCompletedCR" />,
                className: "text-center",
                sortable: false,
                width: 120,
                accessor: "isRequireCloseWo",
                Cell: ({ original }) => {
                    const objWo = this.state.listWo.find((ch) => ch.id === original.id);
                    return (
                        <input type="checkbox" checked={objWo.isRequireCloseWo} disabled />
                    );
                },
            },
            {
                Header: <Trans i18nKey="utilityProcessManagement:utilityProcessManagement.label.isCreateWoWhenClosedCR" />,
                className: "text-center",
                sortable: false,
                accessor: "createWoWhenCloseCR",
                width: 120,
                Cell: ({ original }) => {
                    const objWo = this.state.listWo.find((ch) => ch.id === original.id);
                    return (
                        <input type="checkbox" checked={objWo.createWoWhenCloseCR} disabled />
                    );
                },
            }
        ];
    }
    onChangeRowProcessTime(newValue, object) {
        //Set into data
        const data = [...this.state.data];
        for (const obj of data) {
            if (obj.itemId === object.itemId) {
                obj.processTime = newValue;
                break;
            }
        }
        this.setState({
            data
        });
    }

    handleValidSubmitAddOrEdit(event, values) {
        validSubmitForm(event, values, "idFormAddOrEdit");
        this.setState({
            btnAddOrEditLoading: true
        }, () => {
            const utilityProcessManagement = Object.assign({}, values);
            utilityProcessManagement.crProcessName = values['crProcessName-multi-language'] ? values['crProcessName-multi-language'].trim() : "";
            utilityProcessManagement.crTypeId = this.state.selectValueCrType.value;
            utilityProcessManagement.impactType = this.state.selectValueImpactType.value;
            utilityProcessManagement.riskLevel = this.state.selectValueRiskLevel.value;
            utilityProcessManagement.impactSegmentId = this.state.selectValueImpactSegment.value;
            utilityProcessManagement.deviceTypeId = this.state.selectValueDeviceType.value;
            utilityProcessManagement.impactCharacteristic = this.state.selectValueImpactCharacteristic.value;
            utilityProcessManagement.isVMSAActiveCellProcess = (this.state.isVMSAActiveCellProcess) ? 1 : 0;
            utilityProcessManagement.approvalLevel = this.state.approvalLevel;
            utilityProcessManagement.requireMop = (this.state.requireMop) ? 1 : 0;
            utilityProcessManagement.requireApprove = (this.state.requireApprove) ? 1 : 0;
            utilityProcessManagement.requireFileLog = (this.state.requireFileLog) ? 1 : 0;
            utilityProcessManagement.closeCrWhenResolveSuccess = (this.state.closeCrWhenResolveSuccess) ? 1 : 0;
            utilityProcessManagement.isLaneImpact = (this.state.isLaneImpact) ? 1 : 0;
            utilityProcessManagement.otherDept = this.state.selectOtherDept.value;
            utilityProcessManagement.listCrProcessName = this.state.listCrProcessName.map(item => ({ ...item, leeValue: item.leeValue ? item.leeValue.trim() : "" }))
            utilityProcessManagement.parentId = (this.state.selectValueParentId && this.state.selectValueParentId.value) ? this.state.selectValueParentId.value : null;
            utilityProcessManagement.parentCode = (this.state.selectValueParentId && this.state.selectValueParentId.value) ? this.state.selectValueParentId.title : "";
            utilityProcessManagement.crProcessIndex = this.state.crProcessIndex;
            if (this.state.isAddOrEdit === "ADD") {
                utilityProcessManagement.isActive = 1;
                this.props.actions.addUtilityProcessManagement(utilityProcessManagement).then((response) => {
                    if (response.payload.data.key === "SUCCESS") {
                        this.setState({
                            btnAddOrEditLoading: false
                        }, () => {
                            this.props.closeAddOrEditPage(this.state.isAddOrEdit);
                            toastr.success(this.props.t("utilityProcessManagement:utilityProcessManagement.message.success.add"));
                        });
                    } else {
                        this.setState({
                            btnAddOrEditLoading: false
                        }, () => {
                            toastr.error(response.payload.data.message);
                        });
                    }
                })
            } else if (this.state.isAddOrEdit === "EDIT") {
                utilityProcessManagement.crProcessId = this.state.selectedData.crProcessId;
                //get list file to save
                let listCrProcess = [];
                for (const obj of this.state.listFile) {
                    let fileListDetail = {
                        cpteId: obj.cpteId,
                        crProcessId: this.state.selectedData.crProcessId,
                        tempImportId: obj.tempImportId
                    };
                    listCrProcess.push(fileListDetail);
                }
                utilityProcessManagement.listCrProcessTemplate = listCrProcess;

                //get group unit to save
                let listCrProcessDeptGroup = [];
                for (const obj of this.state.groupUnit) {
                    let groupUnitDetail = {
                        groupUnitId: obj.groupUnitId,
                        groupUnitCode: obj.groupUnitCode,
                        groupUnitName: obj.groupUnitName,
                        crProcessId: this.state.selectedData.crProcessId
                    };
                    listCrProcessDeptGroup.push(groupUnitDetail);
                }
                utilityProcessManagement.listCrProcessDeptGroup = listCrProcessDeptGroup;
                //get list Wo to save
                let listCrProcessWo = [];
                for (const obj of this.state.listWo) {
                    let CrProcessWoDetail = {
                        isRequire: (obj.isRequire) ? 1 : 0,
                        isRequireCloseWo: (obj.isRequireCloseWo) ? 1 : 0,
                        createWoWhenCloseCR: (obj.createWoWhenCloseCR) ? 1 : 0,
                        woName: obj.woName,
                        durationWo: obj.durationWo,
                        woTypeId: obj.woTypeId,
                        crProcessId: this.state.selectedData.crProcessId,
                        description: obj.description,
                        woTypeName: obj.woTypeName,
                        crProcessWoId: obj.crProcessWoId
                    };
                    listCrProcessWo.push(CrProcessWoDetail);
                }
                utilityProcessManagement.listCrProcessWo = listCrProcessWo;
                this.props.actions.editUtilityProcessManagement(utilityProcessManagement).then((response) => {
                    if (response.payload.data.key === "SUCCESS") {
                        this.setState({
                            btnAddOrEditLoading: false
                        }, () => {
                            this.props.closeAddOrEditPage(this.state.isAddOrEdit);
                            toastr.success(this.props.t("utilityProcessManagement:utilityProcessManagement.message.success.edit"));
                        });
                    } else {
                        this.setState({
                            btnAddOrEditLoading: false
                        }, () => {
                            toastr.error(this.props.t("utilityProcessManagement:utilityProcessManagement.message.error.edit"));
                        });
                    }
                }).catch((response) => {
                    this.setState({
                        btnAddOrEditLoading: false
                    }, () => {
                        try {
                            toastr.error(response.error.response.data.errors[0].defaultMessage);
                        } catch (error) {

                            toastr.error(this.props.t("utilityProcessManagement:utilityProcessManagement.message.error.edit"));
                        }
                    });
                });
            }
        });
    }

    handleInvalidSubmitAddOrEdit(event, errors, values) {
        toastr.warning(this.props.t("common:common.message.required.allFields"));
        invalidSubmitForm(event, errors, values, "idFormAddOrEdit");
    }

    toggleFormAddEdit() {
        this.setState({ collapseFormAddEdit: !this.state.collapseFormAddEdit });
    }
    handleChangeProcessName(data) {
        this.setState({
            listCrProcessName: data
        });
    }
    handleOnChangeOtherDept(value) {
        this.setState({ selectOtherDept: value });
    }


    handleChangeParent(option) {
        this.setState({ selectValueParentId: option })
        // Xét thêm parent là level bao nhiêu nếu = 2 hoặc lớn hơn thì load data của parent
        if (option) {
            this.props.actions.getCrProcessById(option.value).then((response) => {
                if (response.payload && response.payload.data) {
                    const data = response.payload.data;
                    // generate processCode automatically
                    this.props.actions.generateCrProcessCode({ parentId: data.crProcessId, parentCode: data.crProcessCode }).then((response) => {
                        this.setState({
                            valueInput: response.payload.data.crProcessCode,
                            crProcessIndex: response.payload.data.crProcessIndex
                        })
                    })
                    if (response.payload.data.crProcessLevel !== 1) {
                        this.setState({
                            level: data.crProcessLevel,
                            selectOtherDept: data.otherDept ? { value: data.otherDept } : {},
                            approvalLevel: data.approvalLevel,
                            selectValueCrType: { value: data.crTypeId },
                            selectValueDeviceType: { value: data.deviceTypeId },
                            selectValueImpactCharacteristic: { value: data.impactCharacteristic },
                            selectValueImpactSegment: { value: data.impactSegmentId },
                            selectValueImpactType: { value: data.impactType },
                            selectValueRiskLevel: { value: data.riskLevel },
                        })
                    } else {
                        this.setState({
                            level: 1,
                            selectOtherDept: {},
                            approvalLevel: 0,
                            selectValueCrType: {},
                            selectValueDeviceType: {},
                            selectValueImpactCharacteristic: {},
                            selectValueImpactSegment: {},
                            selectValueImpactType: {},
                            selectValueRiskLevel: {},
                        })
                    }
                }
            })
        } else if ((this.state.selectedData ? (this.state.selectedData.crProcessLevel !== 1 && this.state.selectedData.crProcessLevel !== 2) : false) || this.state.isAddOrEdit === "ADD") {
            this.setState({
                level: 1,
                selectOtherDept: {},
                approvalLevel: 0,
                selectValueCrType: {},
                selectValueDeviceType: {},
                selectValueImpactCharacteristic: {},
                selectValueImpactSegment: {},
                selectValueImpactType: {},
                selectValueRiskLevel: {},
            })
        }

    }
    render() {
        const { t } = this.props;
        let objectAddOrEdit = (this.state.isAddOrEdit === "EDIT" || this.state.isAddOrEdit === "COPY") ? this.state.selectedData : {};
        let dataLanguageExchange = (this.state.isAddOrEdit === "EDIT" || this.state.isAddOrEdit === "COPY") ? this.state.selectedData.listCrProcessName : [];
        const { listFileTable, groupUnitTable, listWoTable } = this.state;
        let disabled = (this.state.level + "" !== "1" && (this.state.isAddOrEdit === 'ADD' || this.state.isAddOrEdit === 'EDIT')) ? true : false;
        return (
            <div className="animated fadeIn">
                <AvForm id="idFormAddOrEdit" onValidSubmit={this.handleValidSubmitAddOrEdit} onInvalidSubmit={this.handleInvalidSubmitAddOrEdit} model={objectAddOrEdit}>
                    <Row>
                        <Col xs="12">
                            <Card>
                                <CustomSticky>
                                    <CardHeader>
                                        <i className={(this.state.isAddOrEdit === "ADD" || this.state.isAddOrEdit === "COPY") ? "fa fa-plus-circle" : "fa fa-edit"}></i>{(this.state.isAddOrEdit === "ADD" || this.state.isAddOrEdit === "COPY") ? t("utilityProcessManagement:utilityProcessManagement.title.utilityProcessManagementAdd") : this.state.isAddOrEdit === "EDIT" ? t("utilityProcessManagement:utilityProcessManagement.title.utilityProcessManagementEdit") : ''}
                                        <div className="card-header-actions card-header-actions-button">
                                            <LaddaButton type="submit"
                                                className="btn btn-primary btn-md mr-1"
                                                loading={this.state.btnAddOrEditLoading}
                                                data-style={ZOOM_OUT}>
                                                <i className="fa fa-save"></i> {(this.state.isAddOrEdit === "ADD" || this.state.isAddOrEdit === "COPY") ? t("common:common.button.save") : this.state.isAddOrEdit === "EDIT" ? t("common:common.button.update") : ''}
                                            </LaddaButton>{' '}
                                            <Button type="button" color="secondary" onClick={this.props.closeAddOrEditPage}><i className="fa fa-reply"></i> {t("common:common.button.back")}</Button>
                                        </div>
                                    </CardHeader>
                                </CustomSticky>
                                <Collapse isOpen={this.state.collapseFormAddEdit} id="collapseFormAddEdit">
                                    <CardBody>

                                        <Row >
                                            <Col xs="12" sm="4">
                                                <CustomAvField
                                                    value={this.state.valueInput}
                                                    name="crProcessCode"
                                                    label={t("utilityProcessManagement:utilityProcessManagement.label.crProcessCode")}
                                                    placeholder={t("utilityProcessManagement:utilityProcessManagement.placeholder.crProcessCode")} required
                                                    autoFocus maxLength="200" validate={{ required: { value: true, errorMessage: t("utilityProcessManagement:utilityProcessManagement.message.requiredProcessCode") } }

                                                    } />
                                            </Col>
                                            <Col xs="12" sm="8">
                                                <CustomInputMultiLanguage
                                                    formId="idFormAddOrEdit"
                                                    name="crProcessName"
                                                    label={t("utilityProcessManagement:utilityProcessManagement.label.crProcessName")}
                                                    placeholder={t("utilityProcessManagement:utilityProcessManagement.placeholder.crProcessName")}
                                                    isRequired={true}
                                                    messageRequire={t("utilityProcessManagement:utilityProcessManagement.message.requiredProcessName")}
                                                    maxLength={1000}
                                                    autoFocus={false}
                                                    dataLanguageExchange={dataLanguageExchange}
                                                    handleChange={this.handleChangeProcessName}
                                                />
                                            </Col>
                                        </Row>
                                        <Row >
                                            <Col xs="12" md="4">
                                                <CustomRcTreeSelect
                                                    name={"parentId"}
                                                    label={t("utilityProcessManagement:utilityProcessManagement.label.parentTree")}
                                                    isRequired={false}
                                                    moduleName={"CR_PROCESS"}
                                                    handleChange={this.handleChangeParent}
                                                    selectValue={this.state.selectValueParentId}
                                                />
                                            </Col>
                                            <Col xs="12" sm="4">
                                                {/* impact frame */}
                                                <CustomSelect
                                                    isDisabled={disabled}
                                                    name={"impactType"}
                                                    label={t("utilityProcessManagement:utilityProcessManagement.label.impactType")}
                                                    isRequired={true}
                                                    messageRequire={t("utilityProcessManagement:utilityProcessManagement.message.requiredImpactType")}
                                                    moduleName={"GNOC_CR_IMPACT_FRAME"}
                                                    closeMenuOnSelect={true}
                                                    handleItemSelectChange={this.handleItemSelectChangeImpactType}
                                                    selectValue={this.state.selectValueImpactType}
                                                />
                                            </Col>
                                            <Col xs="12" sm="4">
                                                <CustomSelectLocal
                                                    isDisabled={disabled}
                                                    name={"crTypeId"}
                                                    label={t("utilityProcessManagement:utilityProcessManagement.label.crType")}
                                                    isRequired={true}
                                                    messageRequire={t("utilityProcessManagement:utilityProcessManagement.message.requiredCrType")}
                                                    options={this.state.crTypeListSelect}
                                                    closeMenuOnSelect={true}
                                                    handleItemSelectChange={this.handleItemSelectChangeCrType}
                                                    selectValue={this.state.selectValueCrType}
                                                />
                                            </Col>

                                        </Row>
                                        <Row>
                                            <Col xs="12" sm="4">
                                                <CustomSelectLocal
                                                    isDisabled={disabled}
                                                    name={"riskLevel"}
                                                    label={t("utilityProcessManagement:utilityProcessManagement.label.riskLevel")}
                                                    isRequired={true}
                                                    messageRequire={t("utilityProcessManagement:utilityProcessManagement.message.requiredRiskLevel")}
                                                    options={this.state.riskLevelListSelect}
                                                    closeMenuOnSelect={true}
                                                    handleItemSelectChange={this.handleItemSelectChangeRiskLevel}
                                                    selectValue={this.state.selectValueRiskLevel}
                                                />
                                            </Col>
                                            <Col xs="12" sm="4">
                                                <CustomSelect
                                                    isDisabled={disabled}
                                                    name={"impactSegmentId"}
                                                    label={t("utilityProcessManagement:utilityProcessManagement.label.impactSegment")}
                                                    isRequired={true}
                                                    messageRequire={t("utilityProcessManagement:utilityProcessManagement.message.requiredImpactSegment")}
                                                    moduleName={"GNOC_CR_IMPACT_SEGMENT"}
                                                    closeMenuOnSelect={true}
                                                    handleItemSelectChange={this.handleItemSelectChangeImpactSegment}
                                                    selectValue={this.state.selectValueImpactSegment}
                                                />
                                            </Col>
                                            <Col xs="12" sm="4">
                                                <CustomSelect
                                                    isDisabled={disabled}
                                                    name={"deviceTypeId"}
                                                    label={t("utilityProcessManagement:utilityProcessManagement.label.deviceType")}
                                                    isRequired={true}
                                                    moduleName={"GNOC_CR_DEVICE_TYPES"}
                                                    messageRequire={t("utilityProcessManagement:utilityProcessManagement.message.requiredDeviceType")}
                                                    closeMenuOnSelect={true}
                                                    handleItemSelectChange={this.handleItemSelectChangeDeviceType}
                                                    selectValue={this.state.selectValueDeviceType}
                                                />
                                            </Col>

                                        </Row>
                                        <Row>
                                            <Col xs="12" sm="4">
                                                <CustomSelectLocal
                                                    isDisabled={disabled}
                                                    name={"impactCharacteristic"}
                                                    label={t("utilityProcessManagement:utilityProcessManagement.label.impactCharacteristic")}
                                                    isRequired={false}
                                                    messageRequire={t("utilityProcessManagement:utilityProcessManagement.message.requiredImpactCharacteristic")}
                                                    options={this.state.impactCharacteristicListSelect}
                                                    closeMenuOnSelect={true}
                                                    handleItemSelectChange={this.handleItemSelectChangeImpactCharacteristic}
                                                    selectValue={this.state.selectValueImpactCharacteristic}
                                                />
                                            </Col>

                                            <Col xs="12" sm="4">
                                                <CustomAutocomplete
                                                    isDisabled={disabled}
                                                    name={"otherDept"}
                                                    label={t("utilityProcessManagement:utilityProcessManagement.label.otherDept")}
                                                    placeholder={this.props.t("utilityProcessManagement:utilityProcessManagement.placeholder.otherDept")}
                                                    isRequired={false}
                                                    closeMenuOnSelect={false}
                                                    handleItemSelectChange={this.handleOnChangeOtherDept}
                                                    selectValue={this.state.selectOtherDept}
                                                    moduleName={"UNIT"}
                                                    isHasChildren={true}
                                                />
                                            </Col>
                                            <Col xs="12" sm="4">
                                                <FormGroup>
                                                    <div>
                                                        <Label style={{ fontWeight: '500' }}>{t("utilityProcessManagement:utilityProcessManagement.label.approvalLevel")}</Label>
                                                    </div>
                                                    <ButtonGroup>
                                                        <Button color="outline-info" onClick={() => this.setState({ approvalLevel: 0 })} active={this.state.approvalLevel === 0}>
                                                            {t("utilityProcessManagement:utilityProcessManagement.label.approvalLevelDefault")}
                                                        </Button>
                                                        <Button color="outline-info" onClick={() => this.setState({ approvalLevel: 1 })} active={this.state.approvalLevel === 1}>
                                                            {t("utilityProcessManagement:utilityProcessManagement.label.approvalFirstLevel")}
                                                        </Button>
                                                        <Button color="outline-info" onClick={() => this.setState({ approvalLevel: 2 })} active={this.state.approvalLevel === 2}>
                                                            {t("utilityProcessManagement:utilityProcessManagement.label.approvalSecondLevel")}
                                                        </Button>
                                                    </ButtonGroup>
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col xs="12" sm="1">
                                                <CustomAppSwitch
                                                    name="isVMSAActiveCellProcess"
                                                    label={t("utilityProcessManagement:utilityProcessManagement.label.VMSAKey")}
                                                    checked={this.state.isVMSAActiveCellProcess}
                                                    handleChange={(checked) => this.setState({ isVMSAActiveCellProcess: checked })}
                                                />
                                            </Col>

                                            <Col xs="12" sm="3">
                                                {
                                                    this.state.isVMSAActiveCellProcess ?
                                                        <CustomAvField
                                                            required
                                                            validate={{ required: { value: true, errorMessage: t("utilityProcessManagement:utilityProcessManagement.message.requiredVMSA") } }}
                                                            name="vmsaActiveCellProcessKey"
                                                            label={t("utilityProcessManagement:utilityProcessManagement.label.VMSAKey")}
                                                            placeholder={t("utilityProcessManagement:utilityProcessManagement.placeholder.VMSAKey")}
                                                            maxLength="200" /> :
                                                        <CustomAvField
                                                            readOnly={true}
                                                            name="vmsaActiveCellProcessKey"
                                                            label={t("utilityProcessManagement:utilityProcessManagement.label.VMSAKey")}
                                                            placeholder={t("utilityProcessManagement:utilityProcessManagement.placeholder.VMSAKey")}
                                                            maxLength="200" />
                                                }

                                            </Col>
                                            <Col xs="12" sm="4">
                                                <CustomAppSwitch
                                                    name="requireFileLog"
                                                    label={t("utilityProcessManagement:utilityProcessManagement.label.requireFileLog")}
                                                    checked={this.state.requireFileLog}
                                                    handleChange={(checked) => this.setState({ requireFileLog: checked })}
                                                />
                                            </Col>

                                            <Col xs="12" sm="4">
                                                <CustomAppSwitch
                                                    name="isApproved"
                                                    label={t("utilityProcessManagement:utilityProcessManagement.label.isApproved")}
                                                    checked={this.state.requireApprove}
                                                    handleChange={(checked) => this.setState({ requireApprove: checked })}
                                                />
                                            </Col>
                                        </Row>
                                        <Row >
                                            <Col xs="12" sm="4">
                                                <CustomAppSwitch
                                                    name="closeCrWhenResolveSuccess"
                                                    label={t("utilityProcessManagement:utilityProcessManagement.label.closeCrWhenResolveSuccess")}
                                                    checked={this.state.closeCrWhenResolveSuccess}
                                                    handleChange={(checked) => this.setState({ closeCrWhenResolveSuccess: checked })}
                                                />
                                            </Col>
                                            <Col xs="12" sm="4">
                                                <CustomAppSwitch
                                                    name="isLaneImpact"
                                                    label={t("utilityProcessManagement:utilityProcessManagement.label.isLaneImpact")}
                                                    checked={this.state.isLaneImpact}
                                                    handleChange={(checked) => this.setState({ isLaneImpact: checked })}
                                                />
                                            </Col>
                                            <Col xs="12" sm="4">
                                                <CustomAppSwitch
                                                    name="requireMop"
                                                    label={t("utilityProcessManagement:utilityProcessManagement.label.requireMop")}
                                                    checked={this.state.requireMop}
                                                    handleChange={(checked) => this.setState({ requireMop: checked })}
                                                />
                                            </Col>
                                        </Row>
                                        {
                                            (this.state.isAddOrEdit === "EDIT" && this.state.selectedData.isLeaf) ?
                                                <div>
                                                    <Row>
                                                        <Col xs="12" md="12" lg="12">
                                                            <Card>
                                                                <CardHeader>
                                                                    <div style={{ float: 'left' }}>
                                                                        <span style={{ position: 'absolute' }} className="mt-1">
                                                                            {t("utilityProcessManagement:utilityProcessManagement.label.listFile")}
                                                                        </span>
                                                                    </div>
                                                                    <div className="card-header-actions card-header-search-actions-button">
                                                                        <Button type="button" className="custom-btn btn-pill mr-2" color="primary" onClick={() => this.openPopupListFile()} title={t("odConfigScheduleCreate:odConfigScheduleCreate.button.additional")}><i className="fa fa-plus"></i></Button>
                                                                        <Button type="button" className="custom-btn btn-pill" color="secondary" onClick={() => this.clearListFile(this.state.dataCheckedListFile)} title={t("odConfigScheduleCreate:odConfigScheduleCreate.button.remove")}><i className="fa fa-close"></i></Button>
                                                                    </div>
                                                                </CardHeader>
                                                                <CustomReactTableLocal
                                                                    columns={listFileTable.columns}
                                                                    data={this.state.listFile}
                                                                    loading={false}
                                                                    defaultPageSize={3}
                                                                    isCheckbox={true}
                                                                    propsCheckbox={["cpteId"]}
                                                                    handleDataCheckbox={this.handleDataCheckboxListFile}
                                                                />
                                                            </Card>
                                                        </Col>
                                                        <Col xs="12" md="12" lg="12">
                                                            <Card>
                                                                <CardHeader>
                                                                    <div style={{ float: 'left' }}>
                                                                        <span style={{ position: 'absolute' }} className="mt-1">
                                                                            {t("utilityProcessManagement:utilityProcessManagement.label.groupUnit")}
                                                                        </span>
                                                                    </div>
                                                                    <div className="card-header-actions card-header-search-actions-button">
                                                                        <Button type="button" className="custom-btn btn-pill mr-2" color="primary" onClick={() => this.openPopupGroupUnit()} title={t("odConfigScheduleCreate:odConfigScheduleCreate.button.additional")}><i className="fa fa-plus"></i></Button>
                                                                        <Button type="button" className="custom-btn btn-pill" color="secondary" onClick={() => this.clearGroupUnit(this.state.dataCheckedGroupUnit)} title={t("odConfigScheduleCreate:odConfigScheduleCreate.button.remove")}><i className="fa fa-close"></i></Button>
                                                                    </div>
                                                                </CardHeader>
                                                                <CustomReactTableLocal
                                                                    columns={groupUnitTable.columns}
                                                                    data={this.state.groupUnit}
                                                                    loading={false}
                                                                    defaultPageSize={3}
                                                                    isCheckbox={true}
                                                                    propsCheckbox={["groupUnitId"]}
                                                                    handleDataCheckbox={this.handleDataCheckboxGroupUnit}
                                                                />
                                                            </Card>
                                                        </Col>
                                                        <Col xs="12" md="12" lg="12">
                                                            <Card>
                                                                <CardHeader>
                                                                    <div style={{ float: 'left' }}>
                                                                        <span style={{ position: 'absolute' }} className="mt-1">
                                                                            {t("utilityProcessManagement:utilityProcessManagement.label.woList")}
                                                                        </span>
                                                                    </div>
                                                                    <div className="card-header-actions card-header-search-actions-button">
                                                                        <Button type="button" className="custom-btn btn-pill mr-2" color="primary" onClick={() => this.openPopupListWo("ADD", this.state.selectedData.crProcessId)} title={t("odConfigScheduleCreate:odConfigScheduleCreate.button.additional")}><i className="fa fa-plus"></i></Button>
                                                                        <Button type="button" className="custom-btn btn-pill" color="secondary" onClick={() => this.clearListWo(this.state.dataCheckedListWo)} title={t("odConfigScheduleCreate:odConfigScheduleCreate.button.remove")}><i className="fa fa-close"></i></Button>
                                                                    </div>
                                                                </CardHeader>
                                                                <CustomReactTableLocal
                                                                    columns={listWoTable.columns}
                                                                    data={this.state.listWo}
                                                                    loading={false}
                                                                    defaultPageSize={3}
                                                                    isCheckbox={true}
                                                                    propsCheckbox={["id"]}
                                                                    handleDataCheckbox={this.handleDataCheckboxWo}
                                                                />
                                                            </Card>
                                                        </Col>
                                                    </Row>
                                                </div> : ""
                                        }
                                    </CardBody>
                                </Collapse>
                            </Card>
                        </Col>
                    </Row>
                </AvForm>
                <UtilityProcessManagementAddEditPopupListFile
                    parentState={this.state}
                    closePopup={this.closePopupListFile}
                    addListFile={this.addListFile}
                />
                <UtilityProcessManagementAddEditPopupGroupUnit
                    parentState={this.state}
                    closePopup={this.closePopupGroupUnit}
                    addGroupUnit={this.addGroupUnit}
                />
                <UtilityProcessManagementAddEditPopupListWo
                    parentState={this.state}
                    closePopup={this.closePopupListWo}
                    addOrEditWo={this.addOrEditWo}
                />
            </div>
        );
    }
}

UtilityProcessManagementAddEdit.propTypes = {
    closeAddOrEditPage: PropTypes.func.isRequired,
    parentState: PropTypes.object.isRequired
};

function mapStateToProps(state, ownProps) {
    const { utilityProcessManagement, common } = state;
    return {
        response: { utilityProcessManagement, common }
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(Object.assign({}, UtilityProcessManagementActions, commonActions), dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(translate()(UtilityProcessManagementAddEdit));
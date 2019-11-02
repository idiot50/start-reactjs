import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Col, Card, CardBody, CardHeader, Collapse, Row } from 'reactstrap';
import { AvForm, AvFeedback, AvGroup } from 'availity-reactstrap-validation';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { translate, Trans } from 'react-i18next';
import LaddaButton, { ZOOM_OUT } from 'react-ladda';
import { toastr } from 'react-redux-toastr';
import * as commonActions from './../../../actions/commonActions';
import * as TtMessageConfigActions from './TtMessageConfigActions';
import { CustomReactTableLocal, CustomSelectLocal, CustomSticky, CustomAvField, CustomAutocomplete, CustomReactTable } from "../../../containers/Utils";
import { validSubmitForm, invalidSubmitForm } from '../../../containers/Utils/Utils';

class TtMessageConfigAddEdit extends Component {
    constructor(props) {
        super(props);

        this.toggleFormAddEdit = this.toggleFormAddEdit.bind(this);
        this.handleValidSubmitAddOrEdit = this.handleValidSubmitAddOrEdit.bind(this);
        this.handleInvalidSubmitAddOrEdit = this.handleInvalidSubmitAddOrEdit.bind(this);
        this.confirmDelete = this.confirmDelete.bind(this);
        this.state = {
            btnAddOrEditLoading: false,
            collapseFormAddEdit: true,
            //AddOrEditModal
            isAddOrEdit: props.parentState.isAddOrEdit,
            selectedData: props.parentState.selectedData,
            //Table
            data: [],
            loading: false,
            btnAddStaff: false,
            columns: this.buildTableColumns(),
            objectSearch: {},
            //Select
            selectValueConfigLevel: {},
            selectValuePriority: {},
            selectValueMessageType: {},
            selectValueHandlePerson: {},
            selectValueHandleUnit: {},
            configLevelList: [],
            pureConfigLevelList: [],
            messageAddList: [],
            loop: false,
            disable: false
        };
    }

    componentDidMount() {
        //get combobox
        this.props.actions.getItemMaster("TT_PRIORITY", "itemId", "itemName", "1", "3");// mức độ ưu tiên
        this.props.actions.getItemMaster("LEVEL_CALL_IPCC", "itemId", "itemName", "1", "3").then((response) => {

            let configLevelList = [];
            for (const i of response.payload.data.data) {
                configLevelList.push({ itemId: i.itemValue, itemName: i.itemName });
            }
            let maxConfigLevel = Math.max.apply(Math, configLevelList.map(i => i.itemId));
            let minConfigLevel = Math.min.apply(Math, configLevelList.map(i => i.itemId));
            this.setState({
                configLevelList,
                pureConfigLevelList: JSON.parse(JSON.stringify(configLevelList)),
                minConfigLevel,
                maxConfigLevel
            })
        });
        if (this.state.isAddOrEdit === 'EDIT' || this.state.isAddOrEdit === 'COPY') {
            
            this.setState({
                selectValueConfigLevel: { value: this.state.selectedData.levelId },
                selectValueHandleUnit: { value: this.state.selectedData.unitId, label: this.state.selectedData.unitName },
                selectValuePriority: { value: this.state.selectedData.priorityId, label: this.state.selectedData.priorityName },
                selectValueSection: { value: this.state.selectedData.locationId, label: this.state.selectedData.locationName },
            })
        }
        if (this.state.isAddOrEdit === 'EDIT') {
            this.setState({
                disable: true
            })
        }
    }

    componentDidUpdate() {
        if (this.state.loop) {
            this.findMaxLevelByUnit(this.state.selectValueHandleUnit.value);
            this.setState({
                loop: false,
            })
        }
    }

    findMaxLevelByUnit = async (value) => {
        let objectMaxUnit = Object.assign({}, objectMaxUnit);
        objectMaxUnit.unitId = value
        await this.props.actions.getMaxLevelIDByUnitID(objectMaxUnit).then((response) => {
            if (response.payload.data === 0) {
                this.setState({
                    configLevelList: [...this.state.configLevelList].filter(item => item.itemId === this.state.minConfigLevel + "")
                })
            }
            else if (response.payload.data === this.state.maxConfigLevel) {
                this.setState({
                    configLevelList: [...this.state.configLevelList]
                })
            }
            else {
                this.setState({
                    configLevelList: [...this.state.configLevelList].filter(item => Number(item.itemId) <= response.payload.data + 1)
                })
            }
        })
        if (this.state.selectValueConfigLevel && this.state.selectValueConfigLevel.value) {
            if (this.state.configLevelList.filter(i => i.itemId === this.state.selectValueConfigLevel.value).length === 0) {
                this.setState({
                    selectValueConfigLevel: {}
                })
                toastr.warning(this.props.t("ttMessageConfig:ttMessageConfig.message.required.rangeConfigLevel"))
            }
        }

    }

    componentWillUnmount() {
        this.setState({
            isAddOrEdit: null
        });
    }

    buildTableColumns() {
        return [
            {
                Header: <Trans i18nKey="ttMessageConfig:ttMessageConfig.label.action" />,
                id: "action",
                sortable: false,
                fixed: "left",
                width: 120,
                accessor: d => {
                    let html = <div></div>;
                    html = <div className="text-center">
                        <span title={this.props.t("common:common.button.delete")} onClick={() => this.confirmDelete(d.userName, d.userId)}>
                            <Button type="button" size="sm" className="btn-danger icon mr-1"><i className="fa fa-trash-o"></i></Button>
                        </span>
                    </div>;
                    return html;
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{ height: '2.7em' }}></div>
                )
            },
            {
                Header: <Trans i18nKey="ttMessageConfig:ttMessageConfig.label.messageType" />,
                id: "cfgTypeName",
                width: 250,
                accessor: d => {
                    return <span title={d.cfgTypeName}>{d.cfgTypeName}</span>
                },
                Filter: ({ filter, onChange }) => (null)
            },
            {
                Header: <Trans i18nKey="ttMessageConfig:ttMessageConfig.label.fullname" />,
                id: "fullName",
                width: 250,
                accessor: d => {
                    return <span title={d.fullName}>{d.fullName}</span>
                },
                Filter: ({ filter, onChange }) => (null)
            },
            {
                Header: <Trans i18nKey="ttMessageConfig:ttMessageConfig.label.account" />,
                id: "userName",
                width: 250,
                accessor: d => {
                    return <span title={d.userName}>{d.userName}</span>
                },
                Filter: ({ filter, onChange }) => (null)
            },
            {
                Header: <Trans i18nKey="ttMessageConfig:ttMessageConfig.label.email" />,
                id: "email",
                minWidth: 200,
                accessor: d => {
                    return d.email && <span title={d.email}>{d.email}</span>
                },
                Filter: ({ filter, onChange }) => (null)
            },
            {
                Header: <Trans i18nKey="ttMessageConfig:ttMessageConfig.label.phoneNumber" />,
                id: "mobile",
                minWidth: 200,
                accessor: d => {
                    return d.mobile && <span title={d.mobile}>{d.mobile}</span>
                },
                Filter: () => (
                    null
                )
            },
            {
                Header: <Trans i18nKey="ttMessageConfig:ttMessageConfig.label.unit" />,
                id: "unitName",
                minWidth: 200,
                accessor: d => {
                    return d.unitName && <span title={d.unitName}>{d.unitName}</span>
                },
                Filter: () => (
                    null
                )
            },
        ];
    }

    onFetchData = (state, instance) => {
        if (this.state.isAddOrEdit === 'EDIT' || this.state.isAddOrEdit === 'COPY') {
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
            objectSearch.cfgId = this.state.selectedData.cfgId;
            this.setState({
                loading: true,
                objectSearch: objectSearch
            })
            try {
                let list = [];
                this.props.actions.getListCfgSmsUser(objectSearch).then((response) => {
                    for (const i of response.payload.data.data) {
                        list.push({ cfgId: i.cfgId, cfgType: i.cfgType, userId: i.userId })
                        if (i.cfgType === '0') {
                            i.cfgTypeName = this.props.t("ttMessageConfig:ttMessageConfig.label.singleSynMess");
                            continue;
                        }
                        if (i.cfgType === '1') {
                            i.cfgTypeName = this.props.t("ttMessageConfig:ttMessageConfig.label.singleMess");
                            continue;
                        }
                        if (i.cfgType === '2') {
                            i.cfgTypeName = this.props.t("ttMessageConfig:ttMessageConfig.label.syntheticMess");
                        }
                    }
                    this.setState({
                        loading: false,
                        data: response.payload.data.data,
                        messageAddList: list
                    })
                });

            } catch (error) {
                toastr.warning(this.props.t("ttMessageConfig:ttMessageConfig.message.error.messList"))
                this.setState({
                    loading: false
                })
            }
        }
    }

    handleValidSubmitAddOrEdit(event, values) {
        validSubmitForm(event, values, "idFormAddOrEdit");
        this.setState({
            btnAddOrEditLoading: true
        }, () => {
            values.cfgName = values.cfgName.trim();
            values.unitId = this.state.selectValueHandleUnit.value;
            values.unitName = this.state.selectValueHandleUnit.label;
            values.locationId = (this.state.selectValueSection && this.state.selectValueSection.value) ? this.state.selectValueSection.value : "";
            values.locationName = (this.state.selectValueSection && this.state.selectValueSection.value) ? this.state.selectValueSection.label : "";
            values.priorityId = (this.state.selectValuePriority && this.state.selectValuePriority.value) ? this.state.selectValuePriority.value + "" : "";
            values.priorityName = (this.state.selectValuePriority && this.state.selectValuePriority.value) ? this.state.selectValuePriority.label : "";
            values.levelId = this.state.selectValueConfigLevel.value + "";
            values.levelName = this.state.selectValueConfigLevel.label;
            values.timeProcess = values.timeProcess.trim();
            const ttMessageConfig = Object.assign({}, values);
            ttMessageConfig.list = this.state.messageAddList;
            delete ttMessageConfig.messageType;
            delete ttMessageConfig.staff;
            if (this.state.isAddOrEdit === 'ADD' || this.state.isAddOrEdit === 'COPY') {
                if (this.state.isAddOrEdit === "COPY") {
                    ttMessageConfig.cfgId = "";
                }
                this.props.actions.addTtMessageConfig(ttMessageConfig).then((response) => {
                    if (response.payload.data.key === "SUCCESS") {
                        this.setState({
                            btnAddOrEditLoading: false
                        }, () => {
                            this.props.closeAddOrEditPage(this.state.isAddOrEdit);
                            toastr.success(this.props.t("ttMessageConfig:ttMessageConfig.message.success.add"));
                        });
                    } else if (response.payload.data.key === "ERROR") {
                        toastr.error(response.payload.data.message);
                    } else if (response.payload.data.key === "DUPLICATE") {
                        this.setState({
                            btnAddOrEditLoading: false
                        })
                        toastr.error(this.props.t("ttMessageConfig:ttMessageConfig.message.error.duplicate"));
                    } else {
                        this.setState({
                            btnAddOrEditLoading: false
                        }, () => {
                            toastr.error(this.props.t("ttMessageConfig:ttMessageConfig.message.error.add"));
                        });
                    }
                }).catch((response) => {
                    this.setState({
                        btnAddOrEditLoading: false
                    }, () => {
                        try {
                            toastr.error(response.error.response.data.errors[0].defaultMessage);
                        } catch (error) {
                            console.error(error);
                            toastr.error(this.props.t("ttMessageConfig:ttMessageConfig.message.error.add"));
                        }
                    });
                });
            } else if (this.state.isAddOrEdit === 'EDIT') {
                ttMessageConfig.cfgId = this.state.selectedData.cfgId;
                ttMessageConfig.list = this.state.messageAddList;
                this.props.actions.editTtMessageConfig(ttMessageConfig).then((response) => {
                    if (response.payload.data.key === "SUCCESS") {
                        this.setState({
                            btnAddOrEditLoading: false
                        }, () => {
                            this.props.closeAddOrEditPage(this.state.isAddOrEdit);
                            toastr.success(this.props.t("ttMessageConfig:ttMessageConfig.message.success.edit"));
                        });
                    } else if (response.payload.data.key === "ERROR") {
                        toastr.error(response.payload.data.message);
                    } else if (response.payload.data.key === "DUPLICATE") {
                        this.setState({
                            btnAddOrEditLoading: false
                        })
                        toastr.error(this.props.t("ttMessageConfig:ttMessageConfig.message.error.duplicate"));
                    } else {
                        this.setState({
                            btnAddOrEditLoading: false
                        }, () => {
                            toastr.error(this.props.t("ttMessageConfig:ttMessageConfig.message.error.edit"));
                        });
                    }
                }).catch((response) => {
                    this.setState({
                        btnAddOrEditLoading: false
                    }, () => {
                        try {
                            toastr.error(response.error.response.data.errors[0].defaultMessage);
                        } catch (error) {
                            console.error(error);
                            toastr.error(this.props.t("ttMessageConfig:ttMessageConfig.message.error.edit"));
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

    handleItemSelectChangeConfigLevel = (option) => {
        this.setState({ selectValueConfigLevel: option })
    }

    handleItemSelectChangePriority = (option) => {
        this.setState({ selectValuePriority: option })
    }

    handleItemSelectChangeMessageType = (option) => {
        this.setState({ selectValueMessageType: option })
    }

    handleItemSelectChangeHandlePerson = (option) => {
        this.setState({ selectValueHandlePerson: option })
    }

    handleItemSelectChangeUnit = (option) => {
        this.setState({ selectValueHandleUnit: option })
        if (this.state.isAddOrEdit === 'ADD' || this.state.isAddOrEdit === 'COPY') {
            if (option && option.value) {
                this.setState({
                    loop: true,
                    configLevelList: JSON.parse(JSON.stringify(this.state.pureConfigLevelList))
                })
            } else {
                this.setState({
                    configLevelList: JSON.parse(JSON.stringify(this.state.pureConfigLevelList)),
                    selectValueConfigLevel: {},
                })
            }
        }
    }

    handleItemSelectChangeSection = (option) => {
        this.setState({ selectValueSection: option })
    }


    onAddStaff = () => {
        if (Object.getOwnPropertyNames(this.state.selectValueMessageType).length !== 0 && this.state.selectValueMessageType.value !== null) {
            if (typeof this.state.selectValueHandlePerson === 'object' && this.state.selectValueHandlePerson !== null) {
                if (Object.getOwnPropertyNames(this.state.selectValueHandlePerson).length !== 0) {
                    const objectAdd = Object.assign({}, objectAdd);
                    let objectMessAdd = {};
                    var pattern = /[()]/g;
                    var pattern1 = /\s[-]\s/g;
                    objectAdd.userId = this.state.selectValueHandlePerson.label && this.state.selectValueHandlePerson.value;
                    objectAdd.fullName = (this.state.selectValueHandlePerson.label.split(pattern))[0].trim();
                    objectAdd.userName = this.state.selectValueHandlePerson.label && (this.state.selectValueHandlePerson.label.split(pattern))[1].trim();
                    objectAdd.email = this.state.selectValueHandlePerson.label && this.state.selectValueHandlePerson.subLabel.split(pattern1)[0];
                    objectAdd.mobile = this.state.selectValueHandlePerson.label && this.state.selectValueHandlePerson.subLabel.split(pattern1)[1];
                    objectAdd.unitName = this.state.selectValueHandlePerson.label && this.state.selectValueHandlePerson.parentLabel;
                    objectAdd.cfgTypeName = this.state.selectValueMessageType.label && this.state.selectValueMessageType.label;

                    objectMessAdd.userId = this.state.selectValueHandlePerson.label && this.state.selectValueHandlePerson.value;
                    objectMessAdd.cfgType = this.state.selectValueMessageType.label && this.state.selectValueMessageType.value;
                    if (this.state.isAddOrEdit === 'EDIT') {
                        objectMessAdd.cfgId = this.state.selectedData.cfgId;
                    }
                    if (!this.state.data.some(item => item.userName === objectAdd.userName)) {
                        this.setState({
                            data: [...this.state.data, objectAdd],
                            messageAddList: [...this.state.messageAddList, objectMessAdd]
                        })
                    } else {
                        toastr.warning(this.props.t("ttMessageConfig:ttMessageConfig.message.required.duplicatedStaff"))
                    }
                } else {
                    toastr.warning(this.props.t("ttMessageConfig:ttMessageConfig.message.required.staff"))
                }
            }
        } else {
            toastr.warning(this.props.t("ttMessageConfig:ttMessageConfig.message.required.messageType"))
        }
    }

    confirmDelete(userName, userId) {
        this.setState({
            messageAddList: [...this.state.messageAddList].filter(item => item.userId !== userId),
            data: [...this.state.data].filter(item => item.userName !== userName)
        })
    }

    render() {
        const { t, response } = this.props;
        const { pages, loading, data, configLevelList, disable } = this.state;
        let priorityList = (response.common.ttPriority && response.common.ttPriority.payload) ? response.common.ttPriority.payload.data.data : [];
        const messageTypeList = [{ itemId: '0', itemName: this.props.t("ttMessageConfig:ttMessageConfig.label.singleSynMess") }, { itemId: '1', itemName: this.props.t("ttMessageConfig:ttMessageConfig.label.singleMess") }, { itemId: '2', itemName: this.props.t("ttMessageConfig:ttMessageConfig.label.syntheticMess") }];
        let objectAddOrEdit = (this.state.isAddOrEdit === "EDIT" || this.state.isAddOrEdit === "COPY") ? this.state.selectedData : {};
        const { columns } = this.state;
        return (
            <div className="animated fadeIn">
                <AvForm id="idFormAddOrEdit" onValidSubmit={this.handleValidSubmitAddOrEdit} onInvalidSubmit={this.handleInvalidSubmitAddOrEdit} model={objectAddOrEdit}>
                    <Row>
                        <Col xs="12">
                            <Card>
                                <CustomSticky>
                                    <CardHeader>
                                        <i className={(this.state.isAddOrEdit === "ADD" || this.state.isAddOrEdit === "COPY") ? "fa fa-plus-circle" : "fa fa-edit"}></i>{(this.state.isAddOrEdit === "ADD" || this.state.isAddOrEdit === "COPY") ? t("ttMessageConfig:ttMessageConfig.title.ttMessageConfigAdd") : this.state.isAddOrEdit === "EDIT" || this.state.isAddOrEdit === "COPY" ? t("ttMessageConfig:ttMessageConfig.title.ttMessageConfigEdit") : ''}
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
                                        <Row>
                                            <Col xs="12" sm="12">
                                                <Card>
                                                    <CardHeader>
                                                        <i className="fa fa-align-justify"></i>{t("ttMessageConfig:ttMessageConfig.title.ttMessageConfigInfo")}
                                                    </CardHeader>
                                                    <CardBody>
                                                        <Row>
                                                            <Col xs="12" sm="4">
                                                                <CustomAvField name="cfgName" label={t("ttMessageConfig:ttMessageConfig.label.spmCode")} //placeholder={t("ttMessageConfig:ttMessageConfig.placeholder.spmCode")} 
                                                                required autoFocus maxLength="500" validate={{ required: { value: true, errorMessage: t("ttMessageConfig:ttMessageConfig.message.required.spmCode") } }} />
                                                            </Col>
                                                            <Col xs="12" sm="4">
                                                                <CustomSelectLocal
                                                                    name={"levelId"}
                                                                    label={t("ttMessageConfig:ttMessageConfig.label.configLevel")}
                                                                    isRequired={true}
                                                                    messageRequire={t("ttMessageConfig:ttMessageConfig.message.required.configLevel")}
                                                                    options={configLevelList}
                                                                    closeMenuOnSelect={true}
                                                                    handleItemSelectChange={this.handleItemSelectChangeConfigLevel}
                                                                    selectValue={this.state.selectValueConfigLevel}
                                                                />
                                                            </Col>
                                                            <Col xs="12" sm="4">
                                                                <CustomSelectLocal
                                                                    name={"priorityId"}
                                                                    label={t("ttMessageConfig:ttMessageConfig.label.priority")}
                                                                    messageRequire={t("ttMessageConfig:ttMessageConfig.message.required.priority")}
                                                                    options={priorityList}
                                                                    closeMenuOnSelect={true}
                                                                    handleItemSelectChange={this.handleItemSelectChangePriority}
                                                                    selectValue={this.state.selectValuePriority}
                                                                    isRequired={false}
                                                                />
                                                            </Col>

                                                        </Row>
                                                        <Row>
                                                            <Col xs="12" sm="4">
                                                                <CustomAvField name="timeProcess" label={t("ttMessageConfig:ttMessageConfig.label.processingTime")} 
                                                                    //placeholder={t("ttMessageConfig:ttMessageConfig.placeholder.handleTime")} required
                                                                    maxLength="500" validate={{
                                                                        required: { value: true, errorMessage: t("ttMessageConfig:ttMessageConfig.message.required.handleTime") },
                                                                        pattern: { value: '^[+]?([0-9]{1,4})?([.][0-9]{1,2})?$', errorMessage: this.props.t("ttMessageConfig:ttMessageConfig.message.error.wrongDataFormat") },
                                                                        min: { value: 0.01, errorMessage: this.props.t("ttMessageConfig:ttMessageConfig.message.error.wrongZeroDataFormat") }
                                                                    }} />
                                                            </Col>
                                                            <Col xs="12" sm="4">
                                                                <CustomAutocomplete
                                                                    name={"unitId"}
                                                                    label={t("ttMessageConfig:ttMessageConfig.label.unit")}
                                                                    placeholder={t("ttMessageConfig:ttMessageConfig.placeholder.unit")}
                                                                    isRequired={true}
                                                                    messageRequire={t("ttMessageConfig:ttMessageConfig.message.required.unit")}
                                                                    closeMenuOnSelect={false}
                                                                    handleItemSelectChange={this.handleItemSelectChangeUnit}
                                                                    selectValue={this.state.selectValueHandleUnit}
                                                                    moduleName={"UNIT"}
                                                                    isDisabled={disable}
                                                                    parentValue={(this.state.selectValueReceiveUnitId && this.state.selectValueReceiveUnitId.value) ? this.state.selectValueReceiveUnitId.value + "" : ""}
                                                                />
                                                            </Col>
                                                            <Col xs="12" sm="4">
                                                                <CustomAutocomplete
                                                                    name={"locationId"}
                                                                    label={t("ttMessageConfig:ttMessageConfig.label.section")}
                                                                    placeholder={t("ttMessageConfig:ttMessageConfig.placeholder.section")}
                                                                    isRequired={false}
                                                                    closeMenuOnSelect={false}
                                                                    handleItemSelectChange={this.handleItemSelectChangeSection}
                                                                    selectValue={this.state.selectValueSection}
                                                                    moduleName={"REGION"}
                                                                    isDisabled={disable}
                                                                    parentValue={(this.state.selectValueReceiveLocationId && this.state.selectValueReceiveLocationId.value) ? this.state.selectValueReceiveLocationId.value + "" : ""}
                                                                />
                                                            </Col>
                                                        </Row>
                                                    </CardBody>
                                                </Card>
                                            </Col>
                                        </Row>
                                    </CardBody>
                                </Collapse>
                                <CardBody>
                                    <Row>
                                        <Col xs="12" sm="12">
                                            <Card>
                                                <CardHeader>
                                                    <i className="fa fa-align-justify"></i>{t("ttMessageConfig:ttMessageConfig.title.staff")}
                                                </CardHeader>
                                                <CardBody>
                                                    <Row>
                                                        <Col xs="12" sm="6">
                                                            <CustomSelectLocal
                                                                name={"messageType"}
                                                                label={t("ttMessageConfig:ttMessageConfig.label.messageType")}
                                                                options={messageTypeList}
                                                                isRequired={false}
                                                                closeMenuOnSelect={true}
                                                                handleItemSelectChange={this.handleItemSelectChangeMessageType}
                                                                selectValue={this.state.selectValueMessageType}
                                                            />
                                                        </Col>
                                                        <Col xs="12" sm="6">
                                                            <CustomAutocomplete
                                                                name={"staff"}
                                                                label={t("ttMessageConfig:ttMessageConfig.label.staff")}
                                                                placeholder={t("ttMessageConfig:ttMessageConfig.placeholder.staff")}
                                                                isRequired={false}
                                                                closeMenuOnSelect={false}
                                                                handleItemSelectChange={this.handleItemSelectChangeHandlePerson}
                                                                selectValue={this.state.selectValueHandlePerson}
                                                                moduleName={"USERS"}
                                                                parentValue={(this.state.selectValueReceiveUnitId && this.state.selectValueReceiveUnitId.value) ? this.state.selectValueReceiveUnitId.value + "" : ""}
                                                                isHasChildren={true}
                                                            />
                                                        </Col>
                                                    </Row>
                                                    <Row>
                                                        <Col xs="12" sm="12" style={{ textAlign: 'center', margin: '1em 0' }}>
                                                            <LaddaButton type="button"
                                                                className="btn btn-primary btn-md mr-1"
                                                                name="submitMessage"
                                                                loading={this.state.btnAddStaff}
                                                                onClick={this.onAddStaff}
                                                                data-style={ZOOM_OUT}>
                                                                <i className="fa fa-plus"></i>  {t("ttMessageConfig:ttMessageConfig.button.add")}
                                                            </LaddaButton>
                                                        </Col>
                                                    </Row>
                                                    <Row>
                                                        <Col xs="12" sm="12">
                                                            <Card>
                                                                <CardBody>
                                                                    <CustomReactTable
                                                                        onRef={ref => (this.customReactTable = ref)}
                                                                        columns={columns}
                                                                        data={data}
                                                                        pages={pages}
                                                                        loading={loading}
                                                                        onFetchData={this.onFetchData}
                                                                        defaultPageSize={10}
                                                                    />
                                                                </CardBody>
                                                            </Card>
                                                        </Col>
                                                    </Row>
                                                </CardBody>
                                            </Card>
                                        </Col>
                                    </Row>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </AvForm>
            </div>
        );
    }
}

TtMessageConfigAddEdit.propTypes = {
    closeAddOrEditPage: PropTypes.func.isRequired,
    parentState: PropTypes.object.isRequired
};

function mapStateToProps(state, ownProps) {
    const { ttMessageConfig, common } = state;
    return {
        response: { ttMessageConfig, common }
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(Object.assign({}, TtMessageConfigActions, commonActions), dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(translate()(TtMessageConfigAddEdit));
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Col, Card, CardBody, CardHeader, Collapse, Row } from 'reactstrap';
import { AvForm } from 'availity-reactstrap-validation';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { translate, Trans } from 'react-i18next';
import LaddaButton, { ZOOM_OUT } from 'react-ladda';
import { toastr } from 'react-redux-toastr';
import * as commonActions from './../../../actions/commonActions';
import * as OdTypeActions from './OdTypeActions';
import { CustomReactTableLocal, CustomSelectLocal, CustomSticky, CustomAvField } from "../../../containers/Utils";
import { validSubmitForm, invalidSubmitForm } from '../../../containers/Utils/Utils';

class OdTypeAddEdit extends Component {
    constructor(props) {
        super(props);

        this.toggleFormAddEdit = this.toggleFormAddEdit.bind(this);
        this.handleValidSubmitAddOrEdit = this.handleValidSubmitAddOrEdit.bind(this);
        this.handleInvalidSubmitAddOrEdit = this.handleInvalidSubmitAddOrEdit.bind(this);
        this.handleItemSelectChangeOdGroupTypeId = this.handleItemSelectChangeOdGroupTypeId.bind(this);
        this.handleItemSelectChangeStatus = this.handleItemSelectChangeStatus.bind(this);

        this.state = {
            btnAddOrEditLoading: false,
            collapseFormAddEdit: true,
            //AddOrEditModal
            isAddOrEdit: props.parentState.isAddOrEdit,
            selectedData: props.parentState.selectedData,
            //Table
            data: [],
            columns: this.buildTableColumns(),
            //Select
            selectValueOdGroupTypeId: {},
            statusListSelect: [
                { itemId: 1, itemName: props.t("odType:odType.dropdown.status.active") },
                { itemId: 0, itemName: props.t("odType:odType.dropdown.status.inActive") }
            ],
            selectValueStatus: {}
        };
    }

    componentDidMount() {
        //get combobox
        this.props.actions.getItemMaster("OD_PRIORITY", "itemId", "itemName", "1", "3").then((response) => {
            const dataOdPriority = response.payload.data.data;
            let odPriorities = [];
            if ((this.state.isAddOrEdit === "EDIT" || this.state.isAddOrEdit === "COPY") && this.state.selectedData.odTypeDetailDTOS) {
                for (const obj of this.state.selectedData.odTypeDetailDTOS) {
                    odPriorities.push({
                        itemId: obj.priorityId,
                        itemName: obj.priorityName,
                        processTime: obj.processTime
                    });
                }
                this.setState({
                    data: odPriorities,
                    selectValueOdGroupTypeId: {value: this.state.selectedData.odGroupTypeId ? this.state.selectedData.odGroupTypeId : null },
                    selectValueStatus: {value: this.state.selectedData.status }
                });
            } else {
                for (const obj of dataOdPriority) {
                    odPriorities.push({
                        itemId: obj.itemId,
                        itemName: obj.itemName,
                        processTime: obj.processTime
                    });
                }
                this.setState({
                    data: odPriorities,
                    selectValueOdGroupTypeId: {},
                    selectValueStatus: {}
                });
            }
        }).catch((error) => {
        });
    }

    componentWillUnmount() {
        this.setState({
            isAddOrEdit: null
        });
    }

    buildTableColumns() {
        return [
            {
                Header: <Trans i18nKey="odType:odType.label.priority" />,
                id: "itemName",
                accessor: d => <span title={d.itemName}>{d.itemName}</span>
            },
            {
                Header: <div><Trans i18nKey="odType:odType.label.processingTime" /><span className="text-danger">{" (*)"}</span></div>,
                accessor: "processTime",
                Cell: ({ original }) => {
                    const isOnchangeValue = this.state.data.find((ch) => ch.itemId === original.itemId);
                    return <CustomAvField type="text" name={"input-" + original.itemId} value={(isOnchangeValue && isOnchangeValue.processTime) ? isOnchangeValue.processTime : ""} 
                        isinputonly="true" onChange={(e) => this.onChangeRowProcessTime(e.target.value, original)} required
                        validate={{ required: { value: true, errorMessage: this.props.t("odType:odType.message.requiredProcessTime")},
                                    pattern: {value: '^[+]?[0-9]+([.][0-9]{1})?$', errorMessage: this.props.t("odType:odType.message.error.wrongDataFormat")},
                        }} />;
                }
            }
        ];
    }

    onChangeRowProcessTime(newValue, object) {
        //Set into data
        const data = [...this.state.data];
        for(const obj of data) {
            if(obj.itemId === object.itemId) {
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
            const odType = Object.assign({}, values);
            odType.odGroupTypeId = this.state.selectValueOdGroupTypeId.value;
            odType.status = this.state.selectValueStatus.value;
            if(this.state.isAddOrEdit === "COPY") {
                odType.odTypeId = "";
            }
            let odTypeDetailDTOS = [];
            for (const obj of this.state.data) {
                let odTypeDetail = {
                    priorityId: obj.itemId,
                    priorityName: obj.itemName,
                    processTime: obj.processTime
                };
                odTypeDetailDTOS.push(odTypeDetail);
            }
            odType.odTypeCode = odType.odTypeCode.trim();
            odType.odTypeName = odType.odTypeName.trim();
            odType.odTypeDetailDTOS = odTypeDetailDTOS;
            delete odType.processTime;
            if (this.state.isAddOrEdit === "ADD" || this.state.isAddOrEdit === "COPY") {
                this.props.actions.addOdType(odType).then((response) => {
                    if (response.payload.data.key === "SUCCESS") {
                        this.setState({
                            btnAddOrEditLoading: false
                        }, () => {
                            this.props.closeAddOrEditPage(this.state.isAddOrEdit);
                            toastr.success(this.props.t("odType:odType.message.success.add"));
                        });
                    } else {
                        this.setState({
                            btnAddOrEditLoading: false
                        }, () => {
                            toastr.error(this.props.t("odType:odType.message.error.add"));
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
                            toastr.error(this.props.t("odType:odType.message.error.add"));
                        }
                    });
                });
            } else if (this.state.isAddOrEdit === "EDIT") {
                odType.odTypeId = this.state.selectedData.odTypeId;
                this.props.actions.editOdType(odType).then((response) => {
                    if (response.payload.data.key === "SUCCESS") {
                        this.setState({
                            btnAddOrEditLoading: false
                        }, () => {
                            this.props.closeAddOrEditPage(this.state.isAddOrEdit);
                            toastr.success(this.props.t("odType:odType.message.success.edit"));
                        });
                    } else {
                        this.setState({
                            btnAddOrEditLoading: false
                        }, () => {
                            toastr.error(this.props.t("odType:odType.message.error.edit"));
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
                            toastr.error(this.props.t("odType:odType.message.error.edit"));
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

    handleItemSelectChangeOdGroupTypeId(option) {
        this.setState({selectValueOdGroupTypeId: option});
    }

    handleItemSelectChangeStatus(option) {
        this.setState({selectValueStatus: option});
    }

    render() {
        const { t, response } = this.props;
        let objectAddOrEdit = (this.state.isAddOrEdit === "EDIT" || this.state.isAddOrEdit === "COPY") ? this.state.selectedData : {};
        let odGroupTypeList = (response.common.odGroupType && response.common.odGroupType.payload) ? response.common.odGroupType.payload.data.data : [];
        let odPriorityList = (response.common.odPriority && response.common.odPriority.payload) ? response.common.odPriority.payload.data.data : [];
        if (this.state.isAddOrEdit === "ADD" || this.state.isAddOrEdit === "COPY") {
            for (const odPriority of odPriorityList) {
                odPriority.processTime = null;
            }
        }
        objectAddOrEdit.odGroupTypeId = objectAddOrEdit.odGroupTypeId ? objectAddOrEdit.odGroupTypeId : '';
        const { columns } = this.state;
        return (
            <div className="animated fadeIn">
                <AvForm id="idFormAddOrEdit" onValidSubmit={this.handleValidSubmitAddOrEdit} onInvalidSubmit={this.handleInvalidSubmitAddOrEdit} model={objectAddOrEdit}>
                    <Row>
                        <Col xs="12">
                            <Card>
                                <CustomSticky>
                                    <CardHeader>
                                        <i className={(this.state.isAddOrEdit === "ADD" || this.state.isAddOrEdit === "COPY") ? "fa fa-plus-circle" : "fa fa-edit"}></i>{(this.state.isAddOrEdit === "ADD" || this.state.isAddOrEdit === "COPY") ? t("odType:odType.title.odTypeAdd") : this.state.isAddOrEdit === "EDIT" ? t("odType:odType.title.odTypeEdit") : ''}
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
                                            <Col xs="12" sm="6">
                                                <Card>
                                                    <CardHeader>
                                                        <i className="fa fa-align-justify"></i>{t("odType:odType.title.odTypeInfo")}
                                                    </CardHeader>
                                                    <CardBody>
                                                        <Row>
                                                            <Col xs="12" sm="12">
                                                                <CustomAvField name="odTypeCode" label={t("odType:odType.label.typeCode")} placeholder={t("odType:odType.placeholder.typeCode")} required
                                                                    autoFocus maxLength="500" validate={{ required: { value: true, errorMessage: t("odType:odType.message.requiredODcode") } }} />
                                                            </Col>
                                                        </Row>
                                                        <Row>
                                                            <Col xs="12" sm="12">
                                                                <CustomAvField name="odTypeName" label={t("odType:odType.label.type")} placeholder={t("odType:odType.placeholder.type")} required
                                                                    maxLength="500" validate={{ required: { value: true, errorMessage: t("odType:odType.message.requiredType") } }} />
                                                            </Col>
                                                        </Row>
                                                        <Row>
                                                            <Col xs="12" sm="12">
                                                                <CustomSelectLocal
                                                                    name={"status"}
                                                                    label={t("odType:odType.label.status")}
                                                                    isRequired={true}
                                                                    messageRequire={t("odType:odType.message.requiredStatus")}
                                                                    options={this.state.statusListSelect}
                                                                    closeMenuOnSelect={true}
                                                                    handleItemSelectChange={this.handleItemSelectChangeStatus}
                                                                    selectValue={this.state.selectValueStatus}
                                                                />
                                                            </Col>
                                                        </Row>
                                                        <Row>
                                                            <Col xs="12" sm="12">
                                                                <CustomSelectLocal
                                                                    name={"odGroupTypeId"}
                                                                    label={t("odType:odType.label.groupType")}
                                                                    isRequired={false}
                                                                    options={odGroupTypeList}
                                                                    closeMenuOnSelect={true}
                                                                    handleItemSelectChange={this.handleItemSelectChangeOdGroupTypeId}
                                                                    selectValue={this.state.selectValueOdGroupTypeId}
                                                                />
                                                            </Col>
                                                        </Row>
                                                    </CardBody>
                                                </Card>
                                            </Col>
                                            <Col xs="12" sm="6">
                                                <Card>
                                                    <CardHeader>
                                                        <i className="fa fa-list-ul"></i>{t("odType:odType.title.odTypeInfoExtra")}
                                                    </CardHeader>
                                                    <CardBody>
                                                        <CustomReactTableLocal
                                                            columns={columns}
                                                            data={odPriorityList}
                                                            loading={false}
                                                            defaultPageSize={6}
                                                            showPagination={false}
                                                            isContainsAvField={true}
                                                        />
                                                    </CardBody>
                                                </Card>
                                            </Col>
                                        </Row>
                                    </CardBody>
                                </Collapse>
                            </Card>
                        </Col>
                    </Row>
                </AvForm>
            </div>
        );
    }
}

OdTypeAddEdit.propTypes = {
    closeAddOrEditPage: PropTypes.func.isRequired,
    parentState: PropTypes.object.isRequired
};

function mapStateToProps(state, ownProps) {
    const { odType, common } = state;
    return {
        response: { odType, common }
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(Object.assign({}, OdTypeActions, commonActions), dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(translate()(OdTypeAddEdit));
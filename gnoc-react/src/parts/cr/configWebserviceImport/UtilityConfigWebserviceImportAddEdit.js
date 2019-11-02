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
import * as UtilityConfigWebserviceImportActions from './UtilityConfigWebserviceImportActions';
import { CustomReactTableLocal, CustomAppSwitch, CustomSticky,CustomInputColumnDuplicate, CustomAvField, CustomSelectLocal } from "../../../containers/Utils";
import { invalidSubmitForm, validSubmitForm } from '../../../containers/Utils/Utils';

class UtilityConfigWebserviceImportAddEdit extends Component {
    constructor(props) {
        super(props);

        this.toggleFormAddEdit = this.toggleFormAddEdit.bind(this);
        this.handleValidSubmitAddOrEdit = this.handleValidSubmitAddOrEdit.bind(this);
        this.handleInvalidSubmitAddOrEdit = this.handleInvalidSubmitAddOrEdit.bind(this);
        this.typingTimeOut = 0;
        this.state = {
            btnAddOrEditLoading: false,
            collapseFormAddEdit: true,
            //AddOrEditModal
            isAddOrEdit: props.parentState.isAddOrEdit,
            selectedData: props.parentState.selectedData,
            //Table
            data: [],
            columns: this.buildTableColumns(),
            listWebserviceMethod: [],
            loading: false,
            disabled: false,
            addMore: 0,
            isEditable: true,
            selectValueActive: {},
            activeList:
                [
                    { itemId: 1, itemName: props.t("common:common.dropdown.status.active") },
                    { itemId: 0, itemName: props.t("common:common.dropdown.status.inActive") }
                ]
        };
    }
    componentDidMount() {
        if (this.state.isAddOrEdit === "COPY" || this.state.isAddOrEdit === "EDIT") {
            let tempList = (this.state.selectedData.webServiceMethodDTOS && this.state.isAddOrEdit === "COPY")
                ? this.state.selectedData.webServiceMethodDTOS.map((item, index) => ({ ...item, id: 'COPY-' + index, webServiceMethodId: null, webServiceId: null }))
                : (this.state.selectedData.webServiceMethodDTOS && this.state.isAddOrEdit === "EDIT") ? this.state.selectedData.webServiceMethodDTOS.map((item, index) => ({ ...item, id: 'EDIT-' + index })) : []
            this.setState({
                listWebserviceMethod: tempList,
                selectValueActive: { value: this.state.selectedData.isActive },
                selectValueStatus: { value: this.state.selectedData.isEditable },
                isEditable: this.state.selectedData.isEditable ? false : true,
            })
            if (this.state.isAddOrEdit === "EDIT" && this.state.selectedData.isEditable === 0) {
                this.setState({
                    disabled: true
                })
            }
        }
    }

    componentWillUnmount() {
        this.setState({
            isAddOrEdit: null,
            listWebserviceMethod: [],
            disabled: false
        });
    }

    buildTableColumns() {
        return [
            {
                Header: <Trans i18nKey="utilityConfigWebserviceImport:utilityConfigWebserviceImport.label.action" />,
                id: "action",
                sortable: false,
                fixed: "left",
                width: 120,
                accessor: d => {
                    let html = <div></div>;
                    html = <div className="text-center">
                        <span title={this.props.t("common:common.button.delete")} onClick={() => this.confirmDelete(d)} hidden={this.state.disabled}>
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
                Header: <div><Trans i18nKey="utilityConfigWebserviceImport:utilityConfigWebserviceImport.label.methodName" /></div>,
                id: "methodName",
                minWidth: 150,
                Cell: ({ original }) => {
                    return (
                        <CustomInputColumnDuplicate
                            placeholder={this.props.t("utilityConfigWebserviceImport:utilityConfigWebserviceImport.placeholder.methodName")}
                            handleOnChange={(e) => this.onChangeRow(e.target.value, original, 'methodName')}
                            isDisabled={this.state.disabled}
                            maxLength="200"
                            isRequired={true}
                            isPattern={false}
                            messageRequire={this.props.t("utilityConfigWebserviceImport:utilityConfigWebserviceImport.message.required.methodName")}
                            messageDuplicate={this.props.t("utilityConfigWebserviceImport:utilityConfigWebserviceImport.message.required.methodNameExisted")}
                            data={this.state.listWebserviceMethod}
                            dataRowOriginal={original}
                            rowName={"methodName"}
                            rowId={"id"}
                        />
                    )
                }
            },
            {
                Header: <div><Trans i18nKey="utilityConfigWebserviceImport:utilityConfigWebserviceImport.label.successReturnValue" /></div>,
                accessor: "sucessReturnValue",
                minWidth: 150,
                Cell: ({ original }) => {
                    const isOnchangeValue = this.state.listWebserviceMethod.find((ch) => ch.id === original.id);
                    return (
                        <CustomAvField 
                            placeholder={this.props.t("utilityConfigWebserviceImport:utilityConfigWebserviceImport.placeholder.successValue")}                            
                            type="text" 
                            name={"input-SuccessReturnValue " + original.id} value={(isOnchangeValue && isOnchangeValue.sucessReturnValue) ? isOnchangeValue.sucessReturnValue : ""}
                            isinputonly="true" onChange={(e) => this.onChangeRow(e.target.value, original, 'sucessReturnValue')}
                            maxLength="10"
                            required
                            validate={{
                                required: { value: true, errorMessage: this.props.t("utilityConfigWebserviceImport:utilityConfigWebserviceImport.message.required.successReturnValue") },
                                // max: { value: "10", errorMessage: this.props.t("utilityConfigWebserviceImport:utilityConfigWebserviceImport.message.required.maximumNumb") },
                                pattern: { value: "^[0-9]{1,10}$", errorMessage: this.props.t("utilityConfigWebserviceImport:utilityConfigWebserviceImport.message.required.numberRequired") }
                            }}
                            disabled={this.state.disabled}
                        />
                    )
                }
            },
            {
                Header: <div><Trans i18nKey="utilityConfigWebserviceImport:utilityConfigWebserviceImport.label.classPath" /></div>,
                accessor: "classPath",
                minWidth: 150,
                Cell: ({ original }) => {
                    const isOnchangeValue = this.state.listWebserviceMethod.find((ch) => ch.id === original.id);
                    return (
                    <CustomAvField 
                        placeholder={this.props.t("utilityConfigWebserviceImport:utilityConfigWebserviceImport.placeholder.classPath")} 
                        type="text" 
                        name={"input-classPath " + original.id} 
                        required
                        value={(isOnchangeValue && isOnchangeValue.classPath) ? isOnchangeValue.classPath : ""}
                        isinputonly="true" onChange={(e) => this.onChangeRow(e.target.value, original, 'classPath')}
                        validate={{ required: { value: true, errorMessage: this.props.t("utilityConfigWebserviceImport:utilityConfigWebserviceImport.message.required.classPath") } }}
                        maxLength="200"
                        disabled={this.state.disabled}
                    />
                    )
                }
            },
            {
                Header: <div><Trans i18nKey="utilityConfigWebserviceImport:utilityConfigWebserviceImport.label.isMerge" /></div>,
                sortable: false,
                minWidth: 50,
                className: 'text-center',
                accessor: "isMerge",
                Cell: ({ original }) => {
                    const isOnchangeValue = this.state.listWebserviceMethod.find((ch) => ch.id === original.id);
                    return <span><input type="checkbox" value={isOnchangeValue.isMerge || false} onClick={(e) => this.onChangeCheckbox(e.target.checked, original)} name={"input-checkbox" + original.id} defaultChecked={original.isMerge} disabled={this.state.disabled} /></span>
                }
            },
            {
                Header: <div><Trans i18nKey="utilityConfigWebserviceImport:utilityConfigWebserviceImport.label.returnValueField" /></div>,
                accessor: "returnValueField",
                Cell: ({ original }) => {
                    const isOnchangeValue = this.state.listWebserviceMethod.find((ch) => ch.id === original.id);
                    return (
                        <CustomAvField 
                            placeholder={this.props.t("utilityConfigWebserviceImport:utilityConfigWebserviceImport.placeholder.returnValueField")}                          
                            type="text" name={"input-returnValueField " + original.id} 
                            value={(isOnchangeValue && isOnchangeValue.returnValueField) ? isOnchangeValue.returnValueField : ""}
                            isinputonly="true" onChange={(e) => this.onChangeRow(e.target.value, original, 'returnValueField')}
                            maxLength="200"
                            disabled={this.state.disabled}
                    />
                    )
                }
            },
            {
                Header: <div><Trans i18nKey="utilityConfigWebserviceImport:utilityConfigWebserviceImport.label.idField" /></div>,
                accessor: "idField",
                Cell: ({ original }) => {
                    const isOnchangeValue = this.state.listWebserviceMethod.find((ch) => ch.id === original.id);
                    return (
                        <CustomAvField 
                            placeholder={this.props.t("utilityConfigWebserviceImport:utilityConfigWebserviceImport.placeholder.idField")}                          
                            type="text" 
                            name={"input-idField " + original.id} 
                            value={isOnchangeValue.idField}
                            isinputonly="true" onChange={(e) => this.onChangeRow(e.target.value, original, 'idField')}
                            maxLength="200"
                            disabled={this.state.disabled}
                    />
                    )
                }
            }
        ];
    }

    onChangeRow(newValue, object, fieldName) {
        if (this.typingTimeOut) {
            clearTimeout(this.typingTimeOut)
        }
        this.typingTimeOut = setTimeout(() => {
            const listWebserviceMethod = [...this.state.listWebserviceMethod];
            for (const obj of listWebserviceMethod) {
                if (obj.id === object.id) {
                    obj[fieldName] = newValue;
                    break;
                }
            }
            this.setState({
                listWebserviceMethod
            })
        }, 100)
    }

    onChangeCheckbox(newValue, object) {
        const listWebserviceMethod = [...this.state.listWebserviceMethod];
        for (const obj of listWebserviceMethod) {
            if (obj.id === object.id) {
                if (newValue) {
                    obj.isMerge = 1
                } else {
                    obj.isMerge = 0
                }
                break;
            }
        }
        this.setState({
            listWebserviceMethod
        });
    }

    onAddRow = () => {
        this.setState({
            listWebserviceMethod: [...this.state.listWebserviceMethod, { id: "Add-" + (this.state.addMore + 1), isMerge: 0 }],
            addMore: this.state.addMore + 1
        })
    }

    confirmDelete = (d) => {
        const listWebserviceMethod = [...this.state.listWebserviceMethod];
        const index = listWebserviceMethod.findIndex(item => item.id === d.id);
        listWebserviceMethod.splice(index, 1);
        this.setState({
            listWebserviceMethod
        });
    }

    handleValidSubmitAddOrEdit(event, values) {
        validSubmitForm(event, values, "idFormAddOrEdit");
        this.setState({
            btnAddOrEditLoading: true
        }, () => {
            const utilityConfigWebserviceImport = Object.assign({}, values);
            utilityConfigWebserviceImport.webServiceName = values.webServiceName ? values.webServiceName.trim() : "";
            utilityConfigWebserviceImport.url = values.url ? values.url.trim() : "";
            utilityConfigWebserviceImport.nameSpaceURI = values.nameSpaceURI ? values.nameSpaceURI.trim() : "";
            utilityConfigWebserviceImport.localPart = values.localPart ? values.localPart.trim() : "";
            utilityConfigWebserviceImport.webServiceClassPath = values.webServiceClassPath ? values.webServiceClassPath.trim() : "";
            utilityConfigWebserviceImport.getPortMethod = values.getPortMethod ? values.getPortMethod.trim() : "";
            utilityConfigWebserviceImport.userName = values.userName ? values.userName.trim() : "";
            utilityConfigWebserviceImport.password = values.password ? values.password.trim() : "";
            utilityConfigWebserviceImport.isEditable = this.state.isEditable ? 0 : 1;
            utilityConfigWebserviceImport.isActive = this.state.selectValueActive.value;
            utilityConfigWebserviceImport.webServiceMethodDTOS = this.state.listWebserviceMethod.map(i => ({
                ...i,
                idField: i.idField ? i.idField.trim() : "",
                methodName: i.methodName ? i.methodName.trim() : "",
                classPath: i.classPath ? i.classPath.trim() : "",
                returnValueField: i.returnValueField ? i.returnValueField.trim() : ""
            }));
            if (this.state.isAddOrEdit === "ADD" || this.state.isAddOrEdit === "COPY") {
                this.props.actions.addUtilityConfigWebserviceImport(utilityConfigWebserviceImport).then((response) => {
                    if (response.payload.data.key === "SUCCESS") {
                        this.setState({
                            btnAddOrEditLoading: false
                        }, () => {
                            this.props.closeAddOrEditPage(this.state.isAddOrEdit);
                            toastr.success(this.props.t("utilityConfigWebserviceImport:utilityConfigWebserviceImport.message.success.add"));
                        });
                    } else {
                        this.setState({
                            btnAddOrEditLoading: false
                        }, () => {
                            toastr.error(this.props.t("utilityConfigWebserviceImport:utilityConfigWebserviceImport.message.error.add"));
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
                            toastr.error(this.props.t("utilityConfigWebserviceImport:utilityConfigWebserviceImport.message.error.add"));
                        }
                    });
                });
            } else if (this.state.isAddOrEdit === "EDIT") {
                utilityConfigWebserviceImport.webServiceId = this.state.selectedData.webServiceId;
                utilityConfigWebserviceImport.webServiceMethodDTOS = this.state.listWebserviceMethod ? this.state.listWebserviceMethod.map(i => ({ ...i, webServiceId: this.state.selectedData.webServiceId })) : [];
                this.props.actions.editUtilityConfigWebserviceImport(utilityConfigWebserviceImport).then((response) => {
                    if (response.payload.data.key === "SUCCESS") {
                        this.setState({
                            btnAddOrEditLoading: false
                        }, () => {
                            this.props.closeAddOrEditPage(this.state.isAddOrEdit);
                            toastr.success(this.props.t("utilityConfigWebserviceImport:utilityConfigWebserviceImport.message.success.edit"));
                        });
                    } else {
                        this.setState({
                            btnAddOrEditLoading: false
                        }, () => {
                            toastr.error(this.props.t("utilityConfigWebserviceImport:utilityConfigWebserviceImport.message.error.edit"));
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
                            toastr.error(this.props.t("utilityConfigWebserviceImport:utilityConfigWebserviceImport.message.error.edit"));
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

    handleItemSelectChangeStatus(option) {
        this.setState({ selectValueStatus: option });
    }

    handleChangeIsEditable = (checked) => {
        this.setState({
            isEditable: checked
        })
    }

    handleItemSelectChangeActive = (option) => {
        this.setState({
            selectValueActive: option
        })
    }


    render() {
        const { t, response } = this.props;
        let objectAddOrEdit = (this.state.isAddOrEdit === "EDIT" || this.state.isAddOrEdit === "COPY") ? this.state.selectedData : {};
        if (this.state.isAddOrEdit === "EDIT" || this.state.isAddOrEdit === "COPY") {
            objectAddOrEdit.webServiceMethodDTOS = objectAddOrEdit.webServiceMethodDTOS.map(i => ({
                ...i,
                sucessReturnValue: i.sucessReturnValue ? i.sucessReturnValue + "" : ""
            }))
        }
        const { columns, loading, listWebserviceMethod, activeList, disabled } = this.state;
        return (
            <div className="animated fadeIn">
                <AvForm id="idFormAddOrEdit" onValidSubmit={this.handleValidSubmitAddOrEdit} onInvalidSubmit={this.handleInvalidSubmitAddOrEdit} model={objectAddOrEdit}>
                    <Row>
                        <Col xs="12">
                            <Card>
                                <CustomSticky>
                                    <CardHeader>
                                        <i className={(this.state.isAddOrEdit === "ADD" || this.state.isAddOrEdit === "COPY") ? "fa fa-plus-circle" : "fa fa-edit"}></i>{(this.state.isAddOrEdit === "ADD" || this.state.isAddOrEdit === "COPY") ? t("utilityConfigTempImport:utilityConfigTempImport.title.utilityConfigTempImportAdd") : this.state.isAddOrEdit === "EDIT" ? t("utilityConfigTempImport:utilityConfigTempImport.title.utilityConfigTempImportEdit") : ''}
                                        <div className="card-header-actions card-header-actions-button">
                                            <LaddaButton type="submit"
                                                hidden={(this.state.isAddOrEdit === "EDIT") ? ((this.state.selectedData && this.state.selectedData.isEditable === 1) ? false : true) : false}
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
                                                        <i className="fa fa-align-justify"></i>{t("utilityConfigWebserviceImport:utilityConfigWebserviceImport.title.utilityConfigWebserviceImportInfo")}
                                                    </CardHeader>
                                                    <CardBody>
                                                        <Row >
                                                            <Col xs="12" sm="6">
                                                                <CustomAvField maxLength="200" name="webServiceName" label={t("utilityConfigWebserviceImport:utilityConfigWebserviceImport.label.webserviceName")} placeholder={t("utilityConfigWebserviceImport:utilityConfigWebserviceImport.placeholder.webserviceName")} required
                                                                    disabled={disabled}
                                                                    autoFocus validate={{ required: { value: true, errorMessage: t("utilityConfigWebserviceImport:utilityConfigWebserviceImport.message.required.requiredWebserviceName") } }} />
                                                            </Col>
                                                            <Col xs="12" sm="6">
                                                                <CustomAvField maxLength="200" name="url" label={t("utilityConfigWebserviceImport:utilityConfigWebserviceImport.label.URL")} placeholder={t("utilityConfigWebserviceImport:utilityConfigWebserviceImport.placeholder.URL")} required
                                                                    disabled={disabled}
                                                                    validate={{ required: { value: true, errorMessage: t("utilityConfigWebserviceImport:utilityConfigWebserviceImport.message.required.requiredURL") } }} />
                                                            </Col>
                                                        </Row>
                                                        <Row >
                                                            <Col xs="12" sm="6">
                                                                <CustomAvField maxLength="200" name="nameSpaceURI" label={t("utilityConfigWebserviceImport:utilityConfigWebserviceImport.label.namespaceURI")} placeholder={t("utilityConfigWebserviceImport:utilityConfigWebserviceImport.placeholder.namespaceURI")} required
                                                                    disabled={disabled}
                                                                    validate={{ required: { value: true, errorMessage: t("utilityConfigWebserviceImport:utilityConfigWebserviceImport.message.required.requiredNamespaceURI") } }} />
                                                            </Col>
                                                            <Col xs="12" sm="6">
                                                                <CustomAvField maxLength="200" name="localPart" label={t("utilityConfigWebserviceImport:utilityConfigWebserviceImport.label.localPart")} placeholder={t("utilityConfigWebserviceImport:utilityConfigWebserviceImport.placeholder.localPart")} required
                                                                    disabled={disabled}
                                                                    validate={{ required: { value: true, errorMessage: t("utilityConfigWebserviceImport:utilityConfigWebserviceImport.message.required.requiredLocalPart") } }} />
                                                            </Col>
                                                        </Row>
                                                        <Row>
                                                            <Col xs="12" sm="6">
                                                                <CustomAvField maxLength="200" name="webServiceClassPath" label={t("utilityConfigWebserviceImport:utilityConfigWebserviceImport.label.wsClassPath")} placeholder={t("utilityConfigWebserviceImport:utilityConfigWebserviceImport.placeholder.wsClassPath")} required
                                                                    disabled={disabled}
                                                                    validate={{ required: { value: true, errorMessage: t("utilityConfigWebserviceImport:utilityConfigWebserviceImport.message.required.requiredWsClassPath") } }} />
                                                            </Col>
                                                            <Col xs="12" sm="6">
                                                                <CustomAvField maxLength="200" name="getPortMethod" label={t("utilityConfigWebserviceImport:utilityConfigWebserviceImport.label.getPortMethod")} placeholder={t("utilityConfigWebserviceImport:utilityConfigWebserviceImport.placeholder.getPortMethod")} required
                                                                    disabled={disabled}
                                                                    validate={{ required: { value: true, errorMessage: t("utilityConfigWebserviceImport:utilityConfigWebserviceImport.message.required.requiredGetPortMethod") } }} />
                                                            </Col>
                                                        </Row>
                                                        <Row >
                                                            <Col xs="12" sm="6">
                                                                <CustomAvField maxLength="200" name="userName" label={t("utilityConfigWebserviceImport:utilityConfigWebserviceImport.label.username")} placeholder={t("utilityConfigWebserviceImport:utilityConfigWebserviceImport.placeholder.username")}
                                                                    disabled={disabled}
                                                                />
                                                            </Col>
                                                            <Col xs="12" sm="6">
                                                                <CustomAvField maxLength="200" name="password" label={t("utilityConfigWebserviceImport:utilityConfigWebserviceImport.label.password")} placeholder={t("utilityConfigWebserviceImport:utilityConfigWebserviceImport.placeholder.password")}
                                                                    disabled={disabled}
                                                                />
                                                            </Col>
                                                        </Row>
                                                        <Row>
                                                            <Col xs="12" sm="6">
                                                                <CustomAppSwitch
                                                                    isDisabled={disabled}
                                                                    name={"isEditable"}
                                                                    label={t("utilityConfigWebserviceImport:utilityConfigWebserviceImport.label.isEditable")}
                                                                    checked={this.state.isEditable}
                                                                    handleChange={this.handleChangeIsEditable}
                                                                />
                                                            </Col>
                                                            <Col xs="12" sm="6">
                                                                <CustomSelectLocal
                                                                    isDisabled={disabled}
                                                                    name={"isActive"}
                                                                    label={t("common:common.label.status")}
                                                                    isRequired={true}
                                                                    messageRequire={t("common:common.message.required.status")}
                                                                    options={activeList}
                                                                    closeMenuOnSelect={true}
                                                                    handleItemSelectChange={this.handleItemSelectChangeActive}
                                                                    selectValue={this.state.selectValueActive}
                                                                />
                                                            </Col>
                                                        </Row>
                                                    </CardBody>
                                                </Card>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col xs="12" sm="12">
                                                <Card>
                                                    <CardBody>
                                                        <Row>
                                                            <Col xs="12" sm="12">
                                                                <Card>
                                                                    <CardHeader>
                                                                        <div style={{ float: 'left' }}>
                                                                            <span style={{ position: 'absolute' }} className="mt-1">
                                                                                {t("utilityConfigWebserviceImport:utilityConfigWebserviceImport.title.webserviceMethod")}
                                                                            </span>
                                                                        </div>
                                                                        <div className="card-header-actions card-header-search-actions-button">
                                                                            <Button type="button" className="custom-btn btn-pill mr-2" color="primary" onClick={this.onAddRow} title={t("odConfigScheduleCreate:odConfigScheduleCreate.button.additional")} disabled={disabled}><i className="fa fa-plus"></i></Button>

                                                                        </div>
                                                                    </CardHeader>
                                                                    <CustomReactTableLocal
                                                                        columns={columns}
                                                                        data={listWebserviceMethod}
                                                                        loading={loading}
                                                                        defaultPageSize={3}
                                                                        isContainsAvField={true}
                                                                    />
                                                                </Card>
                                                            </Col>

                                                        </Row>
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
            </div >
        );
    }
}

UtilityConfigWebserviceImportAddEdit.propTypes = {
    closeAddOrEditPage: PropTypes.func.isRequired,
    parentState: PropTypes.object.isRequired
};

function mapStateToProps(state, ownProps) {
    const { utilityConfigWebserviceImport, common } = state;
    return {
        response: { utilityConfigWebserviceImport, common }
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(Object.assign({}, UtilityConfigWebserviceImportActions, commonActions), dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(translate()(UtilityConfigWebserviceImportAddEdit));
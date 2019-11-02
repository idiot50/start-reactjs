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
import * as WoErrorCaseManagementActions from './WoErrorCaseManagementActions';
import { CustomReactTableLocal, CustomSelectLocal, CustomSticky, CustomAvField } from "../../../containers/Utils";
import { invalidSubmitForm, validSubmitForm } from '../../../containers/Utils/Utils';

class WoErrorCaseManagementAddEdit extends Component {
    constructor(props) {
        super(props);

        this.toggleFormAddEdit = this.toggleFormAddEdit.bind(this);
        this.handleValidSubmitAddOrEdit = this.handleValidSubmitAddOrEdit.bind(this);
        this.handleInvalidSubmitAddOrEdit = this.handleInvalidSubmitAddOrEdit.bind(this);
        this.buildTableColumns = this.buildTableColumns.bind(this);
        this.state = {
            btnAddOrEditLoading: false,
            collapseFormAddEdit: true,
            //AddOrEditModal
            isAddOrEdit: props.parentState.isAddOrEdit,
            selectedData: props.parentState.selectedData,
            testTable: {
                loading: false,
                columns: this.buildTableColumns(),
            },
            checkedTestList: [],
            //Select
            selectValueService: {},
            selectValueInfraType: {},
            serviceList: [],
            testList: [{ id: "Add-1", fileRequired: false }],
            listDelete: [],
            woTechList:[],
            id: 0,
            addMore: 1
        };
    }
    componentWillMount() {
        this.props.actions.getItemMaster("WO_TECHNOLOGY_CODE", "itemId", "itemName", "1", "3").then((response)=>{
            this.setState({
                woTechList: response.payload.data.data.map(i=>({...i,itemId: parseInt(i.itemValue)}))
            })
        });
    }
    componentDidMount() {
        //get combobox
        this.props.actions.getItemServiceMaster("serviceId", "serviceName", 1, 8).then((response) => {
            let listService = response.payload.data.data.map(i => ({ itemId: i.serviceId, itemName: i.serviceName }))
            this.setState({
                serviceList: listService,
            })
        })
        if (this.state.isAddOrEdit === "EDIT" || this.state.isAddOrEdit === "COPY") {
            this.setState({
                selectValueInfraType: this.state.selectedData.infraTypeID ? { value: this.state.selectedData.infraTypeID } : {},
                selectValueService: this.state.selectedData.serviceID ? { value: this.state.selectedData.serviceID } : {},
                testList: this.state.selectedData.cfgSupportCaseTestListDTO
            })
        }
    }

    componentWillUnmount() {
        this.setState({
            isAddOrEdit: null,
            testList: []
        });
    }

    buildTableColumns() {
        return [
            {
                Header: <Trans i18nKey="woErrorCaseManagement:woErrorCaseManagement.label.requirement" />,
                accessor: "requirement",
                sortable: false,
                minWidth: 500,
                Cell: ({ original }) => {
                    return <CustomAvField type="text" name={"input-" + original.id} onChange={(e) => this.onChange(e.target.value, original)} value={original.testCaseName || ""}
                        required maxLength="1000" isinputonly="true"
                        validate={{ required: { value: true, errorMessage: this.props.t("woErrorCaseManagement:woErrorCaseManagement.message.required.caseErrorName") } }}
                    />
                }
            },
            {
                Header: <Trans i18nKey="woErrorCaseManagement:woErrorCaseManagement.label.photograph" />,
                accessor: "photograph",
                className: "text-center",
                minWidth: 50,
                sortable: false,
                Cell: ({ original }) => {
                    return <span><input type="checkbox" value={original.fileRequired || false} onClick={(e) => this.onChangeCheckbox(e.target.checked, original)} name={"input-checkbox" + original.id} checked={original.fileRequired} /></span>
                }
            },
        ];
    }

    onChange = (values, d) => {
        const testList = [...this.state.testList];
        if (testList.some(item => item.id === d.id)) {
            const index = testList.findIndex(item => item.id === d.id);
            const dataTemp = testList.find(item => item.id === d.id) || {};
            testList.splice(index, 1, Object.assign(dataTemp, { testCaseName: values }));
        } else {
            testList.push({ id: d.id, testCaseName: values });
        }
        this.setState({
            testList
        });
    }

    onChangeCheckbox = (values, d) => {
        const testList = [...this.state.testList];
        if (testList.some(item => item.id === d.id)) {
            const index = testList.findIndex(item => item.id === d.id);
            const dataTemp = testList.find(item => item.id === d.id) || {};
            testList.splice(index, 1, Object.assign(dataTemp, { fileRequired: values }));
        } else {
            testList.push({ id: d.id, fileRequired: values });
        }
        this.setState({
            testList
        });
    }

    handleValidSubmitAddOrEdit(event, values) {
        validSubmitForm(event, values, "idFormAddOrEdit");
        this.setState({
            btnAddOrEditLoading: true
        }, () => {
            if (this.state.testList.length > 0) {
                for (const i of this.state.testList) {
                    if (i.fileRequired) {
                        i.fileRequired = 1
                    } else {
                        i.fileRequired = 0
                    }
                    if (typeof i.id === "string") {
                        delete i.id
                    }
                }

                const woErrorCaseManagement = Object.assign({}, values);
                woErrorCaseManagement.infraTypeID = (this.state.selectValueInfraType && this.state.selectValueInfraType.value) ? this.state.selectValueInfraType.value : "";
                woErrorCaseManagement.infraTypeName = this.state.selectValueInfraType ? this.state.selectValueInfraType.label : "";
                woErrorCaseManagement.serviceID = this.state.selectValueService.value || "";
                woErrorCaseManagement.serviceName = this.state.selectValueService.label || "";
                woErrorCaseManagement.cfgSupportCaseTestListDTO = this.state.testList.concat(this.state.listDelete)
                if (this.state.isAddOrEdit === "COPY") {
                    woErrorCaseManagement.id = "";
                }
                if (this.state.isAddOrEdit === "ADD" || this.state.isAddOrEdit === "COPY") {
                    this.props.actions.addWoErrorCaseManagement(woErrorCaseManagement).then((response) => {
                        if (response.payload.data.key === "SUCCESS") {
                            this.setState({
                                btnAddOrEditLoading: false
                            }, () => {
                                this.props.closeAddOrEditPage(this.state.isAddOrEdit);
                                toastr.success(this.props.t("woErrorCaseManagement:woErrorCaseManagement.message.success.add"));
                            });
                        } else if (response.payload.data.key === "DUPLICATE") {
                            this.setState({
                                btnAddOrEditLoading: false
                            }, () => {
                                toastr.warning(this.props.t("woErrorCaseManagement:woErrorCaseManagement.message.error.duplicate"))
                            })
                        }
                        else {
                            this.setState({
                                btnAddOrEditLoading: false
                            }, () => {
                                toastr.error(this.props.t("woErrorCaseManagement:woErrorCaseManagement.message.error.add"));
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
                                toastr.error(this.props.t("woErrorCaseManagement:woErrorCaseManagement.message.error.add"));
                            }
                        });
                    });
                } else if (this.state.isAddOrEdit === "EDIT") {
                    woErrorCaseManagement.id = this.state.selectedData.id;
                    this.props.actions.editWoErrorCaseManagement(woErrorCaseManagement).then((response) => {
                        if (response.payload.data.key === "SUCCESS") {
                            this.setState({
                                btnAddOrEditLoading: false
                            }, () => {
                                this.props.closeAddOrEditPage(this.state.isAddOrEdit);
                                toastr.success(this.props.t("woErrorCaseManagement:woErrorCaseManagement.message.success.edit"));
                            });
                        } else if (response.payload.data.key === "DUPLICATE") {
                            this.setState({
                                btnAddOrEditLoading: false
                            }, () => {
                                toastr.warning(this.props.t("woErrorCaseManagement:woErrorCaseManagement.message.error.duplicate"))
                            })
                        }
                        else {
                            this.setState({
                                btnAddOrEditLoading: false
                            }, () => {
                                toastr.error(this.props.t("woErrorCaseManagement:woErrorCaseManagement.message.error.edit"));
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
                                toastr.error(this.props.t("woErrorCaseManagement:woErrorCaseManagement.message.error.edit"));
                            }
                        });
                    });
                }
            } else {
                this.setState({
                    btnAddOrEditLoading: false
                }, () => {
                    toastr.warning(this.props.t("woErrorCaseManagement:woErrorCaseManagement.message.requiredTestList"))
                })
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

    handleItemSelectChangeService = (option) => {
        this.setState({ selectValueService: option });
    }

    handleItemSelectChangeInfraType = (option) => {
        this.setState({ selectValueInfraType: option });
    }

    handleDataCheckboxTestList = (data) => {
        this.setState({
            checkedTestList: data
        })
    }

    onAddRow = () => {
        this.setState({
            testList: [...this.state.testList, { id: "Add-" + (this.state.addMore + 1), fileRequired: false }],
            addMore: this.state.addMore + 1
        })
    }

    clearTestList = (dataChecked) => {
        if (dataChecked.length < 1) {
            toastr.warning(this.props.t("common:common.message.error.removeSelect"));
        }
        let listTemp = [...this.state.testList];
        let listDelete = [];
        dataChecked.forEach(element => {
            listTemp = listTemp.filter(el => el.id !== element.id);
            if (typeof element.id === "number") {
                element.isDelete = 1
                listDelete.push(element)
            }
        });
        this.setState({
            listDelete,
            testList: listTemp,
            checkedTestList: []
        });
    }

    render() {
        const { t, response } = this.props;
        const { testTable, testList, checkedTestList, woTechList, serviceList } = this.state;
        let objectAddOrEdit = (this.state.isAddOrEdit === "EDIT" || this.state.isAddOrEdit === "COPY") ? this.state.selectedData : {};
        return (
            <div className="animated fadeIn">
                <AvForm id="idFormAddOrEdit" onValidSubmit={this.handleValidSubmitAddOrEdit} onInvalidSubmit={this.handleInvalidSubmitAddOrEdit} model={objectAddOrEdit}>
                    <Row>
                        <Col xs="12">
                            <Card>
                                <CustomSticky>
                                    <CardHeader>
                                        <i className={(this.state.isAddOrEdit === "ADD" || this.state.isAddOrEdit === "COPY") ? "fa fa-plus-circle" : "fa fa-edit"}></i>{(this.state.isAddOrEdit === "ADD" || this.state.isAddOrEdit === "COPY") ? t("woErrorCaseManagement:woErrorCaseManagement.title.woErrorCaseManagementAdd") : this.state.isAddOrEdit === "EDIT" ? t("woErrorCaseManagement:woErrorCaseManagement.title.woErrorCaseManagementEdit") : ''}
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
                                                <Row>
                                                    <Col xs="12" sm="4">
                                                        <CustomAvField name="caseName" label={t("woErrorCaseManagement:woErrorCaseManagement.label.caseErrorName")} placeholder={t("woErrorCaseManagement:woErrorCaseManagement.placeholder.caseErrorName")} required
                                                            autoFocus maxLength="1000" validate={{ required: { value: true, errorMessage: t("woErrorCaseManagement:woErrorCaseManagement.message.required.caseErrorName") } }} />
                                                    </Col>
                                                    <Col xs="12" sm="4">
                                                        <CustomSelectLocal
                                                            name={"service"}
                                                            label={t("woErrorCaseManagement:woErrorCaseManagement.label.service")}
                                                            isRequired={true}
                                                            messageRequire={t("woErrorCaseManagement:woErrorCaseManagement.message.required.service")}
                                                            options={serviceList}
                                                            closeMenuOnSelect={true}
                                                            handleItemSelectChange={this.handleItemSelectChangeService}
                                                            selectValue={this.state.selectValueService}
                                                            autoFocus={false}
                                                        />
                                                    </Col>
                                                    <Col xs="12" sm="4">
                                                        <CustomSelectLocal
                                                            name={"technology"}
                                                            label={t("woErrorCaseManagement:woErrorCaseManagement.label.technology")}
                                                            isRequired={true}
                                                            messageRequire={t("woErrorCaseManagement:woErrorCaseManagement.message.required.technology")}
                                                            options={woTechList}
                                                            closeMenuOnSelect={true}
                                                            handleItemSelectChange={this.handleItemSelectChangeInfraType}
                                                            selectValue={this.state.selectValueInfraType}
                                                            autoFocus={false}
                                                        />
                                                    </Col>
                                                </Row>
                                                <Card>
                                                    <CardHeader>
                                                        <div style={{ float: 'left' }}>
                                                            <span style={{ position: 'absolute' }} className="mt-1">
                                                                {t("woErrorCaseManagement:woErrorCaseManagement.label.testList")}
                                                            </span>
                                                        </div>
                                                        <div className="card-header-actions card-header-search-actions-button">
                                                            <Button type="button" className="custom-btn btn-pill mr-2" color="primary" onClick={() => this.onAddRow()} title={this.props.t("woErrorCaseManagement:woErrorCaseManagement.button.additional")}><i className="fa fa-plus"></i></Button>
                                                            <Button type="button" className="custom-btn btn-pill" color="secondary" onClick={() => this.clearTestList(checkedTestList)} title={this.props.t("woErrorCaseManagement:woErrorCaseManagement.button.remove")}><i className="fa fa-close"></i></Button>
                                                        </div>
                                                    </CardHeader>
                                                    <CardBody>
                                                        <Row>
                                                            <Col xs="12" sm="12">
                                                                <CustomReactTableLocal
                                                                    columns={testTable.columns}
                                                                    data={testList}
                                                                    isCheckbox={true}
                                                                    loading={testTable.loading}
                                                                    propsCheckbox={["id", "fileRequired"]}
                                                                    defaultPageSize={3}
                                                                    handleDataCheckbox={this.handleDataCheckboxTestList}
                                                                />
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
            </div>
        );
    }
}

WoErrorCaseManagementAddEdit.propTypes = {
    closeAddOrEditPage: PropTypes.func.isRequired,
    parentState: PropTypes.object.isRequired
};

function mapStateToProps(state, ownProps) {
    const { woErrorCaseManagement, common } = state;
    return {
        response: { woErrorCaseManagement, common }
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(Object.assign({}, WoErrorCaseManagementActions, commonActions), dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(translate()(WoErrorCaseManagementAddEdit));
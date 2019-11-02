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
import * as UtilityConfigEmployeeDayOffActions from './UtilityConfigEmployeeDayOffActions';
import { CustomReactTableLocal, CustomSelectLocal, CustomSticky, CustomAvField, CustomDatePicker, CustomAutocomplete } from "../../../containers/Utils";
import { invalidSubmitForm, validSubmitForm, convertDateToDDMMYYYYHHMISS } from '../../../containers/Utils/Utils';

class UtilityConfigEmployeeDayOffAddEdit extends Component {
    constructor(props) {
        super(props);

        this.toggleFormAddEdit = this.toggleFormAddEdit.bind(this);
        this.handleValidSubmitAddOrEdit = this.handleValidSubmitAddOrEdit.bind(this);
        this.handleInvalidSubmitAddOrEdit = this.handleInvalidSubmitAddOrEdit.bind(this);
        this.handleItemSelectChangeVacation = this.handleItemSelectChangeVacation.bind(this);
        this.handleItemSelectChangeHandleEmployee = this.handleItemSelectChangeHandleEmployee.bind(this);
        this.handleOnChangeDayOff = this.handleOnChangeDayOff.bind(this);
        this.onAddRecord = this.onAddRecord.bind(this);
        this.confirmDelete = this.confirmDelete.bind(this);

        this.state = {
            btnAddOrEditLoading: false,
            collapseFormAddEdit: true,
            btnAddRecord: false,
            //AddOrEditModal
            isAddOrEdit: props.parentState.isAddOrEdit,
            selectedData: props.parentState.selectedData,
            disable: false,
            //Table
            data: [],
            columns: this.buildTableColumns(),
            //Select
            selectValueVacation: {},
            selectValueEmployeeName: {},
            selectValueDayOff: {},
            addMore: 0
        };
    }

    componentDidMount() {
        if (this.state.isAddOrEdit === "ADD") {
            this.onAddRecord()
        }
        if (this.state.isAddOrEdit === "EDIT" || this.state.isAddOrEdit === "COPY") {
            this.setState({
                data:
                    [{
                        id: "Edit-" + this.state.selectedData.empId,
                        employeeSelect: (this.state.selectedData.empId && this.state.selectedData.empUsername && this.state.selectedData.empUnit)
                            ? { value: this.state.selectedData.empId, label: this.state.selectedData.empUsername, parentValue: this.state.selectedData.empUnit } : {},
                        dayOffSelect: this.state.selectedData.dayOff ? new Date(this.state.selectedData.dayOff) : new Date(),
                        vacationSelect: this.state.selectedData.vacation ? { value: this.state.selectedData.vacation } : {}
                    }]
            })
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
                Header: <Trans i18nKey="utilityConfigEmployeeDayOff:utilityConfigEmployeeDayOff.label.action" />,
                id: "action",
                sortable: false,
                fixed: "left",
                width: 120,
                accessor: d => {
                    let html = <div></div>;
                    html = <div className="text-center">
                        <span title={this.props.t("common:common.button.delete")} onClick={() => this.confirmDelete(d)}>
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
                Header: <div><Trans i18nKey="utilityConfigEmployeeDayOff:utilityConfigEmployeeDayOff.label.employeeName" /><span className="text-danger">{" (*)"}</span></div>,
                id: "employeeName",
                Cell: ({ original }) => {
                    const data = this.state.data.find(item => item.id === original.id);
                    return (
                        <CustomAutocomplete
                            name={"employeeName" + original.id.split("-")[0] + original.id.split("-")[1]}
                            label={""}
                            placeholder={this.props.t("utilityConfigEmployeeDayOff:utilityConfigEmployeeDayOff.placeholder.employeeName")}
                            isRequired={true}
                            messageRequire={this.props.t("utilityConfigEmployeeDayOff:utilityConfigEmployeeDayOff.message.requiredEmployeeName")}
                            closeMenuOnSelect={true}
                            handleItemSelectChange={(option) => this.handleItemSelectChangeHandleEmployee(option, original)}
                            selectValue={data.employeeSelect || {}}
                            moduleName={"USERS"}
                            isDisabled={this.state.disable}
                            isOnlyInputSelect={true}
                            isHasChildren={true}
                        />
                    )
                }
            },
            {
                Header: <div><Trans i18nKey="utilityConfigEmployeeDayOff:utilityConfigEmployeeDayOff.label.dayOff" /><span className="text-danger">{" (*)"}</span></div>,
                id: "dayOff",
                Cell: ({ original }) => {
                    const data = this.state.data.find(item => item.id === original.id);
                    return (
                        <CustomDatePicker
                            name={"dayOff" + original.id.split("-")[0] + original.id.split("-")[1]}
                            label={""}
                            isRequired={true}
                            messageRequire={this.props.t("utilityConfigEmployeeDayOff:utilityConfigEmployeeDayOff.message.requiredDayOff")}
                            handleOnChange={(option) => this.handleOnChangeDayOff(option, original)}
                            dateFormat="dd/MM/yyyy"
                            selected={data.dayOffSelect}
                            placeholder={this.props.t("utilityConfigEmployeeDayOff:utilityConfigEmployeeDayOff.placeholder.dayOff")}
                            isOnlyInputSelect={true}
                            showTimeSelect={false}
                        />
                    )
                }
            },
            {
                Header: <div><Trans i18nKey="utilityConfigEmployeeDayOff:utilityConfigEmployeeDayOff.label.vacation" /><span className="text-danger">{" (*)"}</span></div>,
                id: "vacation",
                Cell: ({ original }) => {
                    const data = this.state.data.find(item => item.id === original.id);
                    return (
                        <CustomSelectLocal
                            name={"vaction" + original.id.split("-")[0] + original.id.split("-")[1]}
                            label={""}
                            isRequired={true}
                            messageRequire={this.props.t("utilityConfigEmployeeDayOff:utilityConfigEmployeeDayOff.message.requiredVacation")}
                            options={[
                                { itemId: 'MOR', itemName: this.props.t("utilityConfigEmployeeDayOff:utilityConfigEmployeeDayOff.dropdown.vacation.mor") },
                                { itemId: 'AFT', itemName: this.props.t("utilityConfigEmployeeDayOff:utilityConfigEmployeeDayOff.dropdown.vacation.aft") },
                                { itemId: 'FULL', itemName: this.props.t("utilityConfigEmployeeDayOff:utilityConfigEmployeeDayOff.dropdown.vacation.full") }
                            ]}
                            closeMenuOnSelect={true}
                            handleItemSelectChange={(option) => this.handleItemSelectChangeVacation(option, original)}
                            selectValue={data.vacationSelect || {}}
                            isOnlyInputSelect={true}
                        />
                    )
                }
            }
        ];
    }

    handleValidSubmitAddOrEdit(event, values) {
        validSubmitForm(event, values, "idFormAddOrEdit");
        this.setState({
            btnAddOrEditLoading: true
        }, () => {
            if (this.state.isAddOrEdit === "ADD" || this.state.isAddOrEdit === "COPY") {
                let utilityConfigEmployeeDayOff = [];
                utilityConfigEmployeeDayOff = this.state.data.map(i => ({
                    empId: i.employeeSelect.value,
                    empUnit: parseInt(i.employeeSelect.parentValue),
                    empUsername: i.employeeSelect.label ? i.employeeSelect.label : "",
                    dayOff: i.dayOffSelect,
                    vacation: i.vacationSelect.value
                }))
                this.props.actions.addUtilityConfigEmployeeDayOff(utilityConfigEmployeeDayOff).then((response) => {
                    this.setState({
                        btnAddOrEditLoading: false
                    }, () => {
                        if (response.payload.data.key === "SUCCESS") {
                            this.props.closeAddOrEditPage("ADD");
                            toastr.success(this.props.t("utilityConfigEmployeeDayOff:utilityConfigEmployeeDayOff.message.success.add"));
                        } else if (response.payload.data.key === "ERROR") {
                            toastr.error(response.payload.data.message);
                        } else  if (response.payload.data.key === "DUPLICATE"){
                            toastr.error(response.payload.data.message);
                        }
                    });
                }).catch((response) => {
                    this.setState({
                        btnAddOrEditLoading: false
                    }, () => {
                        try {
                            toastr.error(response.error.response.data.errors[0].defaultMessage);
                        } catch (error) {
                            console.error(error);
                            toastr.error(this.props.t("utilityConfigEmployeeDayOff:utilityConfigEmployeeDayOff.message.error.add"));
                        }
                    });
                });
            } else if (this.state.isAddOrEdit === "EDIT") {
                debugger
                const utilityConfigEmployeeDayOffEdit = {}
                utilityConfigEmployeeDayOffEdit.idDayOff = parseInt(this.state.selectedData.idDayOff);
                utilityConfigEmployeeDayOffEdit.empId = this.state.data[0].employeeSelect.value;
                utilityConfigEmployeeDayOffEdit.empUnit = parseInt(this.state.data[0].employeeSelect.parentValue);
                utilityConfigEmployeeDayOffEdit.empUsername = (this.state.data[0].employeeSelect.label) ? this.state.data[0].employeeSelect.label : this.state.selectedData.empUsername;
                utilityConfigEmployeeDayOffEdit.dayOff = this.state.data[0].dayOffSelect;
                utilityConfigEmployeeDayOffEdit.vacation = this.state.data[0].vacationSelect.value || "";
                this.props.actions.editUtilityConfigEmployeeDayOff(utilityConfigEmployeeDayOffEdit).then((response) => {
                    this.setState({
                        btnAddOrEditLoading: false
                    }, () => {
                        if (response.payload.data.key === "SUCCESS") {
                            this.props.closeAddOrEditPage("EDIT");
                            toastr.success(this.props.t("utilityConfigEmployeeDayOff:utilityConfigEmployeeDayOff.message.success.edit"));
                        } else if (response.payload.data.key === "ERROR") {
                            toastr.error(response.payload.data.message);
                        } else  if (response.payload.data.key === "DUPLICATE"){
                            toastr.error(response.payload.data.message);
                        }
                    });
                }).catch((response) => {
                    this.setState({
                        btnAddOrEditLoading: false
                    }, () => {
                        try {
                            toastr.error(response.error.response.data.errors[0].defaultMessage);
                        } catch (error) {
                            console.error(error);
                            toastr.error(this.props.t("utilityConfigEmployeeDayOff:utilityConfigEmployeeDayOff.message.error.edit"));
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

    handleItemSelectChangeVacation(option, d) {
        const data = [...this.state.data];
        if (data.some(item => item.id === d.id)) {
            const index = data.findIndex(item => item.id === d.id);
            const dataTemp = data.find(item => item.id === d.id) || {};
            data.splice(index, 1, Object.assign(dataTemp, { vacationSelect: option }));
        } else {
            data.push({ id: d.id, vacationSelect: option });
        }
        this.setState({
            data
        });
    }

    handleOnChangeDayOff(option, d) {
        const data = [...this.state.data];
        if (data.some(item => item.id === d.id)) {
            const index = data.findIndex(item => item.id === d.id);
            const dataTemp = data.find(item => item.id === d.id) || {};
            data.splice(index, 1, Object.assign(dataTemp, { dayOffSelect: option }));
        } else {
            data.push({ id: d.id, dayOffSelect: option });
        }
        this.setState({
            data
        });
    }

    handleItemSelectChangeHandleEmployee(option, d) {
        const data = [...this.state.data];
        if (data.some(item => item.id === d.id)) {
            const index = data.findIndex(item => item.id === d.id);
            const dataTemp = data.find(item => item.id === d.id) || {};
            data.splice(index, 1, Object.assign(dataTemp, { employeeSelect: option }));
        } else {
            data.push({ id: d.id, employeeSelect: option });
        }
        this.setState({
            data
        });
    }

    confirmDelete = (d) => {
        const data = [...this.state.data];
        const index = data.findIndex(item => item.id === d.id);
        data.splice(index, 1);
        this.setState({
            data
        });
    }

    onAddRecord = () => {
        this.setState({
            data: [...this.state.data, { id: "Add-" + (this.state.addMore + 1) }],
            addMore: this.state.addMore + 1
        })
    }

    render() {
        const { t } = this.props;
        const { data } = this.state;
        let objectAddOrEdit = (this.state.isAddOrEdit === "EDIT" || this.state.isAddOrEdit === "COPY") ? this.state.selectedData : {};
        const { isAddOrEdit, columns } = this.state;
        return (
            <div className="animated fadeIn">
                <AvForm id="idFormAddOrEdit" onValidSubmit={this.handleValidSubmitAddOrEdit} onInvalidSubmit={this.handleInvalidSubmitAddOrEdit} model={objectAddOrEdit}>
                    <Row>
                        <Col xs="12">
                            <Card>
                                <CustomSticky>
                                    <CardHeader>
                                        <i className={(this.state.isAddOrEdit === "ADD" || this.state.isAddOrEdit === "COPY") ? "fa fa-plus-circle" : "fa fa-edit"}></i>{(this.state.isAddOrEdit === "ADD" || this.state.isAddOrEdit === "COPY") ? t("utilityConfigEmployeeDayOff:utilityConfigEmployeeDayOff.title.utilityConfigEmployeeDayOffAdd") : this.state.isAddOrEdit === "EDIT" ? t("utilityConfigEmployeeDayOff:utilityConfigEmployeeDayOff.title.utilityConfigEmployeeDayOffEdit") : ''}
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
                                                        <i className="fa fa-align-justify"></i>{this.props.t("utilityConfigEmployeeDayOff:utilityConfigEmployeeDayOff.title.utilityConfigEmployeeDayOffAdd")}
                                                        <div className="card-header-actions card-header-search-actions-button">
                                                            <Button type="button" className="custom-btn btn-pill mr-2" color="primary" onClick={this.onAddRecord} title={t("utilityConfigEmployeeDayOff:utilityConfigEmployeeDayOff.button.add")} hidden={isAddOrEdit === "EDIT"}><i className="fa fa-plus"></i></Button>
                                                        </div>
                                                    </CardHeader>
                                                    <CardBody>
                                                        <Row>
                                                            <Col xs="12" sm="12">
                                                                <Card>
                                                                    <CustomReactTableLocal
                                                                        columns={columns}
                                                                        data={data}
                                                                        loading={false}
                                                                        defaultPageSize={isAddOrEdit === "EDIT" ? 1 : 6}
                                                                        showPagination={!isAddOrEdit === "EDIT"}
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
            </div>
        );
    }
}

UtilityConfigEmployeeDayOffAddEdit.propTypes = {
    closeAddOrEditPage: PropTypes.func.isRequired,
    parentState: PropTypes.object.isRequired
};

function mapStateToProps(state, ownProps) {
    const { utilityConfigEmployeeDayOff, common } = state;
    return {
        response: { utilityConfigEmployeeDayOff, common }
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(Object.assign({}, UtilityConfigEmployeeDayOffActions, commonActions), dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(translate()(UtilityConfigEmployeeDayOffAddEdit));
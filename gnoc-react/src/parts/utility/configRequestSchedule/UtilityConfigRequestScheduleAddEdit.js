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
import * as UtilityConfigRequestScheduleActions from './UtilityConfigRequestScheduleActions';
import { CustomReactTableLocal, CustomSelectLocal, CustomSticky, CustomAvField, CustomAppSwitch, CustomAutocomplete, CustomDatePicker } from "../../../containers/Utils";
import { invalidSubmitForm, validSubmitForm } from '../../../containers/Utils/Utils';
import { convertDateToDDMMYYYYHHMISS, selectWeekListUtils } from '../../../containers/Utils/Utils';



class UtilityConfigRequestScheduleAddEdit extends Component {
    constructor(props) {
        super(props);

        this.toggleFormAddEdit = this.toggleFormAddEdit.bind(this);
        this.handleValidSubmitAddOrEdit = this.handleValidSubmitAddOrEdit.bind(this);
        this.handleInvalidSubmitAddOrEdit = this.handleInvalidSubmitAddOrEdit.bind(this);
        this.handleItemSelectChangeMonth = this.handleItemSelectChangeMonth.bind(this);
        this.handleItemSelectChangeYear = this.handleItemSelectChangeYear.bind(this);
        this.handleOnChangeUnit = this.handleOnChangeUnit.bind(this);
        this.handleItemSelectChangeType = this.handleItemSelectChangeType.bind(this);
        this.handleItemSelectChangeWeek = this.handleItemSelectChangeWeek.bind(this);
        this.handleOnChangePdfDay = this.handleOnChangePdfDay.bind(this);
        this.getListCRAndEmployee = this.getListCRAndEmployee.bind(this);
        this.state = {
            btnAddOrEditLoading: false,
            collapseFormAddEdit: true,
            //AddOrEditModal
            isAddOrEdit: props.parentState.isAddOrEdit,
            selectedData: props.parentState.selectedData || {},
            //Table
            data: [],
            listOfCRColumns: this.buildListOfCRColumns(),
            listOfEmployeeColumns: this.buildListOfEmployeeColumns(),
            //Select
            statusListSelect: [
                { itemId: 1, itemName: props.t("utilityConfigRequestSchedule:utilityConfigRequestSchedule.dropdown.status.active") },
                { itemId: 0, itemName: props.t("utilityConfigRequestSchedule:utilityConfigRequestSchedule.dropdown.status.inActive") }
            ],
            selectTypeList: [
                { itemId: 0, itemName: props.t("utilityConfigRequestSchedule:utilityConfigRequestSchedule.dropdown.type.month") },
                { itemId: 1, itemName: props.t("utilityConfigRequestSchedule:utilityConfigRequestSchedule.dropdown.type.week") },
                { itemId: 2, itemName: props.t("utilityConfigRequestSchedule:utilityConfigRequestSchedule.dropdown.type.day") }
            ],
            selectMonthList: [
                { itemId: 1, itemName: props.t("utilityConfigRequestSchedule:utilityConfigRequestSchedule.dropdown.month.1") },
                { itemId: 2, itemName: props.t("utilityConfigRequestSchedule:utilityConfigRequestSchedule.dropdown.month.2") },
                { itemId: 3, itemName: props.t("utilityConfigRequestSchedule:utilityConfigRequestSchedule.dropdown.month.3") },
                { itemId: 4, itemName: props.t("utilityConfigRequestSchedule:utilityConfigRequestSchedule.dropdown.month.4") },
                { itemId: 5, itemName: props.t("utilityConfigRequestSchedule:utilityConfigRequestSchedule.dropdown.month.5") },
                { itemId: 6, itemName: props.t("utilityConfigRequestSchedule:utilityConfigRequestSchedule.dropdown.month.6") },
                { itemId: 7, itemName: props.t("utilityConfigRequestSchedule:utilityConfigRequestSchedule.dropdown.month.7") },
                { itemId: 8, itemName: props.t("utilityConfigRequestSchedule:utilityConfigRequestSchedule.dropdown.month.8") },
                { itemId: 9, itemName: props.t("utilityConfigRequestSchedule:utilityConfigRequestSchedule.dropdown.month.9") },
                { itemId: 10, itemName: props.t("utilityConfigRequestSchedule:utilityConfigRequestSchedule.dropdown.month.10") },
                { itemId: 11, itemName: props.t("utilityConfigRequestSchedule:utilityConfigRequestSchedule.dropdown.month.11") },
                { itemId: 12, itemName: props.t("utilityConfigRequestSchedule:utilityConfigRequestSchedule.dropdown.month.12") }
            ],
            selectWeekList: selectWeekListUtils,
            selectYearList: [],
            selectValueStatus: {},
            selectWeek: {},
            selectYear: {},
            selectMonth: {},
            selectUnit: {},
            selectType: {},
            complicateWork: false,
            sameNode: false,
            sameService: false,
            sameNodeShift: false,
            sameServiceShift: false,
            pdfDay: null,
            selectEmployeeList: [],
            selectCRBeforeList: [],
            isGet: 0,
            isGetCrBefore: 0,
            scheduleEmployeeDTOS: [],
            scheduleCRFormDTOS: [],
            btnLoading: false
        };
    }

    componentDidMount() {
        this.props.actions.getListYear({ page: 1, pageSize: 10 }).then((response) => {
            const list = response.payload.data.data.map(i => { return { itemId: i.itemValue, itemName: i.itemName } })
            this.setState({ selectYearList: list })
        });
        if (this.state.isAddOrEdit === 'EDIT' || this.state.isAddOrEdit === 'COPY') {
            this.setState({
                selectWeek: this.state.selectedData.week ? { value: this.state.selectedData.week } : {},
                selectMonth: this.state.selectedData.month ? { value: parseInt(this.state.selectedData.month, 10) } : {},
                selectYear: this.state.selectedData.year ? { value: this.state.selectedData.year } : {},
                selectUnit: this.state.selectedData.unitId ? { value: this.state.selectedData.unitId } : {},
                selectType: this.state.selectedData.type ? { value: this.state.selectedData.type } : {},
                pdfDay: new Date(this.state.selectedData.startDate),
                complicateWork: this.state.selectedData.complicateWork,
                sameNodeShift: this.state.selectedData.sameNodeShift,
                sameServiceShift: this.state.selectedData.sameServiceShift,
                sameNode: this.state.selectedData.sameNode,
                sameService: this.state.selectedData.sameService
            })
        } else if (this.state.isAddOrEdit === 'ADD') {
            this.setState({
                selectType: { value: 0 },
                selectedData: null
            })
        }
    }

    componentWillUnmount() {
        this.setState({
            isAddOrEdit: null
        });
    }

    buildListOfCRColumns() {
        return [
            {
                Header: <Trans i18nKey="utilityConfigRequestSchedule:utilityConfigRequestSchedule.label.fixedDay" />,
                accessor: "fixedDay",
                className: 'text-center',
                Cell: ({ original }) => {
                    return (
                        <span>
                            <input
                                type="checkbox"
                                value={original.fixedDay || false}
                                onClick={(e) => this.onChangeCheckbox(e.target.checked, original)}
                                name={"input-checkbox" + original.idCr} checked={original.fixedDay} />
                        </span>
                    )
                }

            },
            {
                Header: <Trans i18nKey="utilityConfigRequestSchedule:utilityConfigRequestSchedule.label.codeCR" />,
                accessor: "codeCR",
                Cell: ({ original }) => {
                    return original.codeCR ? <span title={original.codeCR}>{original.codeCR}</span> : <span>&nbsp;</span>
                }

            },
            {
                Header: <Trans i18nKey="utilityConfigRequestSchedule:utilityConfigRequestSchedule.label.array" />,
                accessor: "array",
                Cell: ({ original }) => {
                    return original.array ? <span title={original.array}>{original.array}</span> : <span>&nbsp;</span>
                }
            },
            {
                Header: <Trans i18nKey="utilityConfigRequestSchedule:utilityConfigRequestSchedule.label.arrayChild" />,
                accessor: "arrayChild",
                Cell: ({ original }) => {
                    return original.arrayChild ? <span title={original.arrayChild}>{original.arrayChild}</span> : <span>&nbsp;</span>
                }
            },
            {
                Header: <Trans i18nKey="utilityConfigRequestSchedule:utilityConfigRequestSchedule.label.startDate" />,
                accessor: "startDate",
                width: 150,
                Cell: ({ original }) => {
                    return (
                        <CustomDatePicker
                            readOnly={!original.fixedDay}
                            name={"input-StartDate" + original.idCr}
                            label={""}
                            isRequired={original.fixedDay ? true : false}
                            handleOnChange={(e) => this.onChangeRow(e, original, 'startDate')}
                            dateFormat="dd-MM-yyyy"
                            showTimeSelect={false}
                            selected={(original && original.startDate) ? new Date(original.startDate) : null}
                            placeholder={this.props.t("utilityConfigRequestSchedule:utilityConfigRequestSchedule.placeholder.createFrom")}
                            isOnlyInputSelect={true}
                        />
                    )
                }
            },
            {
                Header: <Trans i18nKey="utilityConfigRequestSchedule:utilityConfigRequestSchedule.label.endDate" />,
                accessor: "endDate",
                width: 150,
                Cell: ({ original }) => {
                    return (
                        <CustomDatePicker
                            readOnly={!original.fixedDay}
                            name={"input-EndDate" + original.idCr}
                            label={""}
                            isRequired={false}
                            handleOnChange={(e) => this.onChangeRow(e, original, 'endDate')}
                            dateFormat="dd-MM-yyyy"
                            showTimeSelect={false}
                            selected={(original && original.endDate) ? new Date(original.endDate) : null}
                            placeholder={this.props.t("utilityConfigRequestSchedule:utilityConfigRequestSchedule.placeholder.createTo")}
                            isOnlyInputSelect={true}
                        />
                    )
                }
            },
            {
                Header: <Trans i18nKey="utilityConfigRequestSchedule:utilityConfigRequestSchedule.label.forbiddenDate" />,
                accessor: "forbiddenDate",
                width: 250,
                Cell: ({ original }) => {
                    return (
                        (original.fixedDay) ?
                            <CustomAvField name={"input-ForbiddenDate" + original.idCr} value={original.forbiddenDate}
                                placeholder={this.props.t("utilityConfigRequestSchedule:utilityConfigRequestSchedule.placeholder.forbiddenDate")}
                                onChange={(e) => this.onChangeRow(e.target.value, original, 'forbiddenDate')}
                                maxLength="500"
                                validate={{
                                    pattern: { value: '^(([0-9]{2})-([0-9]{2})-([0-9]{4})(;*))+$', errorMessage: this.props.t("utilityConfigRequestSchedule:utilityConfigRequestSchedule.message.wrongFormatForbiddenDate") },
                                    required: { value: true, errorMessage: this.props.t("utilityConfigRequestSchedule:utilityConfigRequestSchedule.message.requiredForbiddenDate") }
                                }}
                            />
                            : null
                    )
                }
            },
            {
                Header: <Trans i18nKey="utilityConfigRequestSchedule:utilityConfigRequestSchedule.label.nodeImpactList" />,
                accessor: "nodeImpactList",
                Cell: ({ original }) => {
                    return original.nodeImpactList ? <span title={original.nodeImpactList}>{original.nodeImpactList}</span> : <span>&nbsp;</span>
                }
            },
            {
                Header: <Trans i18nKey="utilityConfigRequestSchedule:utilityConfigRequestSchedule.label.serviceImpactList" />,
                accessor: "affectServiceList",
                Cell: ({ original }) => {
                    return original.affectServiceList ? <span title={original.affectServiceList}>{original.affectServiceList}</span> : <span>&nbsp;</span>
                }
            },
            {
                Header: <Trans i18nKey="utilityConfigRequestSchedule:utilityConfigRequestSchedule.label.levelOfdiffcult" />,
                accessor: "crLevel",
                Cell: ({ original }) => {
                    return original.crLevel ? <span title={original.crLevel}>{original.crLevel}</span> : <span>&nbsp;</span>
                }
            },
            {
                Header: <Trans i18nKey="utilityConfigRequestSchedule:utilityConfigRequestSchedule.label.implementationTime" />,
                accessor: "implementationTime",
                Cell: ({ original }) => {
                    return original.implementationTime ? <span title={original.implementationTime}>{original.implementationTime}</span> : <span>&nbsp;</span>
                }
            },
            {
                Header: <Trans i18nKey="utilityConfigRequestSchedule:utilityConfigRequestSchedule.label.prioritize" />,
                accessor: "prioritize",
                Cell: ({ original }) => {
                    return original.prioritize ? <span title={original.prioritize}>{original.prioritize}</span> : <span>&nbsp;</span>
                }
            }
        ];
    }

    buildListOfEmployeeColumns() {
        return [
            {
                Header: <Trans i18nKey="utilityConfigRequestSchedule:utilityConfigRequestSchedule.label.employee" />,
                id: "nameDisplay",
                accessor: d => {
                    return d.nameDisplay ? <span title={d.nameDisplay}>{d.nameDisplay}</span>  : <span>&nbsp;</span>
                }
            },
            {
                Header: <Trans i18nKey="utilityConfigRequestSchedule:utilityConfigRequestSchedule.label.arrayChild" />,
                id: "arrayChildName",
                accessor: d => {
                    return d.arrayChildName ? <span title={d.arrayChildName}>{d.arrayChildName}</span>  : <span>&nbsp;</span>
                }
            },
            {
                Header: <Trans i18nKey="utilityConfigRequestSchedule:utilityConfigRequestSchedule.label.level" />,
                id: "empLevel",
                accessor: d => {
                    return d.empLevel ? <span title={d.empLevel}>{d.empLevel}</span>  : <span>&nbsp;</span>
                }
            },
            {
                Header: <Trans i18nKey="utilityConfigRequestSchedule:utilityConfigRequestSchedule.label.workingDay" />,
                id: "workingDay",
                accessor: d => {
                    return d.workingDay ? <span title={d.workingDay}>{d.workingDay}</span>  : <span>&nbsp;</span>
                }
            },
        ];

    }
    onChangeRow(newValue, object, fieldName) {
        const selectCRBeforeList = [...this.state.selectCRBeforeList];
        for (const obj of selectCRBeforeList) {
            if (obj.idCr === object.idCr) {
                obj[fieldName] = newValue;
                break;
            }
        }
        this.setState({
            selectCRBeforeList
        });
    }
    onChangeCheckbox(newValue, object) {
        const selectCRBeforeList = [...this.state.selectCRBeforeList];
        for (const obj of selectCRBeforeList) {
            if (obj.idCr === object.idCr) {
                if (newValue) {
                    obj.fixedDay = 1
                } else {
                    obj.fixedDay = 0
                }
                break;
            }
        }
        this.setState({
            selectCRBeforeList
        });
    }

    handleValidSubmitAddOrEdit(event, values) {
        validSubmitForm(event, values, "idFormAddOrEdit");
        const utilityConfigRequestSchedule = Object.assign({}, values);
        utilityConfigRequestSchedule.unitId = this.state.selectUnit.value;
        utilityConfigRequestSchedule.type = this.state.selectType.value;
        utilityConfigRequestSchedule.complicateWork = (this.state.complicateWork) ? 1 : 0;
        utilityConfigRequestSchedule.sameNode = (this.state.sameNode) ? 1 : 0;
        utilityConfigRequestSchedule.sameService = (this.state.sameService) ? 1 : 0;
        utilityConfigRequestSchedule.sameNodeShift = (this.state.sameNodeShift) ? 1 : 0;
        utilityConfigRequestSchedule.sameServiceShift = (this.state.sameServiceShift) ? 1 : 0;
        utilityConfigRequestSchedule.month = this.state.selectMonth.value || "";
        utilityConfigRequestSchedule.year = this.state.selectYear.value || "";
        utilityConfigRequestSchedule.week = this.state.selectWeek.value || "";
        utilityConfigRequestSchedule.scheduleCRFormDTOS = [];
        utilityConfigRequestSchedule.scheduleEmployeeDTOS = [];
        utilityConfigRequestSchedule.isGetCrBefore = (this.state.isGetCrBefore) ? 1 : 0;
        utilityConfigRequestSchedule.isInsert = (this.state.isAddOrEdit === "ADD" || this.state.isAddOrEdit === "COPY") ? 1 : 0;
        if (this.state.selectType.value + "" === "2" && this.state.pdfDay) {
            utilityConfigRequestSchedule.pdfDay = this.state.pdfDay;
        } else {
            utilityConfigRequestSchedule.pdfDay = null;
        }
        if (this.state.isGet) {
            this.setState({
                btnLoading: true
            }, () => {
                this.props.actions.getCRBefore(utilityConfigRequestSchedule).then((response) => {
                    const listEmp = (response.payload.data.scheduleEmployeeDTOS) ? response.payload.data.scheduleEmployeeDTOS : [];
                    const listCr = (response.payload.data.scheduleCRFormDTOS) ? response.payload.data.scheduleCRFormDTOS : [];
                    this.setState({ 
                        btnLoading: false, 
                        selectCRBeforeList: listCr, 
                        selectEmployeeList: listEmp, 
                        isGet: false, 
                        scheduleEmployeeDTOS: listEmp, 
                        scheduleCRFormDTOS: listCr 
                    });
                }).catch((response) => {
                    this.setState({ btnLoading: false });
                    toastr.error(this.props.t("utilityConfigRequestSchedule:utilityConfigRequestSchedule.message.error.search"));
                });
            })
        } else {
            utilityConfigRequestSchedule.scheduleEmployeeDTOS = this.state.scheduleEmployeeDTOS;
            utilityConfigRequestSchedule.scheduleCRFormDTOS = this.state.scheduleCRFormDTOS;
            this.setState({
                btnAddOrEditLoading: true
            }, () => {
                if (this.state.isAddOrEdit === "COPY") {
                    utilityConfigRequestSchedule.idSchedule = "";
                }
                if (this.state.isAddOrEdit === "ADD" || this.state.isAddOrEdit === "COPY") {
                    this.props.actions.addUtilityConfigRequestSchedule(utilityConfigRequestSchedule).then((response) => {
                        if (response.payload.data.key === "SUCCESS") {
                            this.setState({
                                btnAddOrEditLoading: false
                            }, () => {
                                this.props.closeAddOrEditPage(this.state.isAddOrEdit);
                                toastr.success(this.props.t("utilityConfigRequestSchedule:utilityConfigRequestSchedule.message.success.add"));
                            });
                        } else {
                            this.setState({
                                btnAddOrEditLoading: false
                            }, () => {
                                toastr.error(this.props.t("utilityConfigRequestSchedule:utilityConfigRequestSchedule.message.error.add"));
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
                                toastr.error(this.props.t("utilityConfigRequestSchedule:utilityConfigRequestSchedule.message.error.add"));
                            }
                        });
                    });
                } else if (this.state.isAddOrEdit === "EDIT") {
                    utilityConfigRequestSchedule.idSchedule = this.state.selectedData.idSchedule;
                    this.props.actions.editUtilityConfigRequestSchedule(utilityConfigRequestSchedule).then((response) => {
                        if (response.payload.data.key === "SUCCESS") {
                            this.setState({
                                btnAddOrEditLoading: false
                            }, () => {
                                this.props.closeAddOrEditPage(this.state.isAddOrEdit);
                                toastr.success(this.props.t("utilityConfigRequestSchedule:utilityConfigRequestSchedule.message.success.edit"));
                            });
                        } else {
                            this.setState({
                                btnAddOrEditLoading: false
                            }, () => {
                                toastr.error(this.props.t("utilityConfigRequestSchedule:utilityConfigRequestSchedule.message.error.edit"));
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
                                toastr.error(this.props.t("utilityConfigRequestSchedule:utilityConfigRequestSchedule.message.error.edit"));
                            }
                        });
                    });
                }
            });
        }
    }

    handleInvalidSubmitAddOrEdit(event, errors, values) {
        toastr.warning(this.props.t("common:common.message.required.allFields"));
        invalidSubmitForm(event, errors, values, "idFormAddOrEdit");
    }

    toggleFormAddEdit() {
        this.setState({ collapseFormAddEdit: !this.state.collapseFormAddEdit });
    }

    handleItemSelectChangeMonth(option) {
        this.setState({
            selectMonth: option,
        });
        if (Object.entries(this.state.selectYear).length !== 0) {
            this.setState({
                selectMonth: option
            });
        }
    }
    handleItemSelectChangeYear(option) {
        this.setState({
            selectYear: option,
        });
    }
    handleItemSelectChangeType(option) {
        this.setState({ selectType: option });
    }

    handleOnChangeUnit(option) {
        this.setState({ selectUnit: option });
    }

    handleOnChangePdfDay(option) {
        this.setState({ pdfDay: option });
    }

    handleItemSelectChangeWeek(option) {
        this.setState({ selectWeek: option });
    }
    getListCRAndEmployee(value) {
        this.setState({
            isGet: true,
            isGetCrBefore: true
        }, () => {
            this.myForm.submit()
        });

    }
    render() {
        const { t } = this.props;
        const { selectEmployeeList, selectCRBeforeList } = this.state;
        let objectAddOrEdit = (this.state.isAddOrEdit === "EDIT" || this.state.isAddOrEdit === "COPY") ? this.state.selectedData : {};
        const { listOfCRColumns, listOfEmployeeColumns } = this.state;
        let valueDay = (this.state.pdfDay) ? (t("utilityConfigRequestSchedule:utilityConfigRequestSchedule.placeholder.day") + convertDateToDDMMYYYYHHMISS(this.state.pdfDay).slice(0, 10)) : "";
        const detailWeek = (this.state.selectWeek.value) ? this.props.t("utilityConfigRequestSchedule:utilityConfigRequestSchedule.placeholder.detailWeek", { week: this.state.selectWeek.value, year: this.state.selectYear.value }) : "";
        const detailMonth = (this.state.selectMonth.value) ? this.props.t("utilityConfigRequestSchedule:utilityConfigRequestSchedule.placeholder.detailMonth", { month: this.state.selectMonth.value, year: this.state.selectYear.value }) : "";
        return (
            <div className="animated fadeIn">
                <AvForm id="idFormAddOrEdit" onValidSubmit={this.handleValidSubmitAddOrEdit} onInvalidSubmit={this.handleInvalidSubmitAddOrEdit} model={objectAddOrEdit} ref={(ref) => this.myForm = ref}>
                    <Row>
                        <Col xs="12">
                            <Card>
                                <CustomSticky>
                                    <CardHeader>
                                        <i className={(this.state.isAddOrEdit === "ADD" || this.state.isAddOrEdit === "COPY") ? "fa fa-plus-circle" : "fa fa-edit"}></i>{(this.state.isAddOrEdit === "ADD" || this.state.isAddOrEdit === "COPY") ? t("utilityConfigRequestSchedule:utilityConfigRequestSchedule.title.utilityConfigRequestScheduleAdd") : this.state.isAddOrEdit === "EDIT" ? t("utilityConfigRequestSchedule:utilityConfigRequestSchedule.title.utilityConfigRequestScheduleEdit") : ''}
                                        <div className="card-header-actions card-header-actions-button">
                                            <LaddaButton type="button"
                                                title={t("utilityConfigRequestSchedule:utilityConfigRequestSchedule.button.show")}
                                                color="primary"
                                                className="btn btn-primary btn-md mr-1"
                                                loading={this.state.btnLoading}
                                                onClick={() => this.getListCRAndEmployee(objectAddOrEdit)}
                                                data-style={ZOOM_OUT}
                                            >
                                                <i className="fa fa-plus"></i>{t("utilityConfigRequestSchedule:utilityConfigRequestSchedule.button.show")}
                                            </LaddaButton>{' '}
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
                                                <Card style={{ border: "none" }}>
                                                    <CardBody>
                                                        <Row >
                                                            <Col xs="12" sm="6">
                                                                <CustomAutocomplete
                                                                    name={"unitId"}
                                                                    label={t("utilityConfigRequestSchedule:utilityConfigRequestSchedule.label.unit")}
                                                                    placeholder={this.props.t("utilityConfigRequestSchedule:utilityConfigRequestSchedule.placeholder.unit")}
                                                                    isRequired={true}
                                                                    messageRequire={t("utilityConfigRequestSchedule:utilityConfigRequestSchedule.message.requiredUnit")}
                                                                    closeMenuOnSelect={false}
                                                                    handleItemSelectChange={this.handleOnChangeUnit}
                                                                    selectValue={this.state.selectUnit}
                                                                    moduleName={"UNIT"}
                                                                    isHasChildren={true}
                                                                />

                                                            </Col>
                                                            <Col xs="12" sm="6">
                                                                <CustomSelectLocal
                                                                    name={"type"}
                                                                    label={t("utilityConfigRequestSchedule:utilityConfigRequestSchedule.label.type")}
                                                                    isRequired={true}
                                                                    messageRequire={t("utilityConfigRequestSchedule:utilityConfigRequestSchedule.message.requiredType")}
                                                                    options={this.state.selectTypeList}
                                                                    closeMenuOnSelect={true}
                                                                    handleItemSelectChange={this.handleItemSelectChangeType}
                                                                    selectValue={this.state.selectType}
                                                                />
                                                            </Col>
                                                        </Row>
                                                        {
                                                            (this.state.selectType.value != 2) ?
                                                                <div>
                                                                    <Row >
                                                                        <Col xs="12" sm="6">
                                                                            <CustomSelectLocal
                                                                                name={(this.state.selectType.value + "" === "1") ? "week" : "month"}
                                                                                label={(this.state.selectType.value + "" === "1") ? t("utilityConfigRequestSchedule:utilityConfigRequestSchedule.label.week") : t("utilityConfigRequestSchedule:utilityConfigRequestSchedule.label.month")}
                                                                                isRequired={true}
                                                                                messageRequire={(this.state.selectType.value + "" === "1") ? t("utilityConfigRequestSchedule:utilityConfigRequestSchedule.message.requiredWeek") : t("utilityConfigRequestSchedule:utilityConfigRequestSchedule.message.requiredMonth")}
                                                                                options={(this.state.selectType.value + "" === "1") ? this.state.selectWeekList : this.state.selectMonthList}
                                                                                closeMenuOnSelect={true}
                                                                                handleItemSelectChange={(this.state.selectType.value + "" === "1") ? this.handleItemSelectChangeWeek : this.handleItemSelectChangeMonth}
                                                                                selectValue={(this.state.selectType.value + "" === "1") ? this.state.selectWeek : this.state.selectMonth}
                                                                            />
                                                                        </Col>
                                                                        <Col xs="12" sm="6">
                                                                            <CustomSelectLocal
                                                                                name={"year"}
                                                                                label={t("utilityConfigRequestSchedule:utilityConfigRequestSchedule.label.year")}
                                                                                isRequired={true}
                                                                                messageRequire={t("utilityConfigRequestSchedule:utilityConfigRequestSchedule.message.requiredYear")}
                                                                                options={this.state.selectYearList}
                                                                                closeMenuOnSelect={true}
                                                                                handleItemSelectChange={this.handleItemSelectChangeYear}
                                                                                selectValue={this.state.selectYear}
                                                                            />
                                                                        </Col>
                                                                    </Row>
                                                                </div> :
                                                                <div>
                                                                    <Row >
                                                                        <Col xs="12" sm="6">
                                                                            <CustomDatePicker
                                                                                name="pdfDay"
                                                                                label={t("utilityConfigRequestSchedule:utilityConfigRequestSchedule.label.day")}
                                                                                isRequired={true}
                                                                                messageRequire={t("utilityConfigRequestSchedule:utilityConfigRequestSchedule.message.requiredPdfDay")}
                                                                                handleOnChange={this.handleOnChangePdfDay}
                                                                                dateFormat="dd/MM/yyyy"
                                                                                selected={this.state.pdfDay}
                                                                                showTimeSelect={false}
                                                                                placeholder={this.props.t("utilityConfigRequestSchedule:utilityConfigRequestSchedule.placeholder.createFrom")}
                                                                            />
                                                                        </Col>
                                                                        <Col xs="12" sm="6">
                                                                            <CustomAvField
                                                                                readOnly = {true}
                                                                                name="detailD"
                                                                                value={valueDay}
                                                                                label={t("utilityConfigRequestSchedule:utilityConfigRequestSchedule.label.detail")}
                                                                                maxLength="500" />
                                                                        </Col>
                                                                    </Row>
                                                                </div>
                                                        }
                                                        <Row >
                                                            {

                                                                (this.state.selectType.value + "" === "1") ?
                                                                    <Col xs="12" sm="6">
                                                                        <CustomAvField
                                                                            readOnly = {true}
                                                                            name="detailW"
                                                                            value={(this.state.selectYear.value) ? detailWeek : ""}
                                                                            label={t("utilityConfigRequestSchedule:utilityConfigRequestSchedule.label.detail")}
                                                                            maxLength="500" />
                                                                    </Col> :
                                                                    (this.state.selectType.value + "" === "0") ?
                                                                        <Col xs="12" sm="6">
                                                                            <CustomAvField
                                                                                readOnly = {true}
                                                                                name="detailM"
                                                                                value={(this.state.selectYear.value) ? detailMonth : ""}
                                                                                label={t("utilityConfigRequestSchedule:utilityConfigRequestSchedule.label.detail")}
                                                                                maxLength="500" />
                                                                        </Col> :
                                                                        ""}
                                                            <Col xs="12" sm="6">
                                                                <CustomAvField
                                                                    name="workTime"
                                                                    label={t("utilityConfigRequestSchedule:utilityConfigRequestSchedule.label.hoursPerday")} required
                                                                    placeholder = {this.props.t("utilityConfigRequestSchedule:utilityConfigRequestSchedule.placeholder.hoursPerday")}
                                                                    validate={{ required: { value: true, errorMessage: t("utilityConfigRequestSchedule:utilityConfigRequestSchedule.message.requiredHoursPerday") } }} />
                                                            </Col>
                                                        </Row>
                                                        <Row>
                                                            <Col xs="12" sm="12">
                                                                <Row>
                                                                    <Col xs="12" sm="4">
                                                                        <CustomAppSwitch
                                                                            name="complicateWork"
                                                                            label={t("utilityConfigRequestSchedule:utilityConfigRequestSchedule.label.isGiveComplicatedWork")}
                                                                            checked={this.state.complicateWork}
                                                                            handleChange={(checked) => this.setState({ complicateWork: checked })}
                                                                        />
                                                                    </Col>
                                                                    <Col xs="12" sm="4">
                                                                        <CustomAppSwitch
                                                                            name="sameNode"
                                                                            label={t("utilityConfigRequestSchedule:utilityConfigRequestSchedule.label.isAllowCrNode")}
                                                                            checked={this.state.sameNode}
                                                                            handleChange={(checked) => this.setState({ sameNode: checked })}
                                                                        />
                                                                    </Col>
                                                                    <Col xs="12" sm="4">
                                                                        <CustomAppSwitch
                                                                            name="sameService"
                                                                            label={t("utilityConfigRequestSchedule:utilityConfigRequestSchedule.label.isAllowCrService")}
                                                                            checked={this.state.sameService}
                                                                            handleChange={(checked) => this.setState({ sameService: checked })}
                                                                        />
                                                                    </Col>
                                                                </Row>

                                                            </Col>
                                                        </Row>
                                                        {
                                                            (this.state.selectType.value + "" === "2") ?
                                                                <Row >
                                                                    <Col xs="12" sm="12">
                                                                        <Row>
                                                                            <Col xs="12" sm="4">
                                                                                <CustomAppSwitch
                                                                                    name="sameNodeShift"
                                                                                    label={t("utilityConfigRequestSchedule:utilityConfigRequestSchedule.label.sameNodeShift")}
                                                                                    checked={this.state.sameNodeShift}
                                                                                    handleChange={(checked) => this.setState({ sameNodeShift: checked })}
                                                                                />
                                                                            </Col>
                                                                            <Col xs="12" sm="4">
                                                                                <CustomAppSwitch

                                                                                    name="sameServiceShift"
                                                                                    label={t("utilityConfigRequestSchedule:utilityConfigRequestSchedule.label.sameServiceShift")}
                                                                                    checked={this.state.sameServiceShift}
                                                                                    handleChange={(checked) => this.setState({ sameServiceShift: checked })}
                                                                                />
                                                                            </Col>

                                                                        </Row>

                                                                    </Col>
                                                                </Row> : null
                                                        }

                                                        <Row >
                                                            <Col xs="12" sm="12">
                                                                <CardHeader>
                                                                    <i className="fa fa-align-justify"></i>{t("utilityConfigRequestSchedule:utilityConfigRequestSchedule.label.listOfCR")}
                                                                </CardHeader>
                                                                <CustomReactTableLocal
                                                                    columns={listOfCRColumns}
                                                                    data={selectCRBeforeList}
                                                                    loading={false}
                                                                    defaultPageSize={5}
                                                                    showPagination={true}
                                                                    isContainsAvField={true}
                                                                />
                                                            </Col>
                                                        </Row>
                                                        <Row>
                                                            <p>{t("utilityConfigRequestSchedule:utilityConfigRequestSchedule.placeholder.dataFormat")}</p>
                                                        </Row>
                                                        <Row>
                                                            <p>{t("utilityConfigRequestSchedule:utilityConfigRequestSchedule.placeholder.dataFormatNote")}</p>
                                                        </Row>
                                                        <Row >
                                                            <Col xs="12" sm="12">
                                                                <CardHeader>
                                                                    <i className="fa fa-align-justify"></i>{t("utilityConfigRequestSchedule:utilityConfigRequestSchedule.label.listOfEmployee")}
                                                                </CardHeader>
                                                                <CustomReactTableLocal
                                                                    columns={listOfEmployeeColumns}
                                                                    data={selectEmployeeList}
                                                                    loading={false}
                                                                    defaultPageSize={10}
                                                                    showPagination={true}
                                                                    isContainsAvField={true}
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

UtilityConfigRequestScheduleAddEdit.propTypes = {
    closeAddOrEditPage: PropTypes.func.isRequired,
    parentState: PropTypes.object.isRequired
};

function mapStateToProps(state, ownProps) {
    const { utilityConfigRequestSchedule, common } = state;
    return {
        response: { utilityConfigRequestSchedule, common }
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(Object.assign({}, UtilityConfigRequestScheduleActions, commonActions), dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(translate()(UtilityConfigRequestScheduleAddEdit));

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Col, Row, Label, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { AvForm } from 'availity-reactstrap-validation';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { translate, Trans } from 'react-i18next';
import { toastr } from 'react-redux-toastr';
import LaddaButton, { ZOOM_OUT } from 'react-ladda';

import * as commonActions from '../../../actions/commonActions';
import * as odWorkflowActions from './OdWorkflowActions';
import { CustomSelectLocal, CustomReactTable, CustomDatePicker, CustomAvField } from "../../../containers/Utils";
import { convertDateToDDMMYYYYHHMISS } from "../../../containers/Utils/Utils";

class OdWorkflowAddEditPopupLinkCode extends Component {
    constructor(props) {
        super(props);

        this.onFetchData = this.onFetchData.bind(this);
        this.search = this.search.bind(this);
        this.getListLinkCodeSearch = this.getListLinkCodeSearch.bind(this);
        this.closePopup = this.closePopup.bind(this);
        this.handleDataCheckbox = this.handleDataCheckbox.bind(this);
        this.handleChangeStartTime = this.handleChangeStartTime.bind(this);
        this.handleChangeEndTime = this.handleChangeEndTime.bind(this);
        this.handleItemSelectChangeSystem = this.handleItemSelectChangeSystem.bind(this);

        this.state = {
            //Table
            data: [],
            pages: null,
            loading: true,
            columns: this.buildTableColumns(),
            systemListSelect: [
                { itemId: "CR", itemName: props.t("odWorkflow:odWorkflow.label.cr") },
                { itemId: "SR", itemName: props.t("odWorkflow:odWorkflow.label.sr") },
                { itemId: "WO", itemName: props.t("odWorkflow:odWorkflow.label.wo") }
            ],
            //Object Search
            objectSearch: { offset: "0" },
            backdrop: "static",
            btnSearchLoading: false,
            listLinkCode: this.props.parentState.selectedData,
            dataChecked: [],
            startTime: null,
            endTime: null,
            selectValueSystem: {}
        };
    }

    buildTableColumns() {
        return [
            {
                Header: <Trans i18nKey="odWorkflow:odWorkflow.label.systemName"/>,
                id: "system",
                width: 100,
                accessor: d => <span title={d.system}>{d.system}</span>
            },
            {
                Header: <Trans i18nKey="odWorkflow:odWorkflow.label.linkCode"/>,
                id: "systemCode",
                width: 200,
                accessor: d => <span title={d.systemCode}>{d.systemCode}</span>
            },
            {
                Header: <Trans i18nKey="odWorkflow:odWorkflow.label.status"/>,
                id: "status",
                width: 150,
                accessor: d => {
                    return d.status ? <span title={d.status}>{d.status}</span>
                    : <span>&nbsp;</span>
                }
            },
            {
                Header: <Trans i18nKey="odWorkflow:odWorkflow.label.createdTime"/>,
                id: "createTime",
                className: "text-center",
                width: 150,
                accessor: d => {
                    return d.createTime ? <span title={convertDateToDDMMYYYYHHMISS(d.createTime)}>{convertDateToDDMMYYYYHHMISS(d.createTime)}</span>
                    : <span>&nbsp;</span>
                }
            },
            {
                Header: <Trans i18nKey="odWorkflow:odWorkflow.label.endTimeRequest"/>,
                id: "endTime",
                className: "text-center",
                width: 200,
                accessor: d => {
                    return d.endTime ? <span title={convertDateToDDMMYYYYHHMISS(d.endTime)}>{convertDateToDDMMYYYYHHMISS(d.endTime)}</span>
                    : <span>&nbsp;</span>
                }
            },
            {
                Header: <Trans i18nKey="odWorkflow:odWorkflow.label.content"/>,
                id: "content",
                width: 200,
                accessor: d => <span title={d.content}>{d.content}</span>
            },
            {
                Header: <Trans i18nKey="odWorkflow:odWorkflow.label.createPerson"/>,
                id: "createPersonName",
                width: 150,
                accessor: d => <span title={d.createPersonName}>{d.createPersonName}</span>
            },
            {
                Header: <Trans i18nKey="odWorkflow:odWorkflow.label.receiveUnit"/>,
                id: "receiveUnitName",
                minWidth: 150,
                accessor: d => <span title={d.receiveUnitName}>{d.receiveUnitName}</span>
            }
        ];
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

        this.setState({
            loading: true,
            objectSearch: objectSearch
        }, () => {
            this.getListLinkCodeSearch();
        });
    }

    search(event, values) {
        if(this.state.startTime > this.state.endTime) {
            toastr.error(this.props.t("odWorkflow:odWorkflow.message.error.endTime"));
            return;
        }
        let obj = values;
        const objectSearch = Object.assign({}, this.state.objectSearch, obj);
        objectSearch.startTimeFrom = convertDateToDDMMYYYYHHMISS(this.state.startTime);
        objectSearch.startTimeTo = convertDateToDDMMYYYYHHMISS(this.state.endTime);
        objectSearch.system = this.state.selectValueSystem.value;
        objectSearch.page = 1;
        this.setState({
            btnSearchLoading: true,
            loading: true,
            objectSearch: objectSearch
        }, () => {
            this.customReactTable.resetPage();
            this.getListLinkCodeSearch(true);
        });
    }

    getListLinkCodeSearch(isSearchClicked = false) {
        this.props.actions.getListLinkCodeSearch(this.state.objectSearch).then((response) => {
            this.setState({
                data: response.payload.data.data ? response.payload.data.data : [],
                pages: response.payload.data.pages,
                loading: false
            });
            if(isSearchClicked) {
                this.setState({ btnSearchLoading: false });
            }
        }).catch((response) => {
            this.setState({
                loading: false,
                btnSearchLoading: false
            });
            toastr.error(this.props.t("odConfigScheduleCreate:odConfigScheduleCreate.message.error.searchLinkCode"));
        });
    }

    closePopup() {
        this.setState({
            objectSearch: { offset: "0" },
            startTime: null,
            endTime: null,
            selectValueSystem: {},
            dataChecked: []
        });
        this.props.closePopup();
    }

    handleDataCheckbox(data) {
        this.setState({
            dataChecked: data
        });
    }

    addLinkCode(dataChecked) {
        if (dataChecked.length > 0) {
            this.props.addLinkCode(dataChecked);
            this.closePopup();
        } else {
            toastr.error(this.props.t("odWorkflow:odWorkflow.message.linkCodeRequired"));
        }
    }

    handleChangeStartTime(startTime){
        this.setState({startTime});
    }

    handleChangeEndTime(endTime){
        this.setState({endTime});
    }

    handleItemSelectChangeSystem(option) {
        this.setState({ selectValueSystem: option });
    }

    render() {
        const { t } = this.props;
        const { columns, data, pages, loading, objectSearch, systemListSelect } = this.state;
        return (
            <Modal isOpen={this.props.parentState.isOpenPopupLinkCode} className={'modal-primary modal-lg ' + this.props.className}
                backdrop={this.state.backdrop} >
                <AvForm onValidSubmit={this.search} model={objectSearch}>
                    <ModalHeader toggle={this.closePopup}>
                        {t("odWorkflow:odWorkflow.label.addNewLinkCode")}
                    </ModalHeader>
                    <ModalBody>
                        <Row>
                            <Col xs="12">
                                <Row>
                                    <Col xs="12" sm="6">
                                        <CustomSelectLocal
                                            name={"system"}
                                            label={t("odWorkflow:odWorkflow.label.linkSystem")}
                                            isRequired={true}
                                            messageRequire={t("odWorkflow:odWorkflow.message.woSystemRequired")}
                                            options={systemListSelect}
                                            closeMenuOnSelect={true}
                                            handleItemSelectChange={this.handleItemSelectChangeSystem}
                                            selectValue={this.state.selectValueSystem}
                                        />
                                    </Col>
                                    <Col xs="12" sm="6">
                                        <CustomAvField name="systemCode" label={t("odWorkflow:odWorkflow.label.systemCode")}
                                        placeholder={t("odWorkflow:odWorkflow.placeholder.systemCode")} required
                                        validate={{ required: { value: true, errorMessage: t("odWorkflow:odWorkflow.message.woSystemCodeRequired") } }} />
                                    </Col>
                                </Row>
                            </Col>
                            <Col xs="12">
                                <Row>
                                    <Col xs="12" sm="6">
                                        <CustomDatePicker
                                            name={"startTimeFrom"}
                                            label={t("odWorkflow:odWorkflow.label.startTime")}
                                            isRequired={true}
                                            messageRequire={t('odWorkflow:odWorkflow.message.startTimeRequired')}
                                            selected={this.state.startTime}
                                            timeInputLabel={t('odWorkflow:odWorkflow.label.time')}
                                            handleOnChange={this.handleChangeStartTime}
                                            dateFormat="dd/MM/yyyy HH:mm:ss"
                                            showTimeSelect={true}
                                            timeFormat="HH:mm:ss"
                                            placeholder="dd/MM/yyyy HH:mm:ss"
                                            // placeholder={t("odWorkflow:odWorkflow.placeholder.startTime")}
                                        />
                                    </Col>
                                    <Col xs="12" sm="6">
                                        <CustomDatePicker
                                            name={"startTimeTo"}
                                            label={t("odWorkflow:odWorkflow.label.endTime")}
                                            isRequired={true}
                                            messageRequire={t('odWorkflow:odWorkflow.message.endTimeRequired')}
                                            selected={this.state.endTime}
                                            timeInputLabel={t('odWorkflow:odWorkflow.label.time')}
                                            handleOnChange={this.handleChangeEndTime}
                                            dateFormat="dd/MM/yyyy HH:mm:ss"
                                            showTimeSelect={true}
                                            timeFormat="HH:mm:ss"
                                            placeholder="dd/MM/yyyy HH:mm:ss"
                                            // placeholder={t("odWorkflow:odWorkflow.placeholder.endTime")}
                                        />
                                    </Col>
                                </Row>
                            </Col>
                            <Col xs="12">
                                <Row>
                                    <Col xs="12" sm="12" className="align-self-center text-center">
                                        <LaddaButton type="submit"
                                            className="btn btn-primary btn-md mr-1"
                                            loading={this.state.btnSearchLoading}
                                            data-style={ZOOM_OUT}>
                                            <i className="fa fa-search"></i> <Trans i18nKey="odConfigScheduleCreate:odConfigScheduleCreate.button.search" />
                                        </LaddaButton>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs="12">
                                <Label>{t("odWorkflow:odWorkflow.label.linkCodeList")}</Label>
                                <CustomReactTable
                                    onRef={ref => (this.customReactTable = ref)}
                                    columns={columns}
                                    data={data}
                                    pages={pages}
                                    loading={loading}
                                    onFetchData={this.onFetchData}
                                    defaultPageSize={10}
                                    isCheckbox={true}
                                    propsCheckbox={["systemId", "status", "system", "systemCode", "createTime", "endTime", "content",
                                    "createPersonName", "receiveUnitName", "createPersonId", "receiveUnitId"]}
                                    handleDataCheckbox={this.handleDataCheckbox}
                                />
                            </Col>
                        </Row>
                    </ModalBody>
                    <ModalFooter>
                        <Button type="button" color="primary" disabled={this.state.dataChecked.length < 1} className="ml-auto" onClick={() => this.addLinkCode(this.state.dataChecked)}><i className="fa fa-check"></i> {t("odConfigScheduleCreate:odConfigScheduleCreate.button.choose")}</Button>
                        <Button type="button" color="secondary" className="mr-auto" onClick={this.closePopup}><i className="fa fa-times-circle"></i> {t("common:common.button.close")}</Button>
                    </ModalFooter>
                </AvForm>
            </Modal>
        );
    }
}

OdWorkflowAddEditPopupLinkCode.propTypes = {
    parentState: PropTypes.object.isRequired,
    closePopup: PropTypes.func.isRequired,
    addLinkCode: PropTypes.func.isRequired,
};

function mapStateToProps(state, ownProps) {
    const { odWorkflow, common } = state;
    return {
        response: { odWorkflow, common }
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(Object.assign({}, odWorkflowActions, commonActions), dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(translate()(OdWorkflowAddEditPopupLinkCode));
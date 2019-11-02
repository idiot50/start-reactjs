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
import * as ptProblemActions from './PtProblemActions';
import { CustomReactTable, CustomDatePicker, CustomAvField } from "../../../containers/Utils";
import { convertDateToDDMMYYYYHHMISS } from "../../../containers/Utils/Utils";

class PtProblemEditInfoTabRelatedTtPopup extends Component {
    constructor(props) {
        super(props);

        this.onFetchData = this.onFetchData.bind(this);
        this.closePopup = this.closePopup.bind(this);
        this.search = this.search.bind(this);
        this.handleChangeCreatedTimeFrom = this.handleChangeCreatedTimeFrom.bind(this);
        this.handleChangeCreatedTimeTo = this.handleChangeCreatedTimeTo.bind(this);
        this.setValueTt = this.setValueTt.bind(this);

        this.state = {
            //Table
            data: [],
            pages: null,
            loading: false,
            columns: this.buildTableColumns(),
            //Object Search
            objectSearch: {},
            backdrop: "static",
            btnSearchLoading: false,
            dataChecked: [],
            createdTimeFrom: new Date(new Date().setMonth(new Date().getMonth() - 1)),
            createdTimeTo: new Date()
        };
    }

    buildTableColumns() {
        return [
            {
                Header: <Trans i18nKey="ptProblem:ptProblem.label.action"/>,
                id: "action",
                width: 80,
                accessor: d => (
                    <div className="text-center">
                        <span title={this.props.t("common:common.button.choose")} onClick={() => this.setValueTt(d.troubleCode)}>
                            <Button type="button" size="sm" color="secondary" className="btn-info icon mr-1"><i className="fa fa-check"></i></Button>
                        </span>
                    </div>
                )
            },
            {
                Header: <Trans i18nKey="ptProblem:ptProblem.label.ttCode"/>,
                id: "troubleCode",
                width: 200,
                accessor: d => <span title={d.troubleCode}>{d.troubleCode}</span>
            },
            {
                Header: <Trans i18nKey="ptProblem:ptProblem.label.ttName"/>,
                id: "troubleName",
                width: 200,
                accessor: d => <span title={d.troubleName}>{d.troubleName}</span>
            },
            {
                Header: <Trans i18nKey="ptProblem:ptProblem.label.processUnit"/>,
                id: "receiveUnitName",
                width: 150,
                accessor: d => {
                    return d.receiveUnitName ? <span title={d.receiveUnitName}>{d.receiveUnitName}</span>
                    : <span>&nbsp;</span>
                }
            },
            {
                Header: <Trans i18nKey="ptProblem:ptProblem.label.createdTime"/>,
                id: "createdTime",
                className: "text-center",
                minWidth: 150,
                accessor: d => {
                    return d.createdTime ? <span title={d.createdTime}>{d.createdTime}</span>
                    : <span>&nbsp;</span>
                }
            },
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
        objectSearch.createdTimeFrom = convertDateToDDMMYYYYHHMISS(this.state.createdTimeFrom);
        objectSearch.createdTimeTo = convertDateToDDMMYYYYHHMISS(this.state.createdTimeTo);
        this.setState({
            loading: true,
            objectSearch
        }, () => {
            this.onSearchTroubleRelated();
        });
    }

    search(event, values) {
        if(this.state.createdTimeFrom > this.state.createdTimeTo) {
            toastr.error(this.props.t("ptProblem:ptProblem.message.error.endTime"));
            return;
        }
        let obj = values;
        const objectSearch = Object.assign({}, this.state.objectSearch, obj);
        objectSearch.createdTimeFrom = convertDateToDDMMYYYYHHMISS(this.state.createdTimeFrom);
        objectSearch.createdTimeTo = convertDateToDDMMYYYYHHMISS(this.state.createdTimeTo);
        objectSearch.page = 1;
        this.setState({
            btnSearchLoading: true,
            loading: true,
            objectSearch: objectSearch
        }, () => {
            this.customReactTable.resetPage();
            this.onSearchTroubleRelated(true);
        });
    }

    onSearchTroubleRelated(isSearchClicked = false) {
        this.props.actions.onSearchTroubleRelated(this.state.objectSearch).then((response) => {
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
            toastr.error(this.props.t("ptProblem:ptProblem.message.error.searchTt"));
        });
    }

    closePopup() {
        this.setState({
            objectSearch: {},
            createdTimeFrom: new Date(new Date().setMonth(new Date().getMonth() - 1)),
            createdTimeTo: new Date()
        });
        this.props.closePopup();
    }

    setValueTt(value) {
        this.props.setValueTt(value);
        this.props.closePopup();
    }

    handleChangeCreatedTimeFrom(createdTimeFrom){
        this.setState({createdTimeFrom});
    }

    handleChangeCreatedTimeTo(createdTimeTo){
        this.setState({createdTimeTo});
    }

    render() {
        const { t } = this.props;
        const { columns, data, pages, loading } = this.state;
        let objectSearch = this.state.objectSearch;
        return (
            <Modal isOpen={this.props.parentState.isOpenPopupRelatedTtSearch} className={'modal-primary modal-lg ' + this.props.className}
                backdrop={this.state.backdrop} >
                <AvForm onValidSubmit={this.search} model={objectSearch}>
                    <ModalHeader toggle={this.closePopup}>
                        {t("ptProblem:ptProblem.title.searchTt")}
                    </ModalHeader>
                    <ModalBody>
                        <Row>
                            <Col xs="12" sm="6">
                                <CustomAvField name="troubleCode" label={this.props.t("ptProblem:ptProblem.label.ttCode")}
                                placeholder={this.props.t("ptProblem:ptProblem.placeholder.ttCode")} />
                            </Col>
                            <Col xs="12" sm="6">
                                <CustomAvField name="troubleName" label={this.props.t("ptProblem:ptProblem.label.ttName")}
                                placeholder={this.props.t("ptProblem:ptProblem.placeholder.ttName")} />
                            </Col>
                        </Row>
                        <Row>
                            <Col xs="12" sm="6">
                                <CustomDatePicker
                                    name={"createdTimeFrom"}
                                    label={t("ptProblem:ptProblem.label.startTime")}
                                    isRequired={true}
                                    messageRequire={t('ptProblem:ptProblem.message.required.fromDate')}
                                    selected={this.state.createdTimeFrom}
                                    timeInputLabel={t('ptProblem:ptProblem.label.time')}
                                    handleOnChange={this.handleChangeCreatedTimeFrom}
                                    dateFormat="dd/MM/yyyy HH:mm:ss"
                                    showTimeSelect={true}
                                    timeFormat="HH:mm:ss"
                                    placeholder="dd/MM/yyyy HH:mm:ss"
                                />
                            </Col>
                            <Col xs="12" sm="6">
                                <CustomDatePicker
                                    name={"createdTimeTo"}
                                    label={t("ptProblem:ptProblem.label.endTime")}
                                    isRequired={true}
                                    messageRequire={t('ptProblem:ptProblem.message.required.toDate')}
                                    selected={this.state.createdTimeTo}
                                    timeInputLabel={t('ptProblem:ptProblem.label.time')}
                                    handleOnChange={this.handleChangeCreatedTimeTo}
                                    dateFormat="dd/MM/yyyy HH:mm:ss"
                                    showTimeSelect={true}
                                    timeFormat="HH:mm:ss"
                                    placeholder="dd/MM/yyyy HH:mm:ss"
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col xs="12" sm="12" className="align-self-center text-center">
                                <LaddaButton type="submit"
                                    className="btn btn-primary btn-md mr-1"
                                    loading={this.state.btnSearchLoading}
                                    data-style={ZOOM_OUT}>
                                    <i className="fa fa-search"></i> <Trans i18nKey="ptProblem:ptProblem.button.search" />
                                </LaddaButton>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs="12">
                                <Label>{t("ptProblem:ptProblem.title.ttList")}</Label>
                                <CustomReactTable
                                    onRef={ref => (this.customReactTable = ref)}
                                    columns={columns}
                                    data={data}
                                    pages={pages}
                                    loading={loading}
                                    onFetchData={this.onFetchData}
                                    defaultPageSize={10}
                                    isCheckbox={false}
                                />
                            </Col>
                        </Row>
                    </ModalBody>
                    <ModalFooter>
                        {/* <Button type="button" color="primary" disabled={this.state.dataChecked.length < 1} className="ml-auto" onClick={() => this.setValueTt(this.state.dataChecked)}><i className="fa fa-check"></i> {t("ptProblem:ptProblem.button.choose")}</Button> */}
                        <Button type="button" color="secondary" onClick={this.closePopup}><i className="fa fa-times-circle"></i> {t("common:common.button.close")}</Button>
                    </ModalFooter>
                </AvForm>
            </Modal>
        );
    }
}

PtProblemEditInfoTabRelatedTtPopup.propTypes = {
    parentState: PropTypes.object.isRequired,
    closePopup: PropTypes.func.isRequired,
    setValueTt: PropTypes.func.isRequired,
};

function mapStateToProps(state, ownProps) {
    const { ptProblem, common } = state;
    return {
        response: { ptProblem, common }
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(Object.assign({}, ptProblemActions, commonActions), dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(translate()(PtProblemEditInfoTabRelatedTtPopup));
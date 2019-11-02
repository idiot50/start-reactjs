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

class PtProblemEditInfoTabRelatedPtPopup extends Component {
    constructor(props) {
        super(props);

        this.onFetchData = this.onFetchData.bind(this);
        this.closePopup = this.closePopup.bind(this);
        this.search = this.search.bind(this);
        this.handleChangeFromDate = this.handleChangeFromDate.bind(this);
        this.handleChangeToDate = this.handleChangeToDate.bind(this);
        this.setValuePt = this.setValuePt.bind(this);

        this.state = {
            //Table
            data: [],
            pages: null,
            loading: false,
            columns: this.buildTableColumns(),
            //Object Search
            objectSearch: {
                problemName: props.parentState.selectedData.problemName,
                typeId: props.parentState.selectedData.typeId,
                subCategoryId: props.parentState.selectedData.subCategoryId,
            },
            problemCode: props.parentState.selectedData.problemCode,
            typeId: props.parentState.selectedData.typeId,
            subCategoryId: props.parentState.selectedData.subCategoryId,
            backdrop: "static",
            btnSearchLoading: false,
            fromDate: new Date(new Date().setFullYear(new Date().getFullYear() - 1)),
            toDate: new Date()
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
                        <span title={this.props.t("common:common.button.choose")}>
                            <Button type="button" size="sm" color="secondary" disabled={d.problemCode === this.state.problemCode} onClick={() => this.setValuePt(d.problemCode)} className="btn-info icon mr-1"><i className="fa fa-check"></i></Button>
                        </span>
                    </div>
                )
            },
            {
                Header: <Trans i18nKey="ptProblem:ptProblem.label.problemCode"/>,
                id: "problemCode",
                width: 200,
                accessor: d => <span title={d.problemCode}>{d.problemCode}</span>
            },
            {
                Header: <Trans i18nKey="ptProblem:ptProblem.label.problemName"/>,
                id: "problemName",
                width: 200,
                accessor: d => <span title={d.problemName}>{d.problemName}</span>
            },
            {
                Header: <Trans i18nKey="ptProblem:ptProblem.label.status"/>,
                id: "problemState",
                width: 150,
                accessor: d => {
                    return d.problemState ? <span title={d.problemState}>{d.problemState}</span>
                    : <span>&nbsp;</span>
                }
            },
            {
                Header: <Trans i18nKey="ptProblem:ptProblem.label.createdTime"/>,
                id: "createdTime",
                className: "text-center",
                minWidth: 150,
                accessor: d => {
                    return d.createdTime ? <span title={convertDateToDDMMYYYYHHMISS(d.createdTime)}>{convertDateToDDMMYYYYHHMISS(d.createdTime)}</span>
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
        objectSearch.fromDate = convertDateToDDMMYYYYHHMISS(this.state.fromDate);
        objectSearch.toDate = convertDateToDDMMYYYYHHMISS(this.state.toDate);
        const stateList = "701,121,122,119,702,120,123,124,125,703,126,704,127,128,239,44,741";
        objectSearch.userTokenGNOC = {locale: this.state.typeId, mobile: this.state.subCategoryId, unitName: this.state.problemCode, fullName: stateList};
        this.setState({
            loading: true,
            objectSearch
        }, () => {
            this.getListProblemDuplicate();
        });
    }

    search(event, values) {
        if(this.state.fromDate > this.state.toDate) {
            toastr.error(this.props.t("ptProblem:ptProblem.message.error.toDate"));
            return;
        }
        let obj = values;
        const objectSearch = Object.assign({}, this.state.objectSearch, obj);
        objectSearch.fromDate = convertDateToDDMMYYYYHHMISS(this.state.fromDate);
        objectSearch.toDate = convertDateToDDMMYYYYHHMISS(this.state.toDate);
        const stateList = "701,121,122,119,702,120,123,124,125,703,126,704,127,128,239,44,741";
        objectSearch.userTokenGNOC = {locale: this.state.typeId, mobile: this.state.subCategoryId, unitName: this.state.problemCode, fullName: stateList};
        objectSearch.page = 1;
        this.setState({
            btnSearchLoading: true,
            loading: true,
            objectSearch: objectSearch
        }, () => {
            this.customReactTable.resetPage();
            this.getListProblemDuplicate(true);
        });
    }

    getListProblemDuplicate(isSearchClicked = false) {
        this.props.actions.getListProblemDuplicate(this.state.objectSearch).then((response) => {
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
            toastr.error(this.props.t("ptProblem:ptProblem.message.error.search"));
        });
    }

    closePopup() {
        this.setState({
            objectSearch: {
                problemName: this.props.parentState.selectedData.problemName
            },
            fromDate: new Date(new Date().setFullYear(new Date().getFullYear() - 1)),
            toDate: new Date()
        });
        this.props.closePopup();
    }

    setValuePt(value) {
        this.props.setValuePt(value);
        this.props.closePopup();
    }

    handleChangeFromDate(fromDate){
        this.setState({fromDate});
    }

    handleChangeToDate(toDate){
        this.setState({toDate});
    }

    render() {
        const { t } = this.props;
        const { columns, data, pages, loading, objectSearch } = this.state;
        return (
            <Modal isOpen={this.props.parentState.isOpenPopupRelatedPtSearch} className={'modal-primary modal-lg ' + this.props.className}
                backdrop={this.state.backdrop} >
                <AvForm onValidSubmit={this.search} model={objectSearch}>
                    <ModalHeader toggle={this.closePopup}>
                        {t("ptProblem:ptProblem.title.searchPt")}
                    </ModalHeader>
                    <ModalBody>
                        <Row>
                            <Col xs="12">
                                <CustomAvField name="problemName" label={this.props.t("ptProblem:ptProblem.label.problemName")}
                                placeholder={this.props.t("ptProblem:ptProblem.placeholder.problemName")} required
                                validate={{ required: { value: true, errorMessage: t("ptProblem:ptProblem.message.required.problemName") } }} />
                            </Col>
                        </Row>
                        <Row>
                            <Col xs="12" sm="6">
                                <CustomDatePicker
                                    name={"fromDate"}
                                    label={t("ptProblem:ptProblem.label.createdDateFrom")}
                                    isRequired={true}
                                    messageRequire={t('ptProblem:ptProblem.message.required.fromDate')}
                                    selected={this.state.fromDate}
                                    timeInputLabel={t('ptProblem:ptProblem.label.time')}
                                    handleOnChange={this.handleChangeFromDate}
                                    dateFormat="dd/MM/yyyy HH:mm:ss"
                                    showTimeSelect={true}
                                    timeFormat="HH:mm:ss"
                                    placeholder="dd/MM/yyyy HH:mm:ss"
                                />
                            </Col>
                            <Col xs="12" sm="6">
                                <CustomDatePicker
                                    name={"toDate"}
                                    label={t("ptProblem:ptProblem.label.createdDateTo")}
                                    isRequired={true}
                                    messageRequire={t('ptProblem:ptProblem.message.required.toDate')}
                                    selected={this.state.toDate}
                                    timeInputLabel={t('ptProblem:ptProblem.label.time')}
                                    handleOnChange={this.handleChangeToDate}
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
                                <Label>{t("ptProblem:ptProblem.title.issueList")}</Label>
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
                        <Button type="button" color="secondary" onClick={this.closePopup}><i className="fa fa-times-circle"></i> {t("common:common.button.close")}</Button>
                    </ModalFooter>
                </AvForm>
            </Modal>
        );
    }
}

PtProblemEditInfoTabRelatedPtPopup.propTypes = {
    parentState: PropTypes.object.isRequired,
    closePopup: PropTypes.func.isRequired,
    setValuePt: PropTypes.func.isRequired
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

export default connect(mapStateToProps, mapDispatchToProps)(translate()(PtProblemEditInfoTabRelatedPtPopup));
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Col, Row, Label, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { AvForm } from 'availity-reactstrap-validation';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { translate, Trans } from 'react-i18next';
import { toastr } from 'react-redux-toastr';
import LaddaButton, { ZOOM_OUT } from 'react-ladda';
import { CustomDatePicker, CustomAvField } from '../../../containers/Utils';
import * as ptProblem from './PtProblemActions';
import CustomReactTable from "../../../containers/Utils/CustomReactTable";
import { convertDateToDDMMYYYYHHMISS } from "../../../containers/Utils/Utils";
import PtProblemDetailPopup from './PtProblemDetailPopup';

class PtProblemAddTicketName extends Component {
    constructor(props) {
        super(props);

        this.onFetchData = this.onFetchData.bind(this);
        this.search = this.search.bind(this);
        this.getListProblemDuplicate = this.getListProblemDuplicate.bind(this);
        this.handleChangeStartTime = this.handleChangeStartTime.bind(this);
        this.handleChangeEndTime = this.handleChangeEndTime.bind(this);
        this.closePopup = this.closePopup.bind(this);
  
        this.state = {
            selectedData: props.parentState,
            problemName: "",
            typeId: "",
            subCategoryId: "",
            //Table
            data: [],
            pages: null,
            loading: false,
            columns: this.buildTableColumns(),
            //Object Search
            startedTime: new Date(new Date().setFullYear(new Date().getFullYear() - 1)),
            endedTime: new Date(),
            objectSearch: {},
            backdrop: "static",
            btnSearchLoading: false,
            detailModal: false,
            moduleName: null
        };
    }

    componentWillReceiveProps(newProps) {
        if (newProps.parentState.problemName) {
            this.setState({ problemName: newProps.parentState.problemName });
        }
        if (newProps.parentState.selectValueNodeType) {
            this.setState({ subCategoryId: newProps.parentState.selectValueNodeType.value });
        }
        if (newProps.parentState.selectValueTechDomain) {
            this.setState({ typeId: newProps.parentState.selectValueTechDomain.value });
        }
    }

    handleChangeEndTime(endedTime) {
        this.setState({ endedTime });
    }

    handleChangeStartTime(startedTime) {
        this.setState({ startedTime });
    }

    openPage = (name, object) => {
        this.props.actions.getDetailPtProblem(object.problemId).then((response) => {
            if (response.payload && response.payload.data) {
                this.setState({
                    detailModal: true,
                    selectedData: response.payload.data,
                    moduleName: name
                });
            } else {
                toastr.error(this.props.t("ptProblem:ptProblem.message.error.getDetail"));
            }
        }).catch((response) => {
            toastr.error(this.props.t("ptProblem:ptProblem.message.error.getDetail"));
        });
    }

    closePage = (name) => {
        this.setState({
            detailModal: false,
            moduleName: name
        });
    }

    buildTableColumns() {
        return [
            {
                Header: <Trans i18nKey="ptProblem:ptProblem.label.ticketCodeProb" />,
                id: "problemCode",
                accessor: d => <span style={{ cursor: 'pointer', color: 'rgb(32, 168, 216)', textDecoration: 'underline' }} onClick={() => this.openPage("DETAIL", d)} title={d.problemCode}>{d.problemCode}</span>
            },
            {
                Header: <Trans i18nKey="ptProblem:ptProblem.label.ticketNameProb" />,
                id: "problemName",
                accessor: d => <span title={d.problemName}>{d.problemName}</span>
            },
            {
                Header: <Trans i18nKey="ptProblem:ptProblem.label.status" />,
                id: "problemState",
                accessor: d => <span title={d.problemState}>{d.problemState}</span>
            },
            {
                Header: <Trans i18nKey="ptProblem:ptProblem.label.createdDate" />,
                id: "createdTime",
                accessor: d => <span title={convertDateToDDMMYYYYHHMISS(d.createdTime)}>{convertDateToDDMMYYYYHHMISS(d.createdTime)}</span>

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
        objectSearch.fromDate = convertDateToDDMMYYYYHHMISS(this.state.startedTime);
        objectSearch.toDate = convertDateToDDMMYYYYHHMISS(this.state.endedTime);
        objectSearch.userTokenGNOC = {locale: this.state.typeId, mobile: this.state.subCategoryId};
        objectSearch.problemName = this.state.problemName;

        this.setState({
            loading: true,
            objectSearch: objectSearch
        }, () => {
            this.getListProblemDuplicate();
        });
    }

    search(event, values) {
        if (this.state.startedTime > this.state.endedTime) {
            toastr.error(this.props.t("ptProblem:ptProblem.message.error.endTime"));
            return;
        }
        const objectSearch = Object.assign({}, this.state.objectSearch, values);
        objectSearch.fromDate = convertDateToDDMMYYYYHHMISS(this.state.startedTime);
        objectSearch.toDate = convertDateToDDMMYYYYHHMISS(this.state.endedTime);
        objectSearch.userTokenGNOC = {locale: this.state.typeId, mobile: this.state.subCategoryId};
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
            if (isSearchClicked) {
                this.setState({ btnSearchLoading: false });
            }
        }).catch((response) => {
            this.setState({
                btnSearchLoading: false,
                loading: false
            });
            toastr.error(this.props.t("ptProblem:ptProblem.message.error.search"));
        });
    }

    closePopup() {
        this.setState({
            objectSearch: {}
        });
        this.props.closePopup();
    }

    render() {
        const { t } = this.props;
        const { columns, data, pages, loading, objectSearch } = this.state;
        return (
            <div>
                <Modal isOpen={this.props.parentState.isOpenPopupTicketName} className={'modal-primary modal-lg ' + this.props.className}
                    backdrop={this.state.backdrop} onOpened={this.onOpened} >
                    <ModalHeader toggle={this.closePopup}>
                        {t("ptProblem:ptProblem.label.problemList")}
                    </ModalHeader>
                    <ModalBody>
                        <AvForm onValidSubmit={this.search} model={objectSearch}>
                            <Row>
                                <Col xs="10">
                                    <CustomAvField name="problemName" label={t("ptProblem:ptProblem.label.problemName")} placeholder={t("ptProblem:ptProblem.placeholder.problemName")}
                                        required validate={{ required: { value: true, errorMessage: t("ptProblem:ptProblem.message.required.problemName") } }} value={this.state.problemName}
                                    />
                                </Col>
                                <Col xs="2">
                                    <Row className="mb-2">
                                        <Col xs="12"><Label></Label></Col>
                                    </Row>
                                    <Row>
                                        <LaddaButton type="submit"
                                            disable={this.state.disable}
                                            className="btn btn-primary btn-md mr-1"
                                            loading={this.state.btnSearchLoading}
                                            data-style={ZOOM_OUT}>
                                            <i className="fa fa-search"></i> <Trans i18nKey="ptProblem:ptProblem.button.search" />
                                        </LaddaButton>
                                    </Row>
                                </Col>
                                <Col xs="12">
                                    <Row>
                                        <Col xs="12" sm="6">
                                            <CustomDatePicker
                                                name={"fromDate"}
                                                label={t("ptProblem:ptProblem.label.createdDateFrom")}
                                                isRequired={true}
                                                messageRequire={t('ptProblem:ptProblem.message.required.startTime')}
                                                selected={this.state.startedTime}
                                                timeInputLabel={t('ptProblem:ptProblem.label.time')}
                                                handleOnChange={this.handleChangeStartTime}
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
                                                messageRequire={t('ptProblem:ptProblem.message.required.endTime')}
                                                selected={this.state.endedTime}
                                                timeInputLabel={t('ptProblem:ptProblem.label.time')}
                                                handleOnChange={this.handleChangeEndTime}
                                                dateFormat="dd/MM/yyyy HH:mm:ss"
                                                showTimeSelect={true}
                                                timeFormat="HH:mm:ss"
                                                placeholder="dd/MM/yyyy HH:mm:ss"
                                            />
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </AvForm>
                        <Row>
                            <Col xs="12">
                                <Label>{t("ptProblem:ptProblem.label.searchResult")}</Label>
                                <CustomReactTable
                                    onRef={ref => (this.customReactTable = ref)}
                                    columns={columns}
                                    data={data}
                                    pages={pages}
                                    loading={loading}
                                    onFetchData={this.onFetchData}
                                    defaultPageSize={10}
                                />
                            </Col>
                        </Row>
                    </ModalBody>
                    <ModalFooter>
                        <Button type="button" color="secondary" onClick={this.closePopup}><i className="fa fa-times-circle"></i> {t("common:common.button.close")}</Button>
                    </ModalFooter>
                </Modal>
                <PtProblemDetailPopup
                    parentState={this.state}
                    closePopup={this.closePage} />
            </div>
        );
    }
}

PtProblemAddTicketName.propTypes = {
    parentState: PropTypes.object.isRequired,
    closePopup: PropTypes.func.isRequired,
};

function mapStateToProps(state, ownProps) {
    const { ptProblem } = state;
    return {
        response: { ptProblem }
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(Object.assign({}, ptProblem), dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(translate()(PtProblemAddTicketName));
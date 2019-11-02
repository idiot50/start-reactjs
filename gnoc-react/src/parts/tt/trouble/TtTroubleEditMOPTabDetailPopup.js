import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Col, Row, Modal, ModalBody, ModalFooter, ModalHeader, Label } from 'reactstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { translate, Trans } from 'react-i18next';
import { toastr } from 'react-redux-toastr';
import * as commonActions from './../../../actions/commonActions';
import * as TtTroubleActions from './TtTroubleActions';
import CustomReactTable from "../../../containers/Utils/CustomReactTable";
import { CustomAvField } from '../../../containers/Utils';
import { AvForm } from 'availity-reactstrap-validation';
import { convertDateToDDMMYYYYHHMISS } from '../../../containers/Utils/Utils';

class TtTroubleEditMOPTabDetailPopup extends Component {
    constructor(props) {
        super(props);

        this.state = {
            btnSearchLoading: false,
            selectedData: props.parentState.mopDetail,
            objectSearch: {},
            backdrop: "static",
            //Table
            data: [],
            pages: null,
            loading: true,
            columns: this.buildTableColumns()
        };
    }

    componentWillReceiveProps(newProps) {
        if (newProps.parentState.mopDetail) {
            this.setState({ selectedData: newProps.parentState.mopDetail });
        }
    }

    buildTableColumns() {
        return [
            {
                Header: <Trans i18nKey="ttTrouble:ttTrouble.label.dtName" />,
                id: "dtName",
                width: 200,
                accessor: d => <span title={d.dtName}>{d.dtName}</span>
            },
            {
                Header: <Trans i18nKey="ttTrouble:ttTrouble.label.createTime" />,
                id: "createTime",
                width: 200,
                accessor: d => <span title={convertDateToDDMMYYYYHHMISS(d.createTime)}>{convertDateToDDMMYYYYHHMISS(d.createTime)}</span>
            },
            {
                Header: <Trans i18nKey="ttTrouble:ttTrouble.label.state" />,
                id: "state",
                width: 200,
                accessor: d => <span title={d.state}>{d.state}</span>
            },
            {
                Header: <Trans i18nKey="ttTrouble:ttTrouble.label.nodes" />,
                id: "nodes",
                width: 200,
                accessor: d => <span title={d.nodes}>{d.nodes}</span>
            },
            {
                Header: <Trans i18nKey="ttTrouble:ttTrouble.label.resultDetail" />,
                id: "resultDetail",
                width: 200,
                accessor: d => <span title={d.resultDetail}>{d.resultDetail}</span>
            },
            {
                Header: <Trans i18nKey="ttTrouble:ttTrouble.label.dtType" />,
                id: "dtFileType",
                width: 200,
                accessor: d => <span title={d.dtFileType}>{d.dtFileType}</span>
            },
            {
                Header: <Trans i18nKey="ttTrouble:ttTrouble.label.download" />,
                id: "download",
                minWidth: 100,
                className: "text-center",
                accessor: d => <Button size="sm" type="button" className="icon" onClick={() => this.downloadFile(d)}><i className="fa fa-download"></i></Button>
            }
        ];
    }

    onFetchData = (state, instance) => {
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

        const objectSearch = Object.assign({}, this.state.selectedData, values);

        this.setState({
            loading: true,
            objectSearch: objectSearch
        }, () => {
            this.getListTroubleMopDtDTO();
        });
    }

    getListTroubleMopDtDTO = () => {
        this.props.actions.getListTroubleMopDtDTO(this.state.objectSearch).then((response) => {
            this.setState({
                data: response.payload.data.data ? response.payload.data.data : [],
                pages: response.payload.data.pages,
                loading: false,
                btnSearchLoading: false
            });
        }).catch((response) => {
            this.setState({
                loading: false,
                btnSearchLoading: false
            });
            toastr.error(this.props.t("ttTrouble:ttTrouble.message.error.search"));
        });
    }

    downloadFile = (object) => {
        this.props.actions.downloadTroubleMopDt(object).then((response) => {
        }).catch((response) => {
            toastr.error(this.props.t("ttTrouble:ttTrouble.message.error.downloadFileHelp"));
        });
    }

    render() {
        const { t } = this.props;
        const { columns, data, pages, loading, selectedData } = this.state;
        const objectSearch = Object.assign({}, selectedData);
        if (objectSearch) {
            objectSearch.createTime = objectSearch.createTime ? convertDateToDDMMYYYYHHMISS(objectSearch.createTime) : "";
        }
        return (
            <Modal isOpen={this.props.parentState.isOpenDetailPopup} className={'modal-primary modal-lg ' + this.props.className}
                backdrop={this.state.backdrop} >
                <ModalHeader toggle={this.props.closePopup}>
                    {t("ttTrouble:ttTrouble.title.MOPDetail")}
                </ModalHeader>
                <ModalBody>
                    <AvForm model={objectSearch}>
                        <Row>
                            <Col xs="12" sm="4">
                                <CustomAvField name="mopName" label={t("ttTrouble:ttTrouble.label.mopName")} disabled />
                            </Col>
                            <Col xs="12" sm="4">
                                <CustomAvField name="groupMopName" label={t("ttTrouble:ttTrouble.label.groupMopName")} disabled />
                            </Col>
                            <Col xs="12" sm="4">
                                <CustomAvField name="system" label={t("ttTrouble:ttTrouble.label.system")} disabled />
                            </Col>
                        </Row>
                        <Row>
                            <Col xs="12" sm="4">
                                <CustomAvField name="maxNumberRun" label={t("ttTrouble:ttTrouble.label.maxNumberRun")} disabled />
                            </Col>
                            <Col xs="12" sm="4">
                                <CustomAvField name="numberRun" label={t("ttTrouble:ttTrouble.label.numberRun")} disabled />
                            </Col>
                            <Col xs="12" sm="4">
                                <CustomAvField name="runCycle" label={t("ttTrouble:ttTrouble.label.runCycle")} disabled />
                            </Col>
                        </Row>
                        <Row>
                            <Col xs="12" sm="4">
                                <CustomAvField name="runTypeName" label={t("ttTrouble:ttTrouble.label.runType")} disabled />
                            </Col>
                            <Col xs="12" sm="4">
                                <CustomAvField name="createTime" label={t("ttTrouble:ttTrouble.label.createTime")} disabled />
                            </Col>
                            <Col xs="12" sm="4">
                                <CustomAvField name="stateMopName" label={t("ttTrouble:ttTrouble.label.stateMopName")} disabled />
                            </Col>
                        </Row>
                        <Row>
                            <Col xs="12" sm="12">
                                <CustomAvField type="textarea" name="workLog" rows="5" label={t("ttTrouble:ttTrouble.label.workLogMop")} disabled />
                            </Col>
                        </Row>
                        <Row>
                            <Col xs="12" sm="12">
                                <CustomAvField type="textarea" name="domain" rows="5" label={t("ttTrouble:ttTrouble.label.domainMOP")} disabled />
                            </Col>
                        </Row>
                        <Row>
                            <Col xs="12" sm="12" className="align-self-center text-center">
                                <Button type="submit" className="btn btn-primary btn-md" onClick={this.props.closePopup}>
                                    <i className="fa fa-times-circle"></i> {t("common:common.button.close")}
                                </Button>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs="12">
                                <Label>{t("ttTrouble:ttTrouble.title.DTList")}</Label>
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
                    </AvForm>
                </ModalBody>
                <ModalFooter>
                    <Button type="button" color="secondary" onClick={this.props.closePopup}><i className="fa fa-times-circle"></i> {t("common:common.button.close")}</Button>
                </ModalFooter>
            </Modal>
        );
    }
}

TtTroubleEditMOPTabDetailPopup.propTypes = {
    parentState: PropTypes.object.isRequired,
    closePopup: PropTypes.func.isRequired
};

function mapStateToProps(state, ownProps) {
    const { ttTrouble, common } = state;
    return {
        response: { ttTrouble, common }
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(Object.assign({}, commonActions, TtTroubleActions), dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(translate()(TtTroubleEditMOPTabDetailPopup));
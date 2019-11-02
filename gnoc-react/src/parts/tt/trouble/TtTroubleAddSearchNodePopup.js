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
import LaddaButton, { ZOOM_OUT } from 'react-ladda';
import { AvForm } from 'availity-reactstrap-validation';

class TtTroubleAddSearchNodePopup extends Component {
    constructor(props) {
        super(props);

        this.state = {
            btnSearchLoading: false,
            selectedData: props.parentState.selectedData,
            objectSearch: {applySystem: "TT"},
            backdrop: "static",
            //Table
            data: [],
            pages: null,
            loading: true,
            columns: this.buildTableColumns(),
            dataChecked: []
        };
    }

    buildTableColumns() {
        return [
            {
                Header: <Trans i18nKey="ttTrouble:ttTrouble.label.deviceCode" />,
                id: "deviceCode",
                accessor: d => <span title={d.deviceCode}>{d.deviceCode}</span>
            },
            {
                Header: <Trans i18nKey="ttTrouble:ttTrouble.label.deviceName" />,
                id: "deviceName",
                accessor: d => <span title={d.deviceName}>{d.deviceName}</span>
            },
            {
                Header: <Trans i18nKey="ttTrouble:ttTrouble.label.ipNetworkNode" />,
                id: "ip",
                accessor: d => <span title={d.ip}>{d.ip}</span>
            },
            {
                Header: <Trans i18nKey="ttTrouble:ttTrouble.label.country" />,
                id: "nationCode",
                accessor: d => <span title={d.nationCode}>{d.nationCode}</span>
            },
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

        const objectSearch = Object.assign({}, this.state.objectSearch, values);

        this.setState({
            loading: true,
            objectSearch: objectSearch
        }, () => {
            this.getListNode();
        });
    }

    search = (event, values) => {
        const objectSearch = Object.assign({}, this.state.objectSearch, values);
        objectSearch.deviceCode = objectSearch.deviceCode ? objectSearch.deviceCode.trim() : "";
        objectSearch.ip = objectSearch.ip ? objectSearch.ip.trim() : "";
        objectSearch.page = 1;
        if (objectSearch.deviceCode || objectSearch.ip) {
            this.setState({
                btnSearchLoading: true,
                loading: true,
                objectSearch: objectSearch
            }, () => {
                this.customReactTable.resetPage();
                this.getListNode();
            });
        } else {
            toastr.warning(this.props.t("ttTrouble:ttTrouble.message.required.searchCondition"));
        }
    }

    getListNode = () => {
        if (this.state.objectSearch.deviceCode || this.state.objectSearch.ip) {
            this.props.actions.getListNode(this.state.objectSearch).then((response) => {
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
                toastr.error(this.props.t("ttTrouble:ttTrouble.message.error.getNetworkNode"));
            });
        } else {
            this.setState({
                loading: false,
                btnSearchLoading: false
            });
        }
    }

    closePopup = () => {
        this.setState({
            objectSearch: {},
            dataChecked: [],
            data: [],
            pages: null
        });
        this.props.closePopup();
    }

    handleDataCheckbox = (data) => {
        this.setState({
            dataChecked: data
        });
    }

    addDeviceCode = (dataChecked) => {
        if (dataChecked.length > 0) {
            this.props.setValue(dataChecked);
            this.closePopup();
        }
    }

    render() {
        const { t } = this.props;
        const { columns, data, pages, loading } = this.state;
        const objectSearch = {};
        return (
            <Modal isOpen={this.props.parentState.isOpenSearchNodePopup} className={'modal-primary modal-lg ' + this.props.className}
                backdrop={this.state.backdrop} >
                <ModalHeader toggle={this.closePopup}>
                    {t("ttTrouble:ttTrouble.title.networkNodeList")}
                </ModalHeader>
                <ModalBody>
                    <AvForm onValidSubmit={this.search} model={objectSearch}>
                        <Row>
                            <Col xs="12" sm="5">
                                <CustomAvField name="deviceCode" label={this.props.t("ttTrouble:ttTrouble.label.codeNameNetworkNode")}
                                placeholder={this.props.t("ttTrouble:ttTrouble.placeholder.codeNameNetworkNode")} />
                            </Col>
                            <Col xs="12" sm="5">
                                <CustomAvField name="ip" label={this.props.t("ttTrouble:ttTrouble.label.ipNetworkNode")}
                                placeholder={this.props.t("ttTrouble:ttTrouble.placeholder.ipNetworkNode")} />
                            </Col>
                            <Col xs="12" sm="2">
                                <Row className="mb-2">
                                    <Col xs="12"><Label></Label></Col>
                                </Row>
                                <Row>
                                    <LaddaButton type="submit"
                                        className="btn btn-primary btn-md mr-1"
                                        loading={this.state.btnSearchLoading}
                                        data-style={ZOOM_OUT}>
                                        <i className="fa fa-search"></i> {t("common:common.title.search")}
                                    </LaddaButton>
                                    {/* <Button type="button" size="md" color="primary" className="mr-1" onClick={() => {}}>
                                        <i className="fa fa-file"></i> {t("ttTrouble:ttTrouble.button.loadFromQLTN")}
                                    </Button> */}
                                </Row>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs="12">
                                <Label>{t("ttTrouble:ttTrouble.label.searchResult")}</Label>
                                <CustomReactTable
                                    onRef={ref => (this.customReactTable = ref)}
                                    columns={columns}
                                    data={data}
                                    pages={pages}
                                    loading={loading}
                                    onFetchData={this.onFetchData}
                                    defaultPageSize={10}
                                    isCheckbox={true}
                                    propsCheckbox={["deviceCode", "deviceName", "ip", "nationCode", "ipId", "deviceId"]}
                                    handleDataCheckbox={this.handleDataCheckbox}
                                    // isChooseOneCheckbox={true}
                                    // handleChooseOneCheckbox={() => {toastr.warning(this.props.t("ttTrouble:ttTrouble.message.required.onlyOneRecord"));}}
                                />
                            </Col>
                        </Row>
                    </AvForm>
                </ModalBody>
                <ModalFooter>
                    <Button type="button" color="primary" disabled={this.state.dataChecked.length < 1} className="ml-auto" onClick={() => this.addDeviceCode(this.state.dataChecked)}><i className="fa fa-check"></i> {t("common:common.button.choose")}</Button>
                    <Button type="button" color="secondary" onClick={this.closePopup} className="mr-auto"><i className="fa fa-times-circle"></i> {t("common:common.button.close")}</Button>
                </ModalFooter>
            </Modal>
        );
    }
}

TtTroubleAddSearchNodePopup.propTypes = {
    parentState: PropTypes.object.isRequired,
    closePopup: PropTypes.func.isRequired,
    setValue: PropTypes.func
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

export default connect(mapStateToProps, mapDispatchToProps)(translate()(TtTroubleAddSearchNodePopup));
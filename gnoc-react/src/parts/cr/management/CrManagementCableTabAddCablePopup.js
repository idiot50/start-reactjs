import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Col, Row, Modal, ModalBody, ModalFooter, ModalHeader, Label } from 'reactstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { translate, Trans } from 'react-i18next';
import { toastr } from 'react-redux-toastr';
import * as commonActions from './../../../actions/commonActions';
import * as CrManagementActions from './CrManagementActions';
import CustomReactTable from "../../../containers/Utils/CustomReactTable";
import { CustomAvField, CustomSelectLocal } from '../../../containers/Utils';
import LaddaButton, { ZOOM_OUT } from 'react-ladda';
import { AvForm } from 'availity-reactstrap-validation';
import { invalidSubmitForm } from '../../../containers/Utils/Utils';

class CrManagementCableTabAddCablePopup extends Component {
    constructor(props) {
        super(props);

        this.state = {
            btnSearchLoading: false,
            selectedData: props.parentState.selectedData,
            objectSearch: {},
            backdrop: "static",
            //Table
            dataCable: [],
            pagesCable: null,
            loadingCable: true,
            columnsCable: this.buildTableColumnsCable(),
            dataCheckedCable: [],
            dataLinkInfo: [],
            pagesLinkInfo: null,
            loadingLinkInfo: false,
            columnsLinkInfo: this.buildTableColumnsLinkInfo(),
            valueLaneCode: "",
            selectValueNation: {}
        };
    }

    componentDidMount() {
        if (this.props.onRef) {
            this.props.onRef(this);
        }
    }

    componentWillUnmount() {
        if (this.props.onRef) {
            this.props.onRef(undefined);
        }
    }

    setDataCablePopup(data) {
        if (data.length > 0) {
            const nationCode = data[0].nationCode;
            const laneCodeList = [];
            for (const da of data) {
                laneCodeList.push(da.cableCode);
            }
            this.setState({
                valueLaneCode: laneCodeList.join(";"),
                selectValueNation: nationCode ? { value: nationCode } : {}
            }, () => {
                this.getListCable();
            });
        }
    }

    buildTableColumnsCable() {
        return [
            {
                Header: <Trans i18nKey="crManagement:crManagement.label.laneCode" />,
                id: "cableCode",
                minWidth: 150,
                accessor: d => d.cableCode ? <span title={d.cableCode}>{d.cableCode}</span> : <span>&nbsp;</span>
            },
            {
                Header: <Trans i18nKey="crManagement:crManagement.label.startPoint" />,
                id: "startPoint",
                minWidth: 150,
                accessor: d => d.startPoint ? <span title={d.startPoint}>{d.startPoint}</span> : <span>&nbsp;</span>
            },
            {
                Header: <Trans i18nKey="crManagement:crManagement.label.endPoint" />,
                id: "endPoint",
                minWidth: 150,
                accessor: d => d.endPoint ? <span title={d.endPoint}>{d.endPoint}</span> : <span>&nbsp;</span>
            },
            {
                Header: <Trans i18nKey="crManagement:crManagement.label.nation" />,
                id: "nationCode",
                minWidth: 150,
                accessor: d => d.nationCode ? <span title={d.nationCode}>{d.nationCode}</span> : <span>&nbsp;</span>
            },
            {
                Header: <Trans i18nKey="crManagement:crManagement.label.createTime" />,
                id: "createdDate",
                minWidth: 150,
                accessor: d => d.createdDate ? <span title={d.createdDate}>{d.createdDate}</span> : <span>&nbsp;</span>
            }
        ];
    }

    onFetchDataCable = (state, instance) => {
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
            loadingCable: true,
            objectSearch: objectSearch
        }, () => {
            this.getListCable();
        });
    }

    getListCable = () => {
        const objectSearch = Object.assign({}, this.state.objectSearch);
        objectSearch.laneCode = this.state.valueLaneCode;
        objectSearch.nationCode = this.state.selectValueNation.value ? this.state.selectValueNation.value : "";
        this.props.actions.searchCableInLane(objectSearch).then((response) => {
            this.setState({
                dataCable: response.payload.data.data ? response.payload.data.data : [],
                pagesCable: response.payload.data.pages,
                loadingCable: false
            });
        }).catch((response) => {
            this.setState({
                loadingCable: false
            });
            toastr.error(this.props.t("crManagement:crManagement.message.error.searchCable"));
        });
    }

    closePopup = () => {
        this.setState({
            objectSearch: {},
            dataCheckedCable: [],
            dataCable: [],
            pagesCable: null,
            dataLinkInfo: [],
            pagesLinkInfo: null
        });
        this.props.closePopup();
    }

    setValue = (dataCheckedCable) => {
        if (dataCheckedCable.length > 0) {
            const objectSearch = Object.assign({}, this.state.objectSearch);
            const lstCableCode = [];
            for (const da of dataCheckedCable) {
                lstCableCode.push(da.cableCode);
            }
            objectSearch.lstCableCode = lstCableCode;
            if (objectSearch.lstCableCode.length > 0) {
                this.props.actions.searchLinkInfo(objectSearch).then((response) => {
                    this.props.setValue(dataCheckedCable, response.payload.data.data ? response.payload.data.data : []);
                    this.closePopup();
                }).catch((response) => {
                    toastr.error(this.props.t("crManagement:crManagement.message.error.searchLinkInfo"));
                });
            } else {
                this.props.setValue(dataCheckedCable, []);
                this.closePopup();
            }
        }
    }

    handleInvalidSubmitAddOrEdit = (event, errors, values) => {
        toastr.warning(this.props.t("common:common.message.required.allFields"));
        invalidSubmitForm(event, errors, values, "idFormSearchCablePopup");
    }

    buildTableColumnsLinkInfo() {
        return [
            {
                Header: <Trans i18nKey="crManagement:crManagement.label.capacity" />,
                id: "capacity",
                minWidth: 150,
                accessor: d => d.capacity ? <span title={d.capacity}>{d.capacity}</span> : <span>&nbsp;</span>
            },
            {
                Header: <Trans i18nKey="crManagement:crManagement.label.linkCode" />,
                id: "linkName",
                minWidth: 150,
                accessor: d => d.linkName ? <span title={d.linkName}>{d.linkName}</span> : <span>&nbsp;</span>
            },
            {
                Header: <Trans i18nKey="crManagement:crManagement.label.device1" />,
                id: "device1",
                minWidth: 150,
                accessor: d => d.device1 ? <span title={d.device1}>{d.device1}</span> : <span>&nbsp;</span>
            },
            {
                Header: <Trans i18nKey="crManagement:crManagement.label.device2" />,
                id: "device2",
                minWidth: 150,
                accessor: d => d.device2 ? <span title={d.device2}>{d.device2}</span> : <span>&nbsp;</span>
            },
            {
                Header: <Trans i18nKey="crManagement:crManagement.label.port1" />,
                id: "port1",
                minWidth: 150,
                accessor: d => d.port1 ? <span title={d.port1}>{d.port1}</span> : <span>&nbsp;</span>
            },
            {
                Header: <Trans i18nKey="crManagement:crManagement.label.port2" />,
                id: "port2",
                minWidth: 150,
                accessor: d => d.port2 ? <span title={d.port2}>{d.port2}</span> : <span>&nbsp;</span>
            },
            {
                Header: <Trans i18nKey="crManagement:crManagement.label.fiber" />,
                id: "fiber",
                minWidth: 150,
                accessor: d => d.fiber ? <span title={d.fiber}>{d.fiber}</span> : <span>&nbsp;</span>
            },
            {
                Header: <Trans i18nKey="crManagement:crManagement.label.createDate" />,
                id: "createTime",
                minWidth: 150,
                accessor: d => d.createTime ? <span title={d.createTime}>{d.createTime}</span> : <span>&nbsp;</span>
            },
            {
                Header: <Trans i18nKey="crManagement:crManagement.label.modifyTime" />,
                id: "modifyTime",
                minWidth: 150,
                accessor: d => d.modifyTime ? <span title={d.modifyTime}>{d.modifyTime}</span> : <span>&nbsp;</span>
            }
        ];
    }

    onFetchDataLinkInfo = (state, instance) => {
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
            loadingLinkInfo: false,
            objectSearch: objectSearch
        }, () => {
            this.getListLinkInfo();
        });
    }

    search = (event, values) => {
        const objectSearch = Object.assign({}, this.state.objectSearch, values);
        const lstCableCode = [];
        for (const da of this.state.dataCable) {
            lstCableCode.push(da.cableCode);
        }
        objectSearch.lstCableCode = lstCableCode;
        objectSearch.page = 1;
        if (objectSearch.lstCableCode.length > 0) {
            this.setState({
                btnSearchLoading: true,
                loadingLinkInfo: true,
                objectSearch: objectSearch
            }, () => {
                this.customReactTableLinkInfo.resetPage();
                this.getListLinkInfo();
            });
        } else {
            toastr.warning(this.props.t("crManagement:crManagement.message.required.searchCondition"));
        }
    }

    getListLinkInfo = () => {
        const objectSearch = Object.assign({}, this.state.objectSearch);
        const lstCableCode = [];
        for (const da of this.state.dataCheckedCable) {
            lstCableCode.push(da.cableCode);
        }
        objectSearch.lstCableCode = lstCableCode;
        if (objectSearch.lstCableCode.length > 0) {
            this.props.actions.searchLinkInfo(objectSearch).then((response) => {
                this.setState({
                    dataLinkInfo: response.payload.data.data ? response.payload.data.data : [],
                    pagesLinkInfo: response.payload.data.pages,
                    loadingLinkInfo: false,
                    btnSearchLoading: false
                });
            }).catch((response) => {
                this.setState({
                    loadingLinkInfo: false,
                    btnSearchLoading: false
                });
                toastr.error(this.props.t("crManagement:crManagement.message.error.searchLinkInfo"));
            });
        } else {
            this.setState({
                loadingLinkInfo: false,
                btnSearchLoading: false
            });
        }
    }

    render() {
        const { t, response } = this.props;
        const { columnsCable, dataCable, pagesCable, loadingCable, columnsLinkInfo, dataLinkInfo, pagesLinkInfo, loadingLinkInfo } = this.state;
        const nationList = (response.common.timezone && response.common.timezone.payload) ? response.common.timezone.payload.data : [];
        const objectSearch = {};
        return (
            <Modal isOpen={this.props.parentState.isOpenAddCablePopup} className={'modal-primary modal-lg ' + this.props.className}
                backdrop={this.state.backdrop} >
                <ModalHeader toggle={this.closePopup}>
                    {t("crManagement:crManagement.title.laneList")}
                </ModalHeader>
                <ModalBody>
                    <AvForm id="idFormSearchCablePopup" onValidSubmit={this.search} onInvalidSubmit={this.handleInvalidSubmitAddOrEdit} model={objectSearch}>
                        <Row>
                            <Col xs="12" sm="6">
                                <CustomAvField name="laneCode" label={this.props.t("crManagement:crManagement.label.laneCode")} required
                                    disabled value={this.state.valueLaneCode} placeholder={this.props.t("crManagement:crManagement.placeholder.laneCode")} validate={{ required: { value: true, errorMessage: t("crManagement:crManagement.message.required.laneCode") } }} />
                            </Col>
                            <Col xs="12" sm="6">
                                <CustomSelectLocal
                                    name={"nationCode"}
                                    label={t("crManagement:crManagement.label.nation")}
                                    isRequired={true}
                                    messageRequire={t("crManagement:crManagement.message.required.nation")}
                                    options={Array.from(new Set(nationList.map(item => item.nationCode))).map(item => {return {itemId: item, itemName: item}})}
                                    closeMenuOnSelect={true}
                                    handleItemSelectChange={(d) => this.setState({ selectValueNation: d })}
                                    selectValue={this.state.selectValueNation}
                                    isDisabled={true}
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col xs="12">
                                <Label>{t("crManagement:crManagement.label.searchResult")}</Label>
                                <CustomReactTable
                                    onRef={ref => (this.customReactTableCable = ref)}
                                    columns={columnsCable}
                                    data={dataCable}
                                    pagesCable={pagesCable}
                                    loading={loadingCable}
                                    onFetchData={this.onFetchDataCable}
                                    defaultPageSize={10}
                                    isCheckbox={true}
                                    propsCheckbox={["cableCode", "startPoint", "endPoint", "nationCode", "createdDate"]}
                                    handleDataCheckbox={(d) => this.setState({ dataCheckedCable: d })}
                                />
                            </Col>
                        </Row>
                        <Row className="mt-2">
                            <Col xs="12" sm="12" style={{ textAlign: 'center' }}>
                                <LaddaButton type="submit"
                                    className="btn btn-primary btn-md mr-1"
                                    loading={this.state.btnSearchLoading}
                                    data-style={ZOOM_OUT}
                                    disabled={this.state.dataCheckedCable.length < 1}>
                                    <i className="fa fa-search"></i> {t("crManagement:crManagement.button.searchLink")}
                                </LaddaButton>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs="12">
                                <Label>{t("crManagement:crManagement.title.linkInfoList")}</Label>
                                <CustomReactTable
                                    onRef={ref => (this.customReactTableLinkInfo = ref)}
                                    columns={columnsLinkInfo}
                                    data={dataLinkInfo}
                                    pagesCable={pagesLinkInfo}
                                    loading={loadingLinkInfo}
                                    onFetchData={this.onFetchDataLinkInfo}
                                    defaultPageSize={10}
                                    isCheckbox={false}
                                />
                            </Col>
                        </Row>
                    </AvForm>
                </ModalBody>
                <ModalFooter>
                    <Button type="button" color="primary" disabled={this.state.dataCheckedCable.length < 1} className="ml-auto" onClick={() => this.setValue(this.state.dataCheckedCable)}><i className="fa fa-check"></i> {t("common:common.button.choose")}</Button>
                    <Button type="button" color="secondary" onClick={this.closePopup} className="mr-auto"><i className="fa fa-times-circle"></i> {t("common:common.button.close")}</Button>
                </ModalFooter>
            </Modal>
        );
    }
}

CrManagementCableTabAddCablePopup.propTypes = {
    parentState: PropTypes.object.isRequired,
    closePopup: PropTypes.func.isRequired,
    setValue: PropTypes.func
};

function mapStateToProps(state, ownProps) {
    const { crManagement, common } = state;
    return {
        response: { crManagement, common }
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(Object.assign({}, commonActions, CrManagementActions), dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(translate()(CrManagementCableTabAddCablePopup));
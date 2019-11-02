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

class CrManagementCableTabAddLanePopup extends Component {
    constructor(props) {
        super(props);

        this.state = {
            btnSearchLoading: false,
            selectedData: props.parentState.selectedData,
            objectSearch: {},
            backdrop: "static",
            //Table
            data: [],
            pages: null,
            loading: true,
            columns: this.buildTableColumns(),
            dataChecked: [],
            selectValueNation: {}
        };
    }

    buildTableColumns() {
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
            this.getListLane();
        });
    }

    search = (event, values) => {
        const objectSearch = Object.assign({}, this.state.objectSearch, values);
        objectSearch.laneCode = objectSearch.laneCode ? objectSearch.laneCode.trim() : "";
        objectSearch.startPoint = objectSearch.startPoint ? objectSearch.startPoint.trim() : "";
        objectSearch.endPoint = objectSearch.endPoint ? objectSearch.endPoint.trim() : "";
        objectSearch.nationCode = this.state.selectValueNation.value ? this.state.selectValueNation.value : "";
        objectSearch.page = 1;
        if (objectSearch.nationCode !== ""
            && (objectSearch.laneCode !== "" || objectSearch.startPoint !== "" || objectSearch.endPoint !== "")) {
            this.setState({
                btnSearchLoading: true,
                loading: true,
                objectSearch: objectSearch
            }, () => {
                this.customReactTable.resetPage();
                this.getListLane();
            });
        } else {
            toastr.warning(this.props.t("crManagement:crManagement.message.required.searchCondition"));
        }
    }

    getListLane = () => {
        const objectSearch = Object.assign({}, this.state.objectSearch);
        objectSearch.laneCode = objectSearch.laneCode ? objectSearch.laneCode.trim() : "";
        objectSearch.startPoint = objectSearch.startPoint ? objectSearch.startPoint.trim() : "";
        objectSearch.endPoint = objectSearch.endPoint ? objectSearch.endPoint.trim() : "";
        objectSearch.nationCode = this.state.selectValueNation.value ? this.state.selectValueNation.value : "";
        if (objectSearch.nationCode !== ""
            && (objectSearch.laneCode !== "" || objectSearch.startPoint !== "" || objectSearch.endPoint !== "")) {
            this.props.actions.searchInfraCable(objectSearch).then((response) => {
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
                toastr.error(this.props.t("crManagement:crManagement.message.error.searchLane"));
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
            selectValueNation: {}
        });
        this.props.closePopup();
    }

    handleDataCheckbox = (data) => {
        this.setState({
            dataChecked: data
        });
    }

    setValue = (dataChecked) => {
        if (dataChecked.length > 0) {
            this.props.setValue(dataChecked);
            this.closePopup();
        }
    }

    handleInvalidSubmitAddOrEdit = (event, errors, values) => {
        toastr.warning(this.props.t("common:common.message.required.allFields"));
        invalidSubmitForm(event, errors, values, "idFormSearchLanePopup");
    }

    render() {
        const { t, response } = this.props;
        const { columns, data, pages, loading } = this.state;
        const nationList = (response.common.timezone && response.common.timezone.payload) ? response.common.timezone.payload.data : [];
        const objectSearch = {};
        return (
            <Modal isOpen={this.props.parentState.isOpenAddLanePopup} className={'modal-primary modal-lg ' + this.props.className}
                backdrop={this.state.backdrop} >
                <ModalHeader toggle={this.closePopup}>
                    {t("crManagement:crManagement.title.laneList")}
                </ModalHeader>
                <ModalBody>
                    <AvForm id="idFormSearchLanePopup" onValidSubmit={this.search} onInvalidSubmit={this.handleInvalidSubmitAddOrEdit} model={objectSearch}>
                        <Row>
                            <Col xs="12" sm="3">
                                <CustomAvField name="laneCode" label={this.props.t("crManagement:crManagement.label.laneCode")}
                                placeholder={this.props.t("crManagement:crManagement.placeholder.laneCode")} />
                            </Col>
                            <Col xs="12" sm="3">
                                <CustomAvField name="startPoint" label={this.props.t("crManagement:crManagement.label.startPoint")}
                                placeholder={this.props.t("crManagement:crManagement.placeholder.startPoint")} />
                            </Col>
                            <Col xs="12" sm="3">
                                <CustomAvField name="endPoint" label={this.props.t("crManagement:crManagement.label.endPoint")}
                                placeholder={this.props.t("crManagement:crManagement.placeholder.endPoint")} />
                            </Col>
                            <Col xs="12" sm="3">
                                <CustomSelectLocal
                                    name={"nationCode"}
                                    label={t("crManagement:crManagement.label.nation")}
                                    isRequired={true}
                                    messageRequire={t("crManagement:crManagement.message.required.nation")}
                                    options={Array.from(new Set(nationList.map(item => item.nationCode))).map(item => {return {itemId: item, itemName: item}})}
                                    closeMenuOnSelect={true}
                                    handleItemSelectChange={(d) => this.setState({ selectValueNation: d })}
                                    selectValue={this.state.selectValueNation}
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col xs="12" sm="12" style={{ textAlign: 'center' }}>
                                <LaddaButton type="submit"
                                    className="btn btn-primary btn-md mr-1"
                                    loading={this.state.btnSearchLoading}
                                    data-style={ZOOM_OUT}>
                                    <i className="fa fa-search"></i> {t("common:common.title.search")}
                                </LaddaButton>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs="12">
                                <Label>{t("crManagement:crManagement.label.searchResult")}</Label>
                                <CustomReactTable
                                    onRef={ref => (this.customReactTable = ref)}
                                    columns={columns}
                                    data={data}
                                    pages={pages}
                                    loading={loading}
                                    onFetchData={this.onFetchData}
                                    defaultPageSize={10}
                                    isCheckbox={true}
                                    propsCheckbox={["cableCode", "startPoint", "endPoint", "nationCode", "createdDate"]}
                                    handleDataCheckbox={this.handleDataCheckbox}
                                />
                            </Col>
                        </Row>
                    </AvForm>
                </ModalBody>
                <ModalFooter>
                    <Button type="button" color="primary" disabled={this.state.dataChecked.length < 1} className="ml-auto" onClick={() => this.setValue(this.state.dataChecked)}><i className="fa fa-check"></i> {t("common:common.button.choose")}</Button>
                    <Button type="button" color="secondary" onClick={this.closePopup} className="mr-auto"><i className="fa fa-times-circle"></i> {t("common:common.button.close")}</Button>
                </ModalFooter>
            </Modal>
        );
    }
}

CrManagementCableTabAddLanePopup.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(translate()(CrManagementCableTabAddLanePopup));
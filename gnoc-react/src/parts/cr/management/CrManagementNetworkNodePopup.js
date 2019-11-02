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
import { invalidSubmitForm, validSubmitForm } from '../../../containers/Utils/Utils';

class CrManagementNetworkNodePopup extends Component {
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
            selectValueNation: { value: "VNM" }
        };
    }

    buildTableColumns() {
        return [
            {
                Header: <Trans i18nKey="crManagement:crManagement.label.deviceCode" />,
                id: "deviceCode",
                accessor: d => <span title={d.deviceCode}>{d.deviceCode}</span>
            },
            {
                Header: <Trans i18nKey="crManagement:crManagement.label.deviceName" />,
                id: "deviceName",
                accessor: d => <span title={d.deviceName}>{d.deviceName}</span>
            },
            {
                Header: <Trans i18nKey="crManagement:crManagement.label.ipNetworkNode" />,
                id: "ip",
                accessor: d => <span title={d.ip}>{d.ip}</span>
            },
            {
                Header: <Trans i18nKey="crManagement:crManagement.label.nationCode" />,
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
            this.getListNodeV2();
        });
    }

    search = (event, values) => {
        validSubmitForm(event, values, "idFormSearchNetworkNode");
        const objectSearch = Object.assign({}, this.state.objectSearch, values);
        objectSearch.deviceCode = objectSearch.deviceCode ? objectSearch.deviceCode.trim() : "";
        objectSearch.ip = objectSearch.ip ? objectSearch.ip.trim() : "";
        objectSearch.nationCode = this.state.selectValueNation.value;
        objectSearch.page = 1;
        if (objectSearch.deviceCode || objectSearch.ip) {
            this.setState({
                btnSearchLoading: true,
                loading: true,
                objectSearch: objectSearch
            }, () => {
                this.customReactTable.resetPage();
                this.getListNodeV2();
            });
        } else {
            toastr.warning(this.props.t("crManagement:crManagement.message.required.searchCondition"));
        }
    }

    getListNodeV2 = () => {
        if (this.state.objectSearch.deviceCode || this.state.objectSearch.ip) {
            this.props.actions.getListNodeV2(this.state.objectSearch).then((response) => {
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
                toastr.error(this.props.t("crManagement:crManagement.message.error.getNetworkNode"));
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

    setValue = (dataChecked) => {
        if (dataChecked.length > 0) {
            this.props.setValue(dataChecked);
            this.closePopup();
        }
    }

    handleInvalidSubmitAddOrEdit = (event, errors, values) => {
        toastr.warning(this.props.t("common:common.message.required.allFields"));
        invalidSubmitForm(event, errors, values, "idFormSearchNetworkNode");
    }

    handleLoadFromQLTN = () => {
        this.props.actions.getNetworkNodeFromQLTN("").then((response) => {
            console.log(response)
        }).catch((response) => {
            toastr.error(this.props.t("crManagement:crManagement.message.error.loadFromQLTN"));
        });
    }

    render() {
        const { t, response } = this.props;
        const { columns, data, pages, loading } = this.state;
        const nationList = (response.common.timezone && response.common.timezone.payload) ? response.common.timezone.payload.data : [];
        const objectSearch = {};
        return (
            <Modal isOpen={this.props.parentState.isOpenNetworkNodePopup} className={'modal-primary modal-lg ' + this.props.className}
                backdrop={this.state.backdrop} >
                <ModalHeader toggle={this.closePopup}>
                    {t("crManagement:crManagement.title.networkNodeList")}
                </ModalHeader>
                <ModalBody>
                    <AvForm id="idFormSearchNetworkNode" onValidSubmit={this.search} onInvalidSubmit={this.handleInvalidSubmitAddOrEdit} model={objectSearch}>
                        <Row>
                            <Col xs="12" sm="3">
                                <CustomAvField name="deviceCode" label={this.props.t("crManagement:crManagement.label.codeNameNetworkNode")}
                                placeholder={this.props.t("crManagement:crManagement.placeholder.codeNameNetworkNode")} />
                            </Col>
                            <Col xs="12" sm="3">
                                <CustomAvField name="ip" label={this.props.t("crManagement:crManagement.label.ipNetworkNode")}
                                placeholder={this.props.t("crManagement:crManagement.placeholder.ipNetworkNode")} />
                            </Col>
                            <Col xs="12" sm="3">
                                <CustomSelectLocal
                                    name={"nation"}
                                    label={t("crManagement:crManagement.label.nation")}
                                    isRequired={true}
                                    messageRequire={t("crManagement:crManagement.message.required.nation")}
                                    options={Array.from(new Set(nationList.map(item => item.nationCode))).map(item => {return {itemId: item, itemName: item}})}
                                    closeMenuOnSelect={true}
                                    handleItemSelectChange={(d) => this.setState({ selectValueNation: d })}
                                    selectValue={this.state.selectValueNation}
                                />
                            </Col>
                            <Col xs="12" sm="3">
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
                                    <Button type="button" size="md" color="primary" className="mr-1" onClick={this.handleLoadFromQLTN}>
                                        <i className="fa fa-file"></i> {t("crManagement:crManagement.button.loadFromQLTN")}
                                    </Button>
                                </Row>
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
                                    propsCheckbox={[]}
                                    handleDataCheckbox={this.handleDataCheckbox}
                                    // isChooseOneCheckbox={true}
                                    // handleChooseOneCheckbox={() => {toastr.warning(this.props.t("crManagement:crManagement.message.required.onlyOneRecord"));}}
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

CrManagementNetworkNodePopup.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(translate()(CrManagementNetworkNodePopup));
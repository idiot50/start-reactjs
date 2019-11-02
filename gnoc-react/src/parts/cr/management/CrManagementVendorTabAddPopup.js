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
            selectValueNation: {}
        };
    }

    buildTableColumns() {
        return [
            {
                Header: <Trans i18nKey="crManagement:crManagement.label.vendorCode" />,
                id: "vendorCode",
                minWidth: 150,
                accessor: d => d.vendorCode ? <span title={d.vendorCode}>{d.vendorCode}</span> : <span>&nbsp;</span>
            },
            {
                Header: <Trans i18nKey="crManagement:crManagement.label.vendorName" />,
                id: "vendorName",
                minWidth: 150,
                accessor: d => d.vendorName ? <span title={d.vendorName}>{d.vendorName}</span> : <span>&nbsp;</span>
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
            this.getListVendor();
        });
    }

    search = (event, values) => {
        const objectSearch = Object.assign({}, this.state.objectSearch, values);
        objectSearch.vendorCode = objectSearch.vendorCode ? objectSearch.vendorCode.trim() : "";
        objectSearch.vendorName = objectSearch.vendorName ? objectSearch.vendorName.trim() : "";
        objectSearch.page = 1;
        if (objectSearch.vendorCode !== "" || objectSearch.vendorName !== "") {
            this.setState({
                btnSearchLoading: true,
                loading: true,
                objectSearch: objectSearch
            }, () => {
                this.customReactTable.resetPage();
                this.getListVendor();
            });
        } else {
            toastr.warning(this.props.t("crManagement:crManagement.message.required.searchCondition"));
        }
    }

    getListVendor = () => {
        const objectSearch = Object.assign({}, this.state.objectSearch);
        objectSearch.vendorCode = objectSearch.vendorCode ? objectSearch.vendorCode.trim() : "";
        objectSearch.vendorName = objectSearch.vendorName ? objectSearch.vendorName.trim() : "";
        if (objectSearch.vendorCode !== "" || objectSearch.vendorName !== "") {
            this.props.actions.searchVendorList(objectSearch).then((response) => {
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
        invalidSubmitForm(event, errors, values, "idFormSearchVendor");
    }

    render() {
        const { t } = this.props;
        const { columns, data, pages, loading } = this.state;
        const objectSearch = {};
        return (
            <Modal isOpen={this.props.parentState.isOpenAddVendorPopup} className={'modal-primary modal-lg ' + this.props.className}
                backdrop={this.state.backdrop} >
                <ModalHeader toggle={this.closePopup}>
                    {t("crManagement:crManagement.title.vendorList")}
                </ModalHeader>
                <ModalBody>
                    <AvForm id="idFormSearchVendor" onValidSubmit={this.search} onInvalidSubmit={this.handleInvalidSubmitAddOrEdit} model={objectSearch}>
                        <Row>
                            <Col xs="12" sm="5">
                                <CustomAvField name="vendorCode" label={this.props.t("crManagement:crManagement.label.vendorCode")}
                                placeholder={this.props.t("crManagement:crManagement.placeholder.vendorCode")} />
                            </Col>
                            <Col xs="12" sm="5">
                                <CustomAvField name="vendorName" label={this.props.t("crManagement:crManagement.label.vendorName")}
                                placeholder={this.props.t("crManagement:crManagement.placeholder.vendorName")} />
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
                                    propsCheckbox={["vendorCode"]}
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
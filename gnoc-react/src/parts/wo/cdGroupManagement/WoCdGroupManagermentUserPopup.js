import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as commonActions from '../../../actions/commonActions';
import * as WoCdGroupManagementActions from './WoCdGroupManagementActions';
import { translate, Trans } from 'react-i18next';
import { bindActionCreators } from 'redux';
import { CustomReactTable } from "../../../containers/Utils";
import { Button, Col, Row, Modal, ModalBody, ModalFooter, ModalHeader, Label } from 'reactstrap';
import { AvForm } from 'availity-reactstrap-validation';
import { toastr } from 'react-redux-toastr';
import { CustomAvField } from '../../../containers/Utils';
import LaddaButton, { ZOOM_OUT } from 'react-ladda';



class WoCdGroupManagermentUserPopup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            columns: this.buildUserTableColumns(),
            pages: null,
            loading: false,
            //Modal
            backdrop: "static",
            dataChecked: [],
            objectSearch: {}
        }
    }

    buildUserTableColumns() {
        return [
            {
                Header: <Trans i18nKey="woCdGroupManagement:woCdGroupManagement.label.username" />,
                id: "username",
                sortable: false,
                accessor: d => <span title={d.username}>{d.username}</span>
            },
            {
                Header: <Trans i18nKey="woCdGroupManagement:woCdGroupManagement.label.fullname" />,
                id: "fullname",
                sortable: false,
                accessor: d => <span title={d.fullname}>{d.fullname}</span>

            },
            {
                Header: <Trans i18nKey="woCdGroupManagement:woCdGroupManagement.label.email" />,
                id: "email",
                sortable: false,
                accessor: d => <span title={d.email}>{d.email}</span>

            },
            {
                Header: <Trans i18nKey="woCdGroupManagement:woCdGroupManagement.label.phoneNumber" />,
                id: "mobile",
                sortable: false,
                accessor: d => <span title={d.mobile}>{d.mobile}</span>

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
            this.getListUser();
        });
    }

    search = (event, values) => {
        const objectSearch = Object.assign({},this.state.objectSearch, values);
        objectSearch.page = 1;
        this.setState({
            btnSearchLoading: true,
            loading: true,
            objectSearch: objectSearch
        }, () => {
            this.customReactTable.resetPage();
            this.getListUser();
        });
    }

    getListUser = () => {
        this.props.actions.getListUserDTO(this.state.objectSearch).then((response) => {
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
        const { isOpenUserPopup } = this.props.parentState;
        const { dataChecked, columns, data, pages, loading } = this.state;
        const objectSearch = {};
        return (
            <Modal isOpen={isOpenUserPopup}
                className={'modal-primary modal-lg ' + this.props.className}
                backdrop={this.state.backdrop}>
                <ModalHeader toggle={this.closePopup}>
                    {t("woCdGroupManagement:woCdGroupManagement.title.userPopup")}
                </ModalHeader>
                <ModalBody>
                    <AvForm onValidSubmit={this.search} model={objectSearch}>
                        <Row>
                            <Col xs="12" sm="5">
                                <CustomAvField name="username" label={this.props.t("woCdGroupManagement:woCdGroupManagement.label.username")}
                                    placeholder={this.props.t("woCdGroupManagement:woCdGroupManagement.placeholder.username")} />
                            </Col>
                            <Col xs="12" sm="5">
                                <CustomAvField name="fullname" label={this.props.t("woCdGroupManagement:woCdGroupManagement.label.fullname")}
                                    placeholder={this.props.t("woCdGroupManagement:woCdGroupManagement.placeholder.fullname")} />
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
                            <Col xs="12" sm="12">
                                <Label>{t("woCdGroupManagement:woCdGroupManagement.label.searchResult")}</Label>
                                <CustomReactTable
                                    onRef={ref => (this.customReactTable = ref)}
                                    columns={columns}
                                    data={data}
                                    pages={pages}
                                    loading={loading}
                                    onFetchData={this.onFetchData}
                                    defaultPageSize={10}
                                    isCheckbox={true}
                                    propsCheckbox={["username", "fullname", "email", "mobile", "userId"]}
                                    handleDataCheckbox={this.handleDataCheckbox}
                                    isChooseOneCheckbox={false}
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col xs="12" className="text-center mt-2">
                                <Button type="button" color="primary" className="ml-auto" disabled={this.state.dataChecked.length < 1} onClick={() => this.addDeviceCode(dataChecked)} style={{ marginRight: '1em' }}><i className="fa fa-check"></i> {t("woCdGroupManagement:woCdGroupManagement.button.choose")}</Button>
                                <Button type="button" color="secondary" className="mr-auto" onClick={() => this.closePopup()}><i className="fa fa-close"></i> {t("woCdGroupManagement:woCdGroupManagement.button.close")}</Button>
                            </Col>
                        </Row>

                    </AvForm>

                </ModalBody>

            </Modal>
        );
    }
}

WoCdGroupManagermentUserPopup.propTypes = {
    parentState: PropTypes.object.isRequired,
    closePopup: PropTypes.func.isRequired,
    setValue: PropTypes.func.isRequired
}

function mapStateToProps(state) {
    const { woCdGroupManagement, common } = state;
    return {
        response: { woCdGroupManagement, common }
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(Object.assign({}, WoCdGroupManagementActions, commonActions), dispatch)
    };
}


export default connect(mapStateToProps, mapDispatchToProps)(translate()(WoCdGroupManagermentUserPopup));
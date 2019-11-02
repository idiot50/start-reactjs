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
import { CustomAvField } from '../../../containers/Utils';
import LaddaButton, { ZOOM_OUT } from 'react-ladda';
import { AvForm } from 'availity-reactstrap-validation';
import { invalidSubmitForm } from '../../../containers/Utils/Utils';

class CrManagementInfoTabCrRelatedPopup extends Component {
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
            dataChoose: props.parentState.sourceCreateCr,
            dataChooseChecked: [],
            selectValueRelatedCr: {},
            selectValueCrType: {}
        };
    }

    componentWillReceiveProps(newProps) {
        if (newProps.parentState.selectValueRelatedCr) {
            this.setState({ selectValueRelatedCr: newProps.parentState.selectValueRelatedCr });
        }
        if (newProps.parentState.selectValueCrType) {
            this.setState({ selectValueCrType: newProps.parentState.selectValueCrType });
        }
    }

    buildTableColumns() {
        return [
            {
                Header: <Trans i18nKey="crManagement:crManagement.label.crNumber" />,
                id: "crNumber",
                minWidth: 150,
                accessor: d => <span title={d.crNumber}>{d.crNumber}</span>
            },
            {
                Header: <Trans i18nKey="crManagement:crManagement.label.crName" />,
                id: "title",
                minWidth: 150,
                accessor: d => <span title={d.title}>{d.title}</span>
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
            this.getListCrForRelateOrPreApprove();
        });
    }

    search = (event, values) => {
        const objectSearch = Object.assign({}, this.state.objectSearch, values);
        objectSearch.crNumber = objectSearch.crNumber ? objectSearch.crNumber.trim() : "";
        objectSearch.title = objectSearch.title ? objectSearch.title.trim() : "";
        objectSearch.searchType = 0;
        objectSearch.relateCr = this.state.selectValueRelatedCr.value || "";
        objectSearch.crType = this.state.selectValueCrType.value || "";
        objectSearch.page = 1;
        if (objectSearch.title || objectSearch.crNumber) {
            this.setState({
                btnSearchLoading: true,
                loading: true,
                objectSearch: objectSearch
            }, () => {
                this.customReactTable.resetPage();
                this.getListCrForRelateOrPreApprove();
            });
        } else {
            toastr.warning(this.props.t("crManagement:crManagement.message.required.searchCondition"));
        }
    }

    getListCrForRelateOrPreApprove = () => {
        const { objectSearch } = this.state;
        if (objectSearch.title || objectSearch.crNumber) {
            this.props.actions.getListCrForRelateOrPreApprove(objectSearch).then((response) => {
                this.setState({
                    data: response.payload.data.data ? response.payload.data.data : [],
                    pages: (response.payload.data.data && response.payload.data.data.length > 0) ? response.payload.data.data[0].pageSize : 0,
                    loading: false,
                    btnSearchLoading: false
                });
            }).catch((response) => {
                this.setState({
                    loading: false,
                    btnSearchLoading: false
                });
                toastr.error(this.props.t("crManagement:crManagement.message.error.getListCrForRelateOrPreApprove"));
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
            data: []
        });
        this.props.closePopup();
    }

    handleDataCheckbox = (data) => {
        this.setState({
            dataChecked: data
        });
    }

    handleInvalidSubmitAddOrEdit = (event, errors, values) => {
        toastr.warning(this.props.t("common:common.message.required.allFields"));
        invalidSubmitForm(event, errors, values, "idFormSearchCrRelated");
    }

    setValue = () => {
        this.props.setValue(this.state.dataChecked);
        this.closePopup();
    }

    render() {
        const { t } = this.props;
        const { columns, data, pages, loading } = this.state;
        const objectSearch = {};
        return (
            <Modal isOpen={this.props.parentState.isOpenCrRelatedPopup} className={'modal-primary modal-lg ' + this.props.className}
                backdrop={this.state.backdrop} >
                <ModalHeader toggle={this.closePopup}>
                    {t("crManagement:crManagement.label.relatedCr")}
                </ModalHeader>
                <ModalBody>
                    <AvForm id="idFormSearchCrRelated" onValidSubmit={this.search} onInvalidSubmit={this.handleInvalidSubmitAddOrEdit} model={objectSearch}>
                        <Row>
                            <Col xs="12" sm="6">
                                <CustomAvField name="crNumber" label={this.props.t("crManagement:crManagement.label.crNumber")} />
                            </Col>
                            <Col xs="12" sm="6">
                                <CustomAvField name="title" label={this.props.t("crManagement:crManagement.label.crName")} />
                            </Col>
                        </Row>
                        <Row className="mt-2 mb-2">
                            <Col xs="12" sm="12" style={{ textAlign: 'center' }}>
                                <LaddaButton type="submit"
                                    className="btn btn-primary btn-md mr-1"
                                    loading={this.state.btnSearchLoading}
                                    data-style={ZOOM_OUT}>
                                    <i className="fa fa-search"></i> {t("crManagement:crManagement.button.search")}
                                </LaddaButton>
                            </Col>
                        </Row>
                        <Row style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
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
                                    handleDataCheckbox={(d) => this.setState({ dataChecked: d })}
                                    isChooseOneCheckbox={true}
                                    handleChooseOneCheckbox={() => {toastr.warning(this.props.t("crManagement:crManagement.message.required.onlyOneRecord"));}}
                                />
                            </Col>
                        </Row>
                    </AvForm>
                </ModalBody>
                <ModalFooter>
                    <Button type="button" color="primary" className="ml-auto" disabled={this.state.dataChecked.length < 1} onClick={this.setValue}><i className="fa fa-check"></i> {t("common:common.button.choose")}</Button>
                    <Button type="button" color="secondary" className="mr-auto" onClick={this.closePopup}><i className="fa fa-times-circle"></i> {t("common:common.button.close")}</Button>
                </ModalFooter>
            </Modal>
        );
    }
}

CrManagementInfoTabCrRelatedPopup.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(translate()(CrManagementInfoTabCrRelatedPopup));
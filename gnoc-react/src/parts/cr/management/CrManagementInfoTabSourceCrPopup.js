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
import { CustomAvField, CustomSelectLocal, CustomReactTableLocal } from '../../../containers/Utils';
import LaddaButton, { ZOOM_OUT } from 'react-ladda';
import { AvForm } from 'availity-reactstrap-validation';
import { invalidSubmitForm } from '../../../containers/Utils/Utils';
import { buildDataCbo } from './CrManagementUtils';

class CrManagementInfoTabSourceCrPopup extends Component {
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
            selectValueSystem: {}
        };
    }

    componentDidMount() {
        this.setState({
            selectValueSystem: {value: "3"}
        });
    }

    componentWillReceiveProps(newProps) {
        if (newProps.parentState.sourceCreateCr) {
            this.setState({ dataChoose: newProps.parentState.sourceCreateCr });
        }
    }

    buildTableColumns() {
        return [
            {
                Header: <Trans i18nKey="crManagement:crManagement.label.crParentCode" />,
                id: "itemName",
                minWidth: 150,
                accessor: d => <span title={d.itemName}>{d.itemName}</span>
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
            this.searchParentCr();
        });
    }

    search = (event, values) => {
        const objectSearch = Object.assign({}, this.state.objectSearch, values);
        objectSearch.code = objectSearch.code ? objectSearch.code.trim() : "";
        objectSearch.page = 1;
        this.setState({
            btnSearchLoading: true,
            loadingCable: true,
            objectSearch: objectSearch
        }, () => {
            this.customReactTable.resetPage();
            this.searchParentCr();
        });
    }

    searchParentCr = () => {
        const { objectSearch } = this.state;
        if (objectSearch.code && this.state.selectValueSystem.value) {
            this.props.actions.searchParentCr(this.state.selectValueSystem.value, objectSearch.code, objectSearch.page, objectSearch.pageSize).then((response) => {
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
                toastr.error(this.props.t("crManagement:crManagement.message.error.searchParentCr"));
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
            data: [],
            dataChecked: [],
            dataChoose: [],
            dataChooseChecked: []
        });
        this.props.closePopup();
    }

    handleDataCheckbox = (data) => {
        this.setState({
            dataChecked: data
        });
    }

    setValue = () => {
        this.props.setValue(this.state.dataChoose);
        this.closePopup();
    }

    handleInvalidSubmitAddOrEdit = (event, errors, values) => {
        toastr.warning(this.props.t("common:common.message.required.allFields"));
        invalidSubmitForm(event, errors, values, "idFormSearchSourceCr");
    }

    handleNext = (dataChecked) => {
        const checkedTemp = [...dataChecked];
        checkedTemp.forEach(element => {
            if (this.state.dataChoose.some(el => el.itemName === element.itemName)) {
                dataChecked.splice(dataChecked.indexOf(element), 1);
            }
        });
        this.setState({
            dataChoose: [...this.state.dataChoose, ...dataChecked],
            dataChecked: []
        }, () => {
            this.customReactTable.clearChecked();
        });
    }

    handlePrevious = (dataChecked) => {
        let listTemp = [...this.state.dataChoose];
        dataChecked.forEach(element => {
            listTemp = listTemp.filter(el => el.itemName !== element.itemName);
        });
        this.setState({
            dataChoose: listTemp,
            dataChooseChecked: []
        }, () => {
            this.customReactTableChoose.clearChecked();
        });
    }

    handleSelectCr = () => {
        if (this.state.dataChoose.length > 0) {
            this.setValue();
        } else {
            toastr.warning(this.props.t("crManagement:crManagement.message.required.crParent"));
        }
    }

    render() {
        const { t } = this.props;
        const { columns, data, pages, loading } = this.state;
        const systemList = buildDataCbo("SYSTEM");
        const objectSearch = {};
        return (
            <Modal isOpen={this.props.parentState.isOpenSourceCrPopup} className={'modal-primary modal-lg ' + this.props.className}
                backdrop={this.state.backdrop} >
                <ModalHeader toggle={this.closePopup}>
                    {t("crManagement:crManagement.title.crParentList")}
                </ModalHeader>
                <ModalBody>
                    <AvForm id="idFormSearchSourceCr" onValidSubmit={this.search} onInvalidSubmit={this.handleInvalidSubmitAddOrEdit} model={objectSearch}>
                        <Row>
                            <Col xs="12" sm="6">
                                <CustomSelectLocal
                                    name={"system"}
                                    label={t("crManagement:crManagement.label.system")}
                                    isRequired={true}
                                    messageRequire={t("crManagement:crManagement.message.required.system")}
                                    options={systemList}
                                    closeMenuOnSelect={true}
                                    handleItemSelectChange={(d) => this.setState({ selectValueSystem: d })}
                                    selectValue={this.state.selectValueSystem}
                                />
                            </Col>
                            <Col xs="12" sm="6">
                                <CustomAvField name="code" label={this.props.t("crManagement:crManagement.label.crParentCode")}
                                    placeholder={this.props.t("crManagement:crManagement.placeholder.crParentCode")} required
                                    validate={{ required: { value: true, errorMessage: t("crManagement:crManagement.message.required.crParentCode") } }} />
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
                                <Button type="button" color="primary" onClick={this.handleSelectCr} className="mr-1"><i className="fa fa-check"></i> {t("common:common.button.choose")}</Button>
                                <Button type="button" color="secondary" onClick={this.closePopup} className="mr-auto"><i className="fa fa-times-circle"></i> {t("common:common.button.close")}</Button>
                            </Col>
                        </Row>
                        <Row style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <Col xs="5">
                                <Label>{t("crManagement:crManagement.title.crParentList")}</Label>
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
                                />
                            </Col>
                            <Col xs="2">
                                <Row className="mb-2">
                                    <Col xs="12" className="text-center">
                                        <Button type="button" color="primary" onClick={() => this.handleNext(this.state.dataChecked)} className="mr-1">{">>"}</Button>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col xs="12" className="text-center">
                                        <Button type="button" color="primary" onClick={() => this.handlePrevious(this.state.dataChooseChecked)} className="mr-1">{"<<"}</Button>
                                    </Col>
                                </Row>
                            </Col>
                            <Col xs="5">
                                <Label>{t("crManagement:crManagement.title.crParentList")}</Label>
                                <CustomReactTableLocal
                                    onRef={ref => (this.customReactTableChoose = ref)}
                                    columns={columns}
                                    data={this.state.dataChoose}
                                    loading={false}
                                    defaultPageSize={10}
                                    isCheckbox={true}
                                    propsCheckbox={[]}
                                    handleDataCheckbox={(d) => this.setState({ dataChooseChecked: d })}
                                />
                            </Col>
                        </Row>
                    </AvForm>
                </ModalBody>
            </Modal>
        );
    }
}

CrManagementInfoTabSourceCrPopup.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(translate()(CrManagementInfoTabSourceCrPopup));
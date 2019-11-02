import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Col, Row, Modal, ModalBody, ModalFooter, ModalHeader, Label } from 'reactstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { translate, Trans } from 'react-i18next';
import { toastr } from 'react-redux-toastr';
import * as commonActions from './../../../actions/commonActions';
import * as WoManagementActions from './WoManagementActions';
import * as WoCdGroupManagementActions from '../cdGroupManagement/WoCdGroupManagementActions';
import CustomReactTable from "../../../containers/Utils/CustomReactTable";
import { CustomAvField, CustomSelectLocal } from '../../../containers/Utils';
import LaddaButton, { ZOOM_OUT } from 'react-ladda';
import { AvForm } from 'availity-reactstrap-validation';

class WoManagementAddCdGroupPopup extends Component {
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
            selectValueGroupType: {}
        };
    }

    componentDidMount() {
        this.props.actions.getItemMaster("WO_CD_GROUP_TYPE", "itemId", "itemName", "1", "3");
    }

    buildTableColumns() {
        return [
            {
                Header: <Trans i18nKey="woManagement:woManagement.label.woGroupCode" />,
                id: "woGroupCode",
                accessor: d => <span title={d.woGroupCode}>{d.woGroupCode}</span>
            },
            {
                Header: <Trans i18nKey="woManagement:woManagement.label.woGroupName" />,
                id: "woGroupName",
                accessor: d => <span title={d.woGroupName}>{d.woGroupName}</span>
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
            this.searchWoCdGroupManagement();
        });
    }

    search = (event, values) => {
        const objectSearch = Object.assign({}, this.state.objectSearch, values);
        objectSearch.groupTypeId = this.state.selectValueGroupType.value || "";
        objectSearch.woGroupName = objectSearch.woGroupName ? objectSearch.woGroupName.trim() : "";
        objectSearch.isEnable = 1;
        objectSearch.page = 1;
        if (objectSearch.groupTypeId || objectSearch.woGroupName) {
            this.setState({
                btnSearchLoading: true,
                loading: true,
                objectSearch: objectSearch
            }, () => {
                this.customReactTable.resetPage();
                this.searchWoCdGroupManagement();
            });
        } else {
            toastr.warning(this.props.t("woManagement:woManagement.message.required.searchCondition"));
        }
    }

    searchWoCdGroupManagement = () => {
        if (this.state.objectSearch.groupTypeId || this.state.objectSearch.woGroupName) {
            this.props.actions.searchWoCdGroupManagement(this.state.objectSearch).then((response) => {
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
                toastr.error(this.props.t("woManagement:woManagement.message.error.searchCdGroup"));
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
            pages: null,
            selectValueGroupType: {}
        });
        this.props.closePopup();
    }

    setValue = () => {
        this.props.setValue(this.state.dataChecked);
        this.closePopup();
    }

    render() {
        const { t } = this.props;
        const { columns, data, pages, loading } = this.state;
        const woCdGroupTypeList = (this.props.response.common.woCdGroupType && this.props.response.common.woCdGroupType.payload) ? this.props.response.common.woCdGroupType.payload.data.data : [];
        const objectSearch = {};
        return (
            <Modal isOpen={this.props.parentState.isOpenCdGroupPopup} className={'modal-primary modal-lg ' + this.props.className}
                backdrop={this.state.backdrop} >
                <ModalHeader toggle={this.closePopup}>
                    {t("woManagement:woManagement.label.cdGroup")}
                </ModalHeader>
                <ModalBody>
                    <AvForm onValidSubmit={this.search} model={objectSearch}>
                        <Row>
                            <Col xs="12" sm="5">
                                <CustomAvField name="woGroupName" label={t("woManagement:woManagement.label.cdGroup")}
                                    placeholder={t("woManagement:woManagement.placeholder.cdGroup")} />
                            </Col>
                            <Col xs="12" sm="5">
                                <CustomSelectLocal
                                    name={"groupTypeId"}
                                    label={t("woManagement:woManagement.label.groupType")}
                                    isRequired={false}
                                    options={woCdGroupTypeList.map(item => {return {itemId: item.itemValue, itemName: item.itemName}})}
                                    closeMenuOnSelect={true}
                                    handleItemSelectChange={(d) => this.setState({ selectValueGroupType: d })}
                                    selectValue={this.state.selectValueGroupType}
                                />
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
                                <Label>{t("woManagement:woManagement.label.searchResult")}</Label>
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
                                    isChooseOneCheckbox={this.props.isChooseOnly}
                                    handleChooseOneCheckbox={() => {toastr.warning(this.props.t("woManagement:woManagement.message.required.onlyOneRecord"));}}
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

WoManagementAddCdGroupPopup.propTypes = {
    parentState: PropTypes.object.isRequired,
    closePopup: PropTypes.func.isRequired,
    setValue: PropTypes.func,
    isChooseOnly: PropTypes.bool
};

function mapStateToProps(state, ownProps) {
    const { woManagement, common } = state;
    return {
        response: { woManagement, common }
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(Object.assign({}, commonActions, WoManagementActions, WoCdGroupManagementActions), dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(translate()(WoManagementAddCdGroupPopup));
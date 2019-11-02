import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Col, Row, Label, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { AvForm } from 'availity-reactstrap-validation';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { translate, Trans } from 'react-i18next';
import { toastr } from 'react-redux-toastr';
import LaddaButton, { ZOOM_OUT } from 'react-ladda';

import * as commonActions from '../../../actions/commonActions';
import * as UtilityProcessManagementActions from './UtilityProcessManagementActions';
import CustomReactTable from "../../../containers/Utils/CustomReactTable";
import { CustomAvField} from "../../../containers/Utils";

class UtilityProcessManagementAddEditPopupGroupUnit extends Component {
    constructor(props) {
        super(props);

        this.onFetchData = this.onFetchData.bind(this);
        this.search = this.search.bind(this);
        this.getGroupUnitSearch = this.getGroupUnitSearch.bind(this);
        this.closePopup = this.closePopup.bind(this);
        this.handleDataCheckbox = this.handleDataCheckbox.bind(this);
        this.handleItemSelectChangeStatus = this.handleItemSelectChangeStatus.bind(this);
        this.state = {
            //Table
            data: [],
            pages: null,
            loading: true,
            columns: this.buildTableColumns(),
            selected: {},
            selectAll: 0,
            //Object Search
            objectSearch: {},
            backdrop: "static",
            btnSearchLoading: false,
            listFile: this.props.parentState.selectedData,
            dataChecked: [],
            statusListSelect: [
                { itemId: 1, itemName: props.t("utilityProcessManagement:utilityProcessManagement.dropdown.status.active") },
                { itemId: 0, itemName: props.t("utilityProcessManagement:utilityProcessManagement.dropdown.status.inActive") }
            ],
            selectValueStatus: {}
        };
    }

    buildTableColumns() {
        return [
            {
                Header: <Trans i18nKey="utilityProcessManagement:utilityProcessManagement.label.groupCode"/>,
                id: "groupCode",
                accessor: d => <span title={d.groupCode}>{d.groupCode}</span>
            },
            {
                Header: <Trans i18nKey="utilityProcessManagement:utilityProcessManagement.label.groupName"/>,
                id: "grouName",
                accessor: d => <span title={d.groupName}>{d.groupName}</span>
            },
        ];
    }

    onFetchData(state, instance) {
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
            this.getGroupUnitSearch();
        });
    }

    search(event, errors, values) {
        const objectSearch = Object.assign({}, this.state.objectSearch, values);
        objectSearch.page = 1;
        this.setState({
            btnSearchLoading: true,
            loading: true,
            objectSearch: objectSearch
        }, () => {
            this.customReactTable.resetPage();
            this.getGroupUnitSearch(true);
        });
    }

    getGroupUnitSearch(isSearchClicked = false) {
        this.props.actions.getListGroupUnit(this.state.objectSearch).then((response) => {
            this.setState({
                data: response.payload.data ? response.payload.data.data : [],
                pages: response.payload.data.pages,
                loading: false
            });
            if(isSearchClicked) {
                this.setState({ btnSearchLoading: false });
            }
        }).catch((response) => {
            toastr.error(this.props.t("odConfigScheduleCreate:odConfigScheduleCreate.message.error.searchUnit"));
        });
    }

    closePopup() {
        this.setState({
            objectSearch: {},
            dataChecked: []
        });
        this.props.closePopup();
    }

    handleDataCheckbox(data) {
        this.setState({
            dataChecked: data
        });
    }

    addGroupUnit(dataChecked) {
        if (dataChecked.length > 0) {
            this.props.addGroupUnit(dataChecked);
            this.closePopup();
        } else {
            toastr.error(this.props.t("odConfigScheduleCreate:odConfigScheduleCreate.message.required.receiveUnit"));
        }
    }

    handleItemSelectChangeStatus(option) {
        this.setState({selectValueStatus: option});
    }
    render() {
        const { t } = this.props;
        const { columns, data, pages, objectSearch } = this.state;
        return (
            <Modal isOpen={this.props.parentState.isOpenPopupGroupUnit} className={'modal-primary modal-lg ' + this.props.className}
            backdrop={this.state.backdrop} >
                <ModalHeader toggle={this.closePopup}>
                    {t("utilityProcessManagement:utilityProcessManagement.label.addNewGroupUnit")}
                </ModalHeader>
                <ModalBody>
                    <AvForm onSubmit={this.search} model={objectSearch}>
                        <Row>
                            <Col xs="12">
                                <Row>
                                     
                                    <Col xs="12" sm="5">
                                        <CustomAvField name="groupCode" label={t("utilityProcessManagement:utilityProcessManagement.label.groupCode")}
                                        placeholder={t("utilityProcessManagement:utilityProcessManagement.placeholder.groupCode")} />
                                    </Col>
                                    <Col xs="12" sm="5">
                                        <CustomAvField name="groupName" label={t("utilityProcessManagement:utilityProcessManagement.label.groupName")}
                                        placeholder={t("utilityProcessManagement:utilityProcessManagement.placeholder.groupName")} />
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
                                                <i className="fa fa-search"></i> <Trans i18nKey="odConfigScheduleCreate:odConfigScheduleCreate.button.search" />
                                            </LaddaButton>
                                        </Row>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </AvForm>
                    <Row>
                        <Col xs="12">
                            <Label>{t("utilityProcessManagement:utilityProcessManagement.label.groupUnit")}</Label>
                            <CustomReactTable
                                onRef={ref => (this.customReactTable = ref)}
                                columns={columns}
                                data={data}
                                pages={pages}
                                loading={false}
                                onFetchData={this.onFetchData}
                                defaultPageSize={10}
                                isCheckbox={true}
                                propsCheckbox={["groupUnitId", "groupCode", "groupName"]}
                                handleDataCheckbox={this.handleDataCheckbox}
                            />
                        </Col>
                    </Row>
                </ModalBody>
                <ModalFooter>
                    <Button type="button" color="primary" disabled={this.state.dataChecked.length < 1} className="ml-auto" onClick={() => this.addGroupUnit(this.state.dataChecked)}><i className="fa fa-check"></i> {t("odConfigScheduleCreate:odConfigScheduleCreate.button.choose")}</Button>
                    <Button type="button" color="secondary" className="mr-auto" onClick={this.closePopup}><i className="fa fa-times-circle"></i> {t("common:common.button.close")}</Button>
                </ModalFooter>
            </Modal>
        );
    }
}

UtilityProcessManagementAddEditPopupGroupUnit.propTypes = {
    parentState: PropTypes.object.isRequired,
    closePopup: PropTypes.func.isRequired,
};

function mapStateToProps(state, ownProps) {
    const { UtilityProcessManagement, common } = state;
    return {
        response: { UtilityProcessManagement, common }
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(Object.assign({}, UtilityProcessManagementActions, commonActions), dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(translate()(UtilityProcessManagementAddEditPopupGroupUnit));
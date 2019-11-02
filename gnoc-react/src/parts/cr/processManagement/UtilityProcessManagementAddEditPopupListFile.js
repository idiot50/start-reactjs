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
import { CustomAvField,CustomSelectLocal } from "../../../containers/Utils";

class UtilityProcessManagementAddEditPopupListFile extends Component {
    constructor(props) {
        super(props);

        this.onFetchData = this.onFetchData.bind(this);
        this.search = this.search.bind(this);
        this.getListFileSearch = this.getListFileSearch.bind(this);
        this.closePopup = this.closePopup.bind(this);
        this.handleDataCheckbox = this.handleDataCheckbox.bind(this);

        this.handleItemSelectChangeFileType = this.handleItemSelectChangeFileType.bind(this);
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
            fileTypeListSelect: [
                { itemId: 101, itemName: props.t("utilityProcessManagement:utilityProcessManagement.dropdown.fileType.input") },
                { itemId: 102, itemName: props.t("utilityProcessManagement:utilityProcessManagement.dropdown.fileType.output") }
            ],
            selectValueFileType: {}
        };
    }

    buildTableColumns() {
       
        return [ 
               
            {
                Header: <Trans i18nKey="utilityProcessManagement:utilityProcessManagement.label.fileCode"/>,
                id: "code",
                accessor: d => {   
                    return <span title={d.code}>{d.code}</span>
                }
            },
            {
                Header: <Trans i18nKey="utilityProcessManagement:utilityProcessManagement.label.fileName"/>,
                id: "name",
                accessor: d => <span title={d.name}>{d.name}</span>
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
        objectSearch.crProcessId =  this.props.parentState.selectedData.crProcessId;
        this.setState({
            loading: true,
            objectSearch: objectSearch
        }, () => {
            this.getListFileSearch();
        });
    }

    search(event, errors, values) {
        const objectSearch = {
            ...this.state.objectSearch,
            ...values,
            fileType: this.state.selectValueFileType ? this.state.selectValueFileType.value : null,
        };
        objectSearch.page = 1;
        
        this.setState({
            btnSearchLoading: true,
            loading: true,
            objectSearch: objectSearch
        }, () => {
            this.customReactTable.resetPage();
            this.getListFileSearch(true);
        });
    }

    getListFileSearch(isSearchClicked = false) {
        this.props.actions.getListFile(this.state.objectSearch).then((response) => {
            this.setState({
                data: response.payload.data ? response.payload.data.data : [],
                pages: response.payload.data.pages,
                loading: false
            });
            if(isSearchClicked) {
                this.setState({ btnSearchLoading: false });
            }
        }).catch((response) => {
            toastr.error(this.props.t("utilityProcessManagement:utilityProcessManagement.message.error.searchFile"));
            this.setState({ btnSearchLoading: false });

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

    addListFile(dataChecked) {
        if (dataChecked.length > 0) {
            this.props.addListFile(dataChecked);
            this.closePopup();
        } else {
            toastr.error(this.props.t("odConfigScheduleCreate:odConfigScheduleCreate.message.required.receiveUnit"));
        }
    }

    handleItemSelectChangeFileType(option) {
        this.setState({selectValueFileType: option});
    }
    render() {
        const { t } = this.props;
        const { columns, data, pages, objectSearch } = this.state;
        return (
            <Modal isOpen={this.props.parentState.isOpenPopupListFile} className={'modal-primary modal-lg ' + this.props.className}
            backdrop={this.state.backdrop} >
                <ModalHeader toggle={this.closePopup}>
                    {t("utilityProcessManagement:utilityProcessManagement.label.addNewListFile")}
                </ModalHeader>
                <ModalBody>
                    <AvForm onSubmit={this.search} model={objectSearch}>
                        <Row>
                            <Col xs="12">
                                <Row>
                                     <Col xs="12" sm="4">
                                        <CustomSelectLocal
                                            name={"fileType"}
                                            label={t("utilityProcessManagement:utilityProcessManagement.label.fileType")}
                                            isRequired={false}
                                            options={this.state.fileTypeListSelect}
                                            closeMenuOnSelect={true}
                                            handleItemSelectChange={this.handleItemSelectChangeFileType}
                                            selectValue={this.state.selectValueFileType}
                                        />
                                    </Col>
                                    <Col xs="12" sm="3">
                                        <CustomAvField name="code" label={t("utilityProcessManagement:utilityProcessManagement.label.fileCode")}
                                        placeholder={t("utilityProcessManagement:utilityProcessManagement.placeholder.fileCode")} />
                                    </Col>
                                    <Col xs="12" sm="3">
                                        <CustomAvField name="name" label={t("utilityProcessManagement:utilityProcessManagement.label.fileName")}
                                        placeholder={t("utilityProcessManagement:utilityProcessManagement.placeholder.fileName")} />
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
                            <Label>{t("utilityProcessManagement:utilityProcessManagement.label.listFile")}</Label>
                            <CustomReactTable
                                onRef={ref => (this.customReactTable = ref)}
                                columns={columns}
                                data={data}
                                pages={pages}
                                loading={false}
                                onFetchData={this.onFetchData}
                                defaultPageSize={10}
                                isCheckbox={true}
                                propsCheckbox={["cpteId","tempImportId", "code", "name"]}
                                handleDataCheckbox={this.handleDataCheckbox}
                            />
                        </Col>
                    </Row>
                </ModalBody>
                <ModalFooter>
                    <Button type="button" color="primary" disabled={this.state.dataChecked.length < 1} className="ml-auto" onClick={() => this.addListFile(this.state.dataChecked)}><i className="fa fa-check"></i> {t("odConfigScheduleCreate:odConfigScheduleCreate.button.choose")}</Button>
                    <Button type="button" color="secondary" className="mr-auto" onClick={this.closePopup}><i className="fa fa-times-circle"></i> {t("common:common.button.close")}</Button>
                </ModalFooter>
            </Modal>
        );
    }
}

UtilityProcessManagementAddEditPopupListFile.propTypes = {
    parentState: PropTypes.object.isRequired,
    closePopup: PropTypes.func.isRequired
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

export default connect(mapStateToProps, mapDispatchToProps)(translate()(UtilityProcessManagementAddEditPopupListFile));
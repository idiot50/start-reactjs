import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Col, Row, Label, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { translate, Trans } from 'react-i18next';
import { toastr } from 'react-redux-toastr';
import * as KedbManagementActions from './KedbManagementActions';
import { convertDateToDDMMYYYYHHMISS } from "../../../containers/Utils/Utils";
import CustomReactTable from "../../../containers/Utils/CustomReactTable";

class KedbManagementHistoryPopup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedData: {},
            //Table
            data: [],
            pages: null,
            loading: true,
            columns: this.buildTableColumns(),
            //Object Search
            objectSearch: {},
            backdrop: "static",
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.parentState.selectedData) {
            this.setState({ selectedData: nextProps.parentState.selectedData });
        }
    }

    buildTableColumns() {
        return [
            {
                Header: <Trans i18nKey="kedbManagement:kedbManagement.label.createUserName" />,
                id: "createUserName",
                width: 200,
                accessor: d => <span title={d.createUserName}>{d.createUserName}</span>
            },
            {
                Header: <Trans i18nKey="kedbManagement:kedbManagement.label.createUnit" />,
                id: "createUnitName",
                accessor: d => <span title={d.createUnitName}>{d.createUnitName}</span>
            },
            {
                Header: <Trans i18nKey="kedbManagement:kedbManagement.label.content" />,
                id: "content",
                accessor: d => <span title={d.content}>{d.content}</span>
            },
            {
                Header: <Trans i18nKey="kedbManagement:kedbManagement.label.status" />,
                id: "status",
                accessor: d => <span title={d.status}>{d.status}</span>,
            },
            {
                Header: <Trans i18nKey="kedbManagement:kedbManagement.label.createdTime" />,
                id: "createdTime",
                accessor: d => <span title={convertDateToDDMMYYYYHHMISS(d.createTime)}>{convertDateToDDMMYYYYHHMISS(d.createTime)}</span>,
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
            objectSearch: objectSearch
        }, () => {
            this.searchKedbManagement();
        });
    }

    searchKedbManagement = () => {
        const objectSearch = Object.assign({}, this.state.objectSearch);
        objectSearch.kedbId = this.state.selectedData.kedbId;
        // this.customReactTable.resetPage();
        this.props.actions.getListKedbActionLogsDTO(objectSearch).then((response) => {
            this.setState({
                data: response.payload.data.data ? response.payload.data.data : [],
                pages: response.payload.data.pages,
                loading: false
            });
            
        }).catch((response) => {
            this.setState({
                loading: false
            });
            toastr.error(this.props.t("kedbManagement:kedbManagement.message.error.search"));
        });
    }

    render() {
        const { t } = this.props;
        const { columns, data, pages, loading } = this.state;
        return (
            <Modal isOpen={this.props.parentState.isOpenHistoryPopup} backdrop={this.state.backdrop}
                className={'modal-primary modal-lg'} >
                <ModalHeader toggle={this.props.closePopup}>{t("kedbManagement:kedbManagement.title.history")}</ModalHeader>
                <ModalBody>
                    <CustomReactTable
                        onRef={ref => (this.customReactTable = ref)}
                        columns={columns}
                        data={data}
                        pages={pages}
                        loading={loading}
                        onFetchData={this.onFetchData}
                        defaultPageSize={10}
                    />
                </ModalBody>
                <ModalFooter>
                    <Button type="button" color="secondary" onClick={this.props.closePopup}><i className="fa fa-times-circle"></i> {t("common:common.button.close")}</Button>
                </ModalFooter>
            </Modal>
        );
    }
}

function mapStateToProps(state, ownProps) {
    const {kedbManagement } = state;
    return {
        response: { kedbManagement }
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(Object.assign({}, KedbManagementActions), dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(translate()(KedbManagementHistoryPopup));
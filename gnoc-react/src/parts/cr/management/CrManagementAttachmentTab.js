import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { translate, Trans } from 'react-i18next';
import { connect } from 'react-redux';
import { toastr } from 'react-redux-toastr';
import { Button, Card, CardHeader } from 'reactstrap';
import { bindActionCreators } from 'redux';
import * as commonActions from '../../../actions/commonActions';
import * as CrManagementActions from './CrManagementActions';
import { CustomReactTable, SettingTableLocal } from '../../../containers/Utils';
import CrManagementAttachmentTabAddPopup from './CrManagementAttachmentTabAddPopup';

class CrManagementAttachmentTab extends Component {
    constructor(props) {
        super(props);

        this.onFetchData = this.onFetchData.bind(this);

        this.state = {
            isOpenAddFilesPopup: false,
            //AddOrEditModal
            selectedData: props.parentState.selectedData,
            objectInfoTab: props.parentState ? props.parentState.objectInfoTab : {},
            modalName: props.parentState.modalName,
            btnAddOrEditLoading: false,
            //Table
            data: [],
            pages: null,
            loading: true,
            columns: this.buildTableColumns(),
            objectSearch: {}
        };
    }

    componentWillUnmount() {
        this.setState({
            modalName: null
        });
    }

    buildTableColumns() {
        return [
            {
                Header: <Trans i18nKey="crManagement:crManagement.label.action"/>,
                id: "action",
                sortable: false,
                fixed: "left",
                width: 100,
                accessor: d => {
                    let html = <div></div>;
                    html = <div className="text-center">
                        <span title={this.props.t("common:common.button.downloadFile")} onClick={() => this.downloadFile(d)}>
                            <Button type="button" size="sm" className="btn-info icon mr-1"><i className="fa fa-download"></i></Button>
                        </span>
                    </div>;
                    return html;
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{height: '2.7em'}}></div>
                )
            },
            {
                Header: <Trans i18nKey="crManagement:crManagement.label.fileName" />,
                id: "fileName",
                minWidth: 150,
                accessor: d => d.fileName ? <span title={d.fileName}>{d.fileName}</span> : <span>&nbsp;</span>
            },
            {
                Header: <Trans i18nKey="crManagement:crManagement.label.timeAttach" />,
                id: "timeAttack",
                minWidth: 150,
                accessor: d => d.timeAttack ? <span title={d.timeAttack}>{d.timeAttack}</span> : <span>&nbsp;</span>
            },
            {
                Header: <Trans i18nKey="crManagement:crManagement.label.uploader" />,
                id: "userName",
                minWidth: 150,
                accessor: d => d.userName ? <span title={d.userName}>{d.userName}</span> : <span>&nbsp;</span>
            },
            {
                Header: <Trans i18nKey="crManagement:crManagement.label.fileType" />,
                id: "fileType",
                minWidth: 150,
                accessor: d => d.fileType ? <span title={d.fileType}>{d.fileType}</span> : <span>&nbsp;</span>
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
            this.searchCrManagementAttachment();
        });
    }

    searchCrManagementAttachment = () => {
        const objectSearch = Object.assign({}, this.state.objectSearch);
        objectSearch.crId = this.state.selectedData.crId;
        this.props.actions.getListCrFilesSearch(objectSearch).then((response) => {
            this.setState({
                data: response.payload.data.data ? response.payload.data.data : [],
                pages: response.payload.data.pages,
                loading: false
            });
        }).catch((response) => {
            this.setState({
                loading: false
            });
            toastr.error(this.props.t("crManagement:crManagement.message.error.getHistory"));
        });
    }

    openAddFilesPopup = () => {
        const { selectedData, objectInfoTab } = this.state;
        if (objectInfoTab.selectValueProcess && objectInfoTab.selectValueProcess.value) {
            this.props.actions.getListTemplateFileByProcess(objectInfoTab.selectValueProcess.value, selectedData.actionRight).then((response) => {
                this.crManagementAttachmentTabAddPopup.setTemplateFiles(objectInfoTab, response.payload.data ? response.payload.data : []);
                this.setState({
                    isOpenAddFilesPopup: true
                });
            });
        } else {
            toastr.warning(this.props.t("crManagement:crManagement.message.required.crProcess"));
            this.props.onChangeTab(0);
            setTimeout(() => {
                try {
                    document.getElementById("idFormAddOrEditInfoTab").elements["custom-input-crProcess"].nextElementSibling.focus();
                } catch (error) {
                    console.error(error);
                }
            }, 100);
        }
    }

    closeAddFilesPopup = () => {
        this.setState({
            isOpenAddFilesPopup: false
        });
    }

    downloadFile(item) {
        this.props.actions.onDownloadFileById("cr", item.fileId).then((response) => {
            toastr.success(this.props.t("common:common.message.success.downloadFile"));
        }).catch((response) => {
            toastr.error(this.props.t("common:common.message.error.downloadFile"));
        });
    }

    render() {
        const { t } = this.props;
        const { columns, data, pages, loading } = this.state;
        return (
            <div className="animated fadeIn">
                <Card>
                    <CardHeader>
                        <div style={{position: 'absolute'}} className="mt-1">
                            <i className="fa fa-align-justify mr-2"></i>{t("crManagement:crManagement.title.attachList")}
                        </div>
                        {
                            this.props.parentState.visibleToolbarTab.attachment.all ?
                            <div className="card-header-actions card-header-search-actions-button">
                                <Button type="button" size="md" color="primary" className="custom-btn btn-pill mr-2"
                                    title={t("crManagement:crManagement.button.add")}
                                    onClick={this.openAddFilesPopup}><i className="fa fa-plus"></i></Button>
                                <SettingTableLocal
                                    columns={columns}
                                    onChange={(columns) => this.setState({ columns })}
                                />
                            </div> :
                            <div className="card-header-actions card-header-search-actions-button">
                                <SettingTableLocal
                                    columns={columns}
                                    onChange={(columns) => this.setState({ columns })}
                                />
                            </div>
                        }
                    </CardHeader>
                    <CustomReactTable
                        onRef={ref => (this.customReactTable = ref)}
                        columns={columns}
                        data={data}
                        pages={pages}
                        loading={loading}
                        onFetchData={this.onFetchData}
                        defaultPageSize={10}
                    />
                </Card>
                <CrManagementAttachmentTabAddPopup
                    onRef={ref => (this.crManagementAttachmentTabAddPopup = ref)}
                    parentState={this.state}
                    closePage={this.closeAddFilesPopup} />
            </div>
        );
    }
}

CrManagementAttachmentTab.propTypes = {
    closePage: PropTypes.func.isRequired,
    parentState: PropTypes.object.isRequired,
    onChangeTab: PropTypes.func
};

function mapStateToProps(state, ownProps) {
    const { crManagement, common } = state;
    return {
        response: { crManagement, common }
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(Object.assign({}, CrManagementActions, commonActions), dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(translate()(CrManagementAttachmentTab));
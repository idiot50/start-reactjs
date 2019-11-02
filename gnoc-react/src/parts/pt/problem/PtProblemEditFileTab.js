import { AvForm } from 'availity-reactstrap-validation';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Trans, translate } from 'react-i18next';
import LaddaButton, { ZOOM_OUT } from 'react-ladda';
import { connect } from 'react-redux';
import { toastr } from 'react-redux-toastr';
import { Button, Card, CardBody, CardHeader, Col, ListGroup, ListGroupItem, Row } from 'reactstrap';
import { bindActionCreators } from 'redux';
import * as commonActions from '../../../actions/commonActions';
import { CustomReactTable, SettingTableLocal, CustomSticky } from "../../../containers/Utils";
import * as PtProblemActions from "./PtProblemActions";
import { Dropzone, downloadFileLocal, convertDateToDDMMYYYYHHMISS, validSubmitForm, invalidSubmitForm, confirmAlertDelete } from "../../../containers/Utils/Utils";

class PtProblemEditFileTab extends Component {
    constructor(props) {
        super(props);

        this.handleValidSubmitAddOrEdit = this.handleValidSubmitAddOrEdit.bind(this);
        this.onFetchData = this.onFetchData.bind(this);
        this.handleChangeLocalColumnsTable = this.handleChangeLocalColumnsTable.bind(this);
        this.downloadFile = this.downloadFile.bind(this);

        this.state = {
            btnAddOrEditLoading: false,
            objectSearch: {},
            //AddOrEditModal
            modalName: props.parentState.modalName,
            selectedData: props.parentState.selectedData,
            //Table
            data: [],
            pages: null,
            loading: true,
            columns: this.buildTableColumns(),
            files: [],
        };
    }

    buildTableColumns() {
        return [
            {
                Header: <Trans i18nKey="ptProblem:ptProblem.label.action" />,
                id: "action",
                sortable: false,
                fixed: "left",
                width: 120,
                accessor: d => {
                    let html = <div></div>;
                    html = <div className="text-center">
                        <span title={this.props.t("common:common.button.delete")} onClick={() => this.confirmDelete(d.problemFileId, d.problemFileName)}>
                            <Button size="sm" className="btn-danger icon"><i className="fa fa-trash-o"></i></Button>
                        </span>
                    </div>;
                    return html;
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{ height: '2.7em' }}></div>
                )
            },
            {
                Header: <Trans i18nKey="ptProblem:ptProblem.label.downloadFile" />,
                id: "downloadFile",
                width: 100,
                className: "text-center",
                accessor: d => <Button size="sm" type="button" className="icon" onClick={() => this.downloadFile(d)}><i className="fa fa-download"></i></Button>
            },
            {
                Header: <Trans i18nKey="ptProblem:ptProblem.label.createdEmployee" />,
                id: "createUserName",
                accessor: d => <span title={d.createUserName}>{d.createUserName}</span>
            },
            {
                Header: <Trans i18nKey="ptProblem:ptProblem.label.createdUnit" />,
                id: "createUnitName",
                accessor: d => <span title={d.createUnitName}>{d.createUnitName}</span>
            },
            {
                Header: <Trans i18nKey="ptProblem:ptProblem.label.fileName" />,
                id: "problemFileName",
                accessor: d => <span title={d.problemFileName}>{d.problemFileName}</span>
            },
            {
                Header: <Trans i18nKey="ptProblem:ptProblem.label.updateTime" />,
                id: "createTime",
                accessor: d => <span title={convertDateToDDMMYYYYHHMISS(d.createTime)}>{convertDateToDDMMYYYYHHMISS(d.createTime)}</span>
            },
        ];
    }

    downloadFile(object) {
        this.props.actions.downloadProblemFiles(object).then((response) => {
        }).catch((response) => {
            toastr.error(this.props.t("ptProblem:ptProblem.message.error.downloadFile"));
        });
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
        objectSearch.problemId = this.state.selectedData.problemId;

        this.setState({
            loading: true,
            objectSearch: objectSearch
        }, () => {
            this.getListProblemFiles();
        });
    }

    getListProblemFiles(isSearchClicked = false) {
        this.props.actions.getListProblemFiles(this.state.objectSearch).then((response) => {
            this.setState({
                data: response.payload.data.data ? response.payload.data.data : [],
                pages: response.payload.data.pages,
                loading: false
            });
        }).catch((response) => {
            this.setState({
                loading: false
            });
            toastr.error(this.props.t("ptProblem:ptProblem.message.error.getFiles"));
        });
    }

    handleChangeLocalColumnsTable(columns) {
        this.setState({
            columns
        });
    }

    handleValidSubmitAddOrEdit(event, values) {
        validSubmitForm(event, values, "idFormAddOrEdit");
        this.setState({
            btnAddOrEditLoading: true
        }, () => {
            if (this.state.files.length < 1) {
                this.setState({
                    btnAddOrEditLoading: false
                });
                toastr.warning(this.props.t("ptProblem:ptProblem.message.required.files"));
                return;
            }
            const ptProblem = this.state.selectedData;
            this.props.actions.addProblemFiles(this.state.files, ptProblem).then((response) => {
                this.setState({
                    btnAddOrEditLoading: false
                }, () => {
                    if (response.payload.data.key === "SUCCESS") {
                        this.getListProblemFiles();
                        this.setState({ files: [] });
                        toastr.success(this.props.t("ptProblem:ptProblem.message.success.addFiles"));
                    } else if (response.payload.data.key === "ERROR") {
                        toastr.error(response.payload.data.message);
                    } else {
                        toastr.error(this.props.t("ptProblem:ptProblem.message.error.addFiles"));
                    }
                });
            }).catch((response) => {
                this.setState({
                    btnAddOrEditLoading: false
                }, () => {
                    try {
                        toastr.error(response.error.response.data.errors[0].defaultMessage);
                    } catch (error) {
                        toastr.error(this.props.t("ptProblem:ptProblem.message.error.addFiles"));
                    }
                });
            });
        });
    }

    confirmDelete(ptProblemId, problemFileName) {
        confirmAlertDelete(this.props.t("ptProblem:ptProblem.message.confirmDeleteProblemFiles", { problemFileName: problemFileName }),
        () => {
            this.props.actions.deleteProblemFiles(ptProblemId).then((response) => {
                if (response.payload.data.key === "SUCCESS") {
                    this.getListProblemFiles();
                    toastr.success(this.props.t("ptProblem:ptProblem.message.success.deleteFiles"));
                } else {
                    toastr.error(this.props.t("ptProblem:ptProblem.message.error.deleteFiles"));
                }
            }).catch((response) => {
                toastr.error(this.props.t("ptProblem:ptProblem.message.error.deleteFiles"));
            });
        });
    }

    handleDrop = acceptedFiles => {
        acceptedFiles.forEach(item => {
            if (!this.state.files.some(el => el.fileName === item.name)) {
                const arr = ['doc', 'docx', 'pdf', 'xls', 'xlsx', 'ppt', 'pptx', 'csv', 'txt', 'rar', 'zip', '7z', 'jpg', 'gif', 'png', 'bmp', 'sql']
                if (arr.includes(item.name.split('.').pop().toLowerCase())) {
                    if (item.size <= 40894464) {
                        item.fileName = item.name;
                        this.setState({ files: [...this.state.files, item] });
                    } else {
                        toastr.error(this.props.t("common:common.message.error.fileSize"));
                    }
                } else {
                    toastr.error(this.props.t("common:common.message.error.fileFormat"));
                }
            }
        });
    }

    removeFile(item) {
        let index = this.state.files.indexOf(item);
        let arrFile = this.state.files;
        arrFile.splice(index, 1);
        this.setState({
            files: arrFile
        });
    }

    render() {
        const { t, } = this.props;
        const { files } = this.state;
        const { columns, data, pages, loading } = this.state;
        return (
            <div>
                <div className="animated fadeIn">
                    <AvForm id="idFormAddOrEditFileTab" onSubmit={this.handleValidSubmitAddOrEdit}>
                        <Row>
                            <Col xs="12">
                                <Card>
                                    <CustomSticky level={1}>
                                        <CardHeader>
                                            {t("ptProblem:ptProblem.label.attachFile")}
                                            <div className="card-header-actions card-header-actions-button">
                                                <LaddaButton type="submit"
                                                    className="btn btn-primary btn-md mr-2"
                                                    loading={this.state.btnAddOrEditLoading}
                                                    data-style={ZOOM_OUT}>
                                                    <i className="fa fa-save"></i> {t("ptProblem:ptProblem.button.saveFile")}
                                                </LaddaButton>
                                                <Button type="button" color="secondary" onClick={(e) => this.props.closePage('EDIT')}><i className="fa fa-reply"></i> {t("common:common.button.back")}</Button>
                                            </div>
                                        </CardHeader>
                                    </CustomSticky>
                                    <CardBody>
                                        <Dropzone onDrop={this.handleDrop} className="pb-2" />
                                        <div style={{ overflowY: 'auto', maxHeight: '65px' }} className="mt-2">
                                            <ListGroup>
                                                {files.map((item, index) => (
                                                    <ListGroupItem key={'item-' + index} style={{height: '2.5em'}} className="d-flex align-items-center">
                                                        <span className="app-span-icon-table" onClick={() => this.removeFile(item)}><i className="fa fa-times-circle"></i> </span>
                                                        <Button color="link" onClick={() => downloadFileLocal(item)}>{item.fileName}</Button>
                                                    </ListGroupItem>
                                                ))}
                                            </ListGroup>
                                        </div>
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                    </AvForm>
                    <Row>
                        <Col>
                            <Card>
                                <CardHeader>
                                    <i className="fa fa-align-justify"></i>{t('ptProblem:ptProblem.title.filesList')}
                                    <div className="card-header-actions">
                                        <SettingTableLocal
                                            columns={columns}
                                            onChange={this.handleChangeLocalColumnsTable}
                                        />
                                    </div>
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
                        </Col>
                    </Row>
                </div>
            </div>
        );
    }
}

PtProblemEditFileTab.propTypes = {
    closePage: PropTypes.func.isRequired,
    parentState: PropTypes.object.isRequired
};

function mapStateToProps(state, ownProps) {
    const { ptProblem, common } = state;
    return {
        response: { ptProblem, common }
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(Object.assign({}, PtProblemActions, commonActions), dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(translate()(PtProblemEditFileTab));
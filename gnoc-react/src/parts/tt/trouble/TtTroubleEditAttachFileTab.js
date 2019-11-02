import { AvForm } from 'availity-reactstrap-validation';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import LaddaButton, { ZOOM_OUT } from 'react-ladda';
import { translate, Trans } from 'react-i18next';
import { connect } from 'react-redux';
import { toastr } from 'react-redux-toastr';
import { Button, Card, CardBody, CardHeader, ListGroup, ListGroupItem } from 'reactstrap';
import { bindActionCreators } from 'redux';
import * as commonActions from '../../../actions/commonActions';
import * as TtTroubleActions from './TtTroubleActions';
import {  CustomReactTable, SettingTableLocal } from '../../../containers/Utils';
import { Dropzone, downloadFileLocal, convertDateToDDMMYYYYHHMISS } from "../../../containers/Utils/Utils";

class TtTroubleEditAttachFileTab extends Component {
    constructor(props) {
        super(props);

        this.handleValidSubmitAddOrEdit = this.handleValidSubmitAddOrEdit.bind(this);

        this.state = {
            //AddOrEditModal
            selectedData: props.parentState.selectedData,
            btnAddOrEditLoading: false,
            files: [],
            //Table
            data: [],
            pages: null,
            loading: true,
            columns: this.buildTableColumns(),
        };
    }

    componentDidMount() {
        if (this.props.onRef) {
            this.props.onRef(this);
        }
    }

    componentWillUnmount() {
        this.setState({
            modalName: null
        });
        if (this.props.onRef) {
            this.props.onRef(undefined);
        }
    }

    buildTableColumns() {
        return [
            {
                Header: <Trans i18nKey="ttTrouble:ttTrouble.label.fileName" />,
                id: "fileName",
                width: 400,
                accessor: d => <span title={d.fileName}>{d.fileName}</span>
            },
            {
                Header: <Trans i18nKey="ttTrouble:ttTrouble.label.attachUser" />,
                id: "createUserName",
                width: 150,
                accessor: d => <span title={d.createUserName}>{d.createUserName}</span>
            },
            {
                Header: <Trans i18nKey="ttTrouble:ttTrouble.label.createTime" />,
                id: "createTime",
                width: 200,
                accessor: d => <span title={convertDateToDDMMYYYYHHMISS(d.createTime)}>{convertDateToDDMMYYYYHHMISS(d.createTime)}</span>
            },
            {
                Header: <Trans i18nKey="ttTrouble:ttTrouble.label.download" />,
                id: "download",
                minWidth: 100,
                className: "text-center",
                accessor: d => <Button size="sm" type="button" className="icon" onClick={() => this.downloadFile(d)}><i className="fa fa-download"></i></Button>
            }
        ];
    }

    downloadFile = (object) => {
        this.props.actions.downloadFileAttach(object).then((response) => {
        }).catch((response) => {
            toastr.error(this.props.t("ttTrouble:ttTrouble.message.error.downloadFile"));
        });
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
            this.getFileAttachByTroubleId();
        });
    }

    getFileAttachByTroubleId = () => {
        const objectSearch = Object.assign({}, this.state.objectSearch);
        objectSearch.troubleId = this.state.selectedData.troubleId;
        this.props.actions.getFileAttachByTroubleId(objectSearch).then((response) => {
            this.setState({
                data: response.payload.data.data || [],
                loading: false
            });
        }).catch((response) => {
            this.setState({
                loading: false
            });
            toastr.error(this.props.t("ttTrouble:ttTrouble.message.error.getFileAttach"));
        });
    }

    handleInvalidSubmitAddOrEdit(event, errors, values) {
        toastr.warning(this.props.t("common:common.message.required.allFields"));
        this.setState({
            isValidSubmitForm: false
        }, () => {
            this.props.onChangeChildTab(this.state.tabIndex, this.state, errors);
        });
    }

    handleValidSubmitAddOrEdit(event, values) {
        this.setState({
            isValidSubmitForm: true
        }, () => {
            const state = Object.assign({}, this.state);
            this.props.onChangeChildTab(this.state.tabIndex, state);
        });
        // validSubmitForm(event, values, "idFormAddOrEdit");
        // this.setState({
        //     btnAddOrEditLoading: true
        // }, () => {
        //     const ttTrouble = Object.assign({}, this.state.selectedData, values);
        //     this.updateTtProblem(ttTrouble);
        // });
    }

    saveFileAttach = (files, ttTrouble) => {
        this.props.actions.saveFileAttach(files, ttTrouble).then((response) => {
            this.setState({
                btnAddOrEditLoading: false
            }, () => {
                if (response.payload.data.key === "SUCCESS") {
                    this.getFileAttachByTroubleId();
                    this.setState({ files: [] });
                    toastr.success(this.props.t("ttTrouble:ttTrouble.message.success.saveFileAttach"));
                } else if (response.payload.data.key === "ERROR") {
                    toastr.error(response.payload.data.message);
                } else {
                    toastr.error(this.props.t("ttTrouble:ttTrouble.message.error.saveFileAttach"));
                }
            });
        }).catch((response) => {
            this.setState({
                btnAddOrEditLoading: false
            }, () => {
                try {
                    toastr.error(response.error.response.data.errors[0].defaultMessage);
                } catch (error) {
                    toastr.error(this.props.t("ttTrouble:ttTrouble.message.error.saveFileAttach"));
                }
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

    onSubmitForm(tabIndex, isVisibleTab) {
        this.setState({
            tabIndex
        }, () => {
            if (isVisibleTab) {
                this.myForm.submit();
            } else {
                setTimeout(() => {
                    this.props.onChangeChildTab(this.state.tabIndex, {isValidSubmitForm: true});
                }, 100);
            }
        });
    }

    render() {
        const { t, parentState } = this.props;
        const { columns, data, pages, loading, files } = this.state;
        const objectAddOrEdit = {};
        return (
            <div className="animated fadeIn">
                <AvForm id="idFormAddOrEditFileTab" onSubmit={this.handleValidSubmitAddOrEdit} onInvalidSubmit={this.handleInvalidSubmitAddOrEdit} model={objectAddOrEdit} ref={(ref) => this.myForm = ref}>
                    <Card className={parentState.isDisableUpdate ? "class-hidden" : ""}>
                        <CardHeader>
                            {t("ttTrouble:ttTrouble.title.attachFile")}
                            {/* <div className="card-header-actions card-header-actions-button-table"> */}
                                {/* <LaddaButton type="submit" disabled={parentState.isDisableUpdate}
                                    className="btn btn-primary btn-md mr-1"
                                    loading={this.state.btnAddOrEditLoading}
                                    data-style={ZOOM_OUT}>
                                    <i className="fa fa-save"></i> {t("common:common.button.save")}
                                </LaddaButton>{' '} */}
                                {/* <Button type="button" color="secondary" onClick={() => this.props.closePage('EDIT')}><i className="fa fa-reply"></i> {t("common:common.button.back")}</Button> */}
                            {/* </div> */}
                        </CardHeader>
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
                    <Card>
                        <CardHeader>
                            <i className="fa fa-align-justify"></i>{t("ttTrouble:ttTrouble.title.attachFileList")}
                            <div className="card-header-actions card-header-actions-button-table">
                                <SettingTableLocal
                                    columns={columns}
                                    onChange={(columns) => this.setState({ columns })}
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
                </AvForm>
            </div>
        );
    }
}

TtTroubleEditAttachFileTab.propTypes = {
    closePage: PropTypes.func.isRequired,
    parentState: PropTypes.object.isRequired,
    onChangeChildTab: PropTypes.func
};

function mapStateToProps(state, ownProps) {
    const { ttTrouble, common } = state;
    return {
        response: { ttTrouble, common }
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(Object.assign({}, TtTroubleActions, commonActions), dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(translate()(TtTroubleEditAttachFileTab));
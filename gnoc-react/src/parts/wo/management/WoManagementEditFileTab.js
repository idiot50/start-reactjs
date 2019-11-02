import { AvForm } from 'availity-reactstrap-validation';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { translate } from 'react-i18next';
import { connect } from 'react-redux';
import { toastr } from 'react-redux-toastr';
import { Button, Card, CardBody, CardHeader, Col, Collapse, Row, ListGroup, ListGroupItem } from 'reactstrap';
import { bindActionCreators } from 'redux';
import * as commonActions from '../../../actions/commonActions';
import * as WoManagementActions from './WoManagementActions';
import { validSubmitForm, invalidSubmitForm, Dropzone, downloadFileLocal } from '../../../containers/Utils/Utils';

class WoManagementEditFileTab extends Component {
    constructor(props) {
        super(props);

        this.handleValidSubmitAddOrEdit = this.handleValidSubmitAddOrEdit.bind(this);
        this.handleInvalidSubmitAddOrEdit = this.handleInvalidSubmitAddOrEdit.bind(this);

        this.state = {
            //AddOrEditModal
            selectedData: props.parentState.selectedData,
            cdList: props.parentState.selectedData.listCd,
            isAddOrEdit: null,
            //Select
            files: [],
            isVisibleSave: false
        };
    }

    componentDidMount() {
        this.checkVisibleButton();
        this.props.actions.getListFileFromWo(this.state.selectedData.woId).then((response) => {
            const data = response.payload.data || [];
            this.setState({
                files: data
            });
        });
    }
    
    componentWillUnmount() {
        this.setState({
            modalName: null
        });
    }

    checkVisibleButton = () => {
        const user = JSON.parse(localStorage.user);
        let isVisibleSave = false;
        if (this.state.cdList && this.state.cdList.length > 0) {
            for (const obj of this.state.cdList) {
                if (user.userName === obj.username) {
                    if (this.state.selectedData.status !== 2 && this.state.selectedData.status !== 7 && this.state.selectedData.status !== 8) {
                        isVisibleSave = true;
                    }
                    break;
                }
            }
        }
        if (this.state.selectedData.ftId) {
            if (user.userID === this.state.selectedData.ftId) {
                if (this.state.selectedData.status === 4 || this.state.selectedData.status === 5
                    || this.state.selectedData.status === 3 || this.state.selectedData.status === 9) {
                    isVisibleSave = true;
                }
            }
        }
        this.setState({
            isVisibleSave
        });
    }

    handleValidSubmitAddOrEdit(event, values) {
        validSubmitForm(event, values, "idFormAddOrEdit");
        const woManagement = Object.assign({}, this.state.selectedData);
        woManagement.fileName = this.state.files.filter(item => item.woId !== undefined).map(item => item.fileName).join(",");
        this.updateFileAttack(woManagement);
    }

    updateFileAttack = (woManagement) => {
        this.props.actions.updateFileAttack(this.state.files, woManagement).then((response) => {
            this.setState({
                btnAddOrEditLoading: false
            }, () => {
                if (response.payload.data.key === "SUCCESS") {
                    toastr.success(this.props.t("woManagement:woManagement.message.success.saveFile"));
                } else if (response.payload.data.key === "ERROR") {
                    toastr.error(response.payload.data.message);
                } else {
                    toastr.error(this.props.t("woManagement:woManagement.message.error.saveFile"));
                }
            });
        }).catch((response) => {
            this.setState({
                btnAddOrEditLoading: false
            }, () => {
                try {
                    toastr.error(response.error.response.data.errors[0].defaultMessage);
                } catch (error) {
                    toastr.error(this.props.t("woManagement:woManagement.message.error.saveFile"));
                }
            });
        });
    }

    handleInvalidSubmitAddOrEdit(event, errors, values) {
        toastr.warning(this.props.t("common:common.message.required.allFields"));
        invalidSubmitForm(event, errors, values, "idFormAddOrEdit");
    }

    handleDrop = acceptedFiles => {
        if (acceptedFiles.length <= 5) {
            acceptedFiles.forEach(item => {
                if (!this.state.files.some(el => el.path === item.path)) {
                    const arr = ['doc','docx','pdf','xls','xlsx','ppt','pptx','csv','txt','rar','zip','7z','jpg','gif','png','bmp','sql']
                    if(arr.includes(item.name.split('.').pop().toLowerCase())) {
                        if(item.size <= 40894464) {
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
        } else {
            toastr.error(this.props.t("woManagement:woManagement.message.error.maxFiles"));
        }
    }

    removeFile(item) {
        let index = this.state.files.indexOf(item);
        let arrFile = this.state.files;
        arrFile.splice(index, 1);
        this.setState({
            files: arrFile
        });
    }

    downloadFile = (d) => {
        this.props.actions.downloadWoFile(this.state.selectedData.woId, d.fileName).then((response) => {
        }).catch((response) => {
            toastr.error(this.props.t("woManagement:woManagement.message.error.downloadFile"));
        });
    }

    render() {
        const { t, response } = this.props;
        const { files, isVisibleSave } = this.state;
        const objectAddOrEdit = {};
        return (
            <div className="animated fadeIn">
                <AvForm id="idFormAddOrEdit" onValidSubmit={this.handleValidSubmitAddOrEdit} onInvalidSubmit={this.handleInvalidSubmitAddOrEdit} model={objectAddOrEdit}>
                    <Card>
                        {/* <CustomSticky level={1}> */}
                            <CardHeader>
                                <i className="fa fa-plus-justify"></i>{t("woManagement:woManagement.title.fileAttach")}
                                <div className="card-header-actions card-header-actions-button-table">
                                    <Button type="submit" color="primary" className={isVisibleSave ? "mr-1" : "class-hidden"}><i className="fa fa-save"></i> {t("common:common.button.save")}</Button>
                                    <Button type="button" color="secondary" onClick={() => this.props.closePage('PROCESS')}><i className="fa fa-reply"></i> {t("common:common.button.back")}</Button>
                                </div>
                            </CardHeader>
                        {/* </CustomSticky> */}
                        <CardBody>
                            <Row>
                                <Col xs="12" sm="12">
                                    <Dropzone onDrop={this.handleDrop} className="pb-2" />
                                </Col>
                                <Col xs="12" sm="12">
                                    <div style={{ overflowY: 'auto', maxHeight: '65px' }} className="mt-2">
                                        <ListGroup>
                                            {files.map((item, index) => (
                                                <ListGroupItem key={"item-" + index} style={{height: '2.5em'}} className="d-flex align-items-center">
                                                    <span className="app-span-icon-table" onClick={() => this.removeFile(item)}><i className="fa fa-times-circle"></i></span>
                                                    {item.woId ? <Button color="link" onClick={() => this.downloadFile(item)}>{item.fileName}</Button>
                                                    : <Button color="link" onClick={() => downloadFileLocal(item)}>{item.fileName}</Button>}
                                                </ListGroupItem>
                                            ))}
                                        </ListGroup>
                                    </div>
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>
                </AvForm>
            </div>
        );
    }
}

WoManagementEditFileTab.propTypes = {
    closePage: PropTypes.func.isRequired,
    parentState: PropTypes.object.isRequired
};

function mapStateToProps(state, ownProps) {
    const { woManagement, common } = state;
    return {
        response: { woManagement, common }
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(Object.assign({}, WoManagementActions, commonActions), dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(translate()(WoManagementEditFileTab));
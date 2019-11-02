import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, ModalBody, ModalHeader, ModalFooter, Button, Row, Col, Label, Card, CardBody, CardHeader } from 'reactstrap';
import { AvForm } from 'availity-reactstrap-validation';
import { connect } from 'react-redux';
import { toastr, Trans } from 'react-redux-toastr';
import { bindActionCreators } from 'redux';
import { translate } from 'react-i18next';
import * as commonActions from './../../../actions/commonActions';
import * as CrManagementActions from './CrManagementActions';
import LaddaButton, { ZOOM_OUT } from 'react-ladda';
import { validSubmitForm, invalidSubmitForm, DropzoneImport, DropzoneAttachment, renderRequired } from '../../../containers/Utils/Utils';
import { buildDataCbo } from './CrManagementUtils';

class CrManagementAttachmentTabAddPopup extends Component {
    constructor(props) {
        super(props);

        this.handleValidSubmitAddOrEdit = this.handleValidSubmitAddOrEdit.bind(this);
        this.handleInvalidSubmitAddOrEdit = this.handleInvalidSubmitAddOrEdit.bind(this);
        
        this.state = {
            backdrop: "static",
            selectedData: props.parentState.selectedData,
            modalName: props.parentState.modalName,
            objectInfoTab: {},
            templateFiles: [],
            filesKPI: [],
            filesImpact: [],
            filesTestService: [],
            filesPlan: [],
            filesOther: [],
            fileForm: {},
            resultError: {}
        };
    }

    componentDidMount() {
        if (this.props.onRef) {
            this.props.onRef(this);
        }
    }

    componentWillUnmount() {
        if (this.props.onRef) {
            this.props.onRef(undefined);
        }
    }

    setTemplateFiles(objectInfoTab, templateFiles) {
        const fileForm = Object.assign({}, this.state.fileForm);
        for (const temp of templateFiles) {
            fileForm[temp.codeTemplate] = null;
        }
        this.setState({ objectInfoTab, templateFiles, fileForm });
    }

    handleValidSubmitAddOrEdit(event, values) {
        validSubmitForm(event, values, "idFormAddFiles");
        this.setState({
            btnAddOrEditLoading: false
        }, () => {
            const crManagementAttachment = Object.assign({}, values);
            crManagementAttachment.crId = this.state.selectedData.crId;
            const { objectInfoTab, filesKPI, filesImpact, filesTestService, filesPlan, filesOther, templateFiles, fileForm } = this.state;
            const lstMutilKPI = [], lstMutilDT = [], lstMutilTest = [], 
            lstMutilRoll = [], lstMutilPlant = [], lstMutilImpactScenario = [], 
            lstMutilForm = [], lstMutilFile = [], lstMutilTxt = [], lstMutilFileOther = [], lstMutilProcess = [];
            let check = true;
            for (const temp of templateFiles) {
                if (!fileForm[temp.codeTemplate]) {
                    check = false;
                } else {
                    lstMutilProcess.push(fileForm[temp.codeTemplate]);
                }
            }
            if (!check) {
                toastr.warning(this.props.t("crManagement:crManagement.message.required.templateFiles"));
                return;
            }
            crManagementAttachment.crFileObjects = templateFiles;
            if (objectInfoTab.selectValueProcess && objectInfoTab.selectValueProcess.value) {
                crManagementAttachment.crProcessId = objectInfoTab.selectValueProcess.value;
            }
            if (objectInfoTab.selectValueCrType && objectInfoTab.selectValueCrType.value) {
                crManagementAttachment.crType = objectInfoTab.selectValueCrType.value;
            }
            if (objectInfoTab.selectValueImpactSegment && objectInfoTab.selectValueImpactSegment.value) {
                crManagementAttachment.impactSegment = objectInfoTab.selectValueImpactSegment.value;
            }
            this.props.actions.insertListFileAttach(crManagementAttachment, 
                filesKPI, lstMutilDT, filesTestService, 
                lstMutilRoll, filesPlan, filesImpact, 
                lstMutilForm, lstMutilFile, lstMutilTxt, filesOther, lstMutilProcess).then((response) => {
                if (response.payload.data.key === "SUCCESS") {
                    this.setState({
                        btnAddOrEditLoading: false
                    }, () => {
                        this.props.closePage();
                        toastr.success(this.props.t("crManagement:crManagement.message.success.addAttachment"));
                    });
                } else if (response.payload.data.key === "ERROR") {
                    this.setState({
                        btnAddOrEditLoading: false
                    }, () => {
                        toastr.success(response.payload.data.message);
                    });
                } else {
                    this.setState({
                        btnAddOrEditLoading: false
                    }, () => {
                        toastr.error(this.props.t("crManagement:crManagement.message.error.addAttachment"));
                    });
                }
            }).catch((response) => {
                this.setState({
                    btnAddOrEditLoading: false
                }, () => {
                    try {
                        toastr.error(response.error.response.data.errors[0].defaultMessage);
                    } catch (error) {
                        toastr.error(this.props.t("crManagement:crManagement.message.error.addAttachment"));
                    }
                });
            });
        });
    }

    handleInvalidSubmitAddOrEdit(event, errors, values) {
        toastr.warning(this.props.t("common:common.message.required.allFields"));
        invalidSubmitForm(event, errors, values, "idFormAddFiles");
    }

    closePage = () => {
        this.props.closePage();
    }

    handleDropKPI = acceptedFiles => {
        acceptedFiles.forEach(item => {
            if (!this.state.filesKPI.some(el => el.path === item.path)) {
                const arr = ['doc','docx','pdf','xls','xlsx','ppt','pptx','csv','txt','rar','zip','7z','jpg','gif','png','bmp','sql']
                if(arr.includes(item.name.split('.').pop().toLowerCase())) {
                    if(item.size <= 40894464) {
                        item.fileName = item.name;
                        this.setState({ filesKPI: [...this.state.filesKPI, item] });
                    } else {
                        toastr.error(this.props.t("common:common.message.error.fileSize"));
                    }
                } else {
                    toastr.error(this.props.t("common:common.message.error.fileFormat"));
                }
            }
        });
    }

    removeFileKPI(item) {
        let index = this.state.filesKPI.indexOf(item);
        let arrFile = this.state.filesKPI;
        arrFile.splice(index, 1);
        this.setState({
            filesKPI: arrFile
        });
    }

    handleDropImpact = acceptedFiles => {
        acceptedFiles.forEach(item => {
            if (!this.state.filesImpact.some(el => el.path === item.path)) {
                const arr = ['doc','docx','pdf','xls','xlsx','ppt','pptx','csv','txt','rar','zip','7z','jpg','gif','png','bmp','sql']
                if(arr.includes(item.name.split('.').pop().toLowerCase())) {
                    if(item.size <= 40894464) {
                        item.fileName = item.name;
                        this.setState({ filesImpact: [...this.state.filesImpact, item] });
                    } else {
                        toastr.error(this.props.t("common:common.message.error.fileSize"));
                    }
                } else {
                    toastr.error(this.props.t("common:common.message.error.fileFormat"));
                }
            }
        });
    }

    removeFileImpact(item) {
        let index = this.state.filesImpact.indexOf(item);
        let arrFile = this.state.filesImpact;
        arrFile.splice(index, 1);
        this.setState({
            filesImpact: arrFile
        });
    }

    handleDropTestService = acceptedFiles => {
        acceptedFiles.forEach(item => {
            if (!this.state.filesTestService.some(el => el.path === item.path)) {
                const arr = ['doc','docx','pdf','xls','xlsx','ppt','pptx','csv','txt','rar','zip','7z','jpg','gif','png','bmp','sql']
                if(arr.includes(item.name.split('.').pop().toLowerCase())) {
                    if(item.size <= 40894464) {
                        item.fileName = item.name;
                        this.setState({ filesTestService: [...this.state.filesTestService, item] });
                    } else {
                        toastr.error(this.props.t("common:common.message.error.fileSize"));
                    }
                } else {
                    toastr.error(this.props.t("common:common.message.error.fileFormat"));
                }
            }
        });
    }

    removeFileTestService(item) {
        let index = this.state.filesTestService.indexOf(item);
        let arrFile = this.state.filesTestService;
        arrFile.splice(index, 1);
        this.setState({
            filesTestService: arrFile
        });
    }

    handleDropPlan = acceptedFiles => {
        acceptedFiles.forEach(item => {
            if (!this.state.filesPlan.some(el => el.path === item.path)) {
                const arr = ['doc','docx','pdf','xls','xlsx','ppt','pptx','csv','txt','rar','zip','7z','jpg','gif','png','bmp','sql']
                if(arr.includes(item.name.split('.').pop().toLowerCase())) {
                    if(item.size <= 40894464) {
                        item.fileName = item.name;
                        this.setState({ filesPlan: [...this.state.filesPlan, item] });
                    } else {
                        toastr.error(this.props.t("common:common.message.error.fileSize"));
                    }
                } else {
                    toastr.error(this.props.t("common:common.message.error.fileFormat"));
                }
            }
        });
    }

    removeFilePlan(item) {
        let index = this.state.filesPlan.indexOf(item);
        let arrFile = this.state.filesPlan;
        arrFile.splice(index, 1);
        this.setState({
            filesPlan: arrFile
        });
    }

    handleDropOther = acceptedFiles => {
        acceptedFiles.forEach(item => {
            if (!this.state.filesOther.some(el => el.path === item.path)) {
                const arr = ['doc','docx','pdf','xls','xlsx','ppt','pptx','csv','txt','rar','zip','7z','jpg','gif','png','bmp','sql']
                if(arr.includes(item.name.split('.').pop().toLowerCase())) {
                    if(item.size <= 40894464) {
                        item.fileName = item.name;
                        this.setState({ filesOther: [...this.state.filesOther, item] });
                    } else {
                        toastr.error(this.props.t("common:common.message.error.fileSize"));
                    }
                } else {
                    toastr.error(this.props.t("common:common.message.error.fileFormat"));
                }
            }
        });
    }
    
    removeFileOther(item) {
        let index = this.state.filesOther.indexOf(item);
        let arrFile = this.state.filesOther;
        arrFile.splice(index, 1);
        this.setState({
            filesOther: arrFile
        });
    }

    handleDropFileForm(temp, acceptedFiles) {
        const fileForm = Object.assign({}, this.state.fileForm);
        fileForm[temp.codeTemplate] = acceptedFiles[0];
        this.setState({ fileForm });
    }

    downloadFileTemplateFileForm(temp) {
        this.props.actions.onDownloadFileByPath('cr_cat', { filePath: temp.linkTemplate }).then((response) => {
            toastr.success(this.props.t("common:common.message.success.downloadFile"));
        }).catch((response) => {
            toastr.error(this.props.t("common:common.message.error.downloadFile"));
        });
    }

    downloadFileResultFileForm(resultError) {
        this.props.actions.onDownloadFileTempByPath('cr', { filePath: resultError.filePath }).then((response) => {
            toastr.success(this.props.t("common:common.message.success.downloadFile"));
        }).catch((response) => {
            toastr.error(this.props.t("common:common.message.error.downloadFile"));
        });
    }
     
    removeFileForm(temp, item) {
        const fileForm = Object.assign({}, this.state.fileForm);
        fileForm[temp.codeTemplate] = null;
        this.setState({ fileForm });
    }

    groupArrayList(arr) {
    	const result = [];
    	for (let i = 0; i < arr.length; i++) {
			if (i % 2 === 0) {
				let data = [];
                data.push(arr[i]);
                if (arr[i+1]) {
                    data.push(arr[i+1]);
                }
				result.push(data);
			}
		}
    	return result;
    }

    render() {
        const { t } = this.props;
        const { selectedData, templateFiles, filesKPI, filesImpact, filesTestService, filesPlan, filesOther, fileForm, resultError } = this.state;
        let templateFilesGroup = this.groupArrayList(templateFiles);
        // const resolve = buildDataCbo("ACTION_RIGHT").CAN_RESOLVE;
        // if (selectedData.actionRight + "" !== resolve && this.state.modalName === "EDIT") {
        //     templateFilesGroup = [];
        // }
        const objectAddOrEdit = {};
        return (
            <Modal isOpen={this.props.parentState.isOpenAddFilesPopup} className={'modal-primary modal-lg ' + this.props.className}
                backdrop={this.state.backdrop} >
                <AvForm id="idFormAddFiles" onValidSubmit={this.handleValidSubmitAddOrEdit} onInvalidSubmit={this.handleInvalidSubmitAddOrEdit} model={objectAddOrEdit} ref={(ref) => this.myForm = ref}>
                    <ModalHeader toggle={this.closePage}>
                        {t("crManagement:crManagement.title.attachmentInfo")}
                    </ModalHeader>
                    <ModalBody>
                        <Row>
                            <Col xs="12" sm="6">
                                <Row>
                                    <Col xs="12" sm="12">
                                        <Label style={{ fontWeight: '500' }}>{t("crManagement:crManagement.label.formCheckKpi")}</Label>
                                    </Col>
                                    <Col xs="12" sm="12">
                                        <DropzoneAttachment
                                            onDrop={this.handleDropKPI}
                                            files={filesKPI}
                                            fileId="fileId"
                                            removeFile={(item) => this.removeFileKPI(item)}
                                            downloadFile={(item) => this.downloadFile(item)}
                                            className="pb-2"
                                        />
                                    </Col>
                                </Row>
                            </Col>
                            <Col xs="12" sm="6">
                                <Row>
                                    <Col xs="12" sm="12">
                                        <Label style={{ fontWeight: '500' }}>{t("crManagement:crManagement.label.impactScript")}</Label>
                                    </Col>
                                    <Col xs="12" sm="12">
                                        <DropzoneAttachment
                                            onDrop={this.handleDropImpact}
                                            files={filesImpact}
                                            fileId="fileId"
                                            removeFile={(item) => this.removeFileImpact(item)}
                                            downloadFile={(item) => this.downloadFile(item)}
                                            className="pb-2"
                                        />
                                    </Col>
                                </Row>
                            </Col>
                            <Col xs="12" sm="6">
                                <Row>
                                    <Col xs="12" sm="12">
                                        <Label style={{ fontWeight: '500' }}>{t("crManagement:crManagement.label.formTestService")}</Label>
                                    </Col>
                                    <Col xs="12" sm="12">
                                        <DropzoneAttachment
                                            onDrop={this.handleDropTestService}
                                            files={filesTestService}
                                            fileId="fileId"
                                            removeFile={(item) => this.removeFileTestService(item)}
                                            downloadFile={(item) => this.downloadFile(item)}
                                            className="pb-2"
                                        />
                                    </Col>
                                </Row>
                            </Col>
                            <Col xs="12" sm="6">
                                <Row>
                                    <Col xs="12" sm="12">
                                        <Label style={{ fontWeight: '500' }}>{t("crManagement:crManagement.label.planFile")}</Label>
                                    </Col>
                                    <Col xs="12" sm="12">
                                        <DropzoneAttachment
                                            onDrop={this.handleDropPlan}
                                            files={filesPlan}
                                            fileId="fileId"
                                            removeFile={(item) => this.removeFilePlan(item)}
                                            downloadFile={(item) => this.downloadFile(item)}
                                            className="pb-2"
                                        />
                                    </Col>
                                </Row>
                            </Col>
                            <Col xs="12" sm="6">
                                <Row>
                                    <Col xs="12" sm="12">
                                        <Label style={{ fontWeight: '500' }}>{t("crManagement:crManagement.label.otherFile")}</Label>
                                    </Col>
                                    <Col xs="12" sm="12">
                                        <DropzoneAttachment
                                            onDrop={this.handleDropOther}
                                            files={filesOther}
                                            fileId="fileId"
                                            removeFile={(item) => this.removeFileOther(item)}
                                            downloadFile={(item) => this.downloadFile(item)}
                                            className="pb-2"
                                        />
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                        {
                            templateFilesGroup.length > 0 ?
                            <Card className="mt-2">
                                <CardHeader>
                                    {t("crManagement:crManagement.label.fileFormByProcess") + " "}{renderRequired}
                                </CardHeader>
                                <CardBody>
                                    {
                                        templateFilesGroup.map((templateFiles, idx) => {
                                            return <Row key={idx}>
                                                {
                                                    templateFiles.map((temp, idx) => {
                                                        return <Col key={idx} xs="12" sm="6" className="mb-2">
                                                            <DropzoneImport onDrop={(acceptedFiles) => this.handleDropFileForm(temp, acceptedFiles)}
                                                                onClickDownloadFileTemplate={() => this.downloadFileTemplateFileForm(temp)}
                                                                titleTemplate={t("crManagement:crManagement.button.downloadFileForm") + ": " + temp.nameTemplate}
                                                                file={fileForm[temp.codeTemplate]}
                                                                removeFile={(item) => this.removeFileForm(temp, item)}
                                                            />
                                                        </Col>
                                                    })
                                                }
                                            </Row>;
                                        })
                                    }
                                    {
                                        resultError.filePath ?
                                        <Row>
                                            <Col xs="12" sm="12">
                                                <Button color="link" onClick={() => this.downloadFileResultFileForm(resultError)}>{resultError.fileName}</Button>
                                            </Col>
                                        </Row> : null
                                    }
                                    
                                </CardBody>
                            </Card> : null
                        }
                    </ModalBody>
                    <ModalFooter>
                        <LaddaButton type="submit"
                            className="btn btn-primary btn-md ml-auto"
                            loading={this.state.btnAddOrEditLoading}
                            data-style={ZOOM_OUT}>
                            <i className="fa fa-save"></i> {t("common:common.button.save")}
                        </LaddaButton>
                        <Button type="button" color="secondary" onClick={this.closePage} className="mr-auto"><i className="fa fa-times-circle"></i> {t("common:common.button.close")}</Button>
                    </ModalFooter>
                </AvForm>
            </Modal>
        );
    }
}

CrManagementAttachmentTabAddPopup.propTypes = {
    closePage: PropTypes.func.isRequired,
    parentState: PropTypes.object.isRequired
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

export default connect(mapStateToProps, mapDispatchToProps)(translate()(CrManagementAttachmentTabAddPopup));
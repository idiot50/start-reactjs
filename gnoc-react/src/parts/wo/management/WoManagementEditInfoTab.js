import { AvForm } from 'availity-reactstrap-validation';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { translate } from 'react-i18next';
import { connect } from 'react-redux';
import { toastr } from 'react-redux-toastr';
import { Button, Card, CardBody, CardHeader, Col, Row } from 'reactstrap';
import { bindActionCreators } from 'redux';
import * as commonActions from '../../../actions/commonActions';
import * as WoManagementActions from './WoManagementActions';
import * as WoTypeManagementActions from '../typeManagement/WoTypeManagementActions';
import { validSubmitForm, invalidSubmitForm, confirmAlertInfo } from '../../../containers/Utils/Utils';
import { CustomReactStepperHorizontal, CustomAvField, CustomAppSwitch, CustomDatePicker } from '../../../containers/Utils';
import WoManagementAssignPopup from './WoManagementAssignPopup';
import WoManagementRejectPopup from './WoManagementRejectPopup';
import WoManagementStatusPopup from './WoManagementStatusPopup';
import WoManagementPendingPopup from './WoManagementPendingPopup';
import WoManagementCompletePopup from './WoManagementCompletePopup';
import { CustomCSSTransition } from '../../../containers/Utils/CustomCSSTransition';
import WoManagementEditSplitWo from './WoManagementEditSplitWo';
import WoManagementAuditPopup from './WoManagementAuditPopup';

class WoManagementEditInfoTab extends Component {
    constructor(props) {
        super(props);

        this.handleValidSubmitAddOrEdit = this.handleValidSubmitAddOrEdit.bind(this);
        this.handleInvalidSubmitAddOrEdit = this.handleInvalidSubmitAddOrEdit.bind(this);

        this.state = {
            //AddOrEditModal
            selectedData: props.parentState.selectedData,
            isOpenSplit: false,
            //Select
            stepIndex: this.convertStepper(props.parentState.selectedData.status),
            isOpenAssignPopup: false,
            isOpenRejectPopup: false,
            isOpenStatusPopup: false,
            isOpenPendingPopup: false,
            isOpenCompletePopup: false,
            isOpenAuditPopup: false,
            buttonVisible: this.buildButtonVisible(),
            mapConfigProperty: props.parentState.mapConfigProperty,
            cdList: props.parentState.selectedData.listCd,
            statusList: props.parentState.statusList,
            startTime: null,
            endTime: null,
            createDate: null
        };
    }

    componentWillUnmount() {
        this.setState({
            modalName: null
        });
    }

    async componentDidMount() {
        this.setState({
            startTime: this.state.selectedData.startTime ? new Date(this.state.selectedData.startTime) : null,
            endTime: this.state.selectedData.endTime ? new Date(this.state.selectedData.endTime) : null,
            createDate: this.state.selectedData.createDate ? new Date(this.state.selectedData.createDate) : null
        });
        await this.checkVisibleButton();
    }

    buildButtonVisible() {
        return {
            approve: true,
            completed: true,
            pending: true,
            openPending: true,
            audit: true,
            assign: true,
            accept: true,
            reject: true,
            split: true
        }
    }

    checkCdRject(object) {
        let result = false;
        if (object.status === 2) {
            if (object.ftId === null || object.ftId === "") {
                result = true;
            } else {
                result = false;
            }
        }
        return result;
    }

    checkExistProperty(value, key) {
        if (this.state.mapConfigProperty) {
            try {
                const arrProperty = this.state.mapConfigProperty[key].split(",");
                return arrProperty.includes(value + "");
            } catch (error) {
                return false;
            }
        }
        return false;
    }

    async checkVisibleButton() {
        const { selectedData } = this.state;
        const buttonVisible = Object.assign({}, this.state.buttonVisible);
        const user = JSON.parse(localStorage.user);
        let checkUserCD = false;
        if (this.state.cdList && this.state.cdList.length > 0) {
            for (const eCdInGroup of this.state.cdList) {
                if (eCdInGroup.username === user.userName) {
                    checkUserCD = true;
                    break;
                }
            }
        }

        if (selectedData.result !== null && selectedData.result === 2) {
            buttonVisible.assign = false;
            buttonVisible.approve = false;
            buttonVisible.completed = false;
            buttonVisible.split = false;
            buttonVisible.accept = false;
            buttonVisible.reject = false;
            buttonVisible.pending = false;
        }
        else if (selectedData.status === 0) {
            buttonVisible.approve = false;
            buttonVisible.completed = false;
            buttonVisible.split = false;
            buttonVisible.pending = false;
            if (!checkUserCD) {
                buttonVisible.accept = false;
                buttonVisible.reject = false;
                buttonVisible.assign = false;
            }
        } else if (selectedData.status === 1) {
            buttonVisible.accept = false;
            buttonVisible.reject = false;
            buttonVisible.pending = false;
            buttonVisible.approve = false;
            buttonVisible.completed = false;
            if (checkUserCD) {
                if (selectedData.parentId !== null && selectedData.parentId !== "") {
                    buttonVisible.split = false;
                }
            } else {
                buttonVisible.split = false;
                buttonVisible.assign = false;
            }
        } else if (selectedData.status === 2) {
            buttonVisible.approve = false;
            buttonVisible.completed = false;
            buttonVisible.accept = false;
            buttonVisible.split = false;
            buttonVisible.pending = false;
            if (!checkUserCD || this.checkCdRject(selectedData)) {
                buttonVisible.reject = false;
                buttonVisible.assign = false;
            }
        } else if (selectedData.status === 3) {
            buttonVisible.approve = false;
            buttonVisible.completed = false;
            buttonVisible.pending = false;
            if (checkUserCD) {
                if (selectedData.ftId === null) {
                    const dtoParentSearch = {page: 1, pageSize: 1};
                    dtoParentSearch.parentId = selectedData.woId;
                    dtoParentSearch.userId = user.userID;
                    const listChildWo = await this.props.actions.searchWoManagement(dtoParentSearch).then(response => {
                        return response.payload.data.data || [];
                    }).catch(response => {
                        return [];
                    });
                    console.log(listChildWo);
                    if (listChildWo && listChildWo.length > 0) {
                        buttonVisible.reject = false;
                        buttonVisible.assign = false;
                        buttonVisible.accept = false;
                    }
                } else {
                    buttonVisible.split = false;
                    if (selectedData.ftName !== user.userName) {
                        buttonVisible.accept = false;
                        buttonVisible.reject = false;
                    }
                }
            } else {
                buttonVisible.split = false;
                buttonVisible.assign = false;
                if (selectedData.ftName !== user.userName) {
                    buttonVisible.accept = false;
                    buttonVisible.reject = false;
                }
            }
        } else if (selectedData.status === 4) {
            buttonVisible.reject = false;
            buttonVisible.assign = false;
            buttonVisible.accept = false;
            buttonVisible.split = false;
            buttonVisible.pending = false;
            if (selectedData.ftName !== user.userName) {
                buttonVisible.approve = false;
                buttonVisible.completed = false;
            }
            // cho phep giao lai WO khi dang xu ly_start
            if (checkUserCD) {
                buttonVisible.assign = true;
            }
            // cho phep giao lai WO khi dang xu ly_end
        } else if (selectedData.status === 5) {
            buttonVisible.reject = false;
            buttonVisible.assign = false;
            buttonVisible.accept = false;
            buttonVisible.split = false;
            buttonVisible.approve = false;
            if (selectedData.ftName !== user.userName) {
                buttonVisible.completed = false;
            }
            // cho phep giao lai WO khi dang xu ly_start
            if (checkUserCD) {
                buttonVisible.assign = true;
                buttonVisible.pending = false;
            }
            // cho phep giao lai WO khi dang xu ly_end
        } else if (selectedData.status === 9) {
            buttonVisible.reject = false;
            buttonVisible.assign = false;
            buttonVisible.accept = false;
            buttonVisible.split = false;
            buttonVisible.approve = false;
            buttonVisible.completed = false;
            //truongnt add
            buttonVisible.pending = false;
            if (selectedData.ftName !== user.userName) {
                buttonVisible.openPending = false;
            }
        }
        else if (selectedData.status === 6) {
            buttonVisible.reject = false;
            buttonVisible.assign = false;
            buttonVisible.accept = false;
            buttonVisible.split = false;
            buttonVisible.pending = false;
            buttonVisible.completed = false;
            if (!checkUserCD) {
                buttonVisible.approve = false;
            }
        } else if (selectedData.status === 7) {
            buttonVisible.reject = false;
            buttonVisible.assign = false;
            buttonVisible.accept = false;
            buttonVisible.split = false;
            buttonVisible.pending = false;
            buttonVisible.approve = false;
            buttonVisible.completed = false;
        }
        if (this.checkExistProperty(selectedData.woTypeId, "WO.TYPE.CHECK.QLTS")) {
            if (selectedData.ftName === user.userName) {
                buttonVisible.accept = false;
            }
            if (selectedData.status !== 6) {
                buttonVisible.approve = false;
            }
            if (selectedData.status !== 5) {
                buttonVisible.completed = false;
            }
        }

        // an cac button cap nhat trang thai voi cac WO ko duoc phep dong tren web
        if (this.checkExistProperty(selectedData.woTypeId, "WO_TYPE_COMPLETE_ON_VSMART")) {
            buttonVisible.approve = false;
            buttonVisible.completed = false;
            if (selectedData.status === 6) {
                if (checkUserCD) {
                    buttonVisible.approve = true;
                }
            }
            if (selectedData.status === 5) {
                if (selectedData.ftName === user.userName) {
                    buttonVisible.completed = true;
                }
            }
        }

        // hien thi button hau kiem WO
        buttonVisible.audit = false;
        if (selectedData.status === 8) {
            if (this.checkDisplayAuditWo(selectedData)) {
                buttonVisible.audit = true;
            }
            buttonVisible.reject = false;
            buttonVisible.assign = false;
            buttonVisible.accept = false;
            buttonVisible.split = false;
            buttonVisible.pending = false;
            buttonVisible.approve = false;
            buttonVisible.completed = false;
        }

        //truongnt add
        if (selectedData.status !== 9) {
            buttonVisible.openPending = false;
        }
        this.setState({
            buttonVisible
        });
    }

    checkDisplayAuditWo(selectedData) {
        const user = JSON.parse(localStorage.user);
        if (selectedData.createPersonId === user.userID) {
            try {
                const finishTime = selectedData.finishTime ? new Date(selectedData.finishTime).getTime() : 0;
                const estimate = this.state.mapConfigProperty["WO_AUDIT_TIME"];
                let esTime = 3 * 60 * 60 * 1000;
                if (estimate != null) {
                    esTime = parseInt(estimate) * 60 * 60 * 1000;
                }
                if ((finishTime + esTime) > new Date().getTime()) {
                    return true;
                }
            } catch (error) {
                console.error(error);
            }
        }
        return false;
    }

    handleValidSubmitAddOrEdit(event, values) {
        validSubmitForm(event, values, "idFormAddOrEdit");
    }

    handleInvalidSubmitAddOrEdit(event, errors, values) {
        toastr.warning(this.props.t("common:common.message.required.allFields"));
        invalidSubmitForm(event, errors, values, "idFormAddOrEdit");
    }

    openAssignPopup = () => {
        this.setState({
            isOpenAssignPopup: true
        });
    }

    closeAssignPopup = () => {
        this.setState({
            isOpenAssignPopup: false
        });
    }

    openRejectPopup = () => {
        let checkCdReject = false;
        let checkFtReject = false;
        // Tac nhan la CD
        const listCdByGroup = this.state.cdList;
        let checkUserCD = false;
        if (listCdByGroup.length > 0) {
            for (const eCdInGroup of listCdByGroup) {
                if (eCdInGroup.username === JSON.parse(localStorage.user).userName) {
                    checkUserCD = true;
                }
            }
        }
        if ((this.state.selectedData.status === 0 || this.state.selectedData.status === 2) && !this.checkCdRject(this.state.selectedData)) {
            if (checkUserCD) {
                // Cho phep CD reject
                checkCdReject = true;
            } else {
                toastr.warning(this.props.t("woManagement:woManagement.message.error.rejectRole"));
            }
        } else if (this.state.selectedData.status === 3) {
            const ft = this.state.selectedData.ftName;
            if (JSON.parse(localStorage.user).userName === ft) {
                // Cho phep FT reject
                checkFtReject = true;
            } else {
                toastr.warning(this.props.t("woManagement:woManagement.message.error.notDispatch"));
            }
        } else {
            toastr.warning(this.props.t("woManagement:woManagement.message.error.reject") + this.state.selectedData.status);
        }
        if (checkCdReject || checkFtReject) {
            this.setState({
                isOpenRejectPopup: true,
                checkCd: checkCdReject
            });
        }
    }

    closeRejectPopup = () => {
        this.setState({
            isOpenRejectPopup: false
        });
    }

    openStatusPopup = () => {
        this.setState({
            isOpenStatusPopup: true
        });
    }

    closeStatusPopup = () => {
        this.setState({
            isOpenStatusPopup: false
        });
    }

    openPendingPopup = () => {
        this.props.actions.getDetailWoTypeManagement(this.state.selectedData.woTypeId).then((response) => {
            const data = response.payload.data || {};
            if (data.allowPending === 1) {
                this.setState({
                    isOpenPendingPopup: true
                });
            } else {
                toastr.warning(this.props.t("woManagement:woManagement.message.error.allowPending"));
            }
        }).catch((response) => {
            toastr.warning(this.props.t("woManagement:woManagement.message.error.allowPending"));
        });
    }

    closePendingPopup = () => {
        this.setState({
            isOpenPendingPopup: false
        });
    }

    openCompletePopup = () => {
        this.setState({
            isOpenCompletePopup: true
        });
    }

    closeCompletePopup = () => {
        this.setState({
            isOpenCompletePopup: false
        });
    }

    openSplitModal = () => {
        this.setState({
            isOpenSplit: true
        });
    }

    closeSplitModal = () => {
        this.setState({
            isOpenSplit: false
        });
    }
    
    openAuditPopup = () => {
        if (this.state.selectedData.status !== 8 && JSON.parse(localStorage.user).userID !== this.state.selectedData.createPersonId) {
            this.props.t("woManagement:woManagement.message.error.auditRole")
            return;
        }
        this.setState({
            isOpenAuditPopup: true
        });
    }

    closeAuditPopup = () => {
        this.setState({
            isOpenAuditPopup: false
        });
    }

    handleAcceptWo = () => {
        confirmAlertInfo(this.props.t("woManagement:woManagement.message.confirmAccept"),
        this.props.t("common:common.button.yes"), this.props.t("common:common.button.no"),
        () => {
            let currentStatus = -1;
            let checkAccept = false;
            const selectedData = Object.assign({}, this.state.selectedData);
            // Tac nhan la CD
            const listCdByGroup = this.state.cdList;
            let checkUserCD = false;
            if (listCdByGroup.length > 0) {
                for (const eCdInGroup of listCdByGroup) {
                    if (eCdInGroup.username === JSON.parse(localStorage.user).userName) {
                        checkUserCD = true;
                    }
                }
            }

            if (selectedData.status === 0 || selectedData.status === 3) {
                if (selectedData.status === 0) {
                    if (checkUserCD) {
                        checkAccept = true;
                        currentStatus = 1;
                        selectedData.status = 1;
                    } else {
                        toastr.warning(this.props.t("woManagement:woManagement.message.error.notInGroupDispatch"));
                    }
                } else if (selectedData.status === 3) {
                    const ft = selectedData.ftName;
                    if (JSON.parse(localStorage.user).userName === ft) {
                        checkAccept = true;
                        currentStatus = 4;
                        selectedData.status = 4;
                    } else {
                        toastr.warning(this.props.t("woManagement:woManagement.message.error.notDispatch"));
                    }
                }
            } else {
                const state = this.state.statusList.find(item => item.itemId === selectedData.status) || {};
                toastr.warning(this.props.t("woManagement:woManagement.message.error.accept") + state.itemName);
            }
            if (checkAccept) {
                selectedData.role = currentStatus === 4 ? "FT" : "CD";
                this.props.actions.acceptWoForWeb(selectedData).then((response) => {
                    if (response.payload.data.key === "SUCCESS") {
                        this.props.closePage("PROCESS", true);
                        toastr.success(this.props.t("woManagement:woManagement.message.success.acceptWo"));
                    } else if (response.payload.data.key === "ERROR") {
                        toastr.error(response.payload.data.message);
                    } else {
                        toastr.error(this.props.t("woManagement:woManagement.message.error.acceptWo"));
                    }
                }).catch((response) => {
                    try {
                        toastr.error(response.error.response.data.errors[0].defaultMessage);
                    } catch (error) {
                        toastr.error(this.props.t("woManagement:woManagement.message.error.acceptWo"));
                    }
                });
            }
        }, () => {
            
        });
    }

    handleOpenPendingWo = () => {
        confirmAlertInfo(this.props.t("woManagement:woManagement.message.confirmOpenPending"),
        this.props.t("common:common.button.yes"), this.props.t("common:common.button.no"),
        () => {
            this.props.actions.updatePendingWo(Object.assign(this.state.selectedData, {system: "web"})).then((response) => {
                if (response.payload.data.key === "SUCCESS") {
                    this.props.closePage("PROCESS", true);
                    toastr.success(this.props.t("woManagement:woManagement.message.success.openPending"));
                } else if (response.payload.data.key === "ERROR" || response.payload.data.key === "FAIL") {
                    toastr.error(response.payload.data.message);
                } else {
                    toastr.error(this.props.t("woManagement:woManagement.message.error.openPending"));
                }
            }).catch((response) => {
                try {
                    toastr.error(response.error.response.data.errors[0].defaultMessage);
                } catch (error) {
                    toastr.error(this.props.t("woManagement:woManagement.message.error.openPending"));
                }
            });
        }, () => {
            
        });
    }

    convertStepper(status) {
        switch(status) {
            case 0: case 1: case 2: case 3: case 4:
                return status + 1;
            case 9:
                return 6;
            case 7:
                return 0;
            case 6:
                return 7;
            default:
                return status;
        }
    }

    render() {
        const { t, response } = this.props;
        const { stepIndex, selectedData, buttonVisible } = this.state;
        const objectAddOrEdit = selectedData;
        const woResultStatus = (this.props.response.common.woResultStatus && this.props.response.common.woResultStatus.payload) ? this.props.response.common.woResultStatus.payload.data.data : [];
        objectAddOrEdit.resultName = objectAddOrEdit.result ? (woResultStatus.find(item => item.itemValue + "" === objectAddOrEdit.result + "") || {}).itemName : "";
        objectAddOrEdit.stationCode = objectAddOrEdit.stationCode || "";
        objectAddOrEdit.ftName = objectAddOrEdit.ftName || "";
        objectAddOrEdit.construction = objectAddOrEdit.construction || "";
        objectAddOrEdit.warehouseCode = objectAddOrEdit.warehouseCode || "";
        objectAddOrEdit.woDescription = objectAddOrEdit.woDescription || "";
        objectAddOrEdit.constructionCode = objectAddOrEdit.constructionCode || "";
        return (
            <CustomCSSTransition
            isVisible={this.state.isOpenSplit}
            content={
                this.state.isOpenSplit ?
                <WoManagementEditSplitWo
                    closePage={this.props.closePage}
                    parentState={this.state}
                    closePageSplit={this.closeSplitModal} /> :
                <div></div>
            }>
                <div className="animated fadeIn">
                    <AvForm id="idFormAddOrEdit" onValidSubmit={this.handleValidSubmitAddOrEdit} onInvalidSubmit={this.handleInvalidSubmitAddOrEdit} model={objectAddOrEdit}>
                        <Card>
                            {/* <CustomSticky level={1}> */}
                                <CardHeader>
                                    <i className="fa fa-plus-justify"></i>{t("woManagement:woManagement.title.woDetail")}
                                    <div className="card-header-actions card-header-actions-button-table">
                                        <Button type="button" color="primary" className={buttonVisible.approve ? "mr-1" : "class-hidden"} onClick={this.openStatusPopup}>{t("woManagement:woManagement.button.approve")}</Button>
                                        <Button type="button" color="primary" className={buttonVisible.completed ? "mr-1" : "class-hidden"} onClick={this.openCompletePopup}>{t("woManagement:woManagement.button.completed")}</Button>
                                        <Button type="button" color="primary" className={buttonVisible.pending ? "mr-1" : "class-hidden"} onClick={this.openPendingPopup}>{t("woManagement:woManagement.button.pending")}</Button>
                                        <Button type="button" color="primary" className={buttonVisible.openPending ? "mr-1" : "class-hidden"} onClick={this.handleOpenPendingWo}>{t("woManagement:woManagement.button.openPending")}</Button>
                                        <Button type="button" color="primary" className={buttonVisible.audit ? "mr-1" : "class-hidden"} onClick={this.openAuditPopup}>{t("woManagement:woManagement.button.audit")}</Button>
                                        <Button type="button" color="primary" className={buttonVisible.assign ? "mr-1" : "class-hidden"} onClick={this.openAssignPopup}>{t("woManagement:woManagement.button.assign")}</Button>
                                        <Button type="button" color="primary" className={buttonVisible.accept ? "mr-1" : "class-hidden"} onClick={this.handleAcceptWo}>{t("woManagement:woManagement.button.accept")}</Button>
                                        <Button type="button" color="primary" className={buttonVisible.reject ? "mr-1" : "class-hidden"} onClick={this.openRejectPopup}>{t("woManagement:woManagement.button.reject")}</Button>
                                        <Button type="button" color="primary" className={buttonVisible.split ? "mr-1" : "class-hidden"} onClick={this.openSplitModal}>{t("woManagement:woManagement.button.split")}</Button>
                                        <Button type="button" color="secondary" onClick={() => this.props.closePage('PROCESS')}><i className="fa fa-reply"></i> {t("common:common.button.back")}</Button>
                                    </div>
                                </CardHeader>
                            {/* </CustomSticky> */}
                            <CardBody>
                                <Row>
                                    <Col xs="12" sm="12" className="mb-2">
                                        <CustomReactStepperHorizontal
                                            name=""
                                            steps={[
                                                { title: t("woManagement:woManagement.label.draft"), onClick: (e) =>{ e.preventDefault(); } },
                                                { title: t("woManagement:woManagement.label.unassigned"), onClick: (e) =>{ e.preventDefault(); } },
                                                { title: t("woManagement:woManagement.label.assigned"), onClick: (e) =>{ e.preventDefault(); } },
                                                { title: t("woManagement:woManagement.button.reject"), onClick: (e) =>{ e.preventDefault(); } },
                                                { title: t("woManagement:woManagement.label.dispatch"), onClick: (e) =>{ e.preventDefault(); } },
                                                { title: t("woManagement:woManagement.label.inprocess"), onClick: (e) =>{ e.preventDefault(); } },
                                                { title: t("woManagement:woManagement.label.pending"), onClick: (e) =>{ e.preventDefault(); } },
                                                { title: t("woManagement:woManagement.label.closeFT"), onClick: (e) =>{ e.preventDefault(); } },
                                                { title: t("woManagement:woManagement.label.closeCD"), onClick: (e) =>{ e.preventDefault(); } },

                                                // { title: stepIndex === 0 ? t("woManagement:woManagement.label.unassigned") : "", onClick: (e) =>{ e.preventDefault(); } },
                                                // { title: stepIndex === 1 ? t("woManagement:woManagement.label.assigned") : "", onClick: (e) =>{ e.preventDefault(); } },
                                                // { title: stepIndex === 2 ? t("woManagement:woManagement.label.cdReject") : "", onClick: (e) =>{ e.preventDefault(); } },
                                                // { title: stepIndex === 3 ? t("woManagement:woManagement.label.dispatch") : "", onClick: (e) =>{ e.preventDefault(); } },
                                                // { title: stepIndex === 4 ? t("woManagement:woManagement.label.accept") : "", onClick: (e) =>{ e.preventDefault(); } },
                                                // { title: stepIndex === 5 ? t("woManagement:woManagement.label.inprocess") : "", onClick: (e) =>{ e.preventDefault(); } },
                                                // { title: stepIndex === 6 ? t("woManagement:woManagement.label.closeFT") : "", onClick: (e) =>{ e.preventDefault(); } },
                                                // { title: stepIndex === 7 ? t("woManagement:woManagement.label.draft") : "", onClick: (e) =>{ e.preventDefault(); } },
                                                // { title: stepIndex === 8 ? t("woManagement:woManagement.label.closeCD") : "", onClick: (e) =>{ e.preventDefault(); } },
                                                // { title: stepIndex === 9 ? t("woManagement:woManagement.label.pending") : "", onClick: (e) =>{ e.preventDefault(); } },
                                            ]}
                                            activeStep={this.state.stepIndex} />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col xs="12" sm="12">
                                        <CustomAvField type="textarea" rows="3" name="woDescription" label={t("woManagement:woManagement.label.workDescription")} disabled />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col xs="12" sm="4">
                                        <CustomAvField name="woSystem" label={t("woManagement:woManagement.label.workOrderObject")} disabled />
                                    </Col>
                                    <Col xs="12" sm="4">
                                        <CustomAvField name="statusName" label={t("woManagement:woManagement.label.woStatus")} disabled />
                                    </Col>
                                    <Col xs="12" sm="4">
                                        <CustomAvField name="resultName" label={t("woManagement:woManagement.label.result")} disabled />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col xs="12" sm="4">
                                        <CustomAvField name="woCode" label={t("woManagement:woManagement.label.woCode")} disabled />
                                    </Col>
                                    <Col xs="12" sm="4">
                                        <CustomAvField name="woTypeName" label={t("woManagement:woManagement.label.woType")} disabled />
                                    </Col>
                                    <Col xs="12" sm="4">
                                        <CustomAvField name="cdName" label={t("woManagement:woManagement.label.cdGroup")} disabled />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col xs="12" sm="4">
                                        <CustomAvField name="woContent" label={t("woManagement:woManagement.label.woName")} disabled />
                                    </Col>
                                    <Col xs="12" sm="4">
                                        <CustomDatePicker
                                            name={"startTime"}
                                            label={t("woManagement:woManagement.label.startTimeFrom")}
                                            isRequired={false}
                                            selected={this.state.startTime}
                                            handleOnChange={(d) => this.setState({ startTime: d })}
                                            dateFormat="dd/MM/yyyy HH:mm:ss"
                                            showTimeSelect={true}
                                            timeFormat="HH:mm:ss"
                                            placeholder="dd/MM/yyyy HH:mm:ss"
                                            readOnly={true}
                                        />
                                    </Col>
                                    <Col xs="12" sm="4">
                                        <CustomDatePicker
                                            name={"endTime"}
                                            label={t("woManagement:woManagement.label.startTimeTo")}
                                            isRequired={false}
                                            selected={this.state.endTime}
                                            handleOnChange={(d) => this.setState({ endTime: d })}
                                            dateFormat="dd/MM/yyyy HH:mm:ss"
                                            showTimeSelect={true}
                                            timeFormat="HH:mm:ss"
                                            placeholder="dd/MM/yyyy HH:mm:ss"
                                            readOnly={true}
                                        />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col xs="12" sm="4">
                                        <CustomAvField name="stationCode" label={t("woManagement:woManagement.label.stationCode")} disabled />
                                    </Col>
                                    <Col xs="12" sm="4">
                                        <CustomAvField name="ftName" label={t("woManagement:woManagement.label.ftName")} disabled />
                                    </Col>
                                    <Col xs="12" sm="4">
                                        <CustomAvField name="createPersonName" label={t("woManagement:woManagement.label.createPerson")} disabled />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col xs="12" sm="4">
                                        <CustomAvField name="priorityName" label={t("woManagement:woManagement.label.priority")} disabled />
                                    </Col>
                                    <Col xs="12" sm="4">
                                        <CustomDatePicker
                                            name={"createDate"}
                                            label={t("woManagement:woManagement.label.createTimeEdit")}
                                            isRequired={false}
                                            selected={this.state.createDate}
                                            handleOnChange={(d) => this.setState({ createDate: d })}
                                            dateFormat="dd/MM/yyyy HH:mm:ss"
                                            showTimeSelect={true}
                                            timeFormat="HH:mm:ss"
                                            placeholder="dd/MM/yyyy HH:mm:ss"
                                            readOnly={true}
                                        />
                                    </Col>
                                    <Col xs="12" sm="4">
                                        <CustomAvField name="constructionCode" label={t("woManagement:woManagement.label.construction")} disabled />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col xs="12" sm="4">
                                        <CustomAvField name="warehouseCode" label={t("woManagement:woManagement.label.wareHouseCode")} disabled />
                                    </Col>
                                    <Col xs="12" sm="4">
                                        <CustomAppSwitch
                                            name={"needSupport"}
                                            label={t("woManagement:woManagement.label.woNeedsSupport")}
                                            checked={this.state.selectedData.needSupport ? true : false}
                                            handleChange={() => {}}
                                            isDisabled={true}
                                        />
                                    </Col>
                                </Row>
                            </CardBody>
                        </Card>
                    </AvForm>
                    <WoManagementAssignPopup
                        parentState={this.state}
                        closePopup={this.closeAssignPopup}
                        closePage={this.props.closePage} />
                    <WoManagementRejectPopup
                        parentState={this.state}
                        closePopup={this.closeRejectPopup}
                        closePage={this.props.closePage} />
                    <WoManagementStatusPopup
                        parentState={this.state}
                        closePopup={this.closeStatusPopup}
                        closePage={this.props.closePage} />
                    <WoManagementPendingPopup
                        parentState={this.state}
                        closePopup={this.closePendingPopup}
                        closePage={this.props.closePage} />
                    <WoManagementCompletePopup
                        parentState={this.state}
                        closePopup={this.closeCompletePopup}
                        closePage={this.props.closePage} />
                    <WoManagementAuditPopup
                        parentState={this.state}
                        closePopup={this.closeAuditPopup}
                        closePage={this.props.closePage} />
                </div>
            </CustomCSSTransition>
        );
    }
}

WoManagementEditInfoTab.propTypes = {
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
        actions: bindActionCreators(Object.assign({}, WoManagementActions, WoTypeManagementActions, commonActions), dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(translate()(WoManagementEditInfoTab));
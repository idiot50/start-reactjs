import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Col, Row, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { translate, Trans } from 'react-i18next';
import { toastr } from 'react-redux-toastr';
import * as commonActions from './../../../actions/commonActions';
import * as WoManagementActions from './WoManagementActions';
import { CustomAvField, CustomSelectLocal } from '../../../containers/Utils';
import { AvForm } from 'availity-reactstrap-validation';
import { invalidSubmitForm, validSubmitForm } from '../../../containers/Utils/Utils';

class WoManagementCompleteWoSPMPopup extends Component {
    constructor(props) {
        super(props);

        this.handleValidSubmitAddOrEdit = this.handleValidSubmitAddOrEdit.bind(this);
        this.handleInvalidSubmitAddOrEdit = this.handleInvalidSubmitAddOrEdit.bind(this);

        this.state = {
            btnSearchLoading: false,
            selectedData: props.parentState.selectedData,
            objectSearch: {},
            backdrop: "static",
            selectValueReasonLv1: {},
            selectValueReasonLv2: {},
            selectValueReasonLv3: {},
            lstReason: [],
            lstReasonLv1: [],
            lstReasonLv2: [],
            lstReasonLv3: [],
            lstWoSpm: [],
            lstDetail: []
        };
    }

    componentWillReceiveProps(newProps) {
        if (newProps.parentState.lstDetail) {
            this.setState({ lstDetail: newProps.parentState.lstDetail });
        }
        if (newProps.parentState.lstWoSpm) {
            this.setState({ lstWoSpm: newProps.parentState.lstWoSpm });
        }
    }

    async componentDidMount() {
        await this.getReasonBccs(1, null);
    }

    async getReasonBccs(level, parent) {
        const detailDto = this.state.lstDetail.length > 0 ? this.state.lstDetail[0] : {};
        // let dtoLv3 = null;
        // let dtoLv2 = null;
        // if (this.state.lstDetail.length > 0 && this.state.lstDetail[0].ccResult !== null) {
        //     dtoLv3 = await this.props.actions.findCompCauseById(121).then((response) => {
        //         console.log(response)
        //     }).catch((error) => {
                
        //     });
        //     // dtoLv2 = CompCauseServiceImpl.getInstance().findCompCauseById(Long.parseLong(dtoLv3.getParentId()));
        // }
        let ccServiceId = null;
        let ccGroupId = null;
        let parentId = null;
        let infraType = null;

        if (detailDto.ccServiceId !== null && detailDto.ccServiceId !== undefined) {
            ccServiceId = detailDto.ccServiceId;
        }
        if (parent !== null && parent !== undefined) {
            parentId = parent;
        }
        if (detailDto.ccGroupId !== null && detailDto.ccGroupId !== undefined) {
            // const lstGroup = detailDto.ccGroupId.split(",");
            const lstGroup = [detailDto.ccGroupId];
            if (lstGroup.length > 0) {
                ccGroupId = [];
                for (let i = 0; i < lstGroup.length; i++) {
                    ccGroupId.push(parseInt(lstGroup[i]));
                }
            }
        }
        if (detailDto.infraType !== null && detailDto.infraType !== undefined) {
            if ("1" === detailDto.infraType) {
                infraType = "CCN";
            } else if ("2" === detailDto.infraType) {
                infraType = "CATV";
            } else if ("3" === detailDto.infraType) {
                infraType = "FCN";
            } else if ("4" === detailDto.infraType) {
                infraType = "GPON";
            } else {
                infraType = "ALL";
            }
        } else {
            infraType = "ALL";
        }
        // ccGroupId: ccGroupId
        const data = {levelId: level, parentId: parentId, serviceTypeId: ccServiceId, lineType: infraType, cfgType: 2};
        this.props.actions.getCompCauseListByMap(data).then((response) => {
            if (level === 1) {
                this.setState({
                    lstReasonLv1: response.payload.data || []
                });
            } else if (level === 2) {
                this.setState({
                    lstReasonLv2: response.payload.data || []
                });
            } else if (level === 3) {
                this.setState({
                    lstReasonLv3: response.payload.data || []
                });
            }
        });

        // List<CompCauseDTO> lstReason = CompCauseServiceImpl.getInstance().getComCauseListByMap(ccServiceId, ccGroupId, parentId, level, infraType, 2L, true);
        // if (lstReason != null && !lstReason.isEmpty()) {
        //     lstReason.stream().forEach((tmp) -> {
        //         ComboBoxItem temp = new ComboBoxItem(tmp.getCompCauseId(), tmp.getName());
        //         lstReasonItem.add(temp);
        //         mapReason.put(tmp.getCompCauseId(), temp);
        //     });
        //     BeanItemContainer<ComboBoxItem> beanService = new BeanItemContainer<>(ComboBoxItem.class, lstReasonItem);
        //     if (level == 1) {
        //         cmbReasonLv1.setContainerDataSource(beanService);
        //         cmbReasonLv1.setItemCaptionPropertyId("description");
        //         if (dtoLv2 != null && !StringUtils.isNullOrEmpty(dtoLv2.getParentId())) {
        //             cmbReasonLv1.setValue(mapReason.get(dtoLv2.getParentId()));
        //         }
        //     } else if (level == 2) {
        //         cmbReasonLv2.setContainerDataSource(beanService);
        //         cmbReasonLv2.setItemCaptionPropertyId("description");
        //         if (dtoLv3 != null && !StringUtils.isNullOrEmpty(dtoLv3.getParentId())) {
        //             cmbReasonLv2.setValue(mapReason.get(dtoLv3.getParentId()));
        //         }
        //     } else if (level == 3) {
        //         cmbReasonLv3.setContainerDataSource(beanService);
        //         cmbReasonLv3.setItemCaptionPropertyId("description");
        //         if (!StringUtils.isNullOrEmpty(detailDto.getCcResult())) {
        //             cmbReasonLv3.setValue(mapReason.get(detailDto.getCcResult()));
        //         }
        //     }
        // }
    }

    handleValidSubmitAddOrEdit(event, values) {
        validSubmitForm(event, values, "idFormWoSPMPopup");
        const detailDto = this.state.lstDetail.length > 0 ? this.state.lstDetail[0] : {};
        const lstWoSpm = [...this.state.lstWoSpm];
        for (const wo of lstWoSpm) {
            if (wo.status === 5 && (detailDto.serviceId !== null && detailDto.serviceId !== undefined && detailDto.infraType !== null && detailDto.infraType !== undefined)) {
                wo.showMaterialInfo = true;
            } else {
                wo.showMaterialInfo = false;
            }
        }
        const data = {
            lstWo: lstWoSpm,
            reasonLv1Id: this.state.selectValueReasonLv1.value,
            reasonLv1Name: this.state.selectValueReasonLv1.label,
            reasonLv2Id: this.state.selectValueReasonLv2.value,
            reasonLv2Name: this.state.selectValueReasonLv2.label,
            reasonLv3Id: this.state.selectValueReasonLv3.value,
            reasonLv3Name: this.state.selectValueReasonLv3.label,
            comment: values.comment ? values.comment.trim() : ""
        };
        this.props.actions.saveCompleteWoSPM(data).then((response) => {
            if (response.payload.data.key === "SUCCESS") {
                this.closePopup();
                toastr.success(this.props.t("woManagement:woManagement.message.success.completeWo"));
            } else if (response.payload.data.key === "ERROR") {
                toastr.error(response.payload.data.message);
            } else {
                toastr.error(this.props.t("woManagement:woManagement.message.error.completeWo"));
            }
        }).catch((response) => {
            try {
                toastr.error(response.error.response.data.errors[0].defaultMessage);
            } catch (error) {
                toastr.error(this.props.t("woManagement:woManagement.message.error.completeWo"));
            }
        });
    }

    handleInvalidSubmitAddOrEdit(event, errors, values) {
        toastr.warning(this.props.t("common:common.message.required.allFields"));
        invalidSubmitForm(event, errors, values, "idFormWoSPMPopup");
    }

    closePopup = () => {
        this.props.closePopup();
    }

    handleChangeReasonLv1 = (d) => {
        this.setState({
            selectValueReasonLv1: d,
            selectValueReasonLv2: {},
            selectValueReasonLv3: {}
        }, () => {
            this.getReasonBccs(2, this.state.selectValueReasonLv1.value);
        });
    }

    handleChangeReasonLv2 = (d) => {
        this.setState({
            selectValueReasonLv2: d,
            selectValueReasonLv3: {}
        }, () => {
            this.getReasonBccs(3, this.state.selectValueReasonLv2.value);
        });
    }

    handleChangeReasonLv3 = (d) => {
        this.setState({
            selectValueReasonLv3: d
        });
    }

    render() {
        const { t } = this.props;
        const { lstReason, lstReasonLv1, lstReasonLv2, lstReasonLv3 } = this.state;
        const objectAddEdit = {};
        return (
            <Modal isOpen={this.props.parentState.isOpenWoSpmPopup} className={'modal-primary modal-md ' + this.props.className}
                backdrop={this.state.backdrop} >
                <AvForm id="idFormWoSPMPopup" onValidSubmit={this.handleValidSubmitAddOrEdit} onInvalidSubmit={this.handleInvalidSubmitAddOrEdit} model={objectAddEdit}>
                    <ModalHeader toggle={this.closePopup}>
                        {t("woManagement:woManagement.title.completeWoSPM")}
                    </ModalHeader>
                    <ModalBody>
                        <Row>
                            <Col xs="12" sm="12">
                                <CustomSelectLocal
                                    name={"reasonFromBCCSLevel1"}
                                    label={t("woManagement:woManagement.label.reasonFromBCCSLevel1")}
                                    isRequired={true}
                                    messageRequire={t("woManagement:woManagement.message.required.reasonFromBCCSLevel1")}
                                    options={lstReasonLv1.map(item => {return {itemId: item.compCauseId, itemName: item.name}})}
                                    closeMenuOnSelect={true}
                                    handleItemSelectChange={this.handleChangeReasonLv1}
                                    selectValue={this.state.selectValueReasonLv1}
                                />
                            </Col>
                            <Col xs="12" sm="12">
                                <CustomSelectLocal
                                    name={"reasonFromBCCSLevel2"}
                                    label={t("woManagement:woManagement.label.reasonFromBCCSLevel2")}
                                    isRequired={true}
                                    messageRequire={t("woManagement:woManagement.message.required.reasonFromBCCSLevel2")}
                                    options={lstReasonLv2.map(item => {return {itemId: item.compCauseId, itemName: item.name}})}
                                    closeMenuOnSelect={true}
                                    handleItemSelectChange={this.handleChangeReasonLv2}
                                    selectValue={this.state.selectValueReasonLv2}
                                />
                            </Col>
                            <Col xs="12" sm="12">
                                <CustomSelectLocal
                                    name={"reasonFromBCCSLevel3"}
                                    label={t("woManagement:woManagement.label.reasonFromBCCSLevel3")}
                                    isRequired={true}
                                    messageRequire={t("woManagement:woManagement.message.required.reasonFromBCCSLevel3")}
                                    options={lstReasonLv3.map(item => {return {itemId: item.compCauseId, itemName: item.name}})}
                                    closeMenuOnSelect={true}
                                    handleItemSelectChange={this.handleChangeReasonLv3}
                                    selectValue={this.state.selectValueReasonLv3}
                                />
                            </Col>
                            <Col xs="12" sm="12">
                                <CustomAvField type="textarea" rows="3" name="comment" label={t("woManagement:woManagement.label.reason")} required maxLength="250"
                                    validate={{ required: { value: true, errorMessage: t("woManagement:woManagement.message.required.reason") } }} />
                            </Col>
                        </Row>
                    </ModalBody>
                    <ModalFooter>
                        <Button type="submit" color="primary" className="ml-auto" onClick={() => {}}>
                            <i className="fa fa-save"></i> {t("common:common.button.save")}
                        </Button>
                        <Button type="button" color="secondary" className="mr-auto" onClick={this.closePopup}><i className="fa fa-times-circle"></i> {t("common:common.button.close")}</Button>
                    </ModalFooter>
                </AvForm>
            </Modal>
        );
    }
}

WoManagementCompleteWoSPMPopup.propTypes = {
    parentState: PropTypes.object.isRequired,
    closePopup: PropTypes.func.isRequired,
    reloadDataGrid: PropTypes.func.isRequired,
};

function mapStateToProps(state, ownProps) {
    const { woManagement, common } = state;
    return {
        response: { woManagement, common }
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(Object.assign({}, commonActions, WoManagementActions), dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(translate()(WoManagementCompleteWoSPMPopup));
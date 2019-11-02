import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Col, Row, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { AvForm } from 'availity-reactstrap-validation';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { translate } from 'react-i18next';
import { toastr } from 'react-redux-toastr';

import * as commonActions from '../../../actions/commonActions';
import * as UtilityProcessManagementActions from './UtilityProcessManagementActions';
import { CustomAvField, CustomSelectLocal, CustomAppSwitch } from "../../../containers/Utils";
import { invalidSubmitForm, validSubmitForm } from '../../../containers/Utils/Utils';

class UtilityProcessManagementAddEditPopupListWo extends Component {
    constructor(props) {
        super(props);
        this.closePopup = this.closePopup.bind(this);
        this.handleItemSelectChangeWoType = this.handleItemSelectChangeWoType.bind(this);
        this.handleChangeIsRequire = this.handleChangeIsRequire.bind(this);
        this.handleChangeIsRequireCloseWo = this.handleChangeIsRequireCloseWo.bind(this);
        this.handleChangeCreateWoWhenCloseCR = this.handleChangeCreateWoWhenCloseCR.bind(this);
        this.addOrEditWo = this.addOrEditWo.bind(this);
        this.handleInvalidSubmitAddOrEdit = this.handleInvalidSubmitAddOrEdit.bind(this);
        this.state = {
            //Table
            data: [],
            pages: null,
            selected: {},
            selectAll: 0,
            //Object Search
            objectSearch: {},
            backdrop: "static",
            btnSearchLoading: false,
            selectedWoData: {},
            statusListSelect: [
                { itemId: 1, itemName: props.t("utilityProcessManagement:utilityProcessManagement.dropdown.status.active") },
                { itemId: 0, itemName: props.t("utilityProcessManagement:utilityProcessManagement.dropdown.status.inActive") }
            ],
            selectValueStatus: {},
            selectWoType: {},
            isRequire: false,
            isRequireCloseWo: false,
            createWoWhenCloseCR: false,
            isAddOrEditWo: props.parentState.isAddOrEditWo,
            listWoType: props.parentState.listWoType,
            addMore: 0
        };
    }

    componentWillUnmount() {
        this.setState({
            selectWoType: {}
        });
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.parentState.isAddOrEditWo === "ADD") {
            this.setState({
                isRequire: false,
                isRequireCloseWo: false,
                createWoWhenCloseCR: false,
                selectWoType: {}
            });
        }
        if (nextProps && nextProps.parentState.isAddOrEditWo) {
            this.setState({
                isAddOrEditWo: nextProps.parentState.isAddOrEditWo,
                listWoType: nextProps.parentState.listWoType,
                selectedWoData: nextProps.parentState.selectedWoData,
            })
        }
        if (nextProps.parentState.isAddOrEditWo === "EDIT") {
            this.setState({
                isRequire: nextProps.parentState.selectedWoData.isRequire,
                isRequireCloseWo: nextProps.parentState.selectedWoData.isRequireCloseWo,
                createWoWhenCloseCR: nextProps.parentState.selectedWoData.createWoWhenCloseCR,
                selectWoType: { value: nextProps.parentState.selectedWoData.woTypeId, label: nextProps.parentState.selectedWoData.woTypeName }
            })
        }
    }
    closePopup() {
        this.setState({
            objectSearch: {},
            isRequire: false,
            isRequireCloseWo: false,
            createWoWhenCloseCR: false
        });
        this.props.closePopup();
    }

    addOrEditWo(event, values) {
        validSubmitForm(event, values, "idFormAddOrEditWo");
        values.woTypeName = this.state.selectWoType.label;
        values.woTypeId = this.state.selectWoType.value;
        values.isRequire = this.state.isRequire;
        values.isRequireCloseWo = this.state.isRequireCloseWo;
        values.createWoWhenCloseCR = this.state.createWoWhenCloseCR;
        const utilityCrProcessWo = Object.assign({}, values);
        if (this.state.isAddOrEditWo === "ADD") {
            utilityCrProcessWo.id = "Add-" + (this.state.addMore + 1);
            this.setState({
                addMore: this.state.addMore + 1
            })
        } else {
            utilityCrProcessWo.id = this.state.selectedWoData.id
        }
        this.props.addOrEditWo(utilityCrProcessWo, this.state.isAddOrEditWo);
        this.closePopup();
    }

    handleInvalidSubmitAddOrEdit(event, errors, values) {
        toastr.warning(this.props.t("common:common.message.required.allFields"));
        invalidSubmitForm(event, errors, values, "idFormAddOrEditWo");
    }

    handleItemSelectChangeWoType(option) {
        this.setState({ selectWoType: option });
    }

    handleChangeIsRequire = (checked) => {
        this.setState({
            isRequire: checked
        });
    }
    handleChangeIsRequireCloseWo = (checked) => {
        this.setState({
            isRequireCloseWo: checked
        });
    }
    handleChangeCreateWoWhenCloseCR = (checked) => {
        this.setState({
            createWoWhenCloseCR: checked
        });
    }
    render() {
        const { t } = this.props;
        let objectAddOrEditWo = (this.state.isAddOrEditWo === "EDIT") ? this.state.selectedWoData : {};
        return (
            <Modal isOpen={this.props.parentState.isOpenPopupListWo} className={'modal-primary modal-lg ' + this.props.className}
                backdrop={this.state.backdrop} >
                <ModalHeader toggle={this.closePopup}>
                    {(this.state.isAddOrEditWo === "EDIT") ? this.props.t("utilityProcessManagement:utilityProcessManagement.label.editWo") : this.props.t("utilityProcessManagement:utilityProcessManagement.label.addNewWo")}
                </ModalHeader>
                <AvForm id="idFormAddOrEditWo" onValidSubmit={this.addOrEditWo} onInvalidSubmit={this.handleInvalidSubmitAddOrEdit} model={objectAddOrEditWo}>
                    <ModalBody>
                        <Row>
                            <Col xs="12">
                                <Row>
                                    <Col xs="12" sm="6">
                                        <CustomAvField
                                            name="woName"
                                            maxLength={128}
                                            required
                                            validate={{ required: { value: true, errorMessage: t("utilityProcessManagement:utilityProcessManagement.message.requiredWoName") } }}
                                            label={t("utilityProcessManagement:utilityProcessManagement.label.woName")}
                                            placeholder={t("utilityProcessManagement:utilityProcessManagement.placeholder.woName")} />
                                    </Col>
                                    <Col xs="12" sm="6">
                                        <CustomAvField
                                            name="description"
                                            maxLength={256}
                                            label={t("utilityProcessManagement:utilityProcessManagement.label.description")}
                                            placeholder={t("utilityProcessManagement:utilityProcessManagement.placeholder.description")} />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col xs="12" sm="6">
                                        <CustomAvField
                                            name="durationWo"
                                            maxLength={10}
                                            label={t("utilityProcessManagement:utilityProcessManagement.label.processTime")}
                                            placeholder={t("utilityProcessManagement:utilityProcessManagement.placeholder.processTime")}
                                            required
                                            validate={{
                                                required: { value: true, errorMessage: t("utilityProcessManagement:utilityProcessManagement.message.requiredProcessTime") },
                                                pattern: { value: '^[0-9]{1,10}$', errorMessage: t("utilityProcessManagement:utilityProcessManagement.message.required.processTime") }
                                            }}
                                        />
                                    </Col>
                                    <Col xs="12" sm="6">
                                        <CustomSelectLocal
                                            name={"woTypeId"}
                                            label={t("utilityProcessManagement:utilityProcessManagement.label.woType")}
                                            isRequired={true}
                                            messageRequire={t("utilityProcessManagement:utilityProcessManagement.message.requiredWoType")}
                                            options={this.state.listWoType}
                                            closeMenuOnSelect={true}
                                            handleItemSelectChange={this.handleItemSelectChangeWoType}
                                            selectValue={this.state.selectWoType}
                                        />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col xs="12" sm="3">
                                        <CustomAppSwitch
                                            name="isRequire"
                                            label={t("utilityProcessManagement:utilityProcessManagement.label.isForceCreateWo")}
                                            checked={this.state.isRequire}
                                            handleChange={this.handleChangeIsRequire}
                                        />

                                    </Col>

                                    <Col xs="12" sm="3">
                                        <CustomAppSwitch
                                            name="createWoWhenCloseCR"
                                            label={t("utilityProcessManagement:utilityProcessManagement.label.isCreateWoWhenClosedCR")}
                                            checked={this.state.createWoWhenCloseCR}
                                            handleChange={this.handleChangeCreateWoWhenCloseCR}
                                        />
                                    </Col>
                                    <Col xs="12" sm="4">
                                        <CustomAppSwitch
                                            name="isRequireCloseWo"
                                            label={t("utilityProcessManagement:utilityProcessManagement.label.isCloseWoWhenCompletedCR")}
                                            checked={this.state.isRequireCloseWo}
                                            handleChange={this.handleChangeIsRequireCloseWo}
                                        />
                                    </Col>
                                </Row>

                            </Col>
                        </Row>
                    </ModalBody>
                    <ModalFooter>
                        <Button type="submit" color="primary" className="ml-auto" > <i className="fa fa-save"></i> {(this.state.isAddOrEditWo === "ADD") ? t("common:common.button.save") : this.state.isAddOrEditWo === "EDIT" ? t("common:common.button.update") : ''}</Button>
                        <Button type="button" color="secondary" className="mr-auto" onClick={this.closePopup}><i className="fa fa-times-circle"></i> {t("common:common.button.close")}</Button>
                    </ModalFooter>
                </AvForm>

            </Modal>
        );
    }
}

UtilityProcessManagementAddEditPopupListWo.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(translate()(UtilityProcessManagementAddEditPopupListWo));
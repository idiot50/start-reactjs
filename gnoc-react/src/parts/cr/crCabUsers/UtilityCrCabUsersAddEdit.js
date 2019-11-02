import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Col, Card, CardBody, CardHeader, Collapse, Row } from 'reactstrap';
import { AvForm } from 'availity-reactstrap-validation';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { translate, Trans } from 'react-i18next';
import LaddaButton, { ZOOM_OUT } from 'react-ladda';
import { toastr } from 'react-redux-toastr';
import * as commonActions from './../../../actions/commonActions';
import * as UtilityCrCabUsersActions from './UtilityCrCabUsersActions';
import { CustomAutocomplete, CustomSelectLocal, CustomSticky, CustomAvField, CustomSelect } from "../../../containers/Utils";
import { invalidSubmitForm, validSubmitForm } from '../../../containers/Utils/Utils';

class UtilityCrCabUsersAddEdit extends Component {
    constructor(props) {
        super(props);

        this.toggleFormAddEdit = this.toggleFormAddEdit.bind(this);
        this.handleValidSubmitAddOrEdit = this.handleValidSubmitAddOrEdit.bind(this);
        this.handleInvalidSubmitAddOrEdit = this.handleInvalidSubmitAddOrEdit.bind(this);


        this.state = {
            btnAddOrEditLoading: false,
            collapseFormAddEdit: true,
            //AddOrEditModal
            isAddOrEdit: props.parentState.isAddOrEdit,
            selectedData: props.parentState.selectedData,
            //Select
            selectValueSegmentName: {},
            selectValueExecuteUnitName: {},
            selectValueCabUnitName: {},
            selectValueUserFullName: {},
            selectValueCreationUnitName: {},
            //list
            listImpact: []

        };
    }

    componentDidMount() {
        this.props.actions.getListImpactSegmentCBB().then((response) => {
            const listImpact = response.payload.data && response.payload.data.map(i => ({ itemId: i.valueStr, itemName: i.displayStr }))
            this.setState({
                listImpact,
                
            });
        }).catch((response) => {
            toastr.error(this.props.t("utilityCrCabUsers:utilityCrCabUsers.message.error.search"));
        });
        if (this.state.isAddOrEdit === "EDIT" || this.state.isAddOrEdit === "COPY") {
            this.setState({
                selectValueSegmentName: this.state.selectedData.impactSegmentId ? { value: this.state.selectedData.impactSegmentId } : {},
                selectValueUserFullName: this.state.selectedData.userID ? { value: this.state.selectedData.userID } : {},
                selectValueExecuteUnitName: this.state.selectedData.executeUnitId ? { value: this.state.selectedData.executeUnitId } : {},
                selectValueCabUnitName: this.state.selectedData.cabUnitId ? { value: this.state.selectedData.cabUnitId } : {},
                selectValueCreationUnitName: this.state.selectedData.creationUnitId ? { value: this.state.selectedData.creationUnitId } : {},

            });
        }
    }

    componentWillUnmount() {
        this.setState({
            isAddOrEdit: null
        });
    }


    handleValidSubmitAddOrEdit(event, values) {
        validSubmitForm(event, values, "idFormAddOrEdit");
        this.setState({
            btnAddOrEditLoading: true
        }, () => {

            const utilityCrCabUsers = Object.assign({}, values);
            utilityCrCabUsers.impactSegmentId = this.state.selectValueSegmentName ? this.state.selectValueSegmentName.value : null
            utilityCrCabUsers.userID = this.state.selectValueUserFullName ? this.state.selectValueUserFullName.value : null
            utilityCrCabUsers.executeUnitId = this.state.selectValueExecuteUnitName ? this.state.selectValueExecuteUnitName.value : null
            utilityCrCabUsers.cabUnitId = this.state.selectValueCabUnitName ? this.state.selectValueCabUnitName.value : null
            utilityCrCabUsers.creationUnitId = this.state.selectValueCreationUnitName ? this.state.selectValueCreationUnitName.value : null
       
            if (this.state.isAddOrEdit === "ADD" || this.state.isAddOrEdit === "COPY") {
                if (this.state.isAddOrEdit === "COPY") {
                    utilityCrCabUsers.crCabUsersId = "";
                }
                this.props.actions.addUtilityCrCabUsers(utilityCrCabUsers).then((response) => {
                    if (response.payload.data.key === "SUCCESS") {
                        this.setState({
                            btnAddOrEditLoading: false
                        }, () => {
                            this.props.closeAddOrEditPage(this.state.isAddOrEdit);
                            toastr.success(this.props.t("utilityCrCabUsers:utilityCrCabUsers.message.success.add"));
                        });
                    } else {
                        this.setState({
                            btnAddOrEditLoading: false
                        }, () => {
                            toastr.error(this.props.t("utilityCrCabUsers:utilityCrCabUsers.message.error.add"));
                        });
                    }
                }).catch((response) => {
                    this.setState({
                        btnAddOrEditLoading: false
                    }, () => {
                        try {
                            toastr.error(response.error.response.data.errors[0].defaultMessage);
                        } catch (error) {
                            console.error(error);
                            toastr.error(this.props.t("utilityCrCabUsers:utilityCrCabUsers.message.error.add"));
                        }
                    });
                });
            } else if (this.state.isAddOrEdit === "EDIT") {
                utilityCrCabUsers.crCabUsersId = this.state.selectedData.crCabUsersId;
                this.props.actions.editUtilityCrCabUsers(utilityCrCabUsers).then((response) => {
                    if (response.payload.data.key === "SUCCESS") {
                        this.setState({
                            btnAddOrEditLoading: false
                        }, () => {
                            this.props.closeAddOrEditPage(this.state.isAddOrEdit);
                            toastr.success(this.props.t("utilityCrCabUsers:utilityCrCabUsers.message.success.edit"));
                        });
                    } else {
                        this.setState({
                            btnAddOrEditLoading: false
                        }, () => {
                            toastr.error(this.props.t("utilityCrCabUsers:utilityCrCabUsers.message.error.edit"));
                        });
                    }
                }).catch((response) => {
                    this.setState({
                        btnAddOrEditLoading: false
                    }, () => {
                        try {
                            toastr.error(response.error.response.data.errors[0].defaultMessage);
                        } catch (error) {
                            console.error(error);
                            toastr.error(this.props.t("utilityCrCabUsers:utilityCrCabUsers.message.error.edit"));
                        }
                    });
                });
            }
        });
    }

    handleInvalidSubmitAddOrEdit(event, errors, values) {
        toastr.warning(this.props.t("common:common.message.required.allFields"));
        invalidSubmitForm(event, errors, values, "idFormAddOrEdit");
    }

    toggleFormAddEdit() {
        this.setState({ collapseFormAddEdit: !this.state.collapseFormAddEdit });
    }

    handleOnChangeCreationUnitName = (option) => {
        this.setState({ selectValueCreationUnitName: option })
    }

    handleItemSelectUserFullName = (option) => {
        this.setState({ selectValueUserFullName: option })
    }

    handleOnChangeCabUnitName = (option) => {
        if(!option){
            this.setState({ selectValueUserFullName : {}})
        }
        this.setState({ 
            selectValueCabUnitName: option,
            selectValueUserFullName : {}
         })
    }

    handleOnChangeExecuteUnitName = (option) => {
        this.setState({ selectValueExecuteUnitName: option })
    }

    handleItemSelectSegmentName = (option) => {
        this.setState({ selectValueSegmentName: option })
    }



    render() {
        const { t, response } = this.props;
        let objectAddOrEdit = (this.state.isAddOrEdit === "EDIT" || this.state.isAddOrEdit === "COPY") ? this.state.selectedData : {};
        const { columns } = this.state;
        return (
            <div className="animated fadeIn">
                <AvForm id="idFormAddOrEdit" onValidSubmit={this.handleValidSubmitAddOrEdit} onInvalidSubmit={this.handleInvalidSubmitAddOrEdit} model={objectAddOrEdit}>
                    <Row>
                        <Col xs="12">
                            <Card>
                                <CustomSticky>
                                    <CardHeader>
                                        <i className={(this.state.isAddOrEdit === "ADD" || this.state.isAddOrEdit === "COPY") ? "fa fa-plus-circle" : "fa fa-edit"}></i>{(this.state.isAddOrEdit === "ADD" || this.state.isAddOrEdit === "COPY") ? t("utilityCrCabUsers:utilityCrCabUsers.title.utilityCrCabUsersAdd") : this.state.isAddOrEdit === "EDIT" ? t("utilityCrCabUsers:utilityCrCabUsers.title.utilityCrCabUsersEdit") : ''}
                                        <div className="card-header-actions card-header-actions-button">
                                            <LaddaButton type="submit"
                                                className="btn btn-primary btn-md mr-1"
                                                loading={this.state.btnAddOrEditLoading}
                                                data-style={ZOOM_OUT}>
                                                <i className="fa fa-save"></i> {(this.state.isAddOrEdit === "ADD" || this.state.isAddOrEdit === "COPY") ? t("common:common.button.save") : this.state.isAddOrEdit === "EDIT" ? t("common:common.button.update") : ''}
                                            </LaddaButton>{' '}
                                            <Button type="button" color="secondary" onClick={this.props.closeAddOrEditPage}><i className="fa fa-reply"></i> {t("common:common.button.back")}</Button>
                                        </div>
                                    </CardHeader>
                                </CustomSticky>
                                <Collapse isOpen={this.state.collapseFormAddEdit} id="collapseFormAddEdit">
                                    <CardBody>
                                        <Row>
                                            <Col xs="12" sm="12">
                                                <Card>
                                                    <CardHeader>
                                                        <i className="fa fa-align-justify"></i>{t("utilityCrCabUsers:utilityCrCabUsers.title.utilityCrCabUsersInfo")}
                                                    </CardHeader>
                                                    <CardBody>
                                                        <Row>
                                                            <Col xs="12" sm="6">
                                                                <CustomSelectLocal
                                                                    name={"segmentName"}
                                                                    label={t("utilityCrCabUsers:utilityCrCabUsers.label.impactArr")}
                                                                    isRequired={true}
                                                                    messageRequire={t("utilityCrCabUsers:utilityCrCabUsers.message.requiredImpactArr")}
                                                                    options={this.state.listImpact}
                                                                    closeMenuOnSelect={true}
                                                                    handleItemSelectChange={this.handleItemSelectSegmentName}
                                                                    selectValue={this.state.selectValueSegmentName}
                                                                />
                                                            </Col>
                                                            <Col xs="12" sm="6">
                                                                <CustomAutocomplete
                                                                    name={"executeUnitName"}
                                                                    label={t("utilityCrCabUsers:utilityCrCabUsers.label.unitImpl")}
                                                                    placeholder={t("utilityCrCabUsers:utilityCrCabUsers.placeholder.unitImpl")}
                                                                    isRequired={true}
                                                                    messageRequire={t("utilityCrCabUsers:utilityCrCabUsers.message.requiredUnitImpl")}
                                                                    closeMenuOnSelect={true}
                                                                    handleItemSelectChange={this.handleOnChangeExecuteUnitName}
                                                                    selectValue={this.state.selectValueExecuteUnitName}
                                                                    moduleName={"UNIT"}
                                                                />
                                                            </Col>
                                                        </Row>
                                                        <Row>
                                                            <Col xs="12" sm="6">
                                                                <CustomAutocomplete
                                                                    name={"cabUnitName"}
                                                                    label={t("utilityCrCabUsers:utilityCrCabUsers.label.CABUnit")}
                                                                    placeholder={t("utilityCrCabUsers:utilityCrCabUsers.placeholder.CABUnit")}
                                                                    isRequired={true}
                                                                    messageRequire={t("utilityCrCabUsers:utilityCrCabUsers.message.requiredCABUnit")}
                                                                    closeMenuOnSelect={true}
                                                                    handleItemSelectChange={this.handleOnChangeCabUnitName}
                                                                    selectValue={this.state.selectValueCabUnitName}
                                                                    moduleName={"UNIT"}
                                                                />
                                                            </Col>
                                                            <Col xs="12" sm="6">
                                                                <CustomSelect
                                                                    name={"userFullName"}
                                                                    label={t("utilityCrCabUsers:utilityCrCabUsers.label.CABEmpl")}
                                                                    isRequired={true}
                                                                    messageRequire={t("utilityCrCabUsers:utilityCrCabUsers.message.requiredCABEmpl")}
                                                                    moduleName={"USERS"}
                                                                    closeMenuOnSelect={true}
                                                                    parentValue={(this.state.selectValueCabUnitName && this.state.selectValueCabUnitName.value) ? this.state.selectValueCabUnitName.value : "0"}
                                                                    handleItemSelectChange={this.handleItemSelectUserFullName}
                                                                    selectValue={this.state.selectValueUserFullName}
                                                                    isHasChildren={false}
                                                                />
                                                            </Col>
                                                        </Row>
                                                        <Row>
                                                            <Col xs="12" sm="6">
                                                                <CustomAutocomplete
                                                                    name={"createdcreationUnitNameUnit"}
                                                                    label={t("utilityCrCabUsers:utilityCrCabUsers.label.createdUnit")}
                                                                    placeholder={t("utilityCrCabUsers:utilityCrCabUsers.placeholder.createdUnit")}
                                                                    isRequired={false}
                                                                    closeMenuOnSelect={true}
                                                                    handleItemSelectChange={this.handleOnChangeCreationUnitName}
                                                                    selectValue={this.state.selectValueCreationUnitName}
                                                                    moduleName={"UNIT"}
                                                                />
                                                            </Col>
                                                        </Row>
                                                    </CardBody>
                                                </Card>
                                            </Col>
                                        </Row>
                                    </CardBody>
                                </Collapse>
                            </Card>
                        </Col>
                    </Row>
                </AvForm>
            </div>
        );
    }
}

UtilityCrCabUsersAddEdit.propTypes = {
    closeAddOrEditPage: PropTypes.func.isRequired,
    parentState: PropTypes.object.isRequired
};

function mapStateToProps(state, ownProps) {
    const { utilityCrCabUsers, common } = state;
    return {
        response: { utilityCrCabUsers, common }
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(Object.assign({}, UtilityCrCabUsersActions, commonActions), dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(translate()(UtilityCrCabUsersAddEdit));
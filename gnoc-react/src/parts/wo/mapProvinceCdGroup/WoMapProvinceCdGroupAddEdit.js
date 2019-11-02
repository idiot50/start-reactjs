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
import * as WoMapProvinceCdGroupActions from './WoMapProvinceCdGroupActions';
import { CustomReactTableLocal, CustomSelectLocal, CustomSticky, CustomAvField, CustomSelect } from "../../../containers/Utils";
import { invalidSubmitForm, validSubmitForm } from '../../../containers/Utils/Utils';

class WoMapProvinceCdGroupAddEdit extends Component {
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
            listProvince: [],
            selectValueProvince: {},
            selectValueCdGroup: {}
        };
    }

    componentWillMount() {
        if (this.state.isAddOrEdit === "EDIT" || this.state.isAddOrEdit === "COPY") {
            let { selectedData } = this.state;
            selectedData.numberDistrictSc = selectedData.numberDistrictSc.toString();
            selectedData.numberAccountSc = selectedData.numberAccountSc.toString();
            selectedData.numberDistrictTk = selectedData.numberDistrictTk.toString();
            selectedData.numberAccountTk = selectedData.numberAccountTk.toString();
        }
    }

    componentDidMount() {

        this.props.actions.getListLocationProvince().then((response) => {
            const listProvince = response.payload.data && response.payload.data.map(i => ({ itemId: i.locationCode, itemName: i.locationName }))
            this.setState({
                listProvince,
            })
        }).catch((response) => {
            this.setState({
                btnAddOrEditLoading: false
            }, () => {
                toastr.error(this.props.t("woMapProvinceCdGroup:woMapProvinceCdGroup.message.error.getListProvince"));
            });
        });
        if (this.state.isAddOrEdit === "EDIT" || this.state.isAddOrEdit === "COPY") {
            this.setState({
                selectValueProvince: this.state.selectedData.locationCode ? { value: this.state.selectedData.locationCode } : {},
                selectValueCdGroup: this.state.selectedData.cdId ? { value: this.state.selectedData.cdId } : {}
            })
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
            values.locationCode = this.state.selectValueProvince.value;
            values.cdId = this.state.selectValueCdGroup.value;
            values.numberDistrictSc = values.numberDistrictSc.trim();
            values.numberAccountSc = values.numberAccountSc.trim();
            values.numberDistrictTk = values.numberDistrictTk.trim();
            values.numberAccountTk = values.numberAccountTk.trim();
            const woMapProvinceCdGroup = Object.assign({}, values);
            if (this.state.isAddOrEdit === "ADD" || this.state.isAddOrEdit === "COPY") {
                if (this.state.isAddOrEdit === "COPY") {
                    woMapProvinceCdGroup.id = "";
                }
                this.props.actions.addWoMapProvinceCdGroup(woMapProvinceCdGroup).then((response) => {
                    if (response.payload.data.key === "SUCCESS") {
                        this.setState({
                            btnAddOrEditLoading: false
                        }, () => {
                            this.props.closeAddOrEditPage(this.state.isAddOrEdit);
                            toastr.success(this.props.t("woMapProvinceCdGroup:woMapProvinceCdGroup.message.success.add"));
                        });
                    } else {
                        this.setState({
                            btnAddOrEditLoading: false
                        }, () => {
                            toastr.error(this.props.t("woMapProvinceCdGroup:woMapProvinceCdGroup.message.error.add"));
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
                            toastr.error(this.props.t("woMapProvinceCdGroup:woMapProvinceCdGroup.message.error.add"));
                        }
                    });
                });
            } else if (this.state.isAddOrEdit === "EDIT") {
                woMapProvinceCdGroup.id = this.state.selectedData.id;
                this.props.actions.editWoMapProvinceCdGroup(woMapProvinceCdGroup).then((response) => {
                    if (response.payload.data.key === "SUCCESS") {
                        this.setState({
                            btnAddOrEditLoading: false
                        }, () => {
                            this.props.closeAddOrEditPage(this.state.isAddOrEdit);
                            toastr.success(this.props.t("woMapProvinceCdGroup:woMapProvinceCdGroup.message.success.edit"));
                        });
                    } else {
                        this.setState({
                            btnAddOrEditLoading: false
                        }, () => {
                            toastr.error(this.props.t("woMapProvinceCdGroup:woMapProvinceCdGroup.message.error.edit"));
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
                            toastr.error(this.props.t("woMapProvinceCdGroup:woMapProvinceCdGroup.message.error.edit"));
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

    handleItemSelectChangeProvince = (option) => {
        this.setState({ selectValueProvince: option })
    }

    handleItemSelectChangeCdGroup = (option) => {
        this.setState({ selectValueCdGroup: option })
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
                                        <i className={(this.state.isAddOrEdit === "ADD" || this.state.isAddOrEdit === "COPY") ? "fa fa-plus-circle" : "fa fa-edit"}></i>{(this.state.isAddOrEdit === "ADD" || this.state.isAddOrEdit === "COPY") ? t("woMapProvinceCdGroup:woMapProvinceCdGroup.title.woMapProvinceCdGroupAdd") : this.state.isAddOrEdit === "EDIT" ? t("woMapProvinceCdGroup:woMapProvinceCdGroup.title.woMapProvinceCdGroupEdit") : ''}
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
                                                        <i className="fa fa-align-justify"></i>{t("woMapProvinceCdGroup:woMapProvinceCdGroup.title.woMapProvinceCdGroupInfo")}
                                                    </CardHeader>
                                                    <CardBody>
                                                        <Row>
                                                            <Col xs="12" sm="4">
                                                                <CustomSelectLocal
                                                                    name={"locationCode"}
                                                                    label={t("woMapProvinceCdGroup:woMapProvinceCdGroup.label.province")}
                                                                    isRequired={true}
                                                                    messageRequire={t("woMapProvinceCdGroup:woMapProvinceCdGroup.message.requiredProvince")}
                                                                    options={this.state.listProvince}
                                                                    closeMenuOnSelect={true}
                                                                    handleItemSelectChange={this.handleItemSelectChangeProvince}
                                                                    selectValue={this.state.selectValueProvince}
                                                                />
                                                            </Col>
                                                            <Col xs="12" sm="4">
                                                                <CustomSelect
                                                                    name={"cdId"}
                                                                    label={t("woMapProvinceCdGroup:woMapProvinceCdGroup.label.cdGroup")}
                                                                    isRequired={true}
                                                                    messageRequire={t("woMapProvinceCdGroup:woMapProvinceCdGroup.message.requiredCdGroup")}
                                                                    closeMenuOnSelect={true}
                                                                    handleItemSelectChange={this.handleItemSelectChangeCdGroup}
                                                                    selectValue={this.state.selectValueCdGroup}
                                                                    moduleName={"GNOC_WO_CD_GROUP"}
                                                                />

                                                            </Col>
                                                            <Col xs="12" sm="4">
                                                                <CustomAvField name="numberDistrictSc" label={t("woMapProvinceCdGroup:woMapProvinceCdGroup.label.accidentInspectionDistrict")}
                                                                    placeholder={t("woMapProvinceCdGroup:woMapProvinceCdGroup.placeholder.accidentInspectionDistrict")} required
                                                                    maxLength="10"
                                                                    validate={{
                                                                        pattern: { value: '^([0-9]{1,10})?$', errorMessage: t("woMapProvinceCdGroup:woMapProvinceCdGroup.message.error.wrongDataFormat") },
                                                                        required: { value: true, errorMessage: t("woMapProvinceCdGroup:woMapProvinceCdGroup.message.requiredAccidentInspectionDistrict") }
                                                                    }}
                                                                />
                                                            </Col>
                                                        </Row>
                                                        <Row>
                                                            <Col xs="12" sm="4">
                                                                <CustomAvField name="numberAccountSc" label={t("woMapProvinceCdGroup:woMapProvinceCdGroup.label.accidentInspectionAccount")}
                                                                    placeholder={t("woMapProvinceCdGroup:woMapProvinceCdGroup.placeholder.accidentInspectionAccount")} required
                                                                    maxLength="10"
                                                                    validate={{
                                                                        pattern: { value: '^([0-9]{1,10})?$', errorMessage: t("woMapProvinceCdGroup:woMapProvinceCdGroup.message.error.wrongDataFormat") },
                                                                        required: { value: true, errorMessage: t("woMapProvinceCdGroup:woMapProvinceCdGroup.message.requiredAccidentInspectionAccount") }
                                                                    }}
                                                                />
                                                            </Col>
                                                            <Col xs="12" sm="4">
                                                                <CustomAvField name="numberDistrictTk" label={t("woMapProvinceCdGroup:woMapProvinceCdGroup.label.deployInspectionDistrict")}
                                                                    placeholder={t("woMapProvinceCdGroup:woMapProvinceCdGroup.placeholder.deployInspectionDistrict")} required
                                                                    maxLength="10"
                                                                    validate={{
                                                                        pattern: { value: '^([0-9]{1,10})?$', errorMessage: t("woMapProvinceCdGroup:woMapProvinceCdGroup.message.error.wrongDataFormat") },
                                                                        required: { value: true, errorMessage: t("woMapProvinceCdGroup:woMapProvinceCdGroup.message.requiredDeployInspectionDistrict") }
                                                                    }
                                                                    }
                                                                />
                                                            </Col>
                                                            <Col xs="12" sm="4">
                                                                <CustomAvField name="numberAccountTk" label={t("woMapProvinceCdGroup:woMapProvinceCdGroup.label.deployInspectionAccount")}
                                                                    placeholder={t("woMapProvinceCdGroup:woMapProvinceCdGroup.placeholder.deployInspectionAccount")} required
                                                                    maxLength="10"
                                                                    validate={{
                                                                        pattern: { value: '^([0-9]{1,10})?$', errorMessage: t("woMapProvinceCdGroup:woMapProvinceCdGroup.message.error.wrongDataFormat") },
                                                                        required: { value: true, errorMessage: t("woMapProvinceCdGroup:woMapProvinceCdGroup.message.requiredDeployInspectionAccount") }
                                                                    }
                                                                    }
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

WoMapProvinceCdGroupAddEdit.propTypes = {
    closeAddOrEditPage: PropTypes.func.isRequired,
    parentState: PropTypes.object.isRequired
};

function mapStateToProps(state, ownProps) {
    const { woMapProvinceCdGroup, common } = state;
    return {
        response: { woMapProvinceCdGroup, common }
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(Object.assign({}, WoMapProvinceCdGroupActions, commonActions), dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(translate()(WoMapProvinceCdGroupAddEdit));
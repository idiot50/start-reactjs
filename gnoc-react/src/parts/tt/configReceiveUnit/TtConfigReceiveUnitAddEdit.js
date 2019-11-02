import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Col, Card, CardBody, CardHeader, Collapse, Row } from 'reactstrap';
import { AvForm } from 'availity-reactstrap-validation';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { translate } from 'react-i18next';
import LaddaButton, { ZOOM_OUT } from 'react-ladda';
import { toastr } from 'react-redux-toastr';
import * as commonActions from './../../../actions/commonActions';
import * as TtConfigReceiveUnitActions from './TtConfigReceiveUnitActions';
import { CustomSelectLocal, CustomSticky, CustomAutocomplete } from "../../../containers/Utils";
import { validSubmitForm, invalidSubmitForm } from '../../../containers/Utils/Utils';

class TtConfigReceiveUnitAddEdit extends Component {
    constructor(props) {
        super(props);

        this.toggleFormAddEdit = this.toggleFormAddEdit.bind(this);
        this.handleValidSubmitAddOrEdit = this.handleValidSubmitAddOrEdit.bind(this);
        this.handleInvalidSubmitAddOrEdit = this.handleInvalidSubmitAddOrEdit.bind(this);
        this.handleItemSelectChangeTypeName = this.handleItemSelectChangeTypeName.bind(this);
        this.handleItemSelectChangeUnitType = this.handleItemSelectChangeUnitType.bind(this);
        this.handleOnChangeLocationName = this.handleOnChangeLocationName.bind(this);
        this.handleOnChangeUnitName = this.handleOnChangeUnitName.bind(this);
        this.state = {
            btnAddOrEditLoading: false,
            collapseFormAddEdit: true,
            //AddOrEditModal
            isAddOrEdit: props.parentState.isAddOrEdit,
            selectedData: props.parentState.selectedData,
            //Table
            data: [],
            //Select
            unitTypeListSelect: [
                { itemId: 1, itemName: props.t("ttConfigReceiveUnit:ttConfigReceiveUnit.dropdown.unitType.CTCT") },
                { itemId: 2, itemName: props.t("ttConfigReceiveUnit:ttConfigReceiveUnit.dropdown.unitType.TKTU") }
            ],
            selectValueTypeName: {},
            selectValueLocation: {},
            selectValueUnit: {},
            selectValueUnitType: {},
            selectValueStatus: {}
        };
    }

    componentDidMount() {
        //get data combobox mang su co
        this.props.actions.getListCatItem();

        if (this.state.isAddOrEdit === "EDIT" || this.state.isAddOrEdit === "COPY") {
            this.setState({
                selectValueTypeName: { value: this.state.selectedData.typeId },
                selectValueLocation: { value: this.state.selectedData.locationId },
                selectValueUnit: { value: this.state.selectedData.unitId },
                selectValueUnitType: { value: this.state.selectedData.typeUnit === "-1" ? null : this.state.selectedData.typeUnit }
            });
        } else if (this.state.isAddOrEdit === "ADD") {
            this.setState({
                selectValueTypeName: {},
                selectValueLocation: {},
                selectValueUnit: {},
                selectValueUnitType: {}
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
            values.typeId = this.state.selectValueTypeName.value;
            values.locationId = this.state.selectValueLocation.value;
            values.unitId = this.state.selectValueUnit.value;
            values.typeUnit = this.state.selectValueUnitType.value ? this.state.selectValueUnitType.value : "-1";
            const ttConfigReceiveUnit = Object.assign({}, values);
            if (this.state.isAddOrEdit === "ADD" || this.state.isAddOrEdit === "COPY") {
                this.props.actions.addTtConfigReceiveUnit(ttConfigReceiveUnit).then((response) => {
                    if (response.payload.data.key === "SUCCESS") {
                        this.setState({
                            btnAddOrEditLoading: false
                        }, () => {
                            this.props.closeAddOrEditPage(this.state.isAddOrEdit);
                            toastr.success(this.props.t("ttConfigReceiveUnit:ttConfigReceiveUnit.message.success.add"));
                        });
                    } else {
                        this.setState({
                            btnAddOrEditLoading: false
                        }, () => {
                            toastr.error(this.props.t("ttConfigReceiveUnit:ttConfigReceiveUnit.message.error.add"));
                        });
                    }
                }).catch((response) => {
                    this.setState({
                        btnAddOrEditLoading: false
                    }, () => {
                        try {
                            toastr.error(response.error.response.data.errors[0].defaultMessage);
                        } catch (error) {
                            toastr.error(this.props.t("ttConfigReceiveUnit:ttConfigReceiveUnit.message.error.add"));
                        }
                    });
                });
            } else if (this.state.isAddOrEdit === "EDIT") {
                ttConfigReceiveUnit.id = this.state.selectedData.id;
                this.props.actions.editTtConfigReceiveUnit(ttConfigReceiveUnit).then((response) => {
                    if (response.payload.status === 200) {
                        this.setState({
                            btnAddOrEditLoading: false
                        }, () => {
                            this.props.closeAddOrEditPage(this.state.isAddOrEdit);
                            toastr.success(this.props.t("ttConfigReceiveUnit:ttConfigReceiveUnit.message.success.edit"));
                        });
                    } else {
                        this.setState({
                            btnAddOrEditLoading: false
                        }, () => {
                            toastr.error(this.props.t("ttConfigReceiveUnit:ttConfigReceiveUnit.message.error.edit"));
                        });
                    }
                }).catch((response) => {
                    this.setState({
                        btnAddOrEditLoading: false
                    }, () => {
                        try {
                            toastr.error(response.error.response.data.errors[0].defaultMessage);
                        } catch (error) {
                            toastr.error(this.props.t("ttConfigReceiveUnit:ttConfigReceiveUnit.message.error.edit"));
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

    handleItemSelectChangeTypeName(option) {
        this.setState({ selectValueTypeName: option });
    }

    handleOnChangeLocationName(option) {
        this.setState({ selectValueLocation: option });
    }

    handleOnChangeUnitName(option) {
        this.setState({ selectValueUnit: option });
    }

    handleItemSelectChangeUnitType(option) {
        this.setState({ selectValueUnitType: option });
    }

    render() {
        const { t } = this.props;
        let objectAddOrEdit = (this.state.isAddOrEdit === "EDIT" || this.state.isAddOrEdit === "COPY") ? this.state.selectedData : {};
        return (
            <div className="animated fadeIn">
                <AvForm id="idFormAddOrEdit" onValidSubmit={this.handleValidSubmitAddOrEdit} onInvalidSubmit={this.handleInvalidSubmitAddOrEdit} model={objectAddOrEdit}>
                    <Row>
                        <Col xs="12">
                            <Card>
                                <CustomSticky>
                                    <CardHeader>
                                        <i className={(this.state.isAddOrEdit === "ADD" || this.state.isAddOrEdit === "COPY") ? "fa fa-plus-circle" : "fa fa-edit"}></i>{(this.state.isAddOrEdit === "ADD" || this.state.isAddOrEdit === "COPY") ? t("ttConfigReceiveUnit:ttConfigReceiveUnit.title.ttConfigReceiveUnitAdd") : this.state.isAddOrEdit === "EDIT" ? t("ttConfigReceiveUnit:ttConfigReceiveUnit.title.ttConfigReceiveUnitEdit") : ''}
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
                                            <Col xs="12" sm="6">
                                                <CustomSelectLocal
                                                    name={"typeId"}
                                                    label={t("ttConfigReceiveUnit:ttConfigReceiveUnit.label.typeName")}
                                                    isRequired={true}
                                                    messageRequire={t("ttConfigReceiveUnit:ttConfigReceiveUnit.message.requiredTypeName")}
                                                    options={(this.props.response.ttConfigReceiveUnit.ptType && this.props.response.ttConfigReceiveUnit.ptType.payload) ? this.props.response.ttConfigReceiveUnit.ptType.payload.data : []}
                                                    closeMenuOnSelect={true}
                                                    handleItemSelectChange={this.handleItemSelectChangeTypeName}
                                                    selectValue={this.state.selectValueTypeName}
                                                />
                                                <CustomSelectLocal
                                                    name={"typeUnit"}
                                                    label={t("ttConfigReceiveUnit:ttConfigReceiveUnit.label.unitType")}
                                                    isRequired={false}
                                                    options={this.state.unitTypeListSelect}
                                                    closeMenuOnSelect={true}
                                                    handleItemSelectChange={this.handleItemSelectChangeUnitType}
                                                    selectValue={this.state.selectValueUnitType}
                                                />
                                            </Col>

                                            <Col xs="12" sm="6">
                                                <CustomAutocomplete
                                                    name={"locationId"}
                                                    label={t("ttConfigReceiveUnit:ttConfigReceiveUnit.label.locationName")}
                                                    placeholder={t("ttConfigReceiveUnit:ttConfigReceiveUnit.placeholder.locationName")}
                                                    isRequired={true}
                                                    messageRequire={t("ttConfigReceiveUnit:ttConfigReceiveUnit.message.requiredLocationName")}
                                                    closeMenuOnSelect={false}
                                                    handleItemSelectChange={this.handleOnChangeLocationName}
                                                    selectValue={this.state.selectValueLocation}
                                                    moduleName={"REGION"}
                                                    isHasCheckbox={false}
                                                />
                                                <CustomAutocomplete
                                                    name={"unitId"}
                                                    label={t("ttConfigReceiveUnit:ttConfigReceiveUnit.label.unitName")}
                                                    placeholder={t("ttConfigReceiveUnit:ttConfigReceiveUnit.placeholder.unitName")}
                                                    isRequired={true}
                                                    messageRequire={t("ttConfigReceiveUnit:ttConfigReceiveUnit.message.requiredUnitName")}
                                                    closeMenuOnSelect={false}
                                                    handleItemSelectChange={this.handleOnChangeUnitName}
                                                    selectValue={this.state.selectValueUnit}
                                                    moduleName={"UNIT"}
                                                    isHasCheckbox={false}
                                                />
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

TtConfigReceiveUnitAddEdit.propTypes = {
    closeAddOrEditPage: PropTypes.func.isRequired,
    parentState: PropTypes.object.isRequired
};

function mapStateToProps(state, ownProps) {
    const { ttConfigReceiveUnit, common } = state;
    return {
        response: { ttConfigReceiveUnit, common }
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(Object.assign({}, TtConfigReceiveUnitActions, commonActions), dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(translate()(TtConfigReceiveUnitAddEdit));
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
import * as TtConfigMopActions from './TtConfigMopActions';
import { CustomReactTableLocal, CustomSelectLocal, CustomSticky, CustomAvField } from "../../../containers/Utils";
import { validSubmitForm, invalidSubmitForm } from '../../../containers/Utils/Utils';

class TtConfigMopAddEdit extends Component {
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
            selectValueConfigMopName: {},
            selectValueConfigMopGroup: {},
            mopArrayList: [],
            loop: false
        };
    }

    componentDidMount() {
        this.props.actions.getMopGroup();
        if (this.state.isAddOrEdit === 'EDIT' || this.state.isAddOrEdit === 'COPY') {
            this.props.actions.getMopArray(this.state.selectedData.typeId).then((response) => {
                this.setState({
                    mopArrayList: response.payload.data
                });
            });
            this.setState({
                selectValueConfigMopName: { value: this.state.selectedData.typeId },
                selectValueConfigMopGroup: { value: this.state.selectedData.alarmGroupId }
            })
        }
    }

    componentDidUpdate(nextState) {
        if (this.state.loop) {
            if (this.state.selectValueConfigMopName !== nextState.selectValueConfigMopName) {
                this.setState({
                    selectValueConfigMopGroup: {},
                })
            }
            this.setState({ loop: false })
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
            const ttConfigMop = Object.assign({}, values);
            ttConfigMop.typeId = this.state.selectValueConfigMopName.value + "";
            ttConfigMop.alarmGroupId = this.state.selectValueConfigMopGroup.value + "";
            delete ttConfigMop.configMopGroup;
            delete ttConfigMop.configMopName;
            if (this.state.isAddOrEdit === "ADD" || this.state.isAddOrEdit === "COPY") {
                if (this.state.isAddOrEdit === "COPY") {
                    ttConfigMop.id = null;
                }
                this.props.actions.addTtConfigMop(ttConfigMop).then((response) => {
                    if (response.payload.data.key === "SUCCESS") {
                        this.setState({
                            btnAddOrEditLoading: false
                        }, () => {
                            this.props.closeAddOrEditPage(this.state.isAddOrEdit);
                            toastr.success(this.props.t("ttConfigMop:ttConfigMop.message.success.add"));
                        });
                    } else {
                        this.setState({
                            btnAddOrEditLoading: false
                        }, () => {
                            toastr.error(this.props.t("ttConfigMop:ttConfigMop.message.error.add"));
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
                            toastr.error(this.props.t("ttConfigMop:ttConfigMop.message.error.add"));
                        }
                    });
                });
            } else if (this.state.isAddOrEdit === "EDIT") {
                ttConfigMop.id = this.state.selectedData.id;
                this.props.actions.editTtConfigMop(ttConfigMop).then((response) => {
                    if (response.payload.data.key === "SUCCESS") {
                        this.setState({
                            btnAddOrEditLoading: false
                        }, () => {
                            this.props.closeAddOrEditPage(this.state.isAddOrEdit);
                            toastr.success(this.props.t("ttConfigMop:ttConfigMop.message.success.edit"));
                        });
                    } else {
                        this.setState({
                            btnAddOrEditLoading: false
                        }, () => {
                            toastr.error(this.props.t("ttConfigMop:ttConfigMop.message.error.edit"));
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
                            toastr.error(this.props.t("ttConfigMop:ttConfigMop.message.error.edit"));
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

    handleItemSelectChangeConfigMopName = (option) => {
        this.setState({
            selectValueConfigMopName: option
        })
        if (option.value) {
            this.props.actions.getMopArray(option.value).then((response) => {
                this.setState({
                    mopArrayList: response.payload.data,
                    loop: true
                });
            });
        } else {
            this.setState({
                mopArrayList: [],
                selectValueConfigMopGroup: {}
            });
        }
    }

    handleItemSelectChangeConfigMopGroup = (option) => {
        this.setState({
            selectValueConfigMopGroup: option
        })
    }

    render() {
        const { t, response } = this.props;
        const { mopArrayList } = this.state;
        let objectAddOrEdit = (this.state.isAddOrEdit === "EDIT" || this.state.isAddOrEdit === "COPY") ? this.state.selectedData : {};
        return (
            <div className="animated fadeIn">
                <AvForm id="idFormAddOrEdit" onValidSubmit={this.handleValidSubmitAddOrEdit} onInvalidSubmit={this.handleInvalidSubmitAddOrEdit} model={objectAddOrEdit}>
                    <Row>
                        <Col xs="12">
                            <Card>
                                <CustomSticky>
                                    <CardHeader>
                                        <i className={(this.state.isAddOrEdit === "ADD" || this.state.isAddOrEdit === "COPY") ? "fa fa-plus-circle" : "fa fa-edit"}></i>{(this.state.isAddOrEdit === "ADD" || this.state.isAddOrEdit === "COPY") ? t("ttConfigMop:ttConfigMop.title.ttConfigMopAdd") : this.state.isAddOrEdit === "EDIT" ? t("ttConfigMop:ttConfigMop.title.ttConfigMopEdit") : ''}
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
                                            <Col xs="12">
                                                <Card>
                                                    <CardHeader>
                                                        <i className="fa fa-align-justify"></i>{t("ttConfigMop:ttConfigMop.title.ttConfigMopInfo")}
                                                    </CardHeader>
                                                    <CardBody>
                                                        <Row>
                                                            <Col xs="12" sm="6">
                                                                <CustomSelectLocal
                                                                    name={"configMopName"}
                                                                    label={t("ttConfigMop:ttConfigMop.label.mopName")}
                                                                    isRequired={true}
                                                                    messageRequire={t("ttConfigMop:ttConfigMop.message.required.mopName")}
                                                                    options={(this.props.response.ttConfigMop.mopGroup && this.props.response.ttConfigMop.mopGroup.payload) ? this.props.response.ttConfigMop.mopGroup.payload.data : []}
                                                                    closeMenuOnSelect={true}
                                                                    handleItemSelectChange={this.handleItemSelectChangeConfigMopName}
                                                                    selectValue={this.state.selectValueConfigMopName}
                                                                />
                                                            </Col>
                                                            <Col xs="12" sm="6">
                                                                <CustomSelectLocal
                                                                    name={"configMopGroup"}
                                                                    label={t("ttConfigMop:ttConfigMop.label.groupMopName")}
                                                                    isRequired={true}
                                                                    messageRequire={t("ttConfigMop:ttConfigMop.message.required.groupMopName")}
                                                                    options={mopArrayList}
                                                                    closeMenuOnSelect={true}
                                                                    handleItemSelectChange={this.handleItemSelectChangeConfigMopGroup}
                                                                    selectValue={this.state.selectValueConfigMopGroup}
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

TtConfigMopAddEdit.propTypes = {
    closeAddOrEditPage: PropTypes.func.isRequired,
    parentState: PropTypes.object.isRequired
};

function mapStateToProps(state, ownProps) {
    const { ttConfigMop, common } = state;
    return {
        response: { ttConfigMop, common }
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(Object.assign({}, TtConfigMopActions, commonActions), dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(translate()(TtConfigMopAddEdit));
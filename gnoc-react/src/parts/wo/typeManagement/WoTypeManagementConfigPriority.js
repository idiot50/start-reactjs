import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Col, Card, CardBody, CardHeader, Collapse, Row, ListGroup, ListGroupItem } from 'reactstrap';
import { AppSwitch } from '@coreui/react';
import { AvForm } from 'availity-reactstrap-validation';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { translate, Trans } from 'react-i18next';
import LaddaButton, { ZOOM_OUT } from 'react-ladda';
import { toastr } from 'react-redux-toastr';
import * as commonActions from '../../../actions/commonActions';
import * as WoTypeManagementActions from './WoTypeManagementActions';
import { CustomReactTableLocal, CustomSelectLocal, CustomSticky, CustomAvField, CustomReactTable } from "../../../containers/Utils";
import { invalidSubmitForm, validSubmitForm, Dropzone, downloadFileLocal, convertDateToDDMMYYYYHHMISS, confirmAlertDelete } from '../../../containers/Utils/Utils';

class WoTypeManagementConfigPriority extends Component {
    constructor(props) {
        super(props);

        this.toggleFormAddEdit = this.toggleFormAddEdit.bind(this);
        this.handleValidSubmitPriority = this.handleValidSubmitPriority.bind(this);
        this.handleInvalidSubmitAddOrEdit = this.handleInvalidSubmitAddOrEdit.bind(this);

        this.state = {
            isDuplicate: true,
            btnAddOrEditLoading: false,
            collapseFormAddEdit: true,
            //AddOrEditModal
            isAddOrEdit: props.parentState.isAddOrEdit,
            selectedData: props.parentState.selectedData,
            //Table List require infomation
            data: [],
            columns: this.buildTableColumns(),
            loading: false,
            //Select
            statusListSelect: [
                { itemId: 1, itemName: props.t("woTypeManagement:woTypeManagement.dropdown.status.active") },
                { itemId: 0, itemName: props.t("woTypeManagement:woTypeManagement.dropdown.status.inActive") }
            ],
            // isListPrioritySelect: [
            //     { itemId: 1, itemName: props.t("woTypeManagement:woTypeManagement.dropdown.priroity.low") },
            //     { itemId: 2, itemName: props.t("woTypeManagement:woTypeManagement.dropdown.priroity.medium") },
            //     { itemId: 3, itemName: props.t("woTypeManagement:woTypeManagement.dropdown.priroity.high") },
            //     { itemId: 4, itemName: props.t("woTypeManagement:woTypeManagement.dropdown.priroity.serious") }
            // ],
            selectValueWoGroupName: {},
            selectValueStatus: {},
            selectValuePriority: {},
            files: [],
            //List
            listWoGroupType: []
        };
    }

    componentDidMount() {
        //get combobox
        this.props.actions.getItemMaster("WO_GROUP_TYPE", "itemId", "itemName", "1", "3").then((res) => {
            this.setState({
                listWoGroupType: (res.payload && res.payload.data) ? res.payload.data.data : [],
                selectValueWoGroupName: { value: this.state.selectedData.woGroupType },
                selectValueStatus: { value: this.state.selectedData.isEnable },
                selectValueAllowManualCreate: { value: this.state.selectedData.enableCreate },
                data: this.state.selectedData.woPriorityDTOList
            })
        })
    }

    componentWillUnmount() {
        this.setState({
            isAddOrEdit: null
        });
    }
    // List info 
    buildTableColumns() {
        return [
            {
                Header: <Trans i18nKey="woTypeManagement:woTypeManagement.label.action" />,
                id: "action",
                sortable: false,
                fixed: "left",
                width: 120,
                accessor: d => {
                    let html = <div></div>;
                    html = <div className="text-center">
                        <span title={this.props.t("common:common.button.delete")} onClick={() => this.confirmDelete(d)}>
                            <Button type="button" size="sm" className="btn-danger icon mr-1"><i className="fa fa-trash-o"></i></Button>
                        </span>
                    </div>;
                    return html;
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{ height: '2.7em' }}></div>
                )
            },
            {
                className: "text-center",
                Header: <Trans i18nKey="woTypeManagement:woTypeManagement.label.priorityCode" />,
                id: "priorityCode",
                accessor: d => <span title={d.priorityCode}>{d.priorityCode}</span>
            },
            {
                className: "text-center",
                Header: <Trans i18nKey="woTypeManagement:woTypeManagement.label.priority" />,
                id: "priorityName",
                accessor: d => <span title={d.priorityName}>{d.priorityName}</span>

            }
        ];
    }



    handleValidSubmitPriority(event, values) {
        validSubmitForm(event, values, "idFormAddOrEdit");
        this.setState({
            btnAddOrEditLoading: true
        }, () => {
            const woTypeManagement = Object.assign({}, values, this.state.selectedData);
            woTypeManagement.woPriorityDTOList = this.state.data;
            if (woTypeManagement.woPriorityDTOList.length) {
                this.props.actions.editListPriority(woTypeManagement).then((response) => {
                    if (response.payload.data.key === "SUCCESS") {
                        this.setState({
                            btnAddOrEditLoading: false
                        }, () => {
                            this.props.closeConfigPage();
                            toastr.success(this.props.t("woTypeManagement:woTypeManagement.message.success.editPriority"));
                        });
                    } else {
                        this.setState({
                            btnAddOrEditLoading: false
                        }, () => {
                            toastr.error(this.props.t("woTypeManagement:woTypeManagement.message.error.editPriority"));
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
                            toastr.error(this.props.t("woTypeManagement:woTypeManagement.message.error.editPriority"));
                        }
                    });
                });
            } else {
                toastr.warning(this.props.t("woTypeManagement:woTypeManagement.message.error.listEmpty"));
                this.setState({btnAddOrEditLoading: false})
            }
        }
        );
    }
    confirmDelete(obj) {
        if (obj.isOfDatabase === false) {
            this.setState({
                data: [...this.state.data].filter(item => item.priorityCode !== obj.priorityCode)
            })
            toastr.success(this.props.t("woTypeManagement:woTypeManagement.message.success.deletePriority"));
        } else {
            confirmAlertDelete(this.props.t("woTypeManagement:woTypeManagement.message.confirmDeletePriority", { woTypeManagementCode: obj.priorityId }),
                () => {
                    this.props.actions.deletePriority(obj.priorityId).then((response) => {
                        if (response.payload.data.key === "SUCCESS") {
                            this.setState({
                                data: [...this.state.data].filter(item => item.priorityCode !== obj.priorityCode)
                            })
                            toastr.success(this.props.t("woTypeManagement:woTypeManagement.message.success.deletePriority"));
                        } else {
                            toastr.error(this.props.t("woTypeManagement:woTypeManagement.message.error.deletePriority"));
                        }
                    }).catch((response) => {
                        toastr.error(this.props.t("woTypeManagement:woTypeManagement.message.error.deletePriority"));
                    });
                });
        }

    }

    addPriority(obj) {
        if (obj.priorityCode) {
            if (!this.state.data.some(item => parseInt(item.priorityCode) === obj.priorityCode)) {
                this.setState({
                    data: [...this.state.data, obj]
                })
            } else {
                toastr.warning(this.props.t("woTypeManagement:woTypeManagement.message.error.duplicated"))
            }
        } else {
            toastr.warning(this.props.t("woTypeManagement:woTypeManagement.message.requiredPriority"));
        }
    }

    handleInvalidSubmitAddOrEdit(event, errors, values) {
        toastr.warning(this.props.t("common:common.message.required.allFields"));
        invalidSubmitForm(event, errors, values, "idFormAddOrEdit");
    }

    toggleFormAddEdit() {
        this.setState({ collapseFormAddEdit: !this.state.collapseFormAddEdit });
    }

    handleItemSelectChangeWoGroupName = (option) => {
        this.setState({ selectValueWoGroupName: option });
    }

    handleItemSelectChangeStatus = (option) => {
        this.setState({ selectValueStatus: option });
    }

    handleItemSelectChangePriority = (option) => {
        this.setState({ selectValuePriority: option });
    }

    render() {
        const { t, response } = this.props;
        let object = this.state.selectedData;
        const { columns, statusListSelect } = this.state;
        const isListPrioritySelect = (response.common.woPriorityCode && response.common.woPriorityCode.payload) ? response.common.woPriorityCode.payload.data.data : [];
        return (
            <div className="animated fadeIn">
                <AvForm id="idFormAddOrEdit" onValidSubmit={this.handleValidSubmitPriority} onInvalidSubmit={this.handleInvalidSubmitAddOrEdit} model={object}>
                    <Row>
                        <Col xs="12">
                            <Card>
                                <CustomSticky>
                                    <CardHeader>
                                        <i className="fa fa-edit"></i>{t("woTypeManagement:woTypeManagement.title.woTypeManagementConfigRequired")}
                                        <div className="card-header-actions card-header-actions-button">
                                            <LaddaButton type="submit"
                                                className="btn btn-primary btn-md mr-1"
                                                loading={this.state.btnAddOrEditLoading}
                                                data-style={ZOOM_OUT}>
                                                <i className="fa fa-save"></i> {t("common:common.button.save")}
                                            </LaddaButton>{' '}
                                            <Button type="button" color="secondary" onClick={this.props.closeConfigPage}><i className="fa fa-reply"></i> {t("common:common.button.back")}</Button>
                                        </div>
                                    </CardHeader>
                                </CustomSticky>
                                <Collapse isOpen={this.state.collapseFormAddEdit} id="collapseFormAddEdit">
                                    <CardBody>
                                        <Row>
                                            <Col xs="12" sm="12">
                                                <Card>
                                                    <CardHeader>
                                                        <i className="fa fa-align-justify"></i>{t("woTypeManagement:woTypeManagement.title.woTypeManagementInfo")}
                                                    </CardHeader>
                                                    <CardBody>
                                                        <Row>
                                                            <Col xs="12" sm="4">
                                                                <CustomAvField name="woTypeCode" label={t("woTypeManagement:woTypeManagement.label.woTypeCode")}
                                                                    placeholder={t("woTypeManagement:woTypeManagement.placeholder.woTypeCode")}
                                                                    disabled
                                                                    maxLength="50" validate={{ required: { value: true, errorMessage: t("woTypeManagement:woTypeManagement.message.requiredWoTypeCode") } }} />
                                                            </Col>
                                                            <Col xs="12" sm="4">
                                                                <CustomAvField name="woTypeName" label={t("woTypeManagement:woTypeManagement.label.woTypeName")}
                                                                    placeholder={t("woTypeManagement:woTypeManagement.placeholder.woTypeName")}
                                                                    disabled
                                                                    maxLength="1000" validate={{ required: { value: true, errorMessage: t("woTypeManagement:woTypeManagement.message.requiredWoTypeName") } }} />
                                                            </Col>
                                                            <Col xs="12" sm="4">
                                                                <CustomSelectLocal
                                                                    name={"woGroupName"}
                                                                    label={t("woTypeManagement:woTypeManagement.label.woGroupName")}
                                                                    isRequired={true}
                                                                    options={this.state.listWoGroupType}
                                                                    closeMenuOnSelect={true}
                                                                    handleItemSelectChange={this.handleItemSelectChangeWoGroupName}
                                                                    selectValue={this.state.selectValueWoGroupName}
                                                                    messageRequire={t("woTypeManagement:woTypeManagement.message.requiredWoGroupName")}
                                                                    isDisabled={true}
                                                                />
                                                            </Col>
                                                        </Row>
                                                        <Row>
                                                            <Col xs="12" sm="4">
                                                                <CustomSelectLocal
                                                                    name={"isEnable"}
                                                                    label={t("woTypeManagement:woTypeManagement.label.status")}
                                                                    isRequired={false}
                                                                    options={statusListSelect}
                                                                    closeMenuOnSelect={true}
                                                                    handleItemSelectChange={this.handleItemSelectChangeStatus}
                                                                    selectValue={this.state.selectValueStatus}
                                                                    isDisabled={true}
                                                                />
                                                            </Col>
                                                            <Col xs="12" sm="4">
                                                                <CustomSelectLocal
                                                                    name={"enableCreate"}
                                                                    label={t("woTypeManagement:woTypeManagement.label.priority")}
                                                                    isRequired={false}
                                                                    options={isListPrioritySelect.map(item => {return {itemId: parseInt(item.itemValue, 10), itemName: item.itemName}})}
                                                                    closeMenuOnSelect={true}
                                                                    handleItemSelectChange={this.handleItemSelectChangePriority}
                                                                    selectValue={this.state.selectValuePriority}
                                                                />
                                                            </Col>
                                                        </Row>
                                                        <Col xs="12" className="text-center mt-2">
                                                            <Button type="button" color="primary" className="ml-auto" onClick={() => this.addPriority(
                                                                {
                                                                    priorityCode: this.state.selectValuePriority.value,
                                                                    priorityName: this.state.selectValuePriority.label,
                                                                    isOfDatabase: false,
                                                                    woTypeId: this.state.selectedData.woTypeId
                                                                }
                                                            )}><i className="fa fa-plus"></i> {t("ptProblem:ptProblem.button.add")}</Button>
                                                        </Col>
                                                    </CardBody>
                                                </Card>
                                            </Col>
                                        </Row>

                                        <Row>
                                            <Col xs="12" sm="12">
                                                <Card>
                                                    <CardHeader>
                                                        <i className="fa fa-list-ul"></i>{t("woTypeManagement:woTypeManagement.title.woTypeManagementListRequiredInfo")}<span className="text-danger">{" (*)"}</span>
                                                    </CardHeader>
                                                    <CardBody>
                                                        <CustomReactTableLocal
                                                            columns={columns}
                                                            data={this.state.data}
                                                            loading={this.state.loading}
                                                            isCheckbox={false}
                                                            defaultPageSize={5}
                                                        />
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
            </div >
        );
    }
}

WoTypeManagementConfigPriority.propTypes = {
    closeConfigPage: PropTypes.func.isRequired,
    parentState: PropTypes.object.isRequired
};

function mapStateToProps(state, ownProps) {
    const { woTypeManagement, common } = state;
    return {
        response: { woTypeManagement, common }
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(Object.assign({}, WoTypeManagementActions, commonActions), dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(translate()(WoTypeManagementConfigPriority));
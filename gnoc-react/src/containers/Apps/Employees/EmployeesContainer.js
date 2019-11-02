import React, { Component } from 'react';
import {
  Badge,
  Button,
  ButtonDropdown,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Col,
  Collapse,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Fade,
  Form,
  FormGroup,
  FormText,
  FormFeedback,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Label,
  Row,
  Tooltip,
  UncontrolledTooltip,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader
} from 'reactstrap';
import { AvForm, AvField, AvGroup, AvInput, AvFeedback, AvRadioGroup, AvRadio } from 'availity-reactstrap-validation';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
// Employees actions
import * as employeesActions from '../../../actions/employeesActions';
// Child components
import CustomReactTable from "../../Utils/CustomReactTable";
import AddOrEditEmployeeContainer from "./AddOrEditEmployeeContainer";
import { translate, Trans } from 'react-i18next';
import { toastr } from 'react-redux-toastr';
import dateformat from "dateformat";
import avatar from '../../../assets/img/brand/person.svg';
import Config from '../../../config';
import LaddaButton, { ZOOM_OUT } from 'react-ladda';
import AsyncSelect from 'react-select/lib/Async';
// import queryString from 'query-string';

class EmployeesContainer extends Component {
    constructor(props) {
        super(props);

        this.toggleFormSearch = this.toggleFormSearch.bind(this);
        this.toggleFormInfo = this.toggleFormInfo.bind(this);
        this.onFetchData = this.onFetchData.bind(this);
        this.onPageChange = this.onPageChange.bind(this);
        this.handleSubmitSearch = this.handleSubmitSearch.bind(this);
        this.reloadSearchTable = this.reloadSearchTable.bind(this);
        this.openAddOrEditModal = this.openAddOrEditModal.bind(this);
        this.closeAddOrEditModal = this.closeAddOrEditModal.bind(this);
        this.confirmDelete = this.confirmDelete.bind(this);
        this.handleValidSubmitAddOrEdit = this.handleValidSubmitAddOrEdit.bind(this);
        this.handleInvalidSubmitAddOrEdit = this.handleInvalidSubmitAddOrEdit.bind(this);

        const columnsTable = [
            {
                Header: this.props.t("employee:employee.label.number"),
                id: "row",
                width: 50,
                className: "text-center",
                sortable: false,
                Cell: (row) => {
                    return <div>{row.index + 1}</div>;
                }
            },
            {
                Header: this.props.t("employee:employee.label.image"),
                id: "avatarId",
                sortable: false,
                width: 80,
                accessor: d => {
                    let html = <div></div>;
                    if(d.avatarId === undefined || d.avatarId === null || d.avatarId === "") {
                    html = <div className="text-center"><img className="app-img-avatar-table" src={avatar} alt={d.firstName + " " + d.lastName} /></div>;
                    } else {
                    const accessToken = localStorage.getItem('access_token');
                    html = <div className="text-center"><img className="app-img-avatar-table" src={Config.apiUrl + "/demo/common/getFileById?fileId=" + d.avatarId + '&access_token=' + accessToken} alt={d.firstName + " " + d.lastName} /></div>;
                    }
                    return html;
                }
            },
            {
                Header: this.props.t("employee:employee.label.action"),
                id: "userId",
                sortable: false,
                width: 80,
                accessor: d => {
                    let html = <div></div>;
                    if(d.roleCode === "ADMIN") {
                        html = <div className="text-center">
                            <span className="app-span-icon-table" onClick={() => this.openAddOrEditModal("EDIT", d.userId)}><i className="fa fa-edit"></i></span>
                            </div>;
                    } else {
                        html = <div className="text-center">
                            <span className="app-span-icon-table mr-2" onClick={() => this.openAddOrEditModal("EDIT", d.userId)}><i className="fa fa-edit"></i></span>
                            <span className="app-span-icon-table" onClick={() => this.confirmDelete(d.userId, d.username)}><i className="fa fa-times-circle"></i></span>
                            </div>;
                    }
                    return html;
                }
            },
            {
                Header: this.props.t("employee:employee.label.username"),
                accessor: "username"
            },
            {
                Header: this.props.t("employee:employee.label.fullName"),
                id: "fullName",
                accessor: d => d.firstName + " " + d.lastName
            },
            {
                Header: this.props.t("employee:employee.label.status"),
                id: "enabled",
                accessor: d => d.enabled ? this.props.t("employee:employee.dropdown.status.isActive") : this.props.t("employee:employee.dropdown.status.looked")
            },
            {
                Header: this.props.t("employee:employee.label.roleName"),
                accessor: "roleName"
            },
            {
                Header: this.props.t("employee:employee.label.createdTime"),
                id: "createdTime",
                className: "text-right",
                accessor: d => dateformat(d.createdTime, "HH:MM:ss dd-mm-yyyy")
            },
            {
                Header: this.props.t("employee:employee.label.createdUser"),
                accessor: "createdUser"
            },
            {
                Header: this.props.t("employee:employee.label.updatedTime"),
                id: "updatedTime",
                className: "text-right",
                accessor: d => d.updatedTime === null ? "" : dateformat(d.updatedTime, "HH:MM:ss dd-mm-yyyy")
            },
            {
                Header: this.props.t("employee:employee.label.updatedUser"),
                accessor: "updatedUser"
            },
            {
                Header: this.props.t("employee:employee.label.signInCount"),
                className: "text-center",
                accessor: "signInCount"
            }
        ];

        this.state = {
            collapseFormSearch: true,
            collapseFormInfo: true,
            btnSearchLoading: false,
            btnExportLoading: false,
            btnAddOrEditLoading: false,
            //Object Search
            objectSearch: {},
            //Table
            data: [],
            page: 0,
            pages: null,
            loading: true,
            columns: columnsTable,
            //AddOrEditModal
            addOrEditModal: false,
            isAddOrEdit: null,
            objectAddOrEdit: {},
            selectValue: ''
        };
    }

    toggleFormSearch() {
        this.setState({ collapseFormSearch: !this.state.collapseFormSearch });
    }

    toggleFormInfo() {
        this.setState({ collapseFormInfo: !this.state.collapseFormInfo });
    }

    onFetchData(state, instance) {
        let sortName = null;
        let sortType = null;
        if (state.sorted.length > 0) {
            if (state.sorted[0].id !== null && state.sorted[0].id !== undefined) {
                sortName = state.sorted[0].id;
                sortType = state.sorted[0].desc ? "desc" : "asc";
            }
        }

        let values = {
            page: state.page,
            pageSize: state.pageSize,
            sortName: sortName === "fullName" ? "firstName" : sortName,
            sortType: sortType
        }

        const objectSearch = Object.assign({}, this.state.objectSearch, values);

        this.setState({
            loading: true,
            objectSearch: objectSearch
        }, () => {
            this.props.actions.onSearchTable(this.state.objectSearch).then((response) => {
                this.setState({
                    data: response.payload.data.data,
                    pages: response.payload.data.pages,
                    loading: false
                });
            }).catch((response) => {
              
            });
        });
    }

    onPageChange(page) {
        if (page === -1) {
            this.setState({
                page: 0
            });
        } else {
            this.setState({
                page
            });
        }
    }

    handleSubmitSearch(event, errors, values) {
        let obj = values.objectSearch;
        obj.enabledString = obj.enabled === "" ? null : obj.enabled;
        obj.enabled = obj.enabled === "1" ? true : obj.enabled === "0" ? false : null;
        const objectSearch = Object.assign({}, this.state.objectSearch, obj);
        this.setState({
            btnSearchLoading: true,
            loading: true,
            page: 0,
            objectSearch: objectSearch
        }, () => {
            this.props.actions.onSearchTable(this.state.objectSearch).then((response) => {
                this.setState({
                    data: response.payload.data.data,
                    pages: response.payload.data.pages,
                    loading: false,
                    btnSearchLoading: false
                });
            }).catch((response) => {
              
            });
        });
    }

    reloadSearchTable() {
        this.props.actions.onSearchTable(this.state.objectSearch).then((response) => {
            this.setState({
                data: response.payload.data.data,
                pages: response.payload.data.pages,
                loading: false
            });
        }).catch((response) => {
          
        });
    }

    openAddOrEditModal(value, userId) {
        if(value === "ADD") {
            this.setState({
                addOrEditModal: true,
                isAddOrEdit: value,
                objectAddOrEdit: {}
            });
        } else if(value === "EDIT") {
            this.props.actions.onGetDetail(userId).then((response) => {
                let obj = {};
                if(response.payload !== undefined) {
                    obj = response.payload.data;
                }
                this.setState({
                    addOrEditModal: true,
                    isAddOrEdit: value,
                    objectAddOrEdit: obj
                });
            }).catch((response) => {
                toastr.error(this.props.t("employee:employee.message.error.getDetail"));
            });
        }
    }

    closeAddOrEditModal() {
        this.setState({
            addOrEditModal: false,
            isAddOrEdit: null
        });
    }

    confirmDelete(userId, username) {
        const toastrConfirmOptions = {
            okText: this.props.t("common:common.button.delete"),
            cancelText: this.props.t("common:common.button.cancel"),
            onOk: () => {
                this.props.actions.onDelete(userId).then((response) => {
                    if(response.payload.data.key === "SUCCESS") {
                        this.reloadSearchTable();
                        toastr.success(this.props.t("employee:employee.message.success.delete"));
                    } else {
                        toastr.error(this.props.t("employee:employee.message.error.delete"));
                    }
                }).catch((response) => {
                    toastr.error(this.props.t("employee:employee.message.error.delete"));
                });
            },
            onCancel: () => {
                
            }
        };
        toastr.confirm(this.props.t("employee:employee.message.confirmDelete", { username: username}), toastrConfirmOptions);
    }

    handleValidSubmitAddOrEdit(event, values) {
        this.setState({
            btnAddOrEditLoading: true
        }, () => {
            fetch(this.editor.getImageScaledToCanvas().toDataURL())
            .then(res => res.blob())
            .then(blob => {
                let filename = this.editor.props.image.name;
                let mimeType = this.editor.props.image.type;
                let fileAvatar = new File([blob], filename, {type:mimeType});
                let objSave = values.objectUser;
                objSave.enabled = objSave.enabled === "1" ? true : objSave.enabled === "0" ? false : false;
                objSave.userId = this.state.objectAddOrEdit.userId;
                objSave.employeeId = this.state.objectAddOrEdit.employeeId;
                objSave.avatarId = this.state.objectAddOrEdit.avatarId;
                const formData = new FormData();
                formData.append('formDataJson', JSON.stringify(objSave));
                formData.append('files', fileAvatar);
                if(this.state.isAddOrEdit === "ADD") {
                    this.props.actions.onAdd(formData).then((response) => {
                        if(response.payload.data.key === "SUCCESS") {
                            this.setState({
                                btnAddOrEditLoading: false,
                                addOrEditModal: false,
                                isAddOrEdit: null
                            }, () => {
                                this.reloadSearchTable();
                                toastr.success(this.props.t("employee:employee.message.success.add"));
                            });
                        } else {
                            this.setState({
                                btnAddOrEditLoading: false
                            }, () => {
                                toastr.error(this.props.t("employee:employee.message.error.add"));
                            });
                        }
                    }).catch((response) => {
                        this.setState({
                            btnAddOrEditLoading: false
                        }, () => {
                            toastr.error(this.props.t("employee:employee.message.error.add"));
                        });
                    });
                } else if(this.state.isAddOrEdit === "EDIT") {
                    this.props.actions.onEdit(formData).then((response) => {
                        if(response.payload.data.key === "SUCCESS") {
                            this.setState({
                                btnAddOrEditLoading: false,
                                addOrEditModal: false,
                                isAddOrEdit: null
                            }, () => {
                                this.reloadSearchTable();
                                toastr.success(this.props.t("employee:employee.message.success.edit"));
                            });
                        } else {
                            this.setState({
                                btnAddOrEditLoading: false
                            }, () => {
                                toastr.error(this.props.t("employee:employee.message.error.edit"));
                            });
                        }
                    }).catch((response) => {
                        this.setState({
                            btnAddOrEditLoading: false
                        }, () => {
                            toastr.error(this.props.t("employee:employee.message.error.edit"));
                        });
                    });
                }
            });
        });
    }

    handleInvalidSubmitAddOrEdit(event, errors, values) {
        
    }

    setEditorRefAvatar = editor => {
        if (editor) this.editor = editor;
    }

    loadOptions(query, callback) {
        if (query) {
            this.props.actions.onCheckExistUsername(query).then((response) => {
                
            }).catch((response) => {
                
            });
            // axios.get('/api/customers/search?search='+encodeURIComponent(query))
            //     .then(function(response) {
            //         const items = response.data.data;
            //         let options = items.map(function(item) {
            //             return {
            //                 value: item.id,
            //                 label: item.first_name + ' ' + item.last_name + ' (' + item.email + ')',
            //             };
            //         });
            //         callback(options);
            //     });
        }
        else {
            // var customerID = queryString.parse(window.location.search).customer;
            // if (customerID) {
                // axios.get('/api/customers/fetch?id=' + customerID)
                // .then((response) => {
                //     const items = response.data.data;
                //     let options = items.map(function(item) {
                //         return {
                //             value: item.id,
                //             label: item.first_name + ' ' + item.last_name + ' (' + item.email + ')',
                //         };
                //     });
                //     callback(options);
                //     this.setState({selectValue: options[0]});
                // });
            // }
        }
    }

    handleItemSelectChange(option) {
        this.setState({selectValue: option});
    }
    
    checkForPreLoad() {
        // var customerID = queryString.parse(window.location.search).customer;
        // if (customerID) {
        //     return true;
        // }
        return false;
    }

    render() {
        const nowDate = new Date().toJSON().split('T')[0];
        const { t } = this.props;
        const { columns, data, page, pages, loading, selectedOption } = this.state;
        return (
            <div>
                <div className="animated fadeIn">
                    <AvForm onSubmit={this.handleSubmitSearch}>
                        <Row>
                            <Col xs="12">
                                <Card>
                                    <CardHeader>
                                        <i className="fa fa-search"></i><Trans i18nKey="common:common.title.search"/>
                                        <div className="card-header-actions">
                                            <Button type="button" color="link" className="card-header-action btn-setting"><i className="icon-settings"></i></Button>
                                            <Button type="button" color="link" className="card-header-action btn-minimize" data-target="#collapseFormSearch" onClick={this.toggleFormSearch}><i className="icon-arrow-up"></i></Button>
                                        </div>
                                    </CardHeader>
                                    <Collapse isOpen={this.state.collapseFormSearch} id="collapseFormSearch">
                                        <CardBody>
                                            <Row>
                                                <Col xs="12" sm="4">
                                                    <AvField name="objectSearch.username" label={t("employee:employee.label.username")} placeholder={t("employee:employee.placeholder.username")} />
                                                </Col>
                                                <Col xs="12" sm="4">
                                                    <AvField name="objectSearch.fullName" label={t("employee:employee.label.fullName")} placeholder={t("employee:employee.placeholder.fullName")} />
                                                </Col>
                                                <Col xs="12" sm="4">
                                                    <AvField name="objectSearch.email" label={t("employee:employee.label.email")} placeholder={t("employee:employee.placeholder.email")} />
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col xs="12" sm="4">
                                                    <AvField name="objectSearch.employeeCode" label={t("employee:employee.label.employeeCode")} placeholder={t("employee:employee.placeholder.employeeCode")} />
                                                </Col>
                                                <Col xs="12" sm="4">
                                                    <AvField type="select" name="objectSearch.enabled" label={t("employee:employee.label.status")} helpMessage={t("employee:employee.message.statusAll")} >
                                                        <option value=""><Trans i18nKey="employee:employee.dropdown.all"/></option>
                                                        <option value="1"><Trans i18nKey="employee:employee.dropdown.status.isActive"/></option>
                                                        <option value="0"><Trans i18nKey="employee:employee.dropdown.status.looked"/></option>
                                                    </AvField>
                                                </Col>
                                                <Col xs="12" sm="4">
                                                    <AvField name="objectSearch.createdUser" label={t("employee:employee.label.createdUser")} placeholder={t("employee:employee.placeholder.createdUser")} />
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col xs="12" sm="4">
                                                    <AvGroup>
                                                        <Label><Trans i18nKey="employee:employee.label.username"/></Label>
                                                        <input type={"hidden"} name={this.props.name} defaultValue={this.state.selectValue ? this.state.selectValue.value : ''} />
                                                        <AsyncSelect
                                                            cacheOptions={true}
                                                            defaultOptions={this.checkForPreLoad()}
                                                            loadOptions={(query, callback) => this.loadOptions(query, callback)}
                                                            onChange={(option) => this.handleItemSelectChange(option)}
                                                            value={ this.state.selectValue }
                                                            placeholder={t("common:common.placeholder.select")}
                                                            noOptionsMessage={ () => t("common:common.placeholder.noOptionsMessage") }
                                                            classNamePrefix="react-Selector"
                                                        />
                                                    </AvGroup>
                                                </Col>
                                                <Col xs="12" sm="4">
                                                    <Label><Trans i18nKey="employee:employee.label.username"/></Label>
                                                    <InputGroup>
                                                        <InputGroupAddon addonType="prepend">
                                                            <InputGroupText>
                                                                <Input addon type="checkbox" aria-label="Checkbox for follwing text input" />
                                                            </InputGroupText>
                                                        </InputGroupAddon>
                                                        <Input placeholder="Check it out"/>
                                                    </InputGroup>
                                                </Col>
                                                <Col xs="12" sm="4">
                                                </Col>
                                            </Row>
                                        </CardBody>
                                        <CardFooter className="text-center">
                                            <LaddaButton type="submit"
                                                className="btn btn-warning btn-md mr-1"
                                                loading={this.state.btnSearchLoading}
                                                data-style={ZOOM_OUT}>
                                                <i className="fa fa-search"></i> <Trans i18nKey="employee:employee.button.search"/>
                                            </LaddaButton>
                                            <Button type="button" size="md" color="success" className="mr-1" onClick={() => this.openAddOrEditModal("ADD")}><i className="fa fa-plus-circle"></i> <Trans i18nKey="employee:employee.button.add"/></Button>
                                            <Button type="button" size="md" color="info" className="mr-1"><i className="fa fa-download"></i> <Trans i18nKey="employee:employee.button.import"/></Button>
                                            <LaddaButton type="button"
                                                className="btn btn-info btn-md mr-1"
                                                loading={this.state.btnExportLoading}
                                                data-style={ZOOM_OUT}>
                                                <i className="fa fa-upload"></i> <Trans i18nKey="employee:employee.button.export"/>
                                            </LaddaButton>
                                        </CardFooter>
                                    </Collapse>
                                </Card>
                            </Col>
                        </Row>
                    </AvForm>
                </div>
                <div className="animated fadeIn">
                    <Row>
                        <Col>
                            <Card>
                                <CardHeader>
                                    <i className="fa fa-align-justify"></i><Trans i18nKey="common:common.title.info"/>
                                    <div className="card-header-actions">
                                        <Button type="button" color="link" className="card-header-action btn-setting"><i className="icon-settings"></i></Button>
                                        <Button type="button" color="link" className="card-header-action btn-minimize" data-target="#collapseFormInfo" onClick={this.toggleFormInfo}><i className="icon-arrow-up"></i></Button>
                                    </div>
                                </CardHeader>
                                <Collapse isOpen={this.state.collapseFormInfo} id="collapseFormInfo">
                                    <CardBody>
                                        <CustomReactTable
                                        columns={columns}
                                        data={data}
                                        page={page}
                                        pages={pages}
                                        loading={loading}
                                        onFetchData={this.onFetchData}
                                        onPageChange={this.onPageChange}
                                        defaultPageSize={10}
                                        />
                                    </CardBody>
                                </Collapse>
                            </Card>
                        </Col>
                    </Row>
                </div>
                <AddOrEditEmployeeContainer
                    closeAddOrEditModal={this.closeAddOrEditModal}
                    stateAddOrEditModal={this.state}
                    handleValidSubmitAddOrEdit={this.handleValidSubmitAddOrEdit}
                    handleInvalidSubmitAddOrEdit={this.handleInvalidSubmitAddOrEdit}
                    setEditorRefAvatar={this.setEditorRefAvatar}/>
            </div>
        );
    }
}

function mapStateToProps(state, ownProps) {
    return {
        response: state.employees
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(employeesActions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(translate()(EmployeesContainer));
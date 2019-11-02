import React, { Component } from 'react';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader, Input } from 'reactstrap';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { translate, Trans } from 'react-i18next';
import { toastr } from 'react-redux-toastr';
import LaddaButton, { ZOOM_OUT } from 'react-ladda';
import * as commonActions from './../../actions/commonActions';
import CustomReactTableLocalSearch from "./CustomReactTableLocalSearch";
import _ from 'lodash';

class SettingTable extends Component {
    constructor(props) {
        super(props);
        
        this.toggleFormSettingTable = this.toggleFormSettingTable.bind(this);
        this.handleResetDefault = this.handleResetDefault.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

        this.state = {
            backdrop: "static",
            modalFormSettingTable: false,
            btnSubmitLoading: false,
            columnsChange: this.buildColumnsChange(props.columns),
            //Table
            data: [],
            loading: false,
            columns: this.buildTableColumns(),
            checkedIsShow: [],
            onChangeNumber: [],
            isSaved: false,
            dataTableConfigUser: {}
        };
    }
    
    componentDidMount() {
        this.renderListTableConfigUser(this.props.columns, this.props.moduleName);
    }

    renderDataByColumnTable(columns) {
        const listColumns = [];
        for(let i = 0; i < columns.length; i++) {
            if (columns[i].id !== "action") {
                listColumns.push({
                    itemId: i + 1,
                    itemName: columns[i].Header,
                    itemCode: columns[i].id,
                    isShow: 0,
                    isLeft: 0,
                    isCenter: 0,
                    isRight: 0,
                    order: null
                });
            }
        }
        return listColumns;
    }

    renderDataByListTableConfigUser(headerConfig, listColumns) {
        const listHeaderConfig = headerConfig.split(",");
        for(let i = 0; i < listHeaderConfig.length; i++) {
            for (const col of listColumns) {
                if (listHeaderConfig[i].split("#")[0] === col.itemCode) {
                    col.isShow = 1;
                    if (listHeaderConfig[i].split("#")[1] === "1") {
                        col.isLeft = 1;
                    } else if (listHeaderConfig[i].split("#")[1] === "2") {
                        col.isCenter = 1;
                    } else if (listHeaderConfig[i].split("#")[1] === "3") {
                        col.isRight = 1;
                    }
                    col.order = i + 1;
                    break;
                }
            }
        }
        return listColumns;
    }

    renderDefaultColumn(moduleName) {
        switch (moduleName) {
            case "PT_PROBLEM_LIST":
                return "problemState#1,problemCode#1,problemName#1,esRcaTime#2,createdTime#2,receiveUnitIdStr#1,rca#1";
            case "KEDB_LIST":
                return "kedbCode#1,kedbName#1,vendorName#1,typeName#1,parentTypeName#1,subCategoryName#1,kedbStateName#1,createUserName#1,createdTime#2";
            case "TT_TROUBLE_LIST":
                return "typeName#1,troubleCode#1,troubleName#1,unit#1,stateName#1,priorityName#1,createdTime#2,remainTime#2,clearTime#2,lastUpdateTime#2";
            case "WO_MANAGEMENT":
                return "statusName#1,woContent#1,woCode#1,woTypeName#1,priorityName#1,createDate#1,remainTime#1createUnitName#1";
            default:
                return null;
        }
    }
    
    renderListTableConfigUser(columns, moduleName) {
        const objectUsers = JSON.parse(localStorage.getItem('user'));
        this.props.actions.getListTableConfigUser({userName: objectUsers.userName, headerKey: moduleName}).then((response) => {
            const listTableConfigUser = response.payload.data;
            let listColumns = [...this.renderDataByColumnTable(columns)];
            let checkedIsShow = [];
            let headerConfig;
            if (listTableConfigUser.length > 0) {
                headerConfig = listTableConfigUser[0].headerConfig;
                listColumns = this.renderDataByListTableConfigUser(headerConfig, listColumns);
                for (const obj of listColumns) {
                    if (obj.isShow === 1) {
                        checkedIsShow.push(obj);
                    }
                }
                this.setState({
                    checkedIsShow,
                    data: this.sortDataTable(listColumns),
                    dataTableConfigUser: listTableConfigUser[0],
                    isSaved: true
                }, () => {
                    this.renderColumnTable(this.state.columnsChange, listColumns);
                });
            } else {
                headerConfig = this.renderDefaultColumn(moduleName);
                if (headerConfig !== null) {
                    listColumns = this.renderDataByListTableConfigUser(headerConfig, listColumns);
                    for (const obj of listColumns) {
                        if (obj.isShow === 1) {
                            checkedIsShow.push(obj);
                        }
                    }
                }
                this.setState({
                    checkedIsShow,
                    data: this.sortDataTable(listColumns),
                    isSaved: false
                }, () => {
                    this.renderColumnTable(this.state.columnsChange, listColumns);
                });
            }
        }).catch((error) => {
        });
    }

    buildTableColumns() {
        return [
            {
                Header: <Trans i18nKey="common:common.label.show" />,
                accessor: "isShow",
                className: "text-center",
                fixed: "left",
                sortable: false,
                width: 80,
                Cell: ({ original }) => {
                    const isChecked = this.state.checkedIsShow.find((ch) => ch.itemId === original.itemId);
                    return (
                        <input type="checkbox" checked={isChecked ? true : false} onChange={(e) => this.toggleCheckboxRowIsShow(e.target.checked, original)} />
                    );
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{ height: '2.7em' }}></div>
                )
            },
            {
                Header: <Trans i18nKey="common:common.label.columnName" />,
                id: "itemName",
                sortable: false,
                fixed: "left",
                // width: 250,
                filterMethod: (filter, row) => {
                    if (row._original[filter.id] && (typeof row._original[filter.id] === 'string' || row._original[filter.id] instanceof String)) {
                        return row._original[filter.id].toLowerCase().includes(filter.value.toLowerCase());
                    } else {
                        return false;
                    }
                },
                accessor: d => <span>{d.itemName}</span>
            },
            {
                Header: <Trans i18nKey="common:common.label.textLeft" />,
                accessor: "isLeft",
                className: "text-center",
                sortable: false,
                width: 80,
                Cell: ({ original }) => {
                    return (
                        <input type="radio" name={ original.itemCode } checked={original.isLeft} onChange={(e) => this.toggleCheckboxRowIsAlign("isLeft", original)} />
                    );
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{ height: '2.7em' }}></div>
                )
            },
            {
                Header: <Trans i18nKey="common:common.label.textCenter" />,
                accessor: "isCenter",
                className: "text-center",
                sortable: false,
                width: 80,
                Cell: ({ original }) => {
                    return (
                        <input type="radio" name={ original.itemCode } checked={original.isCenter} onChange={(e) => this.toggleCheckboxRowIsAlign("isCenter", original)} />
                    );
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{ height: '2.7em' }}></div>
                )
            },
            {
                Header: <Trans i18nKey="common:common.label.textRight" />,
                accessor: "isRight",
                className: "text-center",
                sortable: false,
                width: 80,
                Cell: ({ original }) => {
                    return (
                        <input type="radio" name={ original.itemCode } checked={original.isRight} onChange={(e) => this.toggleCheckboxRowIsAlign("isRight", original)} />
                    );
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{ height: '2.7em' }}></div>
                )
            },
            {
                Header: <Trans i18nKey="common:common.label.order" />,
                accessor: "order",
                className: "text-center",
                sortable: false,
                width: 150,
                Cell: ({ original }) => {
                    return <Input type="text" value={(original && original.order) ? original.order : ""} onChange={(e) => this.onChangeRowNumber(e.target.value, original)} />;
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{ height: '2.7em' }}></div>
                )
            }
        ];
    }

    buildColumnsChange(columns) {
        for (const column of columns) {
            column.show = true;
        }
        return columns;
    }

    onChangeRowNumber(newValue, object) {
        //Set into data
        let pattern = /^\d+$/;
        if ((pattern.test(newValue) && Number.parseInt(newValue, 10) > 0) || newValue === "") {
            const data = [...this.state.data];
            for(const obj of data) {
                if(obj.itemId === object.itemId) {
                    obj.order= newValue;
                    break;
                }
            }
            this.setState({
                data
            });
        }
    }

    toggleCheckboxRowIsShow(checked, object) {
        //Set checked
        const checkedIsShow = [...this.state.checkedIsShow];
        if(checked) {
            checkedIsShow.push(object);
        } else {
            const index = checkedIsShow.findIndex((ch) => ch.itemId === object.itemId);
            checkedIsShow.splice(index, 1);
        }
        //Set into data
        const data = [...this.state.data];
        const indexData = data.findIndex((ch) => ch.itemId === object.itemId);
        const objectEdit = Object.assign({}, data[indexData]);
        objectEdit.isShow = checked ? 1 : 0;
        if (checked && objectEdit.isRight === 0 && objectEdit.isCenter === 0 && objectEdit.isLeft === 0) {
            objectEdit.isLeft = 1;
        }
        data.splice(indexData, 1, objectEdit);
        this.setState({
            data,
            checkedIsShow
        });
    }

    toggleCheckboxRowIsAlign(align, object) {
        //Set into data
        const data = [...this.state.data];
        const indexData = data.findIndex((ch) => ch.itemId === object.itemId);
        if (align === "isLeft") {
            object.isRight = 0;
            object.isCenter = 0;
            object.isLeft = 1;
        } else if (align === "isCenter") {
            object.isRight = 0;
            object.isCenter = 1;
            object.isLeft = 0;
        } else if (align === "isRight") {
            object.isRight = 1;
            object.isCenter = 0;
            object.isLeft = 0;
        }
        data.splice(indexData, 1, object);
        this.setState({
            data
        });
    }

    toggleFormSettingTable() {
        if (!this.state.modalFormSettingTable) {
            this.renderListTableConfigUser(this.props.columns, this.props.moduleName);
        }
        this.setState({ modalFormSettingTable: !this.state.modalFormSettingTable });
    }

    handleResetDefault() {
        if (this.state.isSaved) {
            this.props.actions.deleteTableConfigUser(this.state.dataTableConfigUser.tableConfigUserId).then((response) => {
                if (response.payload.data.key === "SUCCESS") {
                    this.toggleFormSettingTable();
                    this.renderListTableConfigUser(this.props.columns, this.props.moduleName);
                    toastr.success(this.props.t("common:common.message.success.resetDefaultTableConfigUser"));
                } else {
                    toastr.error(this.props.t("common:common.message.error.resetDefaultTableConfigUser"));
                }
            }).catch((response) => {
                toastr.error(this.props.t("common:common.message.error.resetDefaultTableConfigUser"));
            });
        } else {
            this.toggleFormSettingTable();
            this.renderListTableConfigUser(this.props.columns, this.props.moduleName);
            setTimeout(() => {
                toastr.success(this.props.t("common:common.message.success.resetDefaultTableConfigUser"));
            }, 1000);
        }
    }

    handleSubmit() {
        this.setState({
            btnSubmitLoading: true
        }, () => {
            const list = [...this.state.data];
            let columns = [...this.state.columnsChange];
            const headerConfig = this.renderDataSave(list);
            if (this.validate(list) === "NOT_FILL_ORDER") {
                this.setState({
                    btnSubmitLoading: false
                }, () => {
                    toastr.warning(this.props.t("common:common.message.nullDisplayOrder"));
                });
                return;
            }
            if (this.validate(list) === "DUPLICATE") {
                this.setState({
                    btnSubmitLoading: false
                }, () => {
                    toastr.warning(this.props.t("common:common.message.duplicateDisplayOrder"));
                });
                return;
            }
            if (headerConfig === "") {
                this.setState({
                    btnSubmitLoading: false
                }, () => {
                    toastr.warning(this.props.t("common:common.message.emptyTableConfigUser"));
                });
                return;
            }
            if (this.state.isSaved) {
                let objectSave = Object.assign({}, this.state.dataTableConfigUser);
                objectSave.headerConfig = headerConfig;
                this.props.actions.updateTableConfigUser(objectSave).then((response) => {
                    this.setState({
                        btnSubmitLoading: false
                    }, () => {
                        if (response.payload.data.key === "SUCCESS") {
                            this.toggleFormSettingTable();
                            this.renderColumnTable(columns, list);
                            toastr.success(this.props.t("common:common.message.success.saveTableConfigUser"));
                        } else {
                            toastr.error(this.props.t("common:common.message.error.saveTableConfigUser"));
                        }
                    });
                }).catch((response) => {
                    this.setState({
                        btnSubmitLoading: false
                    }, () => {
                        toastr.error(this.props.t("common:common.message.error.saveTableConfigUser"));
                    });
                });
            } else {
                // const objectUsers = JSON.parse(localStorage.getItem('user'));
                let objectSave = {
                    userId: "",//objectUsers.userID,
                    userName: "",//objectUsers.userName,
                    headerKey: this.props.moduleName,
                    headerConfig: headerConfig,
                    note: ""
                }
                this.props.actions.insertTableConfigUser(objectSave).then((response) => {
                    this.setState({
                        btnSubmitLoading: false
                    }, () => {
                        if (response.payload.data.key === "SUCCESS") {
                            this.toggleFormSettingTable();
                            this.renderColumnTable(columns, list);
                            toastr.success(this.props.t("common:common.message.success.saveTableConfigUser"));
                        } else {
                            toastr.error(this.props.t("common:common.message.error.saveTableConfigUser"));
                        }
                    });
                }).catch((response) => {
                    this.setState({
                        btnSubmitLoading: false
                    }, () => {
                        toastr.error(this.props.t("common:common.message.error.saveTableConfigUser"));
                    });
                });
            }
        });
    }

    renderDataSave(list) {
        const listSave = [];
        list = _.orderBy(list, ['order'],['asc']);
        for (const obj of list) {
            if (obj.isShow === 1) {
                listSave.push(obj.itemCode + "#" + this.renderTextAlignColumns(obj));
            }
        }
        return listSave.toString();
    }

    renderColumnTable(columns, list) {
        for (const col of columns) {
            for (const obj of list) {
                if (col.id === obj.itemCode) {
                    col.show = obj.isShow === 1 ? true : false;
                    col.className = this.renderAlignColumns(obj);
                    col.order = obj.order !== null ? obj.order : Number.MAX_SAFE_INTEGER;
                    break;
                }
            }
            if (col.id === "action") {
                col.order = Number.MIN_SAFE_INTEGER
            }
        }
        columns = _.orderBy(columns, ['order'],['asc']);
        this.props.onChange(columns);
    }

    renderAlignColumns(obj) {
        if (obj.isLeft === 1) {
            return "text-left";
        } else if (obj.isCenter === 1) {
            return "text-center";
        } else if (obj.isRight === 1) {
            return "text-right";
        } else {
            return "text-left";
        }
    }

    renderTextAlignColumns(obj) {
        if (obj.isLeft === 1) {
            return 1;
        } else if (obj.isCenter === 1) {
            return 2;
        } else if (obj.isRight === 1) {
            return 3;
        } else {
            return 1;
        }
    }

    validate(list) {
        const listOrder = [];
        for (const column of list) {
            if (column.isShow === 1) {
                if (column.order === null || column.order === undefined || column.order === "") {
                    return "NOT_FILL_ORDER";
                }
                listOrder.push(parseInt(column.order));
            }
        }
        return this.hasDuplicates(listOrder) ? "DUPLICATE" : "SUCCESS" ;
    }

    hasDuplicates(list) {
        return _.uniq(list).length !== list.length; 
    }

    sortDataTable(data) {
        const dataSort = _.orderBy(data, [
            function (item) { return item.order; },
            function (item) { return item.itemName; }
          ], ["asc", "asc"]);
        return dataSort;
    }

    render() {
        const { t } = this.props;
        const { columns, data, loading } = this.state;
        return (
            <span>
                <Button color="link" className="p-0 card-header-action btn-setting btn-custom" onClick={this.toggleFormSettingTable} title={t("common:common.label.tableConfig")}>
                    <i className="icon-settings"></i>
                </Button>
                <Modal isOpen={this.state.modalFormSettingTable} toggle={this.toggleFormSettingTable} backdrop={this.state.backdrop}
                        className={'modal-primary modal-lg'}>
                    <ModalHeader toggle={this.toggleFormSettingTable}>{t("common:common.title.configColumn")}</ModalHeader>
                    <ModalBody>
                        <CustomReactTableLocalSearch
                            columns={columns}
                            data={data}
                            loading={loading}
                            defaultPageSize={10}
                            isContainsAvField={true}
                        />
                    </ModalBody>
                    <ModalFooter>
                    <LaddaButton type="button"
                        className="btn btn-primary btn-md mr-1"
                        loading={this.state.btnSubmitLoading}
                        data-style={ZOOM_OUT}
                        onClick={this.handleSubmit}>
                        <i className="fa fa-save"></i> {t("common:common.button.save")}
                    </LaddaButton>{' '}
                    <Button type="button" color="secondary" onClick={this.handleResetDefault}><i className="fa fa-refresh"></i> {t("common:common.button.resetDefault")}</Button>
                    <Button type="button" color="secondary" onClick={this.toggleFormSettingTable}><i className="fa fa-times-circle"></i> {t("common:common.button.close")}</Button>
                    </ModalFooter>
                </Modal>
            </span>
        );
    }
}

SettingTable.propTypes = {
    columns: PropTypes.array.isRequired,
    onChange: PropTypes.func.isRequired,
    moduleName: PropTypes.string.isRequired
};

function mapStateToProps(state, ownProps) {
    const { common } = state;
    return {
        response: { common }
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(Object.assign({}, commonActions), dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(translate()(SettingTable));
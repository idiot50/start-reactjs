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
import * as UtilityConfigTempImportActions from './UtilityConfigTempImportActions';
import { CustomReactTableLocal, CustomSticky, CustomAvField, CustomInputColumnDuplicate, CustomAppSwitch, CustomSelectLocal, CustomSelect } from "../../../containers/Utils";
import { downloadFileLocal, DropzoneTable, invalidSubmitForm, validSubmitForm } from '../../../containers/Utils/Utils';
import Config from '../../../config';
import _ from 'lodash';

class UtilityConfigTempImportAddEdit extends Component {
    constructor(props) {
        super(props);

        this.handleValidSubmitAddOrEdit = this.handleValidSubmitAddOrEdit.bind(this);
        this.handleInvalidSubmitAddOrEdit = this.handleInvalidSubmitAddOrEdit.bind(this);
        this.onAddRecord = this.onAddRecord.bind(this);
        this.typingTimeOut = 0;
        this.typingCode = 0;
        this.state = {
            btnAddOrEditLoading: false,
            collapseFormAddEdit: true,
            //AddOrEditModal
            isAddOrEdit: props.parentState.isAddOrEdit,
            selectedData: props.parentState.selectedData,
            //Table
            backdrop: "static",
            data: [],
            columns: this.buildTableColumns(),
            loading: false,
            //Table file
            dataFile: [],
            columnsFile: this.buildTableColumnsFile(),
            loadingFile: false,
            //switch
            isEditable: true,
            disabled: false,
            isValidateInput: false,
            isValidateOutput: false,
            isRevert: false,
            activeList:
                [
                    { itemId: 1, itemName: props.t("common:common.dropdown.status.active") },
                    { itemId: 0, itemName: props.t("common:common.dropdown.status.inActive") }
                ],
            inputValidList: [
                { itemId: 1, itemName: props.t("utilityConfigTempImport:utilityConfigTempImport.label.yes") },
                { itemId: 0, itemName: props.t("utilityConfigTempImport:utilityConfigTempImport.label.no") }

            ],
            outputValidList: [
                { itemId: 2, itemName: props.t("utilityConfigTempImport:utilityConfigTempImport.label.yes") },
                { itemId: 0, itemName: props.t("utilityConfigTempImport:utilityConfigTempImport.label.no") }
            ],
            revertList: [
                { itemId: 1, itemName: props.t("utilityConfigTempImport:utilityConfigTempImport.label.yes") },
                { itemId: 2, itemName: props.t("utilityConfigTempImport:utilityConfigTempImport.label.no") }
            ],
            listMethodParameter: [],
            listWebserviceMethod: [],
            selectValueWebserviceMethod: {},
            selectValueActive: {},
            selectValueMethodParameter: {},
            selectValueInputValidated: {},
            selectValueOutputValidated: {},
            selectValueIsRevert: {},
            //Select
            addMore: 0
        };
    }

    componentDidMount() {
        if (this.state.isAddOrEdit === "EDIT" || this.state.isAddOrEdit === "COPY") {
            const self = this.state.selectedData;
            const listName = [...this.props.parentState.selectedData.listName];
            let tempList = (self.tempImportColDTOS && this.state.isAddOrEdit === "COPY")
                ? self.tempImportColDTOS.map((item, index) => ({ ...item, id: 'COPY-' + index, tempImportId: null, methodParameter: { value: item.methodParameterId } }))
                : (self.tempImportColDTOS && this.state.isAddOrEdit === "EDIT") ? self.tempImportColDTOS.map((item, index) => ({ ...item, id: 'EDIT-' + index, methodParameter: { value: item.methodParameterId } })) : []
            for (let i = 0; i < listName.length; i++) {
                listName[i].id = i + 1;
                listName[i].file = null;
            }
            this.setState({
                selectValueActive: { value: self.isActive ? self.isActive : 0 },
                selectValueWebserviceMethod: self.webServiceMethodId ? { value: self.webServiceMethodId } : {},
                isEditable: self.isEditable ? false : true,
                selectValueInputValidated: { value: self.isValidateInput === 1 ? self.isValidateInput : 0 },
                selectValueOutputValidated: { value: self.isValidateOutput === 2 ? self.isValidateOutput : 0 },
                selectValueIsRevert: { value: self.isRevert },
                dataFile: listName,
                data: tempList,
                disabled: (this.state.isAddOrEdit === 'EDIT' && self.isEditable === 0) ? true : false
            });
        } else {
            this.props.actions.getListLanguage().then((response) => {
                const dataFile = response.payload.data.map((item, index) => {
                    return {
                        id: index + 1,
                        leeId: null,
                        appliedSystem: null,
                        appliedBussiness: null,
                        bussinessId: null,
                        bussinessCode: null,
                        leeValue: null,
                        leeLocale: item.languageKey,
                        leeLocaleName: item.languageName,
                        leeLocaleFlag: item.languageFlag,
                        file: null,
                        fileName: null
                    }
                });
                this.setState({
                    dataFile
                });
            }).catch((error) => {
                console.error(error);
            });
        }
    }

    componentWillUnmount() {
        this.setState({
            isAddOrEdit: null,
            disabled: false
        });
    }

    buildTableColumns() {
        return [
            {
                Header: <Trans i18nKey="utilityConfigTempImport:utilityConfigTempImport.label.action" />,
                id: "action",
                sortable: false,
                fixed: "left",
                width: 120,
                accessor: d => {
                    let html = <div></div>;
                    html = <div className="text-center">
                        <span title={this.props.t("common:common.button.delete")} onClick={() => this.confirmDelete(d)} hidden={this.state.disabled}>
                            <Button type="button" size="sm" className="btn-danger icon mr-1"><i className="fa fa-trash-o"></i></Button>
                        </span>
                    </div>;
                    return html;
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{ height: '2.7em' }}></div>
                )
            }, {
                Header: <div><Trans i18nKey="utilityConfigTempImport:utilityConfigTempImport.label.fileCode" /><span className="text-danger">{" (*)"}</span></div>,
                id: "code",
                Cell: ({ original }) => {
                    return (
                        <CustomInputColumnDuplicate
                            placeholder={this.props.t("utilityConfigTempImport:utilityConfigTempImport.placeholder.fileCode")}
                            handleOnChange={(e) => this.onChangeRow(e.target.value, original, 'code')}
                            isDisabled={this.state.disabled}
                            maxLength="500"
                            isRequired={true}
                            messageRequire={this.props.t("utilityConfigTempImport:utilityConfigTempImport.message.required.requiredFileCode")}
                            messageDuplicate={this.props.t("utilityConfigTempImport:utilityConfigTempImport.message.required.codeExisted")}
                            data={this.state.data}
                            dataRowOriginal={original}
                            rowName={"code"}
                            rowId={"id"}
                        />
                    )
                }
            },
            {
                Header: <div><Trans i18nKey="utilityConfigTempImport:utilityConfigTempImport.label.title" /><span className="text-danger">{" (*)"}</span></div>,
                id: "title",
                Cell: ({ original }) => {
                    
                    const data = this.state.data.find(item => item.id === original.id);
                    return (
                        <CustomAvField name={"title" + original.id} value={data.title}
                            placeholder={this.props.t("utilityConfigTempImport:utilityConfigTempImport.placeholder.title")}
                            onChange={(e) => this.onChangeRow(e.target.value, original, 'title')}
                            disabled={this.state.disabled}
                            maxLength="500" validate={{ required: { value: true, errorMessage: this.props.t("utilityConfigTempImport:utilityConfigTempImport.message.required.requiredTitle") } }} />
                    )
                }
            },
            {
                Header: <div><Trans i18nKey="utilityConfigTempImport:utilityConfigTempImport.label.colPosition" /><span className="text-danger">{" (*)"}</span></div>,
                id: "colPosition",
                Cell: ({ original }) => {
                    return (
                        <CustomInputColumnDuplicate
                            placeholder={this.props.t("utilityConfigTempImport:utilityConfigTempImport.placeholder.colPosition")}
                            handleOnChange={(e) => this.onChangeRow(e.target.value, original, 'colPosition')}
                            isDisabled={this.state.disabled}
                            maxLength="10"
                            isRequired={true}
                            isPattern={true}
                            valuePattern={"^[0-9]{1,10}$"}
                            messagePattern={this.props.t("utilityConfigTempImport:utilityConfigTempImport.message.required.requiredNumber")}
                            messageRequire={this.props.t("utilityConfigTempImport:utilityConfigTempImport.message.required.requiredColPosition")}
                            messageDuplicate={this.props.t("utilityConfigTempImport:utilityConfigTempImport.message.required.codeExisted")}
                            data={this.state.data}
                            dataRowOriginal={original}
                            rowName={"colPosition"}
                            rowId={"id"}
                        />
                    )
                }
            },
            {
                Header: <Trans i18nKey="utilityConfigTempImport:utilityConfigTempImport.label.isMerge" />,
                accessor: "isMerge",
                className: "text-center",
                minWidth: 50,
                sortable: false,
                Cell: ({ original }) => {
                    const isOnChangeValue = this.state.data.find((ch) => ch.id === original.id)
                    return <span><input type="checkbox" value={isOnChangeValue.isMerge || false} onClick={(e) => this.onChangeCheckbox(e.target.checked, original)} name={"input-checkbox" + original.id} defaultChecked={original.isMerge} disabled={this.state.disabled} /></span>
                }
            },
            {
                Header: <div><Trans i18nKey="utilityConfigTempImport:utilityConfigTempImport.label.methodParameter" /><span className="text-danger">{" (*)"}</span></div>,
                id: "methodParameter",
                Cell: ({ original }) => {
                    const data = this.state.data.find(item => item.id === original.id);
                    return (
                        <CustomSelect
                            name={"methodParameterId" + original.id}
                            label={""}
                            isRequired={true}
                            closeMenuOnSelect={true}
                            messageRequire={this.props.t("utilityConfigTempImport:utilityConfigTempImport.message.required.methodParameter")}
                            handleItemSelectChange={(value) => this.handleItemSelectChangeMethodParameter(value, original)}
                            selectValue={data.methodParameter}
                            moduleName={"GNOC_CR_METHOD_PARAMETER"}
                            isOnlyInputSelect={true}
                            isDisabled={this.state.disabled}
                        />
                    )
                }
            }
        ];
    }

    buildTableColumnsFile() {
        return [
            {
                Header: <Trans i18nKey="common:common.label.language" />,
                id: "id",
                className: "text-left",
                sortable: true,
                width: 200,
                accessor: d => {
                    const defaultLocale = localStorage.getItem('default_locale') ? localStorage.getItem('default_locale') : Config.defaultLocale;
                    let isRequired = null;
                    if (d.leeLocale === defaultLocale) {
                        isRequired = <span className="text-danger">{" (*)"}</span>;
                    }
                    return <span><i className={"flag-icon " + d.leeLocaleFlag} style={{ fontSize: '17px', marginRight: '5px' }}></i>{d.leeLocaleName}{isRequired}</span>;
                }
            },
            {
                Header: <Trans i18nKey="utilityConfigTempImport:utilityConfigTempImport.label.file" />,
                accessor: "fileName",
                className: "text-left",
                sortable: false,
                Cell: ({ original }) => {
                    return (
                        <Row>
                            <Col xs="12" sm="12" style={{ display: 'inherit' }}>
                                <DropzoneTable onDrop={(acceptedFiles) => this.handleDropFile(acceptedFiles, original)} className="pb-2" />
                                {
                                    original.file ?
                                        <div style={{ marginLeft: '1.5em' }}>
                                            <span className="app-span-icon-table" onClick={() => this.removeFile(original)}><i className="fa fa-times-circle"></i></span>
                                            <Button color="link" onClick={() => downloadFileLocal(original.file)} >{original.file.name}</Button>
                                        </div>
                                        :
                                        (original.fileName && original.fileName !== "") ?
                                            <div style={{ marginLeft: '1.5em' }}>
                                                <span className="app-span-icon-table" onClick={() => this.removeFile(original)} hidden={this.state.disabled}><i className="fa fa-times-circle"></i></span>
                                                <Button color="link" onClick={() => this.downloadFileByPath({ filePath: original.leeValue })}>{original.fileName}</Button>
                                            </div>
                                            : null
                                }
                            </Col>
                        </Row>
                    )
                }
            }
        ];
    }

    handleValidSubmitAddOrEdit(event, values) {
        validSubmitForm(event, values, "idFormAddOrEdit");
        this.setState({
            btnAddOrEditLoading: true
        }, () => {
            const utilityConfigTempImport = Object.assign({}, values);
            utilityConfigTempImport.code = utilityConfigTempImport.code ? utilityConfigTempImport.code.trim() : "";
            utilityConfigTempImport.title = utilityConfigTempImport.title ? utilityConfigTempImport.title.trim() : "";
            utilityConfigTempImport.totalColumn = utilityConfigTempImport.totalColumn ? parseInt(utilityConfigTempImport.totalColumn.trim()) : "";
            utilityConfigTempImport.tempImportColDTOS = this.state.data ? this.state.data.map(i => ({ ...i, methodParameterId: i.methodParameter.value })) : [];
            utilityConfigTempImport.isActive = this.state.selectValueActive ? this.state.selectValueActive.value : "";
            utilityConfigTempImport.webServiceMethodId = this.state.selectValueWebserviceMethod ? this.state.selectValueWebserviceMethod.value : "";
            utilityConfigTempImport.isValidateInput = this.state.selectValueInputValidated.value;
            utilityConfigTempImport.isValidateOutput = this.state.selectValueOutputValidated.value;
            utilityConfigTempImport.isRevert = this.state.selectValueIsRevert.value;
            utilityConfigTempImport.isEditable = this.state.isEditable ? 0 : 1;
            const dataFile = _.cloneDeep(this.state.dataFile);
            const files = [];
            let indexFile = 0;
            for (const data of dataFile) {
                if (data.file) {
                    files.push(data.file);
                    data.fileName = data.file.name;
                    data.indexFile = indexFile;
                    data.file = null;
                    indexFile++;
                } else {
                    data.indexFile = null;
                }
            }
            const defaultLocale = localStorage.getItem('default_locale') ? localStorage.getItem('default_locale') : Config.defaultLocale;
            const dataFileDefault = dataFile.find((ch) => ch.leeLocale === defaultLocale);
            if (!dataFileDefault.fileName || dataFileDefault.fileName === "") {
                this.setState({
                    btnAddOrEditLoading: false
                }, () => {
                    toastr.warning(this.props.t("utilityConfigTempImport:utilityConfigTempImport.message.required.requiredFileDefault"));
                });
                return;
            }
            utilityConfigTempImport.listName = dataFile;
            if (this.state.isAddOrEdit === "ADD" || this.state.isAddOrEdit === "COPY") {
                this.props.actions.addUtilityConfigTempImport(files, utilityConfigTempImport).then((response) => {
                    if (response.payload.data.key === "SUCCESS") {
                        this.setState({
                            btnAddOrEditLoading: false
                        }, () => {
                            this.props.closeAddOrEditPage(this.state.isAddOrEdit);
                            toastr.success(this.props.t("utilityConfigTempImport:utilityConfigTempImport.message.success.add"));
                        });
                    } else {
                        this.setState({
                            btnAddOrEditLoading: false
                        }, () => {
                            toastr.error(this.props.t("utilityConfigTempImport:utilityConfigTempImport.message.error.add"));
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
                            toastr.error(this.props.t("utilityConfigTempImport:utilityConfigTempImport.message.error.add"));
                        }
                    });
                });
            } else if (this.state.isAddOrEdit === "EDIT") {
                utilityConfigTempImport.tempImportId = this.state.selectedData.tempImportId;
                this.props.actions.editUtilityConfigTempImport(files, utilityConfigTempImport).then((response) => {
                    if (response.payload.data.key === "SUCCESS") {
                        this.setState({
                            btnAddOrEditLoading: false
                        }, () => {
                            this.props.closeAddOrEditPage(this.state.isAddOrEdit);
                            toastr.success(this.props.t("utilityConfigTempImport:utilityConfigTempImport.message.success.edit"));
                        });
                    } else {
                        this.setState({
                            btnAddOrEditLoading: false
                        }, () => {
                            toastr.error(this.props.t("utilityConfigTempImport:utilityConfigTempImport.message.error.edit"));
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
                            toastr.error(this.props.t("utilityConfigTempImport:utilityConfigTempImport.message.error.edit"));
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

    closePopup() {
        this.setState({
            isOpenPopup: false,
        });
    }

    openPopup() {
        this.setState({
            isOpenPopup: true,
        });
    }

    handleDropFile = (acceptedFiles, original) => {
        const arr = ['xls', 'xlsx'];
        if (arr.includes(acceptedFiles[0].name.split('.').pop().toLowerCase())) {
            if (acceptedFiles[0].size <= 40894464) {
                const dataFile = [...this.state.dataFile];
                for (const data of dataFile) {
                    if (data.id === original.id) {
                        data.file = acceptedFiles[0];
                    }
                }
                this.setState({
                    dataFile
                });
            } else {
                toastr.error(this.props.t("common:common.message.error.fileSize"));
            }
        } else {
            toastr.error(this.props.t("common:common.message.error.fileFormat"));
        }
    }

    removeFile(original) {
        const dataFile = [...this.state.dataFile];
        for (const data of dataFile) {
            if (data.id === original.id) {
                data.file = null;
                data.leeValue = null;
                data.fileName = null;
            }
        }
        this.setState({
            dataFile
        });
    }

    confirmDelete = (d) => {
        const data = [...this.state.data];
        const index = data.findIndex(item => item.id === d.id);
        data.splice(index, 1);
        this.setState({
            data
        });
    }

    onAddRecord = () => {
        this.setState({
            data: [...this.state.data, { id: "Add-" + (this.state.addMore + 1), methodParameter: {} }],
            addMore: this.state.addMore + 1
        })
    }

    onChangeRow(newValue, object, fieldName) {
        const data = [...this.state.data];
        for (const obj of data) {
            if (obj.id === object.id) {
                obj[fieldName] = newValue;
                break;
            }
        }
        this.setState({
            data
        });
    }

    onChangeCheckbox = (values, d) => {
        const data = [...this.state.data];
        if (data.some(item => item.id === d.id)) {
            const index = data.findIndex(item => item.id === d.id);
            const dataTemp = data.find(item => item.id === d.id) || {};
            data.splice(index, 1, Object.assign(dataTemp, { isMerge: values ? 1 : 0 }));
        } else {
            data.push({ id: d.id, isMerge: values ? 1 : 0 });
        }
        this.setState({
            data
        });
    }

    downloadFileByPath(data) {
        this.props.actions.onDownloadFileByPath('cr_cat', data).then((response) => {
            toastr.success(this.props.t("common:common.message.success.downloadFile"));
        }).catch((response) => {
            toastr.error(this.props.t("common:common.message.error.downloadFile"));
        });
    }

    handleItemSelectChangeActive = (option) => {
        this.setState({
            selectValueActive: option
        })
    }

    handleItemSelectChangeMethodParameter = (option, object) => {
        const data = [...this.state.data];
        for (const obj of data) {
            if (obj.id === object.id) {
                obj.methodParameter.value = option.value;
                break;
            }
        }
        this.setState({
            data
        });
    }

    handleItemSelectChangeWebserviceMethod = (option) => {
        this.setState({
            selectValueWebserviceMethod: option
        })
    }

    handleItemSelectChangeInputValidated = (option) => {
        this.setState({
            selectValueInputValidated: option
        })
    }

    handleItemSelectChangeOutputValidated = (option) => {
        this.setState({
            selectValueOutputValidated: option
        })
    }

    handleItemSelectChangeIsRevert = (option) => {
        this.setState({
            selectValueIsRevert: option
        })
    }
    render() {
        console.log(this.state.data)
        const { t } = this.props;
        let objectAddOrEdit = (this.state.isAddOrEdit === "EDIT" || this.state.isAddOrEdit === "COPY") ? this.state.selectedData : {};
        if (this.state.isAddOrEdit === "EDIT" || this.state.isAddOrEdit === "COPY") {
            objectAddOrEdit.totalColumn = objectAddOrEdit.totalColumn ? objectAddOrEdit.totalColumn + "" : "";
            objectAddOrEdit.tempImportColDTOS = objectAddOrEdit.tempImportColDTOS.map(i => ({ ...i, colPosition: i.colPosition + "", isMerge: i.isMerge ? 1 : 0 }))
        }
        const { columns, data, loading, columnsFile, dataFile, loadingFile, activeList, inputValidList, outputValidList, revertList, disabled } = this.state;
        return (
            <div className="animated fadeIn">
                <AvForm id="idFormAddOrEdit" onValidSubmit={this.handleValidSubmitAddOrEdit} onInvalidSubmit={this.handleInvalidSubmitAddOrEdit} model={objectAddOrEdit}>
                    <Row>
                        <Col xs="12">
                            <Card>
                                <CustomSticky>
                                    <CardHeader>
                                        <i className={(this.state.isAddOrEdit === "ADD" || this.state.isAddOrEdit === "COPY") ? "fa fa-plus-circle" : "fa fa-edit"}></i>{(this.state.isAddOrEdit === "ADD" || this.state.isAddOrEdit === "COPY") ? t("utilityConfigTempImport:utilityConfigTempImport.title.utilityConfigTempImportAdd") : this.state.isAddOrEdit === "EDIT" ? t("utilityConfigTempImport:utilityConfigTempImport.title.utilityConfigTempImportEdit") : ''}
                                        <div className="card-header-actions card-header-actions-button">
                                            <LaddaButton type="submit"
                                                hidden={(this.state.isAddOrEdit === "EDIT") ? ((this.state.selectedData && this.state.selectedData.isEditable === 1) ? false : true) : false}
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
                                                <CustomAvField maxLength="250" name="code" label={t("utilityConfigTempImport:utilityConfigTempImport.label.fileCode")} placeholder={t("utilityConfigTempImport:utilityConfigTempImport.placeholder.fileCode")} required
                                                    autoFocus disabled={disabled} validate={{ required: { value: true, errorMessage: t("utilityConfigTempImport:utilityConfigTempImport.message.required.requiredFileCode") } }} />
                                            </Col>
                                            <Col xs="12" sm="6">
                                                <CustomAvField maxLength="10" name="totalColumn" label={t("utilityConfigTempImport:utilityConfigTempImport.label.totalCols")} placeholder={t("utilityConfigTempImport:utilityConfigTempImport.placeholder.totalCols")} required
                                                    disabled={disabled}
                                                    validate={{
                                                        required: { value: true, errorMessage: t("utilityConfigTempImport:utilityConfigTempImport.message.required.requiredTotalCols") },
                                                        pattern: { value: '^[0-9]{1,10}$', errorMessage: t("utilityConfigTempImport:utilityConfigTempImport.message.required.requiredNumber") }
                                                    }} />
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col xs="12" sm="6">
                                                <CustomAvField maxLength="250" name="title" label={t("utilityConfigTempImport:utilityConfigTempImport.label.description")} placeholder={t("utilityConfigTempImport:utilityConfigTempImport.placeholder.description")} required
                                                    disabled={disabled}
                                                    validate={{ required: { value: true, errorMessage: t("utilityConfigTempImport:utilityConfigTempImport.message.required.requiredDescription") } }} />
                                            </Col>
                                            <Col xs="12" sm="6">
                                                <CustomSelectLocal
                                                    name={"isActive"}
                                                    label={t("common:common.label.status")}
                                                    isRequired={true}
                                                    messageRequire={t("common:common.message.required.status")}
                                                    options={activeList}
                                                    isDisabled={disabled}
                                                    closeMenuOnSelect={true}
                                                    handleItemSelectChange={this.handleItemSelectChangeActive}
                                                    selectValue={this.state.selectValueActive}
                                                />
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col xs="12" sm="6">
                                                <CustomSelect
                                                    name={"webserviceMethod"}
                                                    label={t("utilityConfigTempImport:utilityConfigTempImport.label.webserviceMethod")}
                                                    isRequired={false}
                                                    closeMenuOnSelect={true}
                                                    messageRequire={""}
                                                    isDisabled={disabled}
                                                    handleItemSelectChange={this.handleItemSelectChangeWebserviceMethod}
                                                    selectValue={this.state.selectValueWebserviceMethod}
                                                    moduleName={"GNOC_CR_WEBSERVICE_METHOD"}
                                                />
                                            </Col>
                                            <Col xs="12" sm="6">
                                                <CustomSelectLocal
                                                    name={"isInputValidated"}
                                                    label={t("utilityConfigTempImport:utilityConfigTempImport.label.isInputValidated")}
                                                    isRequired={false}
                                                    messageRequire={""}
                                                    isDisabled={disabled}
                                                    options={inputValidList}
                                                    closeMenuOnSelect={true}
                                                    handleItemSelectChange={this.handleItemSelectChangeInputValidated}
                                                    selectValue={this.state.selectValueInputValidated}
                                                />
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col xs="12" sm="6">
                                                <CustomSelectLocal
                                                    name={"isOutputValidated"}
                                                    label={t("utilityConfigTempImport:utilityConfigTempImport.label.isOutputValidated")}
                                                    isRequired={false}
                                                    messageRequire={""}
                                                    isDisabled={disabled}
                                                    options={outputValidList}
                                                    closeMenuOnSelect={true}
                                                    handleItemSelectChange={this.handleItemSelectChangeOutputValidated}
                                                    selectValue={this.state.selectValueOutputValidated}
                                                />
                                            </Col>
                                            <Col xs="12" sm="6">
                                                <CustomSelectLocal
                                                    name={"isRevert"}
                                                    label={t("utilityConfigTempImport:utilityConfigTempImport.label.isRevert")}
                                                    isRequired={false}
                                                    messageRequire={""}
                                                    isDisabled={disabled}
                                                    options={revertList}
                                                    closeMenuOnSelect={true}
                                                    handleItemSelectChange={this.handleItemSelectChangeIsRevert}
                                                    selectValue={this.state.selectValueIsRevert}
                                                />
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col xs="12" sm="6">
                                                <CustomAppSwitch
                                                    name="isEditable"
                                                    label={t("utilityConfigTempImport:utilityConfigTempImport.label.isEditAllowed")}
                                                    checked={this.state.isEditable}
                                                    isDisabled={disabled}
                                                    handleChange={(checked) => this.setState({ isEditable: checked })}
                                                />
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col xs="12" sm="12">
                                                <Card>
                                                    <CardHeader>
                                                        <div>
                                                            <span className="mt-1">
                                                                {t("utilityConfigTempImport:utilityConfigTempImport.title.listFile")}<span className="text-danger">{" (*)"}</span>
                                                            </span>
                                                        </div>
                                                    </CardHeader>
                                                    <CardBody>
                                                        <CustomReactTableLocal
                                                            columns={columnsFile}
                                                            data={dataFile}
                                                            loading={loadingFile}
                                                            defaultPageSize={5}
                                                            isContainsAvField={true}
                                                        />
                                                    </CardBody>
                                                </Card>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col xs="12" sm="12">
                                                <Card>
                                                    <CardHeader>
                                                        <div style={{ float: 'left' }}>
                                                            <span style={{ position: 'absolute' }} className="mt-1">
                                                                {t("utilityConfigTempImport:utilityConfigTempImport.title.colValidation")}
                                                            </span>
                                                        </div>
                                                        <div className="card-header-actions card-header-search-actions-button">
                                                            <Button type="button" className="custom-btn btn-pill mr-2" color="primary" onClick={this.onAddRecord} title={t("utilityConfigEmployeeDayOff:utilityConfigEmployeeDayOff.button.add")}><i className="fa fa-plus" disabled={disabled}></i></Button>
                                                        </div>
                                                    </CardHeader>
                                                    <CardBody>
                                                        <CustomReactTableLocal
                                                            columns={columns}
                                                            data={data}
                                                            loading={loading}
                                                            defaultPageSize={5}
                                                            isContainsAvField={true}
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
            </div>
        );
    }
}

UtilityConfigTempImportAddEdit.propTypes = {
    closeAddOrEditPage: PropTypes.func.isRequired,
    parentState: PropTypes.object.isRequired
};

function mapStateToProps(state, ownProps) {
    const { utilityConfigTempImport, common } = state;
    return {
        response: { utilityConfigTempImport, common }
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(Object.assign({}, UtilityConfigTempImportActions, commonActions), dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(translate()(UtilityConfigTempImportAddEdit));
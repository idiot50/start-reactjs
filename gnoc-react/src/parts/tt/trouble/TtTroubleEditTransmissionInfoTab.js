import { AvForm } from 'availity-reactstrap-validation';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import LaddaButton, { ZOOM_OUT } from 'react-ladda';
import { translate, Trans } from 'react-i18next';
import { connect } from 'react-redux';
import { toastr } from 'react-redux-toastr';
import { Card, CardBody, CardHeader, Col, Row } from 'reactstrap';
import { bindActionCreators } from 'redux';
import * as commonActions from '../../../actions/commonActions';
import * as TtTroubleActions from './TtTroubleActions';
import TtTroubleSearchLineCutCodePopup from './TtTroubleSearchLineCutCodePopup';
import TtTroubleSearchClosuresReplacePopup from './TtTroubleSearchClosuresReplacePopup';
import { CustomSticky, CustomReactTable, SettingTableLocal, CustomSelectLocal, CustomInputPopup, CustomAvField, CustomMultiSelectLocal } from '../../../containers/Utils';
import { validSubmitForm, invalidSubmitForm } from "../../../containers/Utils/Utils";

class TtTroubleEditTransmissionInfoTab extends Component {
    constructor(props) {
        super(props);

        this.onFetchData = this.onFetchData.bind(this);
        this.handleValidSubmitAddOrEdit = this.handleValidSubmitAddOrEdit.bind(this);
        this.handleInvalidSubmitAddOrEdit = this.handleInvalidSubmitAddOrEdit.bind(this);
        this.handleItemSelectChangeNWTypes = this.handleItemSelectChangeNWTypes.bind(this);
        this.handleItemSelectChangeNetworkLevel = this.handleItemSelectChangeNetworkLevel.bind(this);
        this.handleItemSelectChangeReasonType = this.handleItemSelectChangeReasonType.bind(this);
        this.state = {
            //Popup
            isOpenSearchLineCutCodePopup: false,
            isOpenSearchClosuresReplacePopup: false,
            //AddOrEditModal
            selectedData: props.parentState.selectedData,
            btnAddOrEditLoading: false,
            //Table
            data: [],
            pages: null,
            loading: true,
            columns: this.buildTableColumns(),
            objectSearch: {},
            //select
            selectValueNWTypes: {},
            selectValueNetworkLevel: [],
            selectValueReasonType: {},
            selectValueStatus: {},
            selectValueCableType: {},
            selectValueCodeSnippetOff: [],
            selectValueTransReason: {},
            closuresReplace: "",
            fieldsProperty: {},
            transmisstionData: {},
            listCodesnippetOff: [],
            listCableType: [],
            isSubmit: false,
            valueLineCutCode: "",
            tabIndex: null,
            isValidSubmitForm: false,
            isGetCableType: true
        };
    }

    componentWillMount() {
        
    }

    componentDidMount() {
        this.props.actions.getListCatReasonType(this.state.selectedData.typeId);
        this.props.actions.getListNWLevel(this.state.selectedData.typeId);
        this.props.actions.getListTransNWType();
        const { selectedData } = this.state;
        this.setState({
            selectValueNWTypes: { value: this.state.selectedData.transNetworkTypeId },
            selectValueCableType: { value: this.state.selectedData.cableType },
            selectValueCodeSnippetOff: this.state.selectedData.codeSnippetOff ? this.state.selectedData.codeSnippetOff.split(",").map(item => {return {value: item.trim()}}) : [],
            closuresReplace: this.state.selectedData.closuresReplace,
            selectValueTransReason: { value: this.state.selectedData.transReasonEffectiveId },
            selectValueNetworkLevel: selectedData.networkLevel ? selectedData.networkLevel.split(",").map(item => { return { value: item.trim() }; }) : [],
            valueLineCutCode: selectedData.lineCutCode ? selectedData.lineCutCode : "",
            isGetCableType: true
        }, () => {
            this.props.actions.getListSnippetOff(selectedData.lineCutCode).then((response) => {
                this.setState({
                    listCodesnippetOff: response.payload.data,
                    selectValueCodeSnippetOff: selectedData.codeSnippetOff ? selectedData.codeSnippetOff.split(",").map(item => {return {value: item.trim()}}) : []
                })
            })
        });
        if (this.props.onRef) {
            this.props.onRef(this);
        }
    }

    componentWillUnmount() {
        this.setState({
            modalName: null
        });
        if (this.props.onRef) {
            this.props.onRef(undefined);
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.isGetCableType) {
            if (this.state.valueLineCutCode && this.state.selectValueCodeSnippetOff.length > 0) {
                this.props.actions.getListCableType(this.state.valueLineCutCode, this.state.selectValueCodeSnippetOff.map(item => item.value).join(",")).then((response) => {
                    this.setState({
                        listCableType: response.payload.data ? response.payload.data : []
                    }, () => {
                        this.getListLinkInfo()
                    });
                });
            }
            this.setState({
                isGetCableType: false
            });
        }
    }

    buildTableColumns() {
        return [
            {
                Header: <Trans i18nKey="ttTrouble:ttTrouble.label.capacity" />,
                id: "capacity",
                width: 150,
                accessor: d => <span title={d.capacity}>{d.capacity}</span>
            },
            {
                Header: <Trans i18nKey="ttTrouble:ttTrouble.label.linkName" />,
                id: "linkName",
                width: 150,
                accessor: d => <span title={d.linkName}>{d.linkName}</span>
            },
            {
                Header: <Trans i18nKey="ttTrouble:ttTrouble.label.device1" />,
                id: "device1",
                width: 150,
                accessor: d => <span title={d.device1}>{d.device1}</span>
            },
            {
                Header: <Trans i18nKey="ttTrouble:ttTrouble.label.port1" />,
                id: "port1",
                minWidth: 150,
                accessor: d => <span title={d.port1}>{d.port1}</span>
            },
            {
                Header: <Trans i18nKey="ttTrouble:ttTrouble.label.port2" />,
                id: "port2",
                minWidth: 200,
                accessor: d => <span title={d.port2}>{d.port2}</span>
            },
            {
                Header: <Trans i18nKey="ttTrouble:ttTrouble.label.device2" />,
                id: "device2",
                minWidth: 200,
                accessor: d => <span title={d.device2}>{d.device2}</span>
            },
            {
                Header: <Trans i18nKey="ttTrouble:ttTrouble.label.fiber" />,
                id: "fiber",
                width: 150,
                accessor: d => <span title={d.fiber}>{d.fiber}</span>
            },
            {
                Header: <Trans i18nKey="ttTrouble:ttTrouble.label.createTime" />,
                id: "createTime",
                width: 150,
                accessor: d => <span title={d.createTime}>{d.createTime}</span>
            },
            {
                Header: <Trans i18nKey="ttTrouble:ttTrouble.label.modifyTime" />,
                id: "modifyTime",
                width: 150,
                accessor: d => <span title={d.modifyTime}>{d.modifyTime}</span>
            }
        ];
    }

    onFetchData = (state, instance) => {
        let sortName = null;
        let sortType = null;
        if (state.sorted.length > 0) {
            if (state.sorted[0].id !== null && state.sorted[0].id !== undefined) {
                sortName = state.sorted[0].id;
                sortType = state.sorted[0].desc ? "desc" : "asc";
            }
        }

        let values = {
            page: state.page + 1,
            pageSize: state.pageSize,
            sortName: sortName,
            sortType: sortType
        }

        const objectSearch = Object.assign({}, this.state.objectSearch, values);

        this.setState({
            loading: true,
            objectSearch: objectSearch
        }, () => {
            this.getListLinkInfo();
        });
    }

    getListLinkInfo = () => {
        this.props.actions.getListLinkInfo(this.state.selectValueCodeSnippetOff.map(item => item.value).join(",") || this.state.selectedData.codeSnippetOff).then((response) => {
            this.setState({
                data: response.payload.data || [],
                loading: false
            });
        }).catch((response) => {
            this.setState({
                loading: false
            });
            toastr.error(this.props.t("ttTrouble:ttTrouble.message.error.getLinkCable"));
        });
    }

    handleInvalidSubmitAddOrEdit(event, errors, values) {
        toastr.warning(this.props.t("common:common.message.required.allFields"));
        this.setState({
            isValidSubmitForm: false
        }, () => {
            this.props.onChangeChildTab(this.state.tabIndex, this.state, errors);
        });
    }

    handleValidSubmitAddOrEdit(event, values) {
        this.setState({
            isValidSubmitForm: true
        }, () => {
            const state = Object.assign({}, this.state);
            state.transmisstionData = values;
            this.props.onChangeChildTab(this.state.tabIndex, state);
        });
        // validSubmitForm(event, values, "idFormAddOrEdit");
        // this.setState({
        //     btnAddOrEditLoading: true
        // }, () => {
        //     const ttTrouble = Object.assign({}, this.state.selectedData, values);
        //     ttTrouble.transNetworkTypeId = this.state.selectValueNWTypes.value || "";
        //     ttTrouble.networkLevel = this.state.selectValueNetworkLevel.map(i => { return i.value }).join(",") || "";
        //     if (this.state.fieldsProperty.transInfo2 && this.state.fieldsProperty.transInfo2.visible) {
        //         ttTrouble.lineCutCode = this.state.valueLineCutCode;
        //         ttTrouble.closuresReplace = this.state.closuresReplace || "";
        //         ttTrouble.codeSnippetOff = this.state.selectValueCodeSnippetOff.value || "";
        //         ttTrouble.transReasonEffectiveId = this.state.selectValueTransReason.value || "";
        //         ttTrouble.transReasonEffectiveContent = ttTrouble.transReasonEffectiveContent ? ttTrouble.transReasonEffectiveContent.trim() : "";
        //     } else {
        //         ttTrouble.lineCutCode = this.state.selectedData.lineCutCode;
        //         ttTrouble.closuresReplace = this.state.selectedData.closuresReplace;
        //         ttTrouble.codeSnippetOff = this.state.selectedData.codeSnippetOff;
        //         ttTrouble.transReasonEffectiveId = this.state.selectedData.transReasonEffectiveId;
        //         ttTrouble.transReasonEffectiveContent = this.state.selectedData.transReasonEffectiveContent;
        //     }
        //     this.updateTtProblem(ttTrouble);
        // });
    }

    updateTtProblem = (ttTrouble) => {
        // this.setState({
        //     transmisstionData: ttTrouble
        // }, () => {
        //     this.setState({
        //         isSubmit: true,
        //         btnAddOrEditLoading: false
        //     }, () => {
        //         this.props.onChangeChildTab(7, this.state);
        //     });
        // });
        // this.props.actions.editTtTrouble(ttTrouble).then((response) => {
        //     this.setState({
        //         btnAddOrEditLoading: false
        //     }, () => {
        //         if (response.payload.data.key === "SUCCESS") {
        //             toastr.success(this.props.t("ttTrouble:ttTrouble.message.success.updateTransmisstion"));
        //         } else if (response.payload.data.key === "ERROR") {
        //             toastr.error(response.payload.data.message);
        //         } else {
        //             toastr.error(this.props.t("ttTrouble:ttTrouble.message.error.updateTransmisstion"));
        //         }
        //     });
        // }).catch((response) => {
        //     this.setState({
        //         btnAddOrEditLoading: false
        //     }, () => {
        //         try {
        //             toastr.error(response.error.response.data.errors[0].defaultMessage);
        //         } catch (error) {
        //             toastr.error(this.props.t("ttTrouble:ttTrouble.message.error.updateTransmisstion"));
        //         }
        //     });
        // });
    }

    handleItemSelectChangeNWTypes(option) {
        this.setState({ selectValueNWTypes: option });
    }

    handleItemSelectChangeNetworkLevel(option) {
        this.setState({ selectValueNetworkLevel: option });
    }

    handleItemSelectChangeReasonType(option) {
        this.setState({ selectValueReasonType: option });
    }

    openSearchLineCutCodePopup = () => {
        this.setState({
            isOpenSearchLineCutCodePopup: true
        });
    }

    closeSearchLineCutCodePopup = () => {
        this.setState({
            isOpenSearchLineCutCodePopup: false
        });
    }

    setValueSearchLineCutCodePopup = (d) => {
        this.setState({
            valueLineCutCode: d
        }, () => {
            this.closeSearchLineCutCodePopup();
            this.props.actions.getListSnippetOff(d).then((response) => {
                this.setState({
                    listCodesnippetOff: response.payload.data,
                    selectValueCodeSnippetOff: []
                })
            })
        });
    }

    handleItemSelectChangeCodeSnippetOff = (option) => {
        this.setState({
            selectValueCodeSnippetOff: option,
            selectValueCableType: {},
            isGetCableType: true,
            listCableType: [],
            selectValueCableType: {}
        }, () => {
            this.getListLinkInfo()
        })
    }

    openSearchClosuresReplacePopup = () => {
        this.setState({
            isOpenSearchClosuresReplacePopup: true
        });
    }

    closeSearchClosuresReplacePopup = () => {
        this.setState({
            isOpenSearchClosuresReplacePopup: false
        });
    }

    setValueSearchClosuresReplacePopup = (d) => {
        this.setState({
            closuresReplace: d
        }, () => {
            this.closeSearchClosuresReplacePopup();
        });
    }

    setFieldsProperty = (object) => {
        this.setState({
            fieldsProperty: object
        });
    }

    getStateChildTab(callback) {
        callback(this.state);
    }

    onSubmitForm(tabIndex, isVisibleTab) {
        this.setState({
            tabIndex
        }, () => {
            if (isVisibleTab) {
                this.myForm.submit();
            } else {
                setTimeout(() => {
                    this.props.onChangeChildTab(this.state.tabIndex, {isValidSubmitForm: true});
                }, 100);
            }
        });
    }

    render() {
        const { t, response } = this.props;
        const { columns, data, pages, loading, fieldsProperty, listCodesnippetOff, valueLineCutCode, listCableType, closuresReplace } = this.state;
        let objectAddOrEdit = {};
        objectAddOrEdit.transReasonEffectiveContent = this.state.selectedData.transReasonEffectiveContent || "";
        const networkLevelList = response.ttTrouble.networkLevel && response.ttTrouble.networkLevel.payload ? response.ttTrouble.networkLevel.payload.data : [];
        return (
            <div className="animated fadeIn">
                <AvForm id="idFormAddOrEditTransTab" onValidSubmit={this.handleValidSubmitAddOrEdit} onInvalidSubmit={this.handleInvalidSubmitAddOrEdit} model={objectAddOrEdit} ref={(ref) => this.myForm = ref}>
                    <Card>
                        <CustomSticky level={1}>
                            <CardHeader>
                                {t("ttTrouble:ttTrouble.title.transmissionInfo")}
                                {/* <div className="card-header-actions card-header-actions-button">
                                    <LaddaButton type="submit"
                                        className="btn btn-primary btn-md mr-1"
                                        loading={this.state.btnAddOrEditLoading}
                                        data-style={ZOOM_OUT}>
                                        <i className="fa fa-save"></i> {t("common:common.button.save")}
                                    </LaddaButton>{' '}
                                </div> */}
                            </CardHeader>
                        </CustomSticky>
                        <CardBody>
                            <Row>
                                <Col xs="12" sm="4">
                                    <CustomSelectLocal
                                        name={"transNetworkTypeId"}
                                        label={t("ttTrouble:ttTrouble.label.transmissionNetworkType")}
                                        isRequired={fieldsProperty.tranNwType && fieldsProperty.tranNwType.required ? true : false}
                                        messageRequire={t("ttTrouble:ttTrouble.message.required.transmissionNetworkType")}
                                        options={response.ttTrouble.lstNWTypes && response.ttTrouble.lstNWTypes.payload ? response.ttTrouble.lstNWTypes.payload.data : []}
                                        closeMenuOnSelect={true}
                                        handleItemSelectChange={this.handleItemSelectChangeNWTypes}
                                        selectValue={this.state.selectValueNWTypes}
                                    />
                                </Col>
                                <Col xs="12" sm="4" className={fieldsProperty.transInfo2 && fieldsProperty.transInfo2.visible ? "" : "class-hidden"}>
                                    <CustomInputPopup
                                        name={"lineCutCode"}
                                        label={t("ttTrouble:ttTrouble.label.lineCutCode")}
                                        placeholder={t("ttTrouble:ttTrouble.placeholder.doubleClick")}
                                        value={valueLineCutCode}
                                        handleRemove={() => this.setState({ valueLineCutCode: "", selectValueCodeSnippetOff: [], listCodesnippetOff: [] })}
                                        handleDoubleClick={this.openSearchLineCutCodePopup}
                                        isRequired={fieldsProperty.lineCut && fieldsProperty.lineCut.required ? true : false}
                                        messageRequire={t("ttTrouble:ttTrouble.message.required.lineCutCode")}
                                    />
                                </Col>
                                <Col xs="12" sm="4" className={fieldsProperty.transInfo2 && fieldsProperty.transInfo2.visible ? "" : "class-hidden"}>
                                    <CustomSelectLocal
                                        name={"cableType"}
                                        label={t("ttTrouble:ttTrouble.label.cableType")}
                                        isRequired={false}
                                        options={listCableType}
                                        closeMenuOnSelect={true}
                                        handleItemSelectChange={(d) => this.setState({ selectValueCableType: d })}
                                        selectValue={this.state.selectValueCableType}
                                    />
                                </Col>
                            </Row>
                            <Row>
                                <Col xs="12" sm="4">
                                    <CustomMultiSelectLocal
                                        name={"networkLevel"}
                                        label={t("ttTrouble:ttTrouble.label.networkLevel")}
                                        isRequired={true}
                                        messageRequire={t("ttTrouble:ttTrouble.message.required.networkLevel")}
                                        options={networkLevelList.map(item => { return { itemId: item.itemCode, itemName: item.itemName } })}
                                        handleItemSelectChange={this.handleItemSelectChangeNetworkLevel}
                                        selectValue={this.state.selectValueNetworkLevel}
                                        closeMenuOnSelect={false}
                                    />
                                </Col>
                                <Col xs="12" sm="4" className={fieldsProperty.transInfo2 && fieldsProperty.transInfo2.visible ? "" : "class-hidden"}>
                                    <CustomMultiSelectLocal
                                        name={"codeSnippetOff"}
                                        label={t("ttTrouble:ttTrouble.label.codeSnippetOff")}
                                        isRequired={fieldsProperty.snippetOff && fieldsProperty.snippetOff.required ? true : false}
                                        messageRequire={t("ttTrouble:ttTrouble.message.required.codeSnippetOff")}
                                        options={listCodesnippetOff.map(item => {return {itemId: item.itemName, itemName: item.itemName}})}
                                        closeMenuOnSelect={false}
                                        handleItemSelectChange={this.handleItemSelectChangeCodeSnippetOff}
                                        selectValue={this.state.selectValueCodeSnippetOff}
                                    />
                                </Col>
                                <Col xs="12" sm="4" className={fieldsProperty.transInfo2 && fieldsProperty.transInfo2.visible ? "" : "class-hidden"}>
                                    <CustomInputPopup
                                        name={"closuresReplace"}
                                        label={t("ttTrouble:ttTrouble.label.closuresReplace")}
                                        placeholder={t("ttTrouble:ttTrouble.placeholder.doubleClick")}
                                        value={closuresReplace}
                                        handleRemove={() => this.setState({ closuresReplace: [] })}
                                        handleDoubleClick={this.openSearchClosuresReplacePopup}
                                        isRequired={fieldsProperty.closuresReplace && fieldsProperty.closuresReplace.required ? true : false}
                                        messageRequire={t("ttTrouble:ttTrouble.message.required.closuresReplace")}
                                    />
                                </Col>
                            </Row>
                            <Row>
                                <Col xs="12" sm="4" className={fieldsProperty.transInfo2 && fieldsProperty.transInfo2.visible ? "" : "class-hidden"}>
                                    <CustomSelectLocal
                                        name={"transReasonEffectiveId"}
                                        label={t("ttTrouble:ttTrouble.label.reasonType")}
                                        isRequired={fieldsProperty.reasonTypeCbo && fieldsProperty.reasonTypeCbo.required ? true : false}
                                        messageRequire={t("ttTrouble:ttTrouble.message.required.reasonType")}
                                        options={response.ttTrouble.reasonType && response.ttTrouble.reasonType.payload ? response.ttTrouble.reasonType.payload.data : []}
                                        closeMenuOnSelect={true}
                                        handleItemSelectChange={(d) => this.setState({ selectValueTransReason: d })}
                                        selectValue={this.state.selectValueTransReason}
                                    />
                                </Col>
                                <Col xs="12" sm="8" className={fieldsProperty.transInfo2 && fieldsProperty.transInfo2.visible ? "" : "class-hidden"}>
                                    <CustomAvField type="textarea" rows="3" name="transReasonEffectiveContent" label={t("ttTrouble:ttTrouble.label.reason")}
                                        placeholder={t("ttTrouble:ttTrouble.placeholder.reasonLimitWord")} maxLength="4000"
                                        required={fieldsProperty.reasonTypeTxt && fieldsProperty.reasonTypeTxt.required ? true : false}
                                        validate={{ required: { value: true, errorMessage: t("ttTrouble:ttTrouble.message.required.reason") } }} />
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>
                    <Card className={fieldsProperty.transInfo2 && fieldsProperty.transInfo2.visible ? "" : "class-hidden"}>
                        <CardHeader>
                            <i className="fa fa-align-justify"></i>{t("ttTrouble:ttTrouble.title.linkInfoOnCable")}
                            <div className="card-header-actions">
                                <SettingTableLocal
                                    columns={columns}
                                    onChange={(columns) => this.setState({ columns })}
                                />
                            </div>
                        </CardHeader>
                        <CustomReactTable
                            onRef={ref => (this.customReactTable = ref)}
                            columns={columns}
                            data={data}
                            pages={pages}
                            loading={loading}
                            onFetchData={this.onFetchData}
                            defaultPageSize={10}
                        />
                    </Card>
                </AvForm>
                <TtTroubleSearchLineCutCodePopup
                    parentState={this.state}
                    closePopup={this.closeSearchLineCutCodePopup}
                    setValue={this.setValueSearchLineCutCodePopup}
                />
                <TtTroubleSearchClosuresReplacePopup
                    parentState={this.state}
                    codeSnippetOff={this.state.selectValueCodeSnippetOff}
                    closePopup={this.closeSearchClosuresReplacePopup}
                    setValue={this.setValueSearchClosuresReplacePopup}
                />
            </div>
        );
    }
}

TtTroubleEditTransmissionInfoTab.propTypes = {
    closePage: PropTypes.func.isRequired,
    parentState: PropTypes.object.isRequired,
    onChangeChildTab: PropTypes.func
};

function mapStateToProps(state, ownProps) {
    const { ttTrouble, common } = state;
    return {
        response: { ttTrouble, common }
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(Object.assign({}, TtTroubleActions, commonActions), dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(translate()(TtTroubleEditTransmissionInfoTab));
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Col, Row, Modal, ModalBody, ModalFooter, ModalHeader, Label } from 'reactstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { translate, Trans } from 'react-i18next';
import { toastr } from 'react-redux-toastr';
import * as commonActions from './../../../actions/commonActions';
import * as TtTroubleActions from './TtTroubleActions';
import { CustomReactTable } from "../../../containers/Utils";
import { CustomAvField } from '../../../containers/Utils';
import LaddaButton, { ZOOM_OUT } from 'react-ladda';
import { AvForm } from 'availity-reactstrap-validation';
import { convertDateToDDMMYYYYHHMISS } from "../../../containers/Utils/Utils";

class TtTroubleSearchClosuresReplacePopup extends Component {
    constructor(props) {
        super(props);

        this.search = this.search.bind(this);
        this.state = {
            btnSearchLoading: false,
            selectedData: props.parentState.selectedData,
            codeSnippetOff:props.parentState.codeSnippetOff,
            backdrop: "static",
            objectSearch: {},
            data: [],
            loading: false,
            pages: null,
            columns: this.buildTableColumns(),
            dataChecked: []
        };
    }
    componentWillReceiveProps(nextProps){
        if(nextProps && nextProps.codeSnippetOff){
            this.setState({
                codeSnippetOff: nextProps.codeSnippetOff || []
            });
        }
    }

    buildTableColumns() {
        return [
            {
                Header: <Trans i18nKey="ttTrouble:ttTrouble.label.sleeveCode" />,
                id: "sleeveCode",
                accessor: d => <span title={d.sleeveCode}>{d.sleeveCode}</span>
            }, {
                Header: <Trans i18nKey="ttTrouble:ttTrouble.label.sleeveName" />,
                id: "sleeveName",
                accessor: d => <span title={d.sleeveName}>{d.sleeveName}</span>
            }, {
                Header: <Trans i18nKey="ttTrouble:ttTrouble.label.createDate" />,
                id: "modifyDate",
                accessor: d => <span title={convertDateToDDMMYYYYHHMISS(d.modifyDate)}>{convertDateToDDMMYYYYHHMISS(d.modifyDate)}</span>
            }
        ]
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
            sortType: sortType,
            createdTime: this.state.selectedData.createdTime,
            codeSnippetOff: this.state.codeSnippetOff.length > 0 ? this.state.codeSnippetOff.map(item => item.value).join(",") : ""
        }
        const objectSearch = Object.assign({}, this.state.objectSearch, values);

        this.setState({
            loading: true,
            objectSearch: objectSearch
        }, () => {
            this.searchInfraSleeves();
        });
    }

    handleDataCheckbox = (data) => {
        this.setState({
            dataChecked: data
        });
    }

    search(event, values) {
        const objectSearch = Object.assign({}, this.state.objectSearch, values);
        objectSearch.closuresReplace = objectSearch.closuresReplace ? objectSearch.closuresReplace.trim() : "";
        objectSearch.page = 1;
        if (objectSearch.closuresReplace) {
            this.setState({
                btnSearchLoading: true,
                loading: true,
                objectSearch: objectSearch
            }, () => {
                this.customReactTable.resetPage();
                this.searchInfraSleeves();
            });
        } else {
            toastr.warning(this.props.t("ttTrouble:ttTrouble.message.required.searchCondition"));
        }
    }

    searchInfraSleeves() {
        if (this.state.objectSearch.closuresReplace) {
            this.props.actions.searchInfraSleeves(this.state.objectSearch).then((response) => {
                this.setState({
                    data: response.payload.data.data || [],
                    pages: response.payload.data.pages,
                    loading: false,
                    btnSearchLoading: false
                });
            }).catch((response) => {
                this.setState({
                    loading: false,
                    btnSearchLoading: false
                });
                toastr.error(this.props.t("ttTrouble:ttTrouble.message.error.infraSleeveLane"));
            });
        } else {
            this.setState({
                loading: false,
                btnSearchLoading: false
            });
        }
    }

    closePopup = () => {
        this.setState({
            objectSearch: {},
            dataChecked: [],
            data: [],
            pages: null
        });
        this.props.closePopup();
    }

    handleChooseClick = (dataChecked) => {
        if (dataChecked.length === 0) {
            toastr.warning(this.props.t("ttTrouble:ttTrouble.message.required.infraSleeveLane"));
        } else {
            let setDataChecked = dataChecked.map(i => { return i.sleeveCode }).join(",")
            this.props.setValue(setDataChecked);
            this.props.closePopup();
            this.setState({
                objectSearch: {},
                data: [],
                dataChecked: [],
            });
        }
    }

    render() {
        const { t } = this.props;
        const { columns, data, loading, pages } = this.state;
        const objectSearch = {};
        return (
            <Modal isOpen={this.props.parentState.isOpenSearchClosuresReplacePopup}
                className={'modal-primary modal-lg ' + this.props.className}
                backdrop={this.state.backdrop}>
                <ModalHeader toggle={this.closePopup}>
                    {t("ttTrouble:ttTrouble.title.closuresReplace")}
                </ModalHeader>
                <ModalBody>
                    <AvForm onValidSubmit={this.search} model={objectSearch}>
                        <Row>
                            <Col xs="12" sm="10">
                                <CustomAvField name="closuresReplace" label={this.props.t("ttTrouble:ttTrouble.label.closuresReplace")}
                                    placeholder={this.props.t("ttTrouble:ttTrouble.placeholder.closuresReplace")} />
                            </Col>
                            <Col xs="12" sm="2">
                                <Row className="mb-2">
                                    <Col xs="12"><Label></Label></Col>
                                </Row>
                                <Row>
                                    <LaddaButton type="submit"
                                        className="btn btn-primary btn-md mr-1"
                                        loading={this.state.btnSearchLoading}
                                        data-style={ZOOM_OUT}>
                                        <i className="fa fa-search"></i> {t("common:common.title.search")}
                                    </LaddaButton>
                                </Row>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs="12">
                                <Label>{t("ttTrouble:ttTrouble.label.searchResult")}</Label>
                                <CustomReactTable
                                    onRef={ref => (this.customReactTable = ref)}
                                    columns={columns}
                                    data={data}
                                    pages={pages}
                                    loading={loading}
                                    onFetchData={this.onFetchData}
                                    defaultPageSize={10}
                                    isCheckbox={true}
                                    propsCheckbox={["sleeveCode"]}
                                    handleDataCheckbox={this.handleDataCheckbox}
                                    isChooseOneCheckbox={true}
                                    handleChooseOneCheckbox={() => {toastr.warning(this.props.t("ttTrouble:ttTrouble.message.required.onlyOneRecord"));}}
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col xs="12" className="text-center mt-3">
                                <Button type="button" color="primary" disabled={this.state.data.length < 1} className="ml-auto" style={{ margin: '0 auto' }} onClick={() => this.handleChooseClick(this.state.dataChecked)}><i className="fa fa-check"></i> {t("ttTrouble:ttTrouble.button.choose")}</Button>
                            </Col>
                        </Row>
                    </AvForm>
                </ModalBody>
                <ModalFooter>
                </ModalFooter>
            </Modal>


        );
    }
}

TtTroubleSearchClosuresReplacePopup.propTypes = {
    codeSnippetOff: PropTypes.array.isRequired,
    parentState: PropTypes.object.isRequired,
    closePopup: PropTypes.func.isRequired,
    setValue: PropTypes.func.isRequired
}

function mapStateToProps(state, ownProps) {
    const { ttTrouble, common } = state;
    return {
        response: { ttTrouble, common }
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(Object.assign({}, commonActions, TtTroubleActions), dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(translate()(TtTroubleSearchClosuresReplacePopup))
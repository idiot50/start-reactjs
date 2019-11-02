import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Col, Row, Label, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { AvForm } from 'availity-reactstrap-validation';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { translate, Trans } from 'react-i18next';
import { toastr } from 'react-redux-toastr';
import LaddaButton, { ZOOM_OUT } from 'react-ladda';
import * as PtProblemActions from './PtProblemActions';
import CustomReactTable from "../../../containers/Utils/CustomReactTable";
import { CustomAvField } from '../../../containers/Utils';

class PtProblemAddPopupNodeCode extends Component {
    constructor(props) {
        super(props);
        
        this.onFetchData = this.onFetchData.bind(this);
        this.search = this.search.bind(this);
        this.getListNodeCodeSearch = this.getListNodeCodeSearch.bind(this);
        this.closePopup = this.closePopup.bind(this);
        this.handleDataCheckbox = this.handleDataCheckbox.bind(this);

        this.state = {
            //Table
            data: [],
            pages: null,
            loading: true,
            columns: this.buildTableColumns(),
            //Object Search
            objectSearch: {},
            backdrop: "static",
            btnSearchLoading: false,
            dataChecked: []
        };
    }
    
    buildTableColumns() {
        return [
            {
                Header: <Trans i18nKey="ptProblem:ptProblem.label.nodeCode" />,
                id: "deviceCode",
                accessor: d => <span title={d.deviceCode}>{d.deviceCode}</span>
            },
            {
                Header: <Trans i18nKey="ptProblem:ptProblem.label.nodeName" />,
                id: "deviceName",
                accessor: d => <span title={d.deviceName}>{d.deviceName}</span>
            },
            {
                Header: <Trans i18nKey="ptProblem:ptProblem.label.IP" />,
                id: "ip",
                accessor: d => <span title={d.ip}>{d.ip}</span>
            },
            {
                Header: <Trans i18nKey="ptProblem:ptProblem.label.nation" />,
                id: "nationCode",
                accessor: d => <span title={d.nationCode}>{d.nationCode}</span>
            },
        ];
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
            this.getListNodeCodeSearch();
        });
    }

    search(event, values) {
        let obj = values;
        const objectSearch = Object.assign({}, this.state.objectSearch, obj);
        this.setState({
            btnSearchLoading: true,
            loading: true,
            objectSearch: objectSearch
        }, () => {
            this.customReactTable.resetPage();
            this.getListNodeCodeSearch(true);
        });
    }

    getListNodeCodeSearch(isSearchClicked = false) {
        this.props.actions.getListNode(this.state.objectSearch).then((response) => {
            this.setState({
                data: response.payload.data.data ? response.payload.data.data : [],
                pages: response.payload.data.pages,
                loading: false
            });
            if(isSearchClicked) {
                this.setState({ btnSearchLoading: false });
            }
        }).catch((response) => {
            this.setState({
                btnSearchLoading: false,
                loading: false
            });
            toastr.error(this.props.t("ptProblem:ptProblem.message.error.search"));
        });
    }

    closePopup() {
        this.setState({
            objectSearch: {},
            dataChecked: []
        });
        this.props.closePopup();
    }

    handleDataCheckbox(data) {
        this.setState({
            dataChecked: data
        });
    }

    addNodeCode(dataChecked) {
        if (dataChecked.length > 0) {
            this.props.addNodeCode(dataChecked);
            this.closePopup();
        } else {
            toastr.error(this.props.t("ptProblem:ptProblem.message.required.nodeCode"));
        }
    }

    render() {
        const { t } = this.props;
        const { columns, data, pages, loading, objectSearch } = this.state;
        return (
            <Modal isOpen={this.props.parentState.isOpenPopupNodeCode} className={'modal-primary modal-lg ' + this.props.className}
            backdrop={this.state.backdrop}>
                <ModalHeader toggle={this.closePopup}>
                    {t("ptProblem:ptProblem.label.addNewNodeCode")}
                </ModalHeader>
                <ModalBody>
                    <AvForm onValidSubmit={this.search} model={objectSearch}>
                        <Row>
                            <Col xs="12">
                                <Row>
                                    <Col xs="12" sm="5">
                                        <CustomAvField name="deviceCode" label={t("ptProblem:ptProblem.label.nameOrCodeNodeSearch")}
                                        placeholder={t("ptProblem:ptProblem.placeholder.nameOrCodeNodeSearch")} />
                                    </Col>
                                    <Col xs="12" sm="5">
                                        <CustomAvField name="ip" label={t("ptProblem:ptProblem.label.IPnodeSearch")}
                                        placeholder={t("ptProblem:ptProblem.placeholder.IPnodeSearch")} />
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
                                                <i className="fa fa-search"></i> <Trans i18nKey="ptProblem:ptProblem.button.search" />
                                            </LaddaButton>
                                        </Row>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </AvForm>
                    <Row>
                        <Col xs="12">
                            <Label>{t("ptProblem:ptProblem.label.searchResult")}</Label>
                            <CustomReactTable
                                onRef={ref => (this.customReactTable = ref)}
                                columns={columns}
                                data={data}
                                pages={pages}
                                loading={loading}
                                onFetchData={this.onFetchData}
                                defaultPageSize={10}
                                isCheckbox={true}
                                propsCheckbox={["deviceCode", "deviceName", "ip", "nationCode"]}
                                handleDataCheckbox={this.handleDataCheckbox}
                            />
                        </Col>
                    </Row>
                </ModalBody>
                <ModalFooter>
                    <Button type="button" color="primary" disabled={this.state.dataChecked.length < 1} className="ml-auto" onClick={() => this.addNodeCode(this.state.dataChecked)}><i className="fa fa-check"></i> {t("ptProblem:ptProblem.button.choose")}</Button>
                    <Button type="button" color="secondary" className="mr-auto" onClick={this.closePopup}><i className="fa fa-times-circle"></i> {t("common:common.button.close")}</Button>
                </ModalFooter>
            </Modal>
        );
    }
}

PtProblemAddPopupNodeCode.propTypes = {
    parentState: PropTypes.object.isRequired,
    closePopup: PropTypes.func.isRequired,
    addNodeCode: PropTypes.func.isRequired,
};

function mapStateToProps(state, ownProps) {
    const { ptProblem, common } = state;
    return {
        response: { ptProblem, common }
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(Object.assign({}, PtProblemActions), dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(translate()(PtProblemAddPopupNodeCode));
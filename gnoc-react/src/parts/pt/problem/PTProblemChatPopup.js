import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Col, Row, Label, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { AvForm } from 'availity-reactstrap-validation';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { translate, Trans } from 'react-i18next';
import { toastr } from 'react-redux-toastr';
import LaddaButton, { ZOOM_OUT } from 'react-ladda';
import * as commonActions from './../../../actions/commonActions';
import * as PtProblemActions from './PtProblemActions';
import CustomReactTable from "../../../containers/Utils/CustomReactTable";
import CustomReactTableLocal from "../../../containers/Utils/CustomReactTableLocal"
import { CustomAvField } from '../../../containers/Utils';

class PTProblemChatPopup extends Component {
    constructor(props) {
        super(props);

        this.onFetchData = this.onFetchData.bind(this);
        this.search = this.search.bind(this);
        this.getListUserSearch = this.getListUserSearch.bind(this);
        this.searchSupport = this.searchSupport.bind(this);
        this.getListUserSearchSupport = this.getListUserSearchSupport.bind(this);
        this.closePopup = this.closePopup.bind(this);
        this.handleDataCheckbox = this.handleDataCheckbox.bind(this);

        this.state = {
            isLoadFirst: true,
            //Table1
            data: [],
            pages: null,
            loading: true,
            columns: this.buildTableColumns(),
            dataChecked1: [],
            //Table2
            data2: [],
            pages2: null,
            loading2: false,
            columns2: this.buildTableColumns(),
            dataChecked2: [],
            //Object Search
            objectSearch: {},
            backdrop: "static",
            btnSearchLoading: false,
            btnSearchLoadingSupport: false,
            isSearchSupport: false,
            btnAddOrEditLoading : false,
            //select
            selectValueUsername: {},
            selectValueFullname: {}
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.parentState.selectedData) {
            if (this.state.isLoadFirst) {
                this.setState({ 
                    data2: nextProps.parentState.selectedData.listChatUsers || [],
                    isLoadFirst: false
                });
            } else {
                this.setState({ 
                    typeId : nextProps.parentState.selectedData.typeId,
                    selectedData: nextProps.parentState.selectedData
                });
            }
        }
    }

    buildTableColumns() {
        return [
            {
                Header: <Trans i18nKey="ptProblem:ptProblem.label.username" />,
                id: "username",
                accessor: d => <span title={d.username}>{d.username}</span>
            },
            {
                Header: <Trans i18nKey="ptProblem:ptProblem.label.fullName" />,
                id: "fullName",
                accessor: d => <span title={d.fullname}>{d.fullname}</span>
            },
            {
                Header: <Trans i18nKey="ptProblem:ptProblem.label.unit" />,
                id: "unitName",
                accessor: d => <span title={d.unitName}>{d.unitName}</span>
            },
            {
                Header: <Trans i18nKey="ptProblem:ptProblem.label.email" />,
                id: "email",
                accessor: d => <span title={d.email}>{d.email}</span>,
            },
            {
                Header: <Trans i18nKey="ptProblem:ptProblem.label.phone" />,
                id: "mobile",
                accessor: d => <span title={d.mobile}>{d.mobile}</span>,
            }
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
            if (this.state.isSearchSupport) {
                this.getListUserSearchSupport();
            } else {
                this.getListUserSearch();
            }
        });
    }

    updateChat = () => {
        this.setState({
            btnAddOrEditLoading: true
        }, () => {
            if (this.state.data2.length < 1) {
                toastr.warning(this.props.t("ptProblem:ptProblem.message.required.users"));
                this.setState({
                    btnAddOrEditLoading: false
                });
                return;
            }
            let objectSend = Object.assign({}, this.state.selectedData);
            objectSend.usersDtos = [...this.state.data2];
            this.props.actions.sendChatListUsers(objectSend).then((response) => {
                this.setState({
                    btnAddOrEditLoading: false
                }, () => {
                    if (response.payload.data.key === "SUCCESS") {
                        this.closePopup();
                        toastr.success(this.props.t("ptProblem:ptProblem.message.success.sendMessage"));
                    } else if (response.payload.data.key === "ERROR") {
                        toastr.error(response.payload.data.message);
                    } else {
                        toastr.error(this.props.t("ptProblem:ptProblem.message.error.sendMessage"));
                    }
                });
            }).catch((response) => {
                this.setState({
                    btnAddOrEditLoading: false
                }, () => {
                    toastr.error(this.props.t("ptProblem:ptProblem.message.error.sendMessage"));
                });
            });
        })
    }

    removeUser = dataChecked2 => {
        if (dataChecked2.length < 1) {
            toastr.warning(this.props.t("common:common.message.error.removeSelect"));
        }
        let listTemp = [...this.state.data2];
        dataChecked2.forEach(element => {
            listTemp = listTemp.filter(el => el.userId !== element.userId);
        });
        this.setState({
            data2: listTemp
        });
    }

    search(event, error, values) {
        let obj = values.objectSearch;
        const objectSearch = Object.assign({}, this.state.objectSearch, obj);
        objectSearch.page = 1;
        objectSearch.pageSize = 10;
        objectSearch.sortName = null;
        objectSearch.sortType = null;

        this.setState({
            btnSearchLoading: true,
            loading: true,
            objectSearch: objectSearch,
            isSearchSupport: false
        }, () => {
            this.customReactTable.resetPage();
            this.getListUserSearch(true);
        });
    }

    getListUserSearch(isSearchClicked = false) {
        this.props.actions.getListUsers(this.state.objectSearch).then((response) => {
            this.setState({
                data: response.payload.data.data ? response.payload.data.data : [],
                pages: response.payload.data.pages,
                loading: false
            });
            if (isSearchClicked) {
                this.setState({ btnSearchLoading: false });
            }
        }).catch((response) => {
            toastr.error(this.props.t("ptProblem:ptProblem.message.error.searchUsers"));
        });
    }

    searchSupport() {
        const objectSearch = Object.assign({}, this.state.objectSearch);
        objectSearch.page = 1;
        objectSearch.typeId = this.state.typeId;
        this.setState({
            btnSearchLoadingSupport: true,
            loading: true,
            objectSearch: objectSearch,
            isSearchSupport: true
        }, () => {
            this.customReactTable.resetPage();
            this.getListUserSearchSupport(true);
        });
    }

    getListUserSearchSupport(isSearchClicked = false) {
        this.props.actions.getListUsersSupport(this.state.objectSearch).then((response) => {
            this.setState({
                data: response.payload.data.data ? response.payload.data.data : [],
                pages: response.payload.data.pages,
                loading: false
            });
            if (isSearchClicked) {
                this.setState({ btnSearchLoadingSupport: false });
            }
        }).catch((response) => {
            toastr.error(this.props.t("ptProblem:ptProblem.message.error.searchSupport"));
        });
    }

    closePopup() {
        this.setState({
            objectSearch: {},
            btnSearchLoading: false,
            btnSearchLoadingSupport: false,
            isSearchSupport: false,
            isLoadFirst: true
        });
        this.props.closePopup();
    }

    handleDataCheckbox(data) {
        this.setState({
            dataChecked1 : data
        });
    }

    handleDataCheckbox2 = (data) => {
        this.setState({
            dataChecked2 : data
        });
    }
    addUser(dataChecked1) {
        if (dataChecked1.length > 0) {
            const checkedTemp = [...dataChecked1];
            checkedTemp.forEach(element => {
                if (this.state.data2.some(el => el.userId === element.userId)) {
                    dataChecked1.splice(dataChecked1.indexOf(element), 1);
                }
            });
            this.setState({
                objectSearch: {},
                data2: [...this.state.data2,...dataChecked1],
                dataChecked1: []
            });
            this.customReactTable.clearChecked();
        } else {
            toastr.error(this.props.t("ptProblem:ptProblem.message.required.users"));
        }
    }
    render() {
        const { t } = this.props;
        const { columns, data, pages, loading, objectSearch, data2, columns2, loading2 } = this.state;
        return (
            <Modal isOpen={this.props.parentState.isOpenPopup} className={'modal-primary modal-lg ' + this.props.className}
                backdrop={this.state.backdrop} >
                <ModalHeader toggle={this.closePopup}>
                    {t("ptProblem:ptProblem.label.addNewChat")}
                </ModalHeader>
                <ModalBody>
                    <AvForm onSubmit={this.search} model={objectSearch}>
                        <Row>
                            <Col xs="12">
                                <Row>
                                    <Col xs="12" sm="4">
                                        <CustomAvField
                                            name={"objectSearch.username"}
                                            label={t("ptProblem:ptProblem.label.username")}
                                            placeholder={t("ptProblem:ptProblem.placeholder.username")}
                                        />
                                    </Col>
                                    <Col xs="12" sm="4">
                                        <CustomAvField
                                            name={"objectSearch.fullname"}
                                            label={t("ptProblem:ptProblem.label.employeeName")}
                                            placeholder={t("ptProblem:ptProblem.placeholder.employeeName")}
                                        />
                                    </Col>
                                    <Col xs="12" sm="4">
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
                                            <LaddaButton type="button"
                                                className="btn btn-primary btn-md mr-1"
                                                loading={this.state.btnSearchLoadingSupport}
                                                data-style={ZOOM_OUT}
                                                onClick={this.searchSupport}>
                                                <i className="fa fa-file"></i> <Trans i18nKey="ptProblem:ptProblem.button.loadSupportTeam" />
                                            </LaddaButton>
                                        </Row>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </AvForm>
                    <Row>
                        <Col xs="12">
                            <Label>{t("ptProblem:ptProblem.label.searchResults")}</Label>
                            <CustomReactTable
                                onRef={ref => (this.customReactTable = ref)}
                                columns={columns}
                                data={data}
                                pages={pages}
                                loading={loading}
                                onFetchData={this.onFetchData}
                                defaultPageSize={10}
                                isCheckbox={true}
                                propsCheckbox={["userId", "username", "fullname", "unitId", "email", "mobile", "unitName"]}
                                handleDataCheckbox={this.handleDataCheckbox}
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col xs="12" className="text-center mt-2">
                            <Button type="button" color="primary" disabled={this.state.dataChecked1.length < 1} className="ml-auto" onClick={() => this.addUser(this.state.dataChecked1)}><i className="fa fa-plus"></i> {t("ptProblem:ptProblem.button.add")}</Button>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs="12">
                            <Label>{t("ptProblem:ptProblem.label.selectedList")}</Label>
                            <CustomReactTableLocal
                                columns={columns2}
                                data={data2}
                                loading={loading2}
                                isCheckbox={true}
                                propsCheckbox={["userId"]}
                                defaultPageSize={5}
                                handleDataCheckbox={this.handleDataCheckbox2}
                            />
                        </Col>
                    </Row>
                </ModalBody>
                <ModalFooter>
                    <Button type="button" color="primary" disabled={this.state.data2.length < 1} onClick={() => this.updateChat()} className="ml-auto"><i className="fa fa-check"></i> {t("ptProblem:ptProblem.button.choose")}</Button>
                    <Button type="button" color="secondary" className="mr-auto" onClick={() => this.removeUser(this.state.dataChecked2)}><i className="fa fa-times-circle"></i> {t("common:common.button.delete")}</Button>
                </ModalFooter>
            </Modal>
        );
    }
}

PTProblemChatPopup.propTypes = {
    parentState: PropTypes.object.isRequired,
    closePopup: PropTypes.func.isRequired
};

function mapStateToProps(state, ownProps) {
    const { ptProblem, common } = state;
    return {
        response: { ptProblem, common }
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(Object.assign({}, commonActions, PtProblemActions), dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(translate()(PTProblemChatPopup));
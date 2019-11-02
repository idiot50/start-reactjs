import React, { Component } from 'react';
import { Button, Input, Label, InputGroup, InputGroupAddon, InputGroupText, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { AvFeedback, AvGroup } from 'availity-reactstrap-validation';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as commonActions from '../../actions/commonActions';
import { translate, Trans } from 'react-i18next';
import CustomAvInput from './CustomAvInput';
import CustomReactTableLocal from './CustomReactTableLocal';
import { renderRequired } from './Utils';
import Config from '../../config';

const defaultLocale = localStorage.getItem('default_locale') ? localStorage.getItem('default_locale') : Config.defaultLocale;

class CustomInputMultiLanguage extends Component {
    constructor(props) {
        super(props);

        this.toggleFormPopup = this.toggleFormPopup.bind(this);
        this.handleChangeInput = this.handleChangeInput.bind(this);
        this.handleClose = this.handleClose.bind(this);

        this.state = {
            backdrop: "static",
            modalFormPopup: false,
            valueInput: "",
            //Table
            data: [],
            loading: false,
            columns: this.buildTableColumns()
        };
    }

    componentDidMount() {
        if (this.props.dataLanguageExchange && this.props.dataLanguageExchange.length > 0) {
            const data = [...this.props.dataLanguageExchange];
            let valueInput = this.state.valueInput;
            for (let i = 0; i < data.length; i++) {
                data[i].id = i + 1;
                if (data[i].leeLocale === defaultLocale) {
                    valueInput = data[i].leeValue;
                }
            }
            this.setState({
                data,
                valueInput
            });
        } else {
            this.props.actions.getListLanguage().then((response) => {
                const data = response.payload.data.map((item, index) => {
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
                        leeLocaleFlag: item.languageFlag
                    }
                });
                this.setState({
                    data
                });
            }).catch((error) => {
                console.error(error);
            });
        }
    }

    buildTableColumns() {
        return [
            {
                Header: <Trans i18nKey="common:common.label.language" />,
                id: "id",
                className: "text-left",
                sortable: true,
                width: 200,
                accessor: d => <span><i className={"flag-icon " + d.leeLocaleFlag} style={{ fontSize: '17px', marginRight: '5px' }}></i>{d.leeLocaleName}</span>
            },
            {
                Header: this.props.label,
                accessor: "leeValue",
                className: "text-left",
                sortable: false,
                Cell: ({ original }) => {
                    return <Input type="text" disabled={this.props.isDisabled} maxLength={this.props.maxLength} value={(original && original.leeValue) ? original.leeValue : ""} onChange={(e) => this.onChangeRowName(e.target.value, original)} />;
                }
            }
        ];
    }

    onChangeRowName(newValue, object) {
        //Set into data
        const data = [...this.state.data];
        for(const obj of data) {
            if(obj.id === object.id) {
                obj.leeValue= newValue;
                break;
            }
        }
        if (object.leeLocale === defaultLocale) {
            this.setState({
                data,
                valueInput: newValue
            }, () => {
                this.props.handleChange(data);
            });
        } else {
            this.setState({
                data
            }, () => {
                this.props.handleChange(data);
            });
        }
    }

    toggleFormPopup() {
        this.setState({ modalFormPopup: !this.state.modalFormPopup });
    }

    handleChangeInput(e) {
        const data = [...this.state.data];
        for(const obj of data) {
            if(obj.leeLocale === defaultLocale) {
                obj.leeValue= e.target.value;
                break;
            }
        }
        this.setState({
            data,
            valueInput: e.target.value
        }, () => {
            this.props.handleChange(data);
        });
    }

    handleClose() {
        try {
            document.getElementById(this.props.formId).elements[this.props.name + "-multi-language"].value = this.state.valueInput;
        } catch (error) {
            console.error(error);
        }
    }

    render() {
        const { t } = this.props;
        const { columns, data, loading } = this.state;
        return (
        <AvGroup>
            <Label>{this.props.label}</Label>
            {this.props.isRequired ? renderRequired : null}
            <InputGroup>
                <CustomAvInput name={this.props.name + "-multi-language"} 
                    placeholder={this.props.placeholder} required={this.props.isRequired}
                    value={this.state.valueInput || ""} onChange={this.handleChangeInput}
                    disabled={this.props.isDisabled}
                    maxLength={this.props.maxLength} autoFocus={this.props.autoFocus}/>
                <InputGroupAddon addonType="append">
                    <InputGroupText onClick={this.toggleFormPopup} title={t("common:common.title.configMultiLanguage")} style={{borderTopRightRadius: '4px', borderBottomRightRadius: '4px', cursor: 'pointer'}}>
                        <i className="icon-globe globe-flag"></i>
                        <Modal onClosed={this.handleClose} isOpen={this.state.modalFormPopup} toggle={this.toggleFormPopup} backdrop={this.state.backdrop}
                                className={'modal-primary modal-lg'}>
                            <ModalHeader toggle={this.toggleFormPopup}>{t("common:common.title.configMultiLanguage")}</ModalHeader>
                            <ModalBody>
                                <CustomReactTableLocal
                                    columns={columns}
                                    data={data}
                                    loading={loading}
                                    defaultPageSize={10}
                                    isContainsAvField={true}
                                />
                            </ModalBody>
                            <ModalFooter>
                                {/* <Button type="button" color="primary" onClick={this.toggleFormPopup}><i className="fa fa-save"></i> {t("common:common.button.choose")}</Button> */}
                                <Button type="button" color="secondary" onClick={this.toggleFormPopup}><i className="fa fa-times-circle"></i> {t("common:common.button.close")}</Button>
                            </ModalFooter>
                        </Modal>
                    </InputGroupText>
                </InputGroupAddon>
                <AvFeedback>{this.props.messageRequire}</AvFeedback>
            </InputGroup>
        </AvGroup>
        );
    }
}

CustomInputMultiLanguage.propTypes = {
    formId: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    isRequired: PropTypes.bool.isRequired,
    messageRequire: PropTypes.string,
    placeholder: PropTypes.string,
    maxLength: PropTypes.number,
    autoFocus: PropTypes.bool,
    isDisabled: PropTypes.bool,
    dataLanguageExchange: PropTypes.array.isRequired,
    handleChange: PropTypes.func.isRequired
};

function mapStateToProps(state, ownProps) {
    return {
        response: state.common
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(commonActions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(translate()(CustomInputMultiLanguage));
import React, { Component } from 'react';
import { Label } from 'reactstrap';
import { AvInput, AvFeedback, AvGroup } from 'availity-reactstrap-validation';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as commonActions from '../../actions/commonActions';
import { translate } from 'react-i18next';
import Select, { components } from 'react-select';
import { renderRequired } from './Utils';
import 'react-perfect-scrollbar/dist/css/styles.css';
import PerfectScrollbar from 'react-perfect-scrollbar';
import _ from 'lodash';

const MenuList = props => {
    let styleMenuList = {};
    if (props.children.length > 7) {
        styleMenuList = {height: '292px'};
    }
    return (
        <components.MenuList {...props}>
            <div style={styleMenuList}>
                <PerfectScrollbar onScrollDown={container => {
                    if (container.scrollTop + container.offsetHeight === container.scrollHeight) {
                        props.selectProps.onMenuScrollToBottom();
                    }
                }}>
                    {props.children}
                </PerfectScrollbar>
            </div>
        </components.MenuList>
    )
}

class CustomSelect extends Component {
    constructor(props) {
        super(props);

        this.handleMenuScrollToBottom = this.handleMenuScrollToBottom.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleMousedown = this.handleMousedown.bind(this);

        this.state = {
            optionsListChoose: [],
            optionsList: [],
            param: "",
            offset: 10
        };
    }

    componentDidMount() {
        this.props.actions.getListCombobox("stream", this.props.moduleName, this.props.parentValue, this.props.isHasChildren, "", 10).then((response) => {
            let options = response.payload.data.map(item => {
                return {
                    value: item.itemId,
                    label: item.itemName,
                    code: item.itemCode || null,
                    subValue: item.itemValue || null
                }
            });
            options.unshift({
                value: null,
                label: this.props.t("common:common.placeholder.select1"),
                code: null,
                subValue: null
            });
            const optionsList = [];
            const length = (this.state.offset > options.length) ? options.length : this.state.offset;
            for(let i = 0; i < length; i++){
                optionsList.push(options[i])
            }
            if (this.props.selectValue && this.props.selectValue.constructor === Object && !this.isEmptyObject(this.props.selectValue)) {
                this.props.actions.getListCombobox("stream", this.props.moduleName, this.props.parentValue, this.props.isHasChildren, "", 10, this.props.selectValue.value).then((response) => {
                    let optionsChoose = response.payload.data.map(item => {
                        return {
                            value: item.itemId,
                            label: item.itemName,
                            code: item.itemCode || null,
                            subValue: item.itemValue || null
                        }
                    });
                    const optionsListChoose = [];
                    const lengthChoose = (this.state.offset > optionsChoose.length) ? optionsChoose.length : this.state.offset;
                    for(let i = 0; i < lengthChoose; i++){
                        optionsListChoose.push(optionsChoose[i])
                    }
                    if (this.state.optionsList.length === 0) {
                        this.setState({
                            optionsList,
                            optionsListChoose
                        });
                    } else {
                        this.setState({
                            optionsListChoose
                        });
                    }
                }).catch((error) => {
                    console.error(error);
                });
            } else {
                if (this.state.optionsList.length === 0) {
                    this.setState({
                        optionsList
                    });
                }
            }
        }).catch((error) => {
            console.error(error);
        });
        window.addEventListener('mousedown', this.handleMousedown);
    }

    componentWillReceiveProps(nextProps) {
        const isHasChildrenNew = nextProps.isHasChildren ? true : false;
        const value = (this.props.selectValue && this.props.selectValue.constructor === Object && this.isEmptyObject(this.props.selectValue)) ? null : this.props.selectValue;
        const newValue = (nextProps.selectValue && nextProps.selectValue.constructor === Object && this.isEmptyObject(nextProps.selectValue)) ? null : nextProps.selectValue;
        const parentValue = this.props.parentValue === "" ? null : this.props.parentValue;
        const parentNewValue = nextProps.parentValue === "" ? null : nextProps.parentValue;
        const moduleNameValue = this.props.moduleName;
        const moduleNameNewValue = nextProps.moduleName;
        //Check
        let checkRender = false;
        if (value && newValue) {
            checkRender = (value.value + "") !== (newValue.value + "");
        } else {
            if ((!value && newValue) || (value && !newValue)) {
                checkRender = true;
            }
        }
        if (checkRender) {
            if (nextProps.selectValue && nextProps.selectValue.constructor === Object && !this.isEmptyObject(nextProps.selectValue)) {
                this.props.actions.getListCombobox("stream", this.props.moduleName, parentNewValue, isHasChildrenNew, "", 10, nextProps.selectValue.value).then((response) => {
                    let options = response.payload.data.map(item => {
                        return {
                            value: item.itemId,
                            label: item.itemName,
                            code: item.itemCode || null,
                            subValue: item.itemValue || null
                        }
                    });
                    const optionsListChoose = [];
                    const length = (this.state.offset > options.length) ? options.length : this.state.offset;
                    for(let i = 0; i < length; i++){
                        optionsListChoose.push(options[i])
                    }
                    this.setState({
                        optionsListChoose
                    }, () => {
                        if (optionsListChoose.length > 0) {
                            // this.props.handleItemSelectChange(optionsListChoose[0]);
                        } else {
                            this.props.handleItemSelectChange({
                                value: null,
                                label: this.props.t("common:common.placeholder.select1"),
                                code: null,
                                subValue: null
                            });
                        }
                    });
                }).catch((error) => {
                    console.error(error);
                });
            }
        }
        let checkRenderParent = false;
        if (parentValue && parentNewValue) {
            checkRenderParent = (parentValue + "") !== (parentNewValue + "");
        } else {
            if ((!parentValue && parentNewValue) || (parentValue && !parentNewValue)) {
                checkRenderParent = true;
            }
        }
        if (checkRenderParent) {
            this.props.actions.getListCombobox("stream", this.props.moduleName, parentNewValue, isHasChildrenNew, "", 10).then((response) => {
                let options = response.payload.data.map(item => {
                    return {
                        value: item.itemId,
                        label: item.itemName,
                        code: item.itemCode || null,
                        subValue: item.itemValue || null
                    }
                });
                options.unshift({
                    value: null,
                    label: this.props.t("common:common.placeholder.select1"),
                    code: null,
                    subValue: null
                });
                const optionsList = [];
                const length = (this.state.offset > options.length) ? options.length : this.state.offset;
                for(let i = 0; i < length; i++){
                    optionsList.push(options[i])
                }
                this.setState({
                    optionsList
                });
            }).catch((error) => {
                console.error(error);
            });
        }
        let checkRenderModuleName = false;
        if (moduleNameValue && moduleNameNewValue) {
            checkRenderModuleName = (moduleNameValue + "") !== (moduleNameNewValue + "");
        } else {
            if ((!moduleNameValue && moduleNameNewValue) || (moduleNameValue && !moduleNameNewValue)) {
                checkRenderModuleName = true;
            }
        }
        if (checkRenderModuleName) {
            this.props.actions.getListCombobox("stream", moduleNameNewValue, this.props.parentValue, isHasChildrenNew, "", 10).then((response) => {
                let options = response.payload.data.map(item => {
                    return {
                        value: item.itemId,
                        label: item.itemName,
                        code: item.itemCode || null,
                        subValue: item.itemValue || null
                    }
                });
                options.unshift({
                    value: null,
                    label: this.props.t("common:common.placeholder.select1"),
                    code: null,
                    subValue: null
                });
                const optionsList = [];
                const length = (this.state.offset > options.length) ? options.length : this.state.offset;
                for(let i = 0; i < length; i++){
                    optionsList.push(options[i])
                }
                this.setState({
                    optionsList
                });
            }).catch((error) => {
                console.error(error);
            });
        }
    }
    
    componentWillUnmount() {
        window.removeEventListener('mousedown', this.handleMousedown);
    }

    handleMousedown(event) {
        if(this.selectRef.state.menuIsOpen 
            && !event.target.classList.contains('react-Selector__value-container')
            && !event.target.classList.contains('react-Selector__single-value')) {
            this.selectRef.setState({
                menuIsOpen: false
            });
        }
    }

    reloadOptions(value) {
        this.props.actions.getListCombobox("stream", this.props.moduleName, this.props.parentValue, this.props.isHasChildren, this.state.param, this.state.offset, value).then((response) => {
            let options = response.payload.data.map(item => {
                return {
                    value: item.itemId,
                    label: item.itemName,
                    code: item.itemCode || null,
                    subValue: item.itemValue || null
                }
            });
            options.unshift({
                value: null,
                label: this.props.t("common:common.placeholder.select1"),
                code: null,
                subValue: null
            });
            this.setState({
                optionsList: options
            });
        }).catch((error) => {
            console.error(error);
        });
    }

    handleMenuScrollToBottom() {
        this.setState({
            offset: this.state.offset + 10
        }, () => {
            this.reloadOptions();
        });
    }

    handleInputChange(value) {
        if (value !== this.state.param) {
            this.setState({
                offset: 10,
                param: value
            }, () => {
                this.props.actions.getListCombobox("stream", this.props.moduleName, this.props.parentValue, this.props.isHasChildren, this.state.param, this.state.offset, "").then((response) => {
                    let options = response.payload.data.map(item => {
                        return {
                            value: item.itemId,
                            label: item.itemName,
                            code: item.itemCode || null,
                            subValue: item.itemValue || null
                        }
                    });
                    options.unshift({
                        value: null,
                        label: this.props.t("common:common.placeholder.select1"),
                        code: null,
                        subValue: null
                    });
                    this.setState({
                        optionsList: options
                    });
                }).catch((error) => {
                    console.error(error);
                });
            });
        }
        return value;
    }

    isEmptyObject(obj) {
        for(var key in obj) {
            if(obj.hasOwnProperty(key))
                return false;
        }
        return true;
    }

    setDefaultValue(options, selectValue) {
        let value = {};
        for (const opt of options) {
            if ((opt.value + "") === (selectValue.value + "")) {
                value = Object.assign({}, opt);
            }
        }
        return value;
    }

    render() {
        const { t } = this.props;
        let valueInputHidden;
        let defaultValue;
        if (this.props.selectValue.constructor === Object) {
            if (this.isEmptyObject(this.props.selectValue)) {
                defaultValue = {
                    value: null,
                    label: this.props.t("common:common.placeholder.select1"),
                    code: null,
                    subValue: null
                };
            } else {
                defaultValue = Object.assign({}, this.props.selectValue);
                if(defaultValue.value !== null) {
                    valueInputHidden = JSON.stringify(defaultValue);
                }
            }
        }
        let listOptionsAll = this.state.optionsListChoose.length > 0 ? [...this.state.optionsList, this.state.optionsListChoose[0]] : [...this.state.optionsList];
        listOptionsAll = _.uniqBy(listOptionsAll, 'value');
        defaultValue = this.setDefaultValue(listOptionsAll, defaultValue);
        return (
        this.props.isOnlyInputSelect ?
        <AvGroup>
            <AvInput type={"hidden"} name={"custom-input-" + this.props.name} value={valueInputHidden || ""} placeholder={""} required={this.props.isRequired}/>
            <Select
                ref={el => (this.selectRef = el)}
                inputId={"custom-" + this.props.name}
                openMenuOnFocus={true}
                autoFocus={this.props.autoFocus}
                components={{MenuList}}
                closeMenuOnSelect={this.props.closeMenuOnSelect}
                cacheOptions={true}
                defaultOptions={true}
                options={this.state.optionsList}
                onChange={this.props.handleItemSelectChange}
                onMenuScrollToBottom={this.handleMenuScrollToBottom}
                onInputChange={this.handleInputChange}
                value={defaultValue}
                isDisabled={this.props.isDisabled}
                theme={(theme) => ({
                    ...theme,
                    colors: {
                        ...theme.colors,
                        primary: '#8ad4ee'
                    }
                })}
                placeholder={t("common:common.placeholder.select")}
                noOptionsMessage={ () => t("common:common.placeholder.noOptionsMessage") }
                classNamePrefix="react-Selector"
                menuPortalTarget={document.body}
                styles={{
                    menuPortal: base => ({
                        ...base, zIndex: 1050 
                    }),
                    control: base => ({
                        ...base,
                        height: 34,
                        minHeight: 34
                    })
                }}
            />
            <AvFeedback>{this.props.messageRequire}</AvFeedback>
        </AvGroup>
        :
        <AvGroup>
            <Label>{this.props.label}</Label>
            {this.props.isRequired ? renderRequired : null}
            <AvInput type={"hidden"} name={"custom-input-" + this.props.name} value={valueInputHidden || ""} placeholder={""} required={this.props.isRequired}/>
            <Select
                ref={el => (this.selectRef = el)}
                inputId={"custom-" + this.props.name}
                openMenuOnFocus={true}
                autoFocus={this.props.autoFocus}
                components={{MenuList}}
                closeMenuOnSelect={this.props.closeMenuOnSelect}
                cacheOptions={true}
                defaultOptions={true}
                options={this.state.optionsList}
                onChange={this.props.handleItemSelectChange}
                onMenuScrollToBottom={this.handleMenuScrollToBottom}
                onInputChange={this.handleInputChange}
                value={defaultValue}
                isDisabled={this.props.isDisabled}
                theme={(theme) => ({
                    ...theme,
                    colors: {
                        ...theme.colors,
                        primary: '#8ad4ee'
                    }
                })}
                placeholder={t("common:common.placeholder.select")}
                noOptionsMessage={ () => t("common:common.placeholder.noOptionsMessage") }
                classNamePrefix="react-Selector"
                menuPortalTarget={document.body}
                styles={{
                    menuPortal: base => ({
                        ...base, zIndex: 1050 
                    }),
                    control: base => ({
                        ...base,
                        height: 34,
                        minHeight: 34
                    })
                }}
            />
            <AvFeedback>{this.props.messageRequire}</AvFeedback>
        </AvGroup>
        );
    }
}

CustomSelect.propTypes = {
    name: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    isRequired: PropTypes.bool.isRequired,
    messageRequire: PropTypes.string,
    moduleName: PropTypes.string.isRequired,
    parentValue: PropTypes.any,
    isHasChildren: PropTypes.bool,
    closeMenuOnSelect: PropTypes.bool.isRequired,
    handleItemSelectChange: PropTypes.func.isRequired,
    selectValue: PropTypes.any.isRequired,
    isDisabled: PropTypes.bool,
    isOnlyInputSelect: PropTypes.bool,
    autoFocus: PropTypes.bool
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

export default connect(mapStateToProps, mapDispatchToProps)(translate()(CustomSelect));
import React, { Component } from 'react';
import { Label, Input, InputGroup, InputGroupAddon, InputGroupText } from 'reactstrap';
import { AvInput, AvFeedback, AvGroup } from 'availity-reactstrap-validation';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as commonActions from '../../actions/commonActions';
import { translate, Trans } from 'react-i18next';
import { components } from 'react-select';
import AsyncSelect from 'react-select/lib/Async';
import { renderRequired } from './Utils';
import 'react-perfect-scrollbar/dist/css/styles.css';
import PerfectScrollbar from 'react-perfect-scrollbar';

const MenuList = props => {
    let styleMenuList = {};
    if (props.children.length > 7) {
        styleMenuList = {height: '292px'};
    }
    return (
        <components.MenuList {...props}>
            <div style={styleMenuList}>
                <PerfectScrollbar>
                    {props.children}
                </PerfectScrollbar>
            </div>
        </components.MenuList>
    )
}

const SingleValue = ({ children, ...props}) => (
    <components.SingleValue {...props}>
        <span title={children}>{children}</span>
    </components.SingleValue>
);

const OptionUser = (props) => {
    return (
        <div>
            <components.Option {...props}>
                <span style={{fontWeight: 500}}>{props.label}</span>
                <br/>
                <span>{props.data.subLabel}</span>
                <br/>
                <span style={{color: '#20a8d8'}}>{props.data.description}</span>
            </components.Option>
        </div>
    )
}

const OptionUnit = (props) => {
    return (
        <div>
            <components.Option {...props}>
                <span style={{fontWeight: 500}}>{props.label}</span>
                <br/>
                <span style={{color: '#20a8d8'}}>{props.data.parentLabel}</span>
            </components.Option>
        </div>
    )
}

const OptionRegion = (props) => {
    return (
        <div>
            <components.Option {...props}>
                <span style={{fontWeight: 500}}>{props.data.description}</span>
                <br/>
                <span style={{color: '#20a8d8'}}>{props.label}</span>
            </components.Option>
        </div>
    )
}

const OptionWoMaterial = (props) => {
    return (
        <div>
            <components.Option {...props}>
                <span style={{fontWeight: 500}}>{props.label}</span>
                <br/>
                <span style={{color: '#20a8d8'}}>{props.data.description}</span>
            </components.Option>
        </div>
    )
}

class CustomAutocomplete extends Component {
    constructor(props) {
        super(props);

        this.handleInputChange = this.handleInputChange.bind(this);

        this.state = {
            menuIsOpen: false,
            optionsList: []
        };
    }

    componentDidMount() {
        if (this.props.selectValue && this.props.selectValue.constructor === Object && !this.isEmptyObject(this.props.selectValue)) {
            this.reloadOptions(this.props.selectValue.value);
        }
    }

    componentWillReceiveProps(nextProps) {
        const value = (this.props.selectValue && this.props.selectValue.constructor === Object && this.isEmptyObject(this.props.selectValue)) ? null : this.props.selectValue;
        const newValue = (nextProps.selectValue && nextProps.selectValue.constructor === Object && this.isEmptyObject(nextProps.selectValue)) ? null : nextProps.selectValue;
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
                this.reloadOptions(nextProps.selectValue.value);
            }
        }
    }

    reloadOptions(value) {
        this.props.actions.getListCombobox("stream", this.props.moduleName, this.props.parentValue, this.props.isHasChildren, "", 0, value).then((response) => {
            let options = response.payload.data.map(item => {
                return {
                    value: item.itemId,
                    label: this.props.moduleName === "UNIT" ? item.itemName + " (" + item.itemCode + ")" : item.itemName,
                    subLabel: item.itemValue,
                    description: item.description,
                    parentValue: item.parenItemId,
                    parentLabel: item.parenItemName
                }
            });
            this.setState({
                optionsList: options
            });
        }).catch((error) => {
            console.error(error);
        });
    }

    loadOptions(query, callback) {
        this.props.actions.getListCombobox("stream", this.props.moduleName, this.props.parentValue, this.props.isHasChildren, query, 20, "").then((response) => {
            let options = response.payload.data.map(item => {
                return {
                    value: item.itemId,
                    label: this.props.moduleName === "UNIT" ? item.itemName + " (" + item.itemCode + ")" : item.itemName,
                    subLabel: item.itemValue,
                    description: item.description,
                    parentValue: item.parenItemId,
                    parentLabel: item.parenItemName
                }
            });
            callback(options);
        }).catch((error) => {
            console.error(error);
        });
    }

    isEmptyObject(obj) {
        for(var key in obj) {
            if(obj.hasOwnProperty(key))
                return false;
        }
        return true;
    }

    setDefaultValue(options, selectValue) {
        let value = null;
        for (const opt of options) {
            if ((opt.value + "") === (selectValue.value + "")) {
                value = Object.assign({}, opt);
            }
        }
        return value;
    }

    handleInputChange(props, { action }) {
        if (action === 'menu-close') {
            this.setState({
                menuIsOpen: false
            });
        } else {
            this.setState({
                menuIsOpen: true
            });
        }
    }

    render() {
        const { t } = this.props;
        let valueInputHidden;
        let defaultValue = null;
        if (this.props.selectValue && this.props.selectValue.constructor === Object) {
            if (this.isEmptyObject(this.props.selectValue)) {
                defaultValue = null;
            } else {
                defaultValue = Object.assign({}, this.props.selectValue);
                if(defaultValue.value !== null) {
                    valueInputHidden = JSON.stringify(defaultValue);
                }
                if(this.state.optionsList.length > 0) {
                    defaultValue = this.setDefaultValue(this.state.optionsList, defaultValue);
                }
            }
        }
        let components = {};
        if (this.props.moduleName === "USERS" || this.props.moduleName === "USERS_FT") {
            components = Object.assign({}, {MenuList, SingleValue, Option: OptionUser});
        } else if (this.props.moduleName === "UNIT") {
            components = Object.assign({}, {MenuList, SingleValue, Option: OptionUnit});
        } else if (this.props.moduleName === "REGION") {
            components = Object.assign({}, {MenuList, SingleValue, Option: OptionRegion});
        } else if (this.props.moduleName === "GNOC_WO_MATERIAL") {
            components = Object.assign({}, {MenuList, SingleValue, Option: OptionWoMaterial});
        } else {
            components = Object.assign({}, {MenuList});
        }
        const renderOnlyInputSelect = this.props.isHasCheckbox ?
            <AvGroup>
                <InputGroup>
                    <AvInput type={"hidden"} name={"custom-input-" + this.props.name} value={valueInputHidden || ""} placeholder={""} required={this.props.isRequired}/>
                    <AsyncSelect
                        ref={el => (this.selectRef = el)}
                        inputId={"custom-" + this.props.name}
                        openMenuOnFocus={true}
                        autoFocus={this.props.autoFocus}
                        key={JSON.stringify(this.props.parentValue)}
                        components={components}
                        closeMenuOnSelect={true}
                        cacheOptions={true}
                        defaultOptions={true}
                        loadOptions={(query, callback) => this.loadOptions(query, callback)}
                        onChange={this.props.handleItemSelectChange}
                        onInputChange={this.handleInputChange}
                        menuIsOpen={this.state.menuIsOpen}
                        value={defaultValue}
                        isClearable={true}
                        isDisabled={this.props.isDisabled}
                        theme={(theme) => ({
                            ...theme,
                            colors: {
                                ...theme.colors,
                                primary: '#8ad4ee'
                            }
                        })}
                        placeholder={this.props.placeholder}
                        noOptionsMessage={ () => t("common:common.placeholder.noOptionsMessage") }
                        classNamePrefix="react-Selector"
                        menuPortalTarget={document.body}
                        styles={{
                            menuPortal: base => ({
                                ...base, zIndex: 1050 
                            }),
                            container: base => ({
                                WebkitFlex: '1 1 auto',
                                flex: '1 1 auto'
                            }),
                            control: base => ({
                                ...base,
                                height: 34,
                                minHeight: 34,
                                borderRadius: '0.25rem 0rem 0rem 0.25rem'
                            }),
                            indicatorSeparator: base => ({
                                ...base,
                                display: 'none'
                            }),
                            dropdownIndicator: base => ({
                                ...base,
                                display: 'none'
                            })
                        }}
                    />
                    <InputGroupAddon addonType="append">
                        <InputGroupText style={{borderTopRightRadius: '4px', borderBottomRightRadius: '4px'}}>
                            <Input addon type="checkbox" name={this.props.nameCheckbox}
                                disabled={this.props.isDisabled}
                                checked={this.props.isCheckedCheckbox} onChange={this.props.handleOnChangeCheckbox} 
                                title={this.props.titleCheckbox} />
                        </InputGroupText>
                    </InputGroupAddon>
                    <AvFeedback>{this.props.messageRequire}</AvFeedback>
                </InputGroup>
            </AvGroup>
            :
            <AvGroup>
                <AvInput type={"hidden"} name={"custom-input-" + this.props.name} value={valueInputHidden || ""} placeholder={""} required={this.props.isRequired}/>
                <AsyncSelect
                    ref={el => (this.selectRef = el)}
                    inputId={"custom-" + this.props.name}
                    openMenuOnFocus={true}
                    autoFocus={this.props.autoFocus}
                    key={JSON.stringify(this.props.parentValue)}
                    components={components}
                    closeMenuOnSelect={true}
                    cacheOptions={true}
                    defaultOptions={true}
                    loadOptions={(query, callback) => this.loadOptions(query, callback)}
                    onChange={this.props.handleItemSelectChange}
                    onInputChange={this.handleInputChange}
                    menuIsOpen={this.state.menuIsOpen}
                    value={defaultValue}
                    isClearable={true}
                    isDisabled={this.props.isDisabled}
                    theme={(theme) => ({
                        ...theme,
                        colors: {
                            ...theme.colors,
                            primary: '#8ad4ee'
                        }
                    })}
                    placeholder={this.props.placeholder}
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
                        }),
                        indicatorSeparator: base => ({
                            ...base,
                            display: 'none'
                        }),
                        dropdownIndicator: base => ({
                            ...base,
                            display: 'none'
                        })
                    }}
                />
                <AvFeedback>{this.props.messageRequire}</AvFeedback>
            </AvGroup>
        const renderSelect = this.props.isHasCheckbox ?
            <AvGroup>
                <Label>{this.props.label}</Label>
                {this.props.isRequired ? renderRequired : null}
                <InputGroup>
                    <AvInput type={"hidden"} name={"custom-input-" + this.props.name} value={valueInputHidden || ""} placeholder={""} required={this.props.isRequired}/>
                    <AsyncSelect
                        ref={el => (this.selectRef = el)}
                        inputId={"custom-" + this.props.name}
                        openMenuOnFocus={true}
                        autoFocus={this.props.autoFocus}
                        key={JSON.stringify(this.props.parentValue)}
                        components={components}
                        closeMenuOnSelect={true}
                        cacheOptions={true}
                        defaultOptions={true}
                        loadOptions={(query, callback) => this.loadOptions(query, callback)}
                        onChange={this.props.handleItemSelectChange}
                        onInputChange={this.handleInputChange}
                        menuIsOpen={this.state.menuIsOpen}
                        value={defaultValue}
                        isClearable={true}
                        isDisabled={this.props.isDisabled}
                        theme={(theme) => ({
                            ...theme,
                            colors: {
                                ...theme.colors,
                                primary: '#8ad4ee'
                            }
                        })}
                        placeholder={this.props.placeholder}
                        noOptionsMessage={ () => t("common:common.placeholder.noOptionsMessage") }
                        classNamePrefix="react-Selector"
                        menuPortalTarget={document.body}
                        styles={{
                            menuPortal: base => ({
                                ...base, zIndex: 1050 
                            }),
                            container: base => ({
                                WebkitFlex: '1 1 auto',
                                flex: '1 1 auto'
                            }),
                            control: base => ({
                                ...base,
                                height: 34,
                                minHeight: 34,
                                borderRadius: '0.25rem 0rem 0rem 0.25rem'
                            }),
                            indicatorSeparator: base => ({
                                ...base,
                                display: 'none'
                            }),
                            dropdownIndicator: base => ({
                                ...base,
                                display: 'none'
                            })
                        }}
                    />
                    <InputGroupAddon addonType="append">
                        <InputGroupText style={{borderTopRightRadius: '4px', borderBottomRightRadius: '4px'}}>
                            <Input addon type="checkbox" name={this.props.nameCheckbox}
                                disabled={this.props.isDisabled}
                                checked={this.props.isCheckedCheckbox} onChange={this.props.handleOnChangeCheckbox} 
                                title={this.props.titleCheckbox} />
                        </InputGroupText>
                    </InputGroupAddon>
                    <AvFeedback>{this.props.messageRequire}</AvFeedback>
                </InputGroup>
            </AvGroup>
            :
            <AvGroup>
                <Label>{this.props.label}</Label>
                {this.props.isRequired ? renderRequired : null}
                <AvInput type={"hidden"} name={"custom-input-" + this.props.name} value={valueInputHidden || ""} placeholder={""} required={this.props.isRequired}/>
                <AsyncSelect
                    ref={el => (this.selectRef = el)}
                    inputId={"custom-" + this.props.name}
                    openMenuOnFocus={true}
                    autoFocus={this.props.autoFocus}
                    key={JSON.stringify(this.props.parentValue)}
                    components={components}
                    closeMenuOnSelect={true}
                    cacheOptions={true}
                    defaultOptions={true}
                    loadOptions={(query, callback) => this.loadOptions(query, callback)}
                    onChange={this.props.handleItemSelectChange}
                    onInputChange={this.handleInputChange}
                    menuIsOpen={this.state.menuIsOpen}
                    value={defaultValue}
                    isClearable={true}
                    isDisabled={this.props.isDisabled}
                    theme={(theme) => ({
                        ...theme,
                        colors: {
                            ...theme.colors,
                            primary: '#8ad4ee'
                        }
                    })}
                    placeholder={this.props.placeholder}
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
                        }),
                        indicatorSeparator: base => ({
                            ...base,
                            display: 'none'
                        }),
                        dropdownIndicator: base => ({
                            ...base,
                            display: 'none'
                        })
                    }}
                />
                <AvFeedback>{this.props.messageRequire}</AvFeedback>
            </AvGroup>
        return (
            this.props.isOnlyInputSelect ? renderOnlyInputSelect : renderSelect
        );
    }
}

CustomAutocomplete.propTypes = {
    name: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    isRequired: PropTypes.bool.isRequired,
    messageRequire: PropTypes.string,
    moduleName: PropTypes.string.isRequired,
    parentValue: PropTypes.any,
    isHasChildren: PropTypes.bool,
    handleItemSelectChange: PropTypes.func.isRequired,
    selectValue: PropTypes.object,
    isDisabled: PropTypes.bool,
    isOnlyInputSelect: PropTypes.bool,
    autoFocus: PropTypes.bool,

    isHasCheckbox: PropTypes.bool,
    nameCheckbox: PropTypes.string,
    isCheckedCheckbox: PropTypes.bool,
    handleOnChangeCheckbox: PropTypes.func,
    titleCheckbox: PropTypes.string
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

export default connect(mapStateToProps, mapDispatchToProps)(translate()(CustomAutocomplete));
import React, { Component } from 'react';
import { Label } from 'reactstrap';
import { AvInput, AvFeedback, AvGroup } from 'availity-reactstrap-validation';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import Select, { components } from 'react-select';
import { renderRequired, renderFlag } from './Utils';
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

const OptionFlag = (props) => {
    return (
        props.value ?
        <div>
            <components.Option {...props}>
                <span>
                    <i className={"flag-icon " + props.value} style={{ fontSize: '17px' }} title={props.label}></i>
                    <span className="ml-2">{props.label}</span>
                </span>
            </components.Option>
        </div>
        :
        <div>
            <components.Option {...props}>
                <span>{props.label}</span>
            </components.Option>
        </div>
    )
}

class CustomSelectFlag extends Component {
    constructor(props) {
        super(props);

        this.handleMousedown = this.handleMousedown.bind(this);

        this.state = {

        };
    }

    componentDidMount() {
        window.addEventListener('mousedown', this.handleMousedown);
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
        const optionsList = [...renderFlag];
        optionsList.unshift({
            value: null,
            label: t("common:common.placeholder.select1")
        });
        let valueInputHidden;
        let defaultValue;
        if (this.props.selectValue.constructor === Object) {
            if (this.isEmptyObject(this.props.selectValue)) {
                defaultValue = {
                    value: null,
                    label: this.props.t("common:common.placeholder.select1")
                };
            } else {
                defaultValue = Object.assign({}, this.props.selectValue);
                if(defaultValue.value !== null) {
                    valueInputHidden = JSON.stringify(defaultValue);
                }
            }
        }
        defaultValue = this.setDefaultValue(optionsList, defaultValue);
        return (
        this.props.isOnlyInputSelect ?
        <AvGroup>
            <AvInput type={"hidden"} name={"custom-input-" + this.props.name} value={valueInputHidden || ""} placeholder={""} required={this.props.isRequired}/>
            <Select
                ref={el => (this.selectRef = el)}
                inputId={"custom-" + this.props.name}
                components={{MenuList, Option: OptionFlag}}
                openMenuOnFocus={true}
                autoFocus={this.props.autoFocus}
                closeMenuOnSelect={this.props.closeMenuOnSelect}
                cacheOptions={true}
                defaultOptions={true}
                options={optionsList}
                onChange={this.props.handleItemSelectChange}
                filterOption={(candidate, input) => {
                    if (candidate.label) {
                        if ((candidate.label + "").toLowerCase().indexOf(input.toLowerCase()) !== -1) {
                            return true
                        } else {
                            return false;
                        }
                    } else {
                        return true;
                    }
                }}
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
                components={{MenuList, Option: OptionFlag}}
                openMenuOnFocus={true}
                autoFocus={this.props.autoFocus}
                closeMenuOnSelect={this.props.closeMenuOnSelect}
                cacheOptions={true}
                defaultOptions={true}
                options={optionsList}
                onChange={this.props.handleItemSelectChange}
                filterOption={(candidate, input) => {
                    if (candidate.label) {
                        if ((candidate.label + "").toLowerCase().indexOf(input.toLowerCase()) !== -1) {
                            return true
                        } else {
                            return false;
                        }
                    } else {
                        return true;
                    }
                }}
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

CustomSelectFlag.propTypes = {
    name: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    isRequired: PropTypes.bool.isRequired,
    messageRequire: PropTypes.string,
    closeMenuOnSelect: PropTypes.bool.isRequired,
    handleItemSelectChange: PropTypes.func.isRequired,
    selectValue: PropTypes.any.isRequired,
    isDisabled: PropTypes.bool,
    isOnlyInputSelect: PropTypes.bool,
    autoFocus: PropTypes.bool
};

export default translate()(CustomSelectFlag);
import React, { Component } from 'react';
import { Label } from 'reactstrap';
import { AvInput, AvFeedback, AvGroup } from 'availity-reactstrap-validation';
import PropTypes from 'prop-types';
import { translate, Trans } from 'react-i18next';
import i18n from 'i18next';
import Select, { components } from 'react-select';
import _ from 'lodash';
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

const IndicatorsContainer = (props) => {
    return (
        <div style={{display: 'flex'}}>
            { (props.selectProps.value.length !== props.selectProps.options.length) ?
                <div className="custom-indicators-container-select-all" 
                    style={{padding: props.hasValue ? '0px 0px 0px 8px' : '0px 8px 0px 8px'}}
                    onClick={props.selectProps.onSelectAll}>
                    <i className="fa fa-check"></i>
                </div> : null
            }
            <components.IndicatorsContainer {...props} />
        </div>
    )
}

const Option = (props) => {
    return (
        <div>
            <components.Option {...props}>
                <input type="checkbox" style={{marginTop: '4px'}} checked={props.isSelected} 
                    onChange={() => null}
                />
                <span style={{paddingLeft: '8px', position: 'absolute', whiteSpace: 'nowrap'}}>{props.label}</span>
            </components.Option>
        </div>
    )
}

const ValueContainer = ({ children, ...props }) => {
    const { options, value } = props.selectProps;
    let childrenChange = [];
    let text = <span></span>;
    if (value.length === options.length) {
        text = <span title={i18n.t('common:common.placeholder.selectAll')} key="textSelect"><Trans i18nKey="common:common.placeholder.selectAll"/></span>;
    } else {
        let labelSelected = value.map(function(item) {
            return item['label'];
        });
        if (value.length > 3) {
            text = <span title={labelSelected.join(', ')} key="textSelect">{i18n.t('common:common.placeholder.selectedOption', { number: value.length })}</span>;
        } else  if (value.length > 0 && value.length <= 3) {
            text = <span title={labelSelected.join(', ')} key="textSelect">{labelSelected.join(', ')}</span>;
        }
    }
    if (value.length === 0) {
        childrenChange = children;
    } else {
        childrenChange.push(text);
        childrenChange.push(children[1]);
    }
    return (
        <components.ValueContainer {...props}>
            {childrenChange}
        </components.ValueContainer>
    )
}

class CustomMultiSelectLocal extends Component {
    constructor(props) {
        super(props);

        this.handleSelectAll = this.handleSelectAll.bind(this);
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
            && !event.target.classList.contains('react-Selector__value-container')) {
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
        let value = [];
        for (const opt of options) {
            for (const sel of selectValue) {
                if ((sel.value + "") === (opt.value + "")) {
                    value.push(opt);
                }
            }
        }
        value = _.uniqBy(value, 'value');
        return value;
    }

    handleSelectAll() {
        const optionsList = [];
        for (const opt of this.props.options) {
            optionsList.push({
                value: opt.itemId,
                label: opt.itemName,
                code: opt.itemCode || null,
                subValue: opt.itemValue || null
            });
        }
        this.props.handleItemSelectChange(optionsList);
        this.selectRef.setState({
            menuIsOpen: true
        });
    }

    render() {
        const { t, options } = this.props;
        const optionsList = [];
        for (const opt of options) {
            optionsList.push({
                value: opt.itemId,
                label: opt.itemName,
                code: opt.itemCode || null,
                subValue: opt.itemValue || null
            });
        }
        let valueInputHidden;
        let defaultValue = [...this.props.selectValue];
        if(defaultValue.length !== 0) {
            valueInputHidden = JSON.stringify(defaultValue);
        }
        defaultValue = this.setDefaultValue(optionsList, defaultValue);
        return (
        this.props.isOnlyInputSelect ?
        <AvGroup>
            <AvInput type={"hidden"} name={"custom-input-" + this.props.name} value={valueInputHidden || ""} placeholder={""} required={this.props.isRequired}/>
            <Select
                ref={el => (this.selectRef = el)}
                inputId={"custom-" + this.props.name}
                openMenuOnFocus={true}
                autoFocus={this.props.autoFocus}
                components={{MenuList, ValueContainer, Option, IndicatorsContainer}}
                onSelectAll={this.handleSelectAll}
                isMulti={true}
                closeMenuOnSelect={this.props.closeMenuOnSelect}
                hideSelectedOptions={false}
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
                    }),
                    option: (base, state) => ({
                        ...base,
                        backgroundColor: 'transparent',
                        color: 'inherit'
                    }),
                    valueContainer: base => ({
                        ...base,
                        height: 34,
                        padding: '8px 8px',
                        display: '-webkit-box',
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
                        textOverflow: 'ellipsis',
                        textAlign: 'left'
                    }),
                    input: base => ({
                        ...base,
                        display: 'inherit',
                        marginTop: '-2px'
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
                components={{MenuList, ValueContainer, Option, IndicatorsContainer}}
                onSelectAll={this.handleSelectAll}
                isMulti={true}
                closeMenuOnSelect={this.props.closeMenuOnSelect}
                hideSelectedOptions={false}
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
                    }),
                    option: (base, state) => ({
                        ...base,
                        backgroundColor: 'transparent',
                        color: 'inherit'
                    }),
                    valueContainer: base => ({
                        ...base,
                        height: 34,
                        padding: '8px 8px',
                        display: '-webkit-box',
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
                        textOverflow: 'ellipsis',
                        textAlign: 'left'
                    }),
                    input: base => ({
                        ...base,
                        display: 'inherit',
                        marginTop: '-2px'
                    })
                }}
            />
            <AvFeedback>{this.props.messageRequire}</AvFeedback>
        </AvGroup>
        );
    }
}

CustomMultiSelectLocal.propTypes = {
    name: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    isRequired: PropTypes.bool.isRequired,
    messageRequire: PropTypes.string,
    options: PropTypes.array.isRequired,
    closeMenuOnSelect: PropTypes.bool.isRequired,
    handleItemSelectChange: PropTypes.func.isRequired,
    selectValue: PropTypes.any.isRequired,
    isDisabled: PropTypes.bool,
    isOnlyInputSelect: PropTypes.bool,
    autoFocus: PropTypes.bool
};

export default translate()(CustomMultiSelectLocal);
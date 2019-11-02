import React, { Component } from 'react';
import { Label } from 'reactstrap';
import { AvInput, AvFeedback, AvGroup } from 'availity-reactstrap-validation';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as commonActions from '../../actions/commonActions';
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

class CustomMultiSelect extends Component {
    constructor(props) {
        super(props);

        this.handleMenuScrollToBottom = this.handleMenuScrollToBottom.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleMenuOpen = this.handleMenuOpen.bind(this);
        this.handleMousedown = this.handleMousedown.bind(this);

        this.state = {
            optionsListAll: [],
            optionsList: [],
            param: "",
            offset: 10
        };
    }

    componentDidMount() {
        this.props.actions.getListCombobox("stream", this.props.moduleName, this.props.parentValue, this.props.isHasChildren, "", 0, "").then((response) => {
            let options = response.payload.data.map(item => {
                return {
                    value: item.itemId,
                    label: item.itemName,
                    code: item.itemCode || null,
                    subValue: item.itemValue || null
                }
            });
            const optionsList = [];
            const length = (this.state.offset > options.length) ? options.length : this.state.offset;
            for(let i = 0; i < length; i++){
                optionsList.push(options[i])
            }
            this.setState({
                optionsListAll: options,
                optionsList: optionsList
            });
        }).catch((error) => {
            console.error(error);
        });
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

    loadOptions() {
        this.props.actions.getListCombobox("stream", this.props.moduleName, this.props.parentValue, this.props.isHasChildren, this.state.param, this.state.offset, "").then((response) => {
            let options = response.payload.data.map(item => {
                return {
                    value: item.itemId,
                    label: item.itemName,
                    code: item.itemCode || null,
                    subValue: item.itemValue || null
                }
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
            this.loadOptions();
        });
    }

    handleInputChange(value) {
        this.setState({
            offset: 10,
            param: value
        }, () => {
            this.loadOptions();
        });
        return value;
    }

    handleMenuOpen() {
        if (this.props.parentValue !== undefined && this.props.parentValue !== "") {
            this.setState({
                optionsList: []
            }, () => {
                this.loadOptions();
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

    render() {
        const { t } = this.props;
        let valueInputHidden;
        let defaultValue = [...this.props.selectValue];
        if(defaultValue.length !== 0) {
            valueInputHidden = JSON.stringify(defaultValue);
        }
        defaultValue = this.setDefaultValue(this.state.optionsListAll, defaultValue);
        return (
        this.props.isOnlyInputSelect ?
        <AvGroup>
            <AvInput type={"hidden"} name={"custom-input-" + this.props.name} value={valueInputHidden || ""} placeholder={""} required={this.props.isRequired}/>
            <Select
                ref={el => (this.selectRef = el)}
                inputId={"custom-" + this.props.name}
                openMenuOnFocus={true}
                autoFocus={this.props.autoFocus}
                components={{MenuList, ValueContainer, Option}}
                isMulti={true}
                closeMenuOnSelect={this.props.closeMenuOnSelect}
                hideSelectedOptions={false}
                cacheOptions={true}
                defaultOptions={true}
                options={this.state.optionsList}
                onChange={this.props.handleItemSelectChange}
                onMenuScrollToBottom={this.handleMenuScrollToBottom}
                onInputChange={this.handleInputChange}
                onMenuOpen={this.handleMenuOpen}
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
                components={{MenuList, ValueContainer, Option}}
                isMulti={true}
                closeMenuOnSelect={this.props.closeMenuOnSelect}
                hideSelectedOptions={false}
                cacheOptions={true}
                defaultOptions={true}
                options={this.state.optionsList}
                onChange={this.props.handleItemSelectChange}
                onMenuScrollToBottom={this.handleMenuScrollToBottom}
                onInputChange={this.handleInputChange}
                onMenuOpen={this.handleMenuOpen}
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

CustomMultiSelect.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(translate()(CustomMultiSelect));
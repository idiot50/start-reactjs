import React, { Component } from 'react';
import { Label } from 'reactstrap';
import { AvInput, AvFeedback, AvGroup } from 'availity-reactstrap-validation';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import { renderRequired } from './Utils';

class CustomInputPopup extends Component {
    constructor(props) {
        super(props);

        this.handleKeyPress = this.handleKeyPress.bind(this);

        this.state = {

        };
    }

    handleKeyPress(e) {
        if (e.which === 13 || e.keyCode === 13) {
            e.preventDefault();
            if (this.props.handleDoubleClick) {
                this.props.handleDoubleClick();
            }
        }
    }

    render() {
        const { t } = this.props;
        const display = (this.props.value && this.props.value !== "") ? 'block' : 'none';
        const label = (this.props.value && this.props.value !== "") ?
            <span className="input-popup-control-label" title={this.props.value}>{this.props.value}</span>
            : <span className="input-popup-control-placeholder">{this.props.placeholder}</span>
        return (
        this.props.isOnlyInputSelect ?
        <AvGroup>
            <AvInput type={"hidden"} name={"custom-input-" + this.props.name} value={this.props.value || ""} placeholder={""} required={this.props.isRequired}/>
            <div tabIndex="0" className="input-popup-control" onKeyPress={this.props.isDisabled ? () => {} : this.handleKeyPress} onDoubleClick={this.props.isDisabled ? () => {} : this.props.handleDoubleClick}>
                {label}
                {this.props.isDisabled || this.props.isDisabledDelete ? null : 
                    <i className="fa fa-remove" style={{cursor: 'pointer', color: '#ccc', marginTop: '1px', display: display}} onClick={this.props.handleRemove} title={t("common:common.button.delete")}></i>
                }
                {this.props.isExtend ?
                    <i className={this.props.extendIcon} style={{cursor: 'pointer', color: '#ccc', marginTop: '1px', marginLeft: '8px'}} onClick={this.props.extendClick} title={this.props.extendTitle}></i>
                    : null
                }
            </div>
            <AvFeedback>{this.props.messageRequire}</AvFeedback>
        </AvGroup>
        :
        <AvGroup>
            <Label>{this.props.label}</Label>
            {this.props.isRequired ? renderRequired : null}
            <AvInput type={"hidden"} name={"custom-input-" + this.props.name} value={this.props.value || ""} placeholder={""} required={this.props.isRequired}/>
            <div tabIndex="0" className="input-popup-control" onKeyPress={this.props.isDisabled ? () => {} : this.handleKeyPress} onDoubleClick={this.props.isDisabled ? () => {} : this.props.handleDoubleClick}>
                {label}
                {this.props.isDisabled || this.props.isDisabledDelete ? null : 
                    <i className="fa fa-remove" style={{cursor: 'pointer', color: '#ccc', marginTop: '1px', display: display}} onClick={this.props.handleRemove} title={t("common:common.button.delete")}></i>
                }
                {this.props.isExtend ?
                    <i className={this.props.extendIcon} style={{cursor: 'pointer', color: '#ccc', marginTop: '1px', marginLeft: '8px'}} onClick={this.props.extendClick} title={this.props.extendTitle}></i>
                    : null
                }
            </div>
            <AvFeedback>{this.props.messageRequire}</AvFeedback>
        </AvGroup>
        );
    }
}

CustomInputPopup.propTypes = {
    name: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    isRequired: PropTypes.bool.isRequired,
    messageRequire: PropTypes.string,
    placeholder: PropTypes.string,
    handleDoubleClick: PropTypes.func.isRequired,
    handleRemove: PropTypes.func.isRequired,
    value: PropTypes.any,
    isDisabled: PropTypes.bool,
    isOnlyInputSelect: PropTypes.bool,
    isExtend: PropTypes.bool,
    extendTitle: PropTypes.string,
    extendIcon: PropTypes.string,
    extendClick: PropTypes.func,
    isDisabledDelete: PropTypes.bool,
};

export default translate()(CustomInputPopup);
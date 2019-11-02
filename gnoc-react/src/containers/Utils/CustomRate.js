import React, { Component } from 'react';
import { Label } from 'reactstrap';
import { AvInput, AvFeedback, AvGroup } from 'availity-reactstrap-validation';
import Rate from 'rc-rate';
import 'rc-rate/assets/index.css';
import Tooltip from 'rc-tooltip';
import 'rc-tooltip/assets/bootstrap_white.css';
import PropTypes from 'prop-types';
import { translate, Trans } from 'react-i18next';
import { renderRequired } from './Utils';

class CustomRate extends Component {
    constructor(props) {
        super(props);

        this.state = {
        };
    }

    renderText(node) {
        let label = <span></span>;
        switch (node) {
            case 0:
                label = <Trans i18nKey="common:common.rate.epicFail" />
                break;
            case 1:
                label = <Trans i18nKey="common:common.rate.poor" />
                break;
            case 2:
                label = <Trans i18nKey="common:common.rate.ok" />
                break;
            case 3:
                label = <Trans i18nKey="common:common.rate.good" />
                break;
            case 4:
                label = <Trans i18nKey="common:common.rate.excellent" />
                break;
            default:
                break;
        }
        return label;
    }

    render() {
        let valueInputHidden;
        if (this.props.value && this.props.value !== 0) {
            valueInputHidden = this.props.value;
        }
        return (
        <AvGroup>
            <Label>{this.props.label}</Label>
            {this.props.isRequired ? renderRequired : null}
            <AvInput type={"hidden"} name={"custom-input-" + this.props.name} value={valueInputHidden || ""} placeholder={""} required={this.props.isRequired}/>
            <div className="div-rc-rate">
                <Rate
                    defaultValue={this.props.value}
                    onChange={this.props.handleChange}
                    characterRender={(node, props) => (
                        <Tooltip placement="top" overlay={this.renderText(props.index)}>
                            {node}
                        </Tooltip>
                    )}
                    style={{  }}
                    disabled={this.props.isDisabled}
                    allowHalf={this.props.allowHalf}
                    autoFocus={this.props.autoFocus}
                />
            </div>
            <AvFeedback>{this.props.messageRequire}</AvFeedback>
        </AvGroup>
        );
    }
}

CustomRate.propTypes = {
    name: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    isRequired: PropTypes.bool.isRequired,
    messageRequire: PropTypes.string,
    value: PropTypes.number,
    handleChange: PropTypes.func.isRequired,
    isDisabled: PropTypes.bool,
    allowHalf: PropTypes.bool,
    autoFocus: PropTypes.bool
};

export default translate()(CustomRate);
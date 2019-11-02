import React, { Component } from 'react';
import { Label } from 'reactstrap';
import { AvInput, AvFeedback, AvGroup } from 'availity-reactstrap-validation';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import Switch from 'react-switch';
import { renderRequired } from './Utils';

class CustomAppSwitch extends Component {
    constructor(props) {
        super(props);

        this.handleKeydown = this.handleKeydown.bind(this);

        this.state = {
        };
    }

    componentDidMount() {
        try {
            document.getElementById("custom-" + this.props.name).addEventListener('keydown', this.handleKeydown);
        } catch (error) {
            console.error(error);
        }
    }

    componentWillUnmount() {
        try {
            document.getElementById("custom-" + this.props.name).removeEventListener('keydown', this.handleKeydown);
        } catch (error) {
            console.error(error);
        }
    }

    handleKeydown(event) {
        if (event.keyCode === 37) {
            this.props.handleChange(false);
        } else if (event.keyCode === 39) {
            this.props.handleChange(true);
        }
    }

    render() {
        let valueInputHidden;
        if (this.props.checked === true) {
            valueInputHidden = this.props.checked;
        }
        return (
        <AvGroup>
            <Label>{this.props.label}</Label>
            {this.props.isRequired ? renderRequired : null}
            <AvInput type={"hidden"} name={"custom-input-" + this.props.name} value={valueInputHidden || ""} placeholder={""} required={this.props.isRequired}/>
            <div className="">
                <Switch
                    ref={(el) => this.switchRef = el}
                    id={"custom-" + this.props.name}
                    className="react-switch mx-1"
                    disabled={this.props.isDisabled}
                    checked={this.props.checked}
                    onChange={this.props.handleChange}
                    onColor="#20a8d8"
                />
            </div>
            <AvFeedback>{this.props.messageRequire}</AvFeedback>
        </AvGroup>
        );
    }
}

CustomAppSwitch.propTypes = {
    name: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    isRequired: PropTypes.bool,
    messageRequire: PropTypes.string,
    checked: PropTypes.bool,
    handleChange: PropTypes.func,
    isDisabled: PropTypes.bool
};

export default translate()(CustomAppSwitch);
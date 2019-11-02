import React, { Component } from 'react';
import { Label } from 'reactstrap';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import Stepper from "react-stepper-horizontal";

class CustomReactStepperHorizontal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            
        };
    }

    render() {
        return (
            <div className="stepper-container">
                <Label>{this.props.name}</Label>
                <Stepper
                    steps={this.props.steps}
                    activeStep={this.props.activeStep}
                    circleTop={0}
                    circleFontSize={0}
                    titleTop={0}
                    titleFontSize={14}
                    activeColor={"#20a8d8"}
                    completeColor={"#91d8ed"}
                    defaultColor={"#c8ced3"}
                    defaultTitleColor={"#c8ced3"}
                    completeTitleColor={"#91d8ed"}
                    activeTitleColor={"#20a8d8"}
                    size={20}
                />
            </div>
        );
    }
}

CustomReactStepperHorizontal.propTypes = {
    name: PropTypes.string.isRequired,
    steps: PropTypes.array.isRequired,
    activeStep: PropTypes.number.isRequired
};

export default translate()(CustomReactStepperHorizontal);
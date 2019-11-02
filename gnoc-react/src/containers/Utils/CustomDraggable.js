import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Draggable from 'react-draggable';

class CustomDraggable extends Component {
    constructor(props) {
        super(props);

        this.onStart = this.onStart.bind(this);
        this.onStop = this.onStop.bind(this);

        this.state = {
            activeDrags: 0
        };
    }

    onStart() {
        let activeDrags = this.state.activeDrags;
        this.setState({
            activeDrags: ++activeDrags,
        });
    }

    onStop() {
        let activeDrags = this.state.activeDrags;
        this.setState({
            activeDrags: --activeDrags,
        });
    }
    render() {
        const dragHandlers = { onStart: this.onStart, onStop: this.onStop };
        return (
            <Draggable cancel="p" {...dragHandlers}>
                {this.props.children}
            </Draggable>
        );
    }
}

CustomDraggable.propTypes = {
    children: PropTypes.element
};

export default CustomDraggable;
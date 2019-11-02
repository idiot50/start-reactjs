import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    Marker,
    InfoWindow
  } from "react-google-maps";

class MarkerWithInfoWindow extends Component {
    constructor(props) {
        super(props);

        this.onToggleOpen = this.onToggleOpen.bind(this);

        this.state = {
            isOpen: false
        }
    }

    onToggleOpen() {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }

    render() {
        return (<Marker
            key={this.props.keyMarker}
            position={this.props.positionMarker}
            onClick={this.onToggleOpen}>
            {this.state.isOpen && <InfoWindow onCloseClick={this.onToggleOpen}>
                <div>{this.props.contentInfoWindow}</div>
            </InfoWindow>}
        </Marker>)
    }
}

MarkerWithInfoWindow.propTypes = {
    keyMarker: PropTypes.string.isRequired,
    positionMarker: PropTypes.object.isRequired,
    contentInfoWindow: PropTypes.string.isRequired
};

export default MarkerWithInfoWindow;

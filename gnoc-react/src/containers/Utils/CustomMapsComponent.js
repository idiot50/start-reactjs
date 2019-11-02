import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose, withProps, withHandlers } from "recompose";
import {
    withScriptjs,
    withGoogleMap,
    GoogleMap
} from "react-google-maps";
import { MarkerClusterer } from "react-google-maps/lib/components/addons/MarkerClusterer";
import Config from '../../config';
import { translate } from 'react-i18next';
import dateformat from "dateformat";
import MarkerWithInfoWindow from "./MarkerWithInfoWindow";

class CustomMapsComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            
        };
    }

    render() {
        const { t } = this.props;
        let latitude = Config.coords.latitude;
        let longitude = Config.coords.longitude;
        try {
            latitude = JSON.parse(sessionStorage.getItem('coords_center')).latitude;
            longitude = JSON.parse(sessionStorage.getItem('coords_center')).longitude;
        } catch (error) {
            console.log(error);
        }
        return (
            <GoogleMap
            ref={(map) => {
                const bounds = new window.google.maps.LatLngBounds();
                this.props.listMarker.map((marker, idx) => {
                    bounds.extend(new window.google.maps.LatLng(
                        marker.latitude,
                        marker.longitude
                    ));
                });
                if(map) {
                    map.fitBounds(bounds);
                }
            }}
            defaultZoom={8}
            defaultCenter={{ lat: latitude, lng: longitude }}
            options={{ gestureHandling: 'greedy' }}>
                <MarkerClusterer
                onClick={this.props.onMarkerClustererClick}
                averageCenter
                enableRetinaIcons
                gridSize={60}
                >
                    {this.props.listMarker.map((marker, idx) => {
                        return <MarkerWithInfoWindow key={'markerWithInfoWindow' + marker.usersGeolocationId}
                            keyMarker={'marker' + marker.usersGeolocationId}
                            positionMarker={{ lat: parseFloat(marker.latitude), lng: parseFloat(marker.longitude) }}
                            contentInfoWindow={t('common:common.label.timeLogin') + ': ' + dateformat(marker.createdTime, "HH:MM:ss dd-mm-yyyy")} />;
                    },
                    )}
                </MarkerClusterer>
            </GoogleMap>
        );
    }
}

CustomMapsComponent.propTypes = {
    listMarker: PropTypes.array.isRequired
};

export default compose(
    withProps({
        googleMapURL: Config.apiUrlGoogleMaps,
        loadingElement: <div style={{ height: `100%` }} />,
        containerElement: <div style={{ height: `500px`, width: `100%` }} />,
        mapElement: <div style={{ height: `100%` }} />
    }),
    withHandlers({
        onMarkerClustererClick: () => (markerClusterer) => {
            const clickedMarkers = markerClusterer.getMarkers();
            console.log(`Current clicked markers length: ${clickedMarkers.length}`);
            console.log(clickedMarkers);
        },
    }),
    withScriptjs,
    withGoogleMap
)(translate()(CustomMapsComponent));

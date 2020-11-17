import React, { Fragment, useState } from 'react';
import {
  Map,
  InfoWindow,
  Marker,
  GoogleApiWrapper,
  Polyline,
} from 'google-maps-react';
import { gmapAPIKey } from '../../keys';

function GMap({
  // props from parent
  lines,
  markers,

  // props from google-maps-react
  loading,
  google,
  map,
}) {
  const [showingInfoWindow, setShowingInfoWindow] = useState(false);
  const [activeMarker, setActiveMarker] = useState({});
  const [selectedPlace, setSelectedPlace] = useState({});

  const onMarkerClick = (props, marker, e) => {
    setSelectedPlace(props);
    setActiveMarker(marker);
    setShowingInfoWindow(true);
  };

  const onMapClicked = (props) => {
    if (showingInfoWindow) {
      setShowingInfoWindow(false);
      setActiveMarker(null);
    }
  };

  // sets google map init center
  const [initCenter] = useState({
    lat: markers[0].lat,
    lng: markers[0].lng,
  });

  return (
    <Fragment>
      {loading ? (
        <div>loading</div>
      ) : (
        <Map
          onClick={onMapClicked}
          zoom={10}
          style={{ width: '100%', height: '100%' }}
          className={'map'}
          google={google}
          initialCenter={{
            lat: initCenter.lat,
            lng: initCenter.lng,
          }}
        >
          <Polyline
            path={lines}
            strokeColor='#0000FF'
            strokeOpacity={0.8}
            strokeWeight={2}
          />
          {markers.map((marker, index) => (
            <Marker
              onClick={onMarkerClick}
              key={index}
              title={marker.title}
              infoIsPresent={marker.infoIsPresent}
              position={{
                lat: marker.lat,
                lng: marker.lng,
              }}
            />
          ))}

          <InfoWindow marker={activeMarker} visible={showingInfoWindow}>
            <div>
              {!selectedPlace.infoIsPresent ? (
                <h1>Add some info</h1>
              ) : (
                <Fragment>
                  <h1>{selectedPlace.title}</h1>
                  {/* <p>{selectedPlace.info}</p> */}
                </Fragment>
              )}
            </div>
          </InfoWindow>
        </Map>
      )}
    </Fragment>
  );
}

GMap.propTypes = {};

export default GoogleApiWrapper({
  apiKey: gmapAPIKey,
})(GMap);

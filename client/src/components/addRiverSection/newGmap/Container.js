import React, { Fragment, useState } from 'react';
import {
  Map,
  InfoWindow,
  Marker,
  GoogleApiWrapper,
  Polyline,
} from 'google-maps-react';
import { gmapAPIKey } from '../../../keys';

function Container({
  // functions
  onMapClick,
  mouseoverMarker,
  onMarkerClick,
  onMapClickInfo,

  // props from parent
  lines,
  markers,
  showingInfoWindow,
  selectedPlace,
  activeMarker,

  // props from google-maps-react
  loading,
  google,
  map,
}) {
  // sets google map init center
  const [initCenter] = useState({
    lat: 40.854885,
    lng: -88.081807,
  });

  return (
    <Fragment>
      {loading ? (
        <div>loading</div>
      ) : (
        <Map
          onClick={onMapClick}
          zoom={4}
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
              key={index}
              title={marker.title}
              infoIsPresent={marker.infoIsPresent}
              position={{
                lat: marker.lat,
                lng: marker.lng,
              }}
              // onMouseover={mouseoverMarker}
              onClick={onMarkerClick}
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

Container.propTypes = {};

export default GoogleApiWrapper({
  apiKey: gmapAPIKey,
})(Container);

import React, { Fragment, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Container from './Container';
import SaveModal from './SaveModal';
import NoSaveModal from './NoSaveModal';

// import { Button, Modal } from 'react-bootstrap';

import { saveMap, getRiverById } from '../../../actions/rivers';
function CreateMap({
  saveMap,
  getRiverById,
  match,
  rivers: { riverLoading, singleRiver },
}) {
  // map state
  const [markers, setMarkers] = useState([]);
  const [lines, setLines] = useState([]);
  const [lineDraw, setLineDraw] = useState(false);
  const [placeMarker, setPlaceMarker] = useState(false);

  // modal state
  const [saveModalShow, setSaveModalShow] = useState(false);
  const [noSaveModalShow, setNoSaveModalShow] = useState(false);

  // infobox state
  const [showingInfoWindow, setShowingInfoWindow] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState({});
  const [activeMarker, setActiveMarker] = useState({});

  useEffect(() => {
    getRiverById(match.params.id);
  }, [getRiverById, match.params.id]);

  // place marker button
  const placeMarkerButton = () => {
    setLineDraw(false);
    setPlaceMarker(true);
  };

  // draw line button
  const drawLineButton = () => {
    setLineDraw(true);
    setPlaceMarker(false);
  };

  // delete line
  const deleteLine = (index) => {
    let choosenMarkerLat = lines[index].lat;
    let choosenMakerLng = lines[index].lng;

    let updatedArray = lines.filter(
      (line) => line.lng !== choosenMakerLng && line.lat !== choosenMarkerLat
    );

    setLines(updatedArray);
  };

  // delete marker
  const deleteMarker = (index) => {
    let choosenMarkerLat = markers[index].lat;
    let choosenMakerLng = markers[index].lng;

    let updatedArray = markers.filter(
      (marker) =>
        marker.lng !== choosenMakerLng && marker.lat !== choosenMarkerLat
    );

    setMarkers(updatedArray);
  };

  // on map click
  //  - Add button
  //  - draw line
  //  - set info window state
  const onMapClick = (mapProps, map, event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    setShowingInfoWindow(false);
    setActiveMarker(null);

    // draw line
    if (lineDraw) {
      setLines([...lines, { lat, lng }]);
    }

    // place marker
    if (placeMarker) {
      setMarkers([
        ...markers,
        // CREATE MARKER OBJECT
        {
          lat,
          lng,
          showInfoBox: false,
          infoIsPresent: false,
          color: false,
          title: null,
          info: null,
        },
      ]);
    }
  };

  // on infoBox Change
  const onInfoBoxChange = (e, markerLat, markerLng) => {
    for (let i = 0; i < markers.length; i++) {
      if (markers[i].lat === markerLat && markers[i].lng === markerLng) {
        markers[i].title = e.target.value;
        markers[i].infoIsPresent = true;
        markers.length >= 0 && setMarkers([...markers]);
      }
    }
  };

  // on infoBox Submit
  const onInfoBoxSubmit = (e, markerLat, markerLng) => {
    e.preventDefault();
    setMarkers([...markers]);
    for (let i = 0; i < markers.length; i++) {
      if (markers[i].lat === markerLat && markers[i].lng === markerLng) {
        markers[i].showInfoBox = false;
        setMarkers([...markers]);
      }
    }
  };

  // toggle add info button
  const toggleAddInfo = (markerLat, markerLng) => {
    for (let i = 0; i < markers.length; i++) {
      if (markers[i].lat === markerLat && markers[i].lng === markerLng) {
        markers[i].showInfoBox = true;
        setMarkers([...markers]);
      }
    }
  };

  // toggle div color
  const mouseoverMarker = (props, marker, event) => {
    // console.log(event.latLng.lat());
    // console.log(event.latLng.lng());

    let lat = event.latLng.lat();
    let lng = event.latLng.lng();

    for (let i = 0; i < markers.length; i++) {
      if (markers[i].lat === lat && markers[i].lng === lng) {
        console.log(markers[i].color);

        markers[i].color = true;
        console.log(markers[i].color);
        console.log(...markers);
        setMarkers([...markers]);

        setTimeout(() => {
          markers[i].color = false;
          setMarkers([...markers]);
        }, 3000);
      }
    }
  };

  //  marker click
  const onMarkerClick = (props, marker, e) => {
    setSelectedPlace(props);
    setActiveMarker(marker);
    setShowingInfoWindow(true);
  };

  // map click
  const onMapClickInfo = (props) => {
    setShowingInfoWindow(false);
    setActiveMarker(null);
  };

  const onSave = () => {
    if (markers.length > 0) {
      saveMap({ lines, markers }, match.params.id);
      setSaveModalShow(true);
    } else {
      setNoSaveModalShow(true);
    }
  };

  return (
    <div>
      <SaveModal show={saveModalShow} onHide={() => setSaveModalShow(false)} />
      <NoSaveModal
        show={noSaveModalShow}
        onHide={() => setNoSaveModalShow(false)}
      />
      <div className='container-fluid' style={{ padding: 0 }}>
        <div className='row no-gutters'>
          <div className='col-2'>
            <button
              onClick={(e) => {
                onSave();
              }}
              className='btn btn-block btn-success'
            >
              Save
            </button>
            <div className=''>
              <div
                className='overflow-auto bg-light'
                style={{ maxWidth: '30vw', height: '84vh' }}
              >
                {markers.map((marker, index) => (
                  <li
                    key={index}
                    className='list-group-item list-group-item-danger'
                  >
                    <button
                      onClick={(e) => {
                        deleteMarker(index);
                      }}
                      type='button'
                      className='close'
                      aria-label='Close'
                    >
                      <span aria-hidden='true'>&times;</span>
                    </button>
                    <p> {`Lat: ${marker.lat.toString().substr(0, 7)}`}</p>
                    <p> {`Lng: ${marker.lng.toString().substr(0, 7)}`}</p>
                    {!marker.showInfoBox ? (
                      <Fragment>
                        <button
                          onClick={(e) => toggleAddInfo(marker.lat, marker.lng)}
                          className='btn btn-dark'
                        >
                          Add info
                        </button>
                        <p>{marker.title}</p>
                      </Fragment>
                    ) : (
                      <Fragment>
                        {' '}
                        <form
                          onSubmit={(e) =>
                            onInfoBoxSubmit(e, marker.lat, marker.lng)
                          }
                        >
                          <button
                            // onClick={(e) =>
                            //   toggleAddInfo(marker.lat, marker.lng)
                            // }
                            className='btn btn-dark'
                          >
                            Add
                          </button>
                          <div className='form-group'>
                            <textarea
                              onChange={(e) =>
                                onInfoBoxChange(e, marker.lat, marker.lng)
                              }
                              // addedInfo={marker.title}
                              value={marker.title}
                              className='form-control'
                              id='exampleFormControlTextarea1'
                              rows='3'
                            ></textarea>
                          </div>
                        </form>{' '}
                      </Fragment>
                    )}
                  </li>
                ))}
                {lines.map((line, index) => (
                  <li
                    key={index}
                    className='list-group-item list-group-item-primary'
                  >
                    <button
                      onClick={(e) => {
                        deleteLine(index);
                      }}
                      type='button'
                      className='close'
                      aria-label='Close'
                    >
                      <span aria-hidden='true'>&times;</span>
                    </button>
                    {index}
                  </li>
                ))}
              </div>
            </div>
          </div>
          <div className='col-10'>
            <div
              style={{
                justifyContent: 'center',
              }}
              className='btn-group btn-block btn-group-toggle'
              data-toggle='buttons'
            >
              <label className='btn btn-primary'>
                <input
                  type='radio'
                  name='drawLine'
                  id='option2'
                  autoComplete='off'
                  onClick={drawLineButton}
                />{' '}
                Draw Line
              </label>
              <label className='btn btn-danger'>
                <input
                  type='radio'
                  name='addMarker'
                  id='option3'
                  autoComplete='off'
                  onClick={placeMarkerButton}
                />{' '}
                Add Marker
              </label>
            </div>
            <div style={{ position: 'relative', height: '84vh' }}>
              <Container
                // functions
                onMapClick={onMapClick}
                onMarkerClick={onMarkerClick}
                mouseoverMarker={mouseoverMarker}
                onMapClickInfo={onMapClickInfo}
                // props
                lines={lines}
                markers={markers}
                showingInfoWindow={showingInfoWindow}
                selectedPlace={selectedPlace}
                activeMarker={activeMarker}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  rivers: state.rivers,
});

CreateMap.propTypes = {};

export default connect(mapStateToProps, { saveMap, getRiverById })(
  withRouter(CreateMap)
);

import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import useSwr from 'swr';
import GoogleMapReact from 'google-map-react';
import useSupercluster from 'use-supercluster';
import { gmapAPIKey } from '../../keys';

const fetcher = (...args) => fetch(...args).then((response) => response.json());

const Marker = ({ children }) => children;

function ClusterMap() {
  const mapRef = useRef();
  const [bounds, setBounds] = useState(null);
  const [zoom, setZoom] = useState(10);

  // 2) load and format data
  const url = '/api/river/get-all';
  const { data, error } = useSwr(url, { fetcher });
  const rivers = data && !error ? data : [];
  const points = rivers.map((river, i) => ({
    type: 'Feature',
    properties: {
      cluster: false,
      crimeId: i,
      river: river.river,
      section: river.section,
      id: river._id,
    },
    geometry: {
      type: 'Point',
      coordinates: [river.gMap[0].markers[0].lng, river.gMap[0].markers[0].lat],
    },
  }));

  // 3) get clusters
  const { clusters, supercluster } = useSupercluster({
    points,
    bounds,
    zoom,
    options: { radius: 75, maxZoom: 20 },
  });

  // 4) render map

  return (
    <div style={{ height: '90vh', width: '100%' }}>
      <GoogleMapReact
        bootstrapURLKeys={{ key: gmapAPIKey }}
        defaultCenter={{ lat: 35.27328452482669, lng: -83.6778420452473 }}
        defaultZoom={4}
        yesIWantToUseGoogleMapApiInternals
        onGoogleApiLoaded={({ map }) => {
          mapRef.current = map;
        }}
        onChange={({ zoom, bounds }) => {
          setZoom(zoom);
          setBounds([
            bounds.nw.lng,
            bounds.se.lat,
            bounds.se.lng,
            bounds.nw.lat,
          ]);
        }}
      >
        {clusters.map((cluster) => {
          const [longitude, latitude] = cluster.geometry.coordinates;
          const {
            cluster: isCluster,
            point_count: pointCount,
          } = cluster.properties;

          if (isCluster) {
            return (
              <Marker
                key={`cluster-${cluster.id}`}
                lat={latitude}
                lng={longitude}
              >
                <div
                  className='cluster-marker'
                  style={{
                    width: `${10 + (pointCount / points.length) * 70}px`,
                    height: `${10 + (pointCount / points.length) * 70}px`,
                  }}
                  onClick={() => {
                    const expansionZoom = Math.min(
                      supercluster.getClusterExpansionZoom(cluster.id),
                      20
                    );
                    mapRef.current.setZoom(expansionZoom);
                    mapRef.current.panTo({ lat: latitude, lng: longitude });
                  }}
                >
                  {pointCount}
                </div>
              </Marker>
            );
          }

          return (
            <Marker
              key={`crime-${cluster.properties.crimeId}`}
              lat={latitude}
              lng={longitude}
            >
              <div>
                <img
                  alt='icon'
                  src={require('../../assets/iconMap.svg')}
                  height=''
                  width='30px'
                />

                <Link to={`rivers/${cluster.properties.id}`}>
                  {`${cluster.properties.river}${cluster.properties.section}`}
                </Link>
              </div>
            </Marker>
          );
        })}
      </GoogleMapReact>
    </div>
  );
}

export default ClusterMap;

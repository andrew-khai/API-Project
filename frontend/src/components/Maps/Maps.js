import React from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '500px',
};

// const center = {
//   lat: 38.9072,
//   lng: 77.0369,
// };

const Maps = ({ apiKey, spot }) => {

  // console.log(spot)

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: apiKey,
  });

  const { lat, lng } = spot

  const center = {
    lat: +lat,
    lng: +lng
  }

  // console.log('center', center)

  return (
    <>
      {isLoaded && (
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={10}
        >
          <Marker position={center} />
        </GoogleMap>

      )}
    </>
  );
};

export default React.memo(Maps);

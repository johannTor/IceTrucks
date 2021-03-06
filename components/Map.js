import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  GoogleMap,
  useLoadScript,
  Marker,
  InfoWindow,
} from '@react-google-maps/api';
import TagList from '../components/TagList';
// import tmpCars from '../resources/tmpCars';
import mapStyles from '../resources/mapStyles';
import { set } from 'mongoose';
const libraries = ['places'];
import styles from '../styles/MapModal.module.css'
import Image from 'next/image'
// In order to allow truck owners to mark their location we need to use geolocation to use the current location of the browser OR
// use-places-autocomplete in order to be able to select an address (possibly)

export default function Map({ staticTruck }) {
  const [trucks, setTrucks] = useState(staticTruck);
  const [selected, setSelected] = useState(null);
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_MAP_KEY,
    libraries,
    // Enable libraries here such as places to use them.
  });

  // Logs out the lat/lng at the click location
  const handleMapClick = useCallback((event) => {
    console.log('lat: ' + event.latLng.lat() + ', lng: ' + event.latLng.lng());
  }, []);

  const mapRef = useRef();
  // We useRef when we want to retain state without causing re-renders.
  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);

  // Possibly use in useEffect
  if (loadError) return 'Error loading maps...';
  if (!isLoaded) return 'Loading Maps';

  const mapContainerStyle = {
    width: '100%',
    height: '100%',
  };

  const center = {
    // Reykjavik
    lat: 64.126518,
    lng: -21.817438,
  };

  const options = {
    styles: mapStyles,
    disableDefaultUI: true,
    zoomControl: true,
  };

  // When a truck on the map is clicked, set the selected truck
  const handleTruckClick = (truck) => {
    setSelected(truck);
  };

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      zoom={8}
      center={center}
      options={options}
      onLoad={onMapLoad}
      onClick={handleMapClick}
    >
      {/* To change the marker style add the icon property to the Marker component in the map function (create a svg and control the size) */}
      {/* {markers.map((marker, index) => <Marker key={index} position={{lat: marker.lat, lng: marker.lng}} icon={{url: '/redMarker.svg'}}/>)} */}
      {trucks.map((truck, index) => { 
        if(truck.visible) {
        const pos =
          typeof truck.location === 'object'
            ? {
                lat: parseFloat(truck.location.lat),
                lng: parseFloat(truck.location.lng),
              }
            : { lat: 50, lng: -18 };
          return (
            <Marker
              key={truck._id}
              position={pos}
              onClick={() => handleTruckClick(truck)}
              icon={{ url: '/redFillMarker.svg' }}
            />
          );
        }
      })}
      {selected ? (
        // ToDo: Style the InfoWindow or maybe create our own modal
        <InfoWindow
        
          position={{
            lat: parseFloat(selected.location.lat),
            lng: parseFloat(selected.location.lng),
          }}
          onCloseClick={() => setSelected(null)}
        >
          <div className={styles.modalContainer}>
            <Image src="/tmpTruck.svg" width={150} height={70}></Image>
            <h2 className={styles.nameTitle}>{selected.name}</h2>
            <p className={styles.text}>{selected.description}</p>
            {selected.tags.length ? <TagList tags={selected.tags} /> : null}
          </div>
        </InfoWindow>
      ) : null}
    </GoogleMap>
  );
}

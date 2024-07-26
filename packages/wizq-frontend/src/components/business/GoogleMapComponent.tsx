import React, { useRef, useState, useEffect } from 'react';
import Image from 'next/image';

import { DrawingManager, GoogleMap, Polygon, Autocomplete } from '@react-google-maps/api';
import SearchLocationResult from './SearchLocationResult';

import DeleteIcon from '../../assets/images/remove.png';
import GpsIcon from '../../assets/icons/Icons=Gps.svg';
import CloseIcon from '../../assets/icons/Icons=Close.svg';
import { Option } from '../../types';
import { errorToast } from '../../lib/toast';
import useWidth from '../../utils/useWidth';

export type TypePosition = {
  lat: number;
  lng: number;
};

interface GoogleMapComponentProps {
  showMap: boolean;
  center: TypePosition;
  setCenter: React.Dispatch<React.SetStateAction<TypePosition>>;
  coords: GeolocationCoordinates;
  isGeolocationAvailable: boolean;
  isGeolocationEnabled: boolean;
  setMapResult: React.Dispatch<React.SetStateAction<Option[]>>;
}

const polygonOptions = {
  fillOpacity: 0.3,
  fillColor: '#ff0000',
  strokeColor: '#ff0000',
  strokeWeight: 2,
  draggable: true,
  editable: true,
};

export default function GoogleMapComponent({
  showMap,
  center,
  setCenter,
  coords,
  isGeolocationAvailable,
  isGeolocationEnabled,
  setMapResult,
}: GoogleMapComponentProps) {
  const windowWidth = useWidth(1024);

  const mapRef = useRef<google.maps.Map>();
  const polygonRefs = useRef<google.maps.Polygon[]>([]);
  const activePolygonIndex = useRef<number>();
  const drawingManagerRef = useRef<google.maps.drawing.DrawingManager>();
  const autocompleteRef = useRef<google.maps.places.Autocomplete>();

  const [polygons, setPolygons] = useState<TypePosition[][]>([]);
  const [searchValue, setSearchValue] = useState<string>('');
  const [draw, setDraw] = useState<boolean>(false);
  const [showDelete, setShowDelete] = useState<boolean>(false);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [searchResult, setSearchResult] = useState<google.maps.GeocoderResult[][]>([]);
  const [data, setData] = useState<Option[]>([]);

  const drawingManagerOptions = {
    polygonOptions,
    drawingControl: draw,
    drawingControlOptions: {
      position: windowWidth.status
        ? window.google?.maps?.ControlPosition?.TOP_RIGHT
        : window.google?.maps?.ControlPosition?.RIGHT_CENTER,
      drawingModes: [window.google?.maps?.drawing?.OverlayType?.POLYGON],
    },
  };

  useEffect(() => {
    setPolygons([]);
    setSearchValue('');
    setDraw(false);
    setShowDelete(false);
    setShowResult(false);
    setSearchResult([]);

    if (!isGeolocationAvailable) {
      errorToast('Your browser does not support Geolocation');
      return;
    }

    if (!isGeolocationEnabled) {
      errorToast('Geolocation is not enabled');
      return;
    }

    if (coords) {
      setCenter({
        lat: coords?.latitude,
        lng: coords?.longitude,
      });
    } else {
      setCenter({
        lat: 40.7569545,
        lng: -73.990494,
      });
    }
  }, [showMap]);

  const onLoadMap = (map: google.maps.Map) => {
    mapRef.current = map;
  };

  const onLoadDrawingManager = (drawingManager: google.maps.drawing.DrawingManager) => {
    drawingManagerRef.current = drawingManager;
  };

  const onOverlayComplete = (overlayEvent: any) => {
    setSearchResult([]);
    setData([]);
    drawingManagerRef.current.setDrawingMode(null);
    setShowResult(true);

    if (overlayEvent.type === window.google.maps.drawing.OverlayType.POLYGON) {
      const newPolygon = overlayEvent.overlay
        .getPath()
        .getArray()
        .map((latLng: google.maps.LatLng) => ({ lat: latLng.lat(), lng: latLng.lng() }));

      const geocoder = new google.maps.Geocoder();

      newPolygon.filter((rs: TypePosition) => {
        geocoder.geocode(
          {
            location: rs,
          },
          (results, status) => {
            if (status === 'OK') {
              setSearchResult((prevRes) => [...prevRes, results]);
            }
          }
        );
      });

      const startPoint = newPolygon[0];
      newPolygon.push(startPoint);
      overlayEvent.overlay?.setMap(null);
      setPolygons([newPolygon]);
    }
  };

  const onLoadPolygon = (polygon: google.maps.Polygon, index: number) => {
    polygonRefs.current[index] = polygon;
  };

  const onClickPolygon = (index: number) => {
    activePolygonIndex.current = index;
  };

  const onEditPolygon = (index: number) => {
    setSearchResult([]);
    setData([]);
    setShowResult(true);
    const polygonRef = polygonRefs.current[index];

    if (polygonRef) {
      const coordinates = polygonRef
        .getPath()
        .getArray()
        .map((latLng) => ({ lat: latLng.lat(), lng: latLng.lng() }));

      const geocoder = new google.maps.Geocoder();

      coordinates.filter((rs: TypePosition) => {
        geocoder.geocode(
          {
            location: rs,
          },
          (results, status) => {
            if (status === 'OK') {
              setSearchResult((prevRes) => [...prevRes, results]);
            }
          }
        );
      });

      const allPolygons = [...polygons];
      allPolygons[index] = coordinates;
      setPolygons(allPolygons);
    }
  };

  const onDeleteDrawing = () => {
    setPolygons(polygons.filter((_, index) => index !== activePolygonIndex.current));
    setSearchResult([]);
  };

  const onLoadAutocomplete = (autocomplete: google.maps.places.Autocomplete) => {
    autocompleteRef.current = autocomplete;
  };

  const onPlaceChanged = () => {
    const { geometry, formatted_address } = autocompleteRef.current.getPlace();

    if (!formatted_address) {
      errorToast('Please enter the correct address format.');
      return;
    }

    const bounds = new window.google.maps.LatLngBounds();

    if (geometry.viewport) {
      bounds.union(geometry.viewport);
    } else {
      bounds.extend(geometry.location);
    }

    mapRef.current.fitBounds(bounds);

    setPolygons([]);
    setSearchResult([]);
    setSearchValue(formatted_address);
  };

  const handleChangeValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const handleDraw = () => {
    setDraw(!draw);
    setShowDelete(!showDelete);
  };

  return (
    <div className={`w-full ${showMap ? 'h-[500px]' : 'h-0'} mt-7 relative`}>
      {showMap && (
        <div
          className={`${
            windowWidth.status ? 'w-6 h-6' : 'w-7 h-7'
          } flex items-center justify-center bg-[#017EFF] cursor-pointer absolute z-[1] ${
            windowWidth.status ? 'top-[5px] right-[5px]' : 'top-1/2 right-[5px] mt-[-14px]'
          } ${draw ? (windowWidth.status ? 'translate-x-[-72px]' : 'mt-[-44px] right-[33px]') : ''}`}
          onClick={handleDraw}
        >
          {!draw ? <GpsIcon /> : <CloseIcon />}
        </div>
      )}

      {drawingManagerRef.current && showDelete && (
        <Image
          className={`absolute cursor-pointer ${
            windowWidth.status ? 'top-[5px] right-[53px]' : 'top-1/2 right-[5px] mt-[-44px]'
          } bg-white z-[1]`}
          src={DeleteIcon}
          width={windowWidth.status ? 24 : 28}
          height={windowWidth.status ? 24 : 28}
          alt=""
          onClick={onDeleteDrawing}
        />
      )}

      {showResult && (
        <div className="absolute z-[1] bg-white w-[240px] top-[60px] bottom-[15px] left-[5px]">
          <SearchLocationResult
            searchResult={searchResult}
            setMapResult={setMapResult}
            data={data}
            setData={setData}
            setShowResult={setShowResult}
          />
        </div>
      )}

      <GoogleMap
        zoom={6}
        center={center}
        onLoad={onLoadMap}
        onTilesLoaded={() => setCenter(null)}
        mapContainerClassName="w-full h-full"
        options={{
          fullscreenControl: false,
          streetViewControl: false,
          mapTypeControl: false,
        }}
      >
        <DrawingManager
          onLoad={onLoadDrawingManager}
          onOverlayComplete={onOverlayComplete}
          options={drawingManagerOptions}
        />

        {polygons.map((iterator, index) => (
          <Polygon
            key={index}
            onLoad={(event) => onLoadPolygon(event, index)}
            onMouseDown={() => onClickPolygon(index)}
            onMouseUp={() => onEditPolygon(index)}
            onDragEnd={() => onEditPolygon(index)}
            options={polygonOptions}
            paths={iterator}
            draggable
            editable
          />
        ))}

        <Autocomplete onLoad={onLoadAutocomplete} onPlaceChanged={onPlaceChanged}>
          <input
            type="text"
            placeholder="Search Location"
            className="w-60 h-9 rounded absolute top-[5px] left-[5px] px-3 outline-none shadow-lg"
            value={searchValue}
            onChange={handleChangeValue}
          />
        </Autocomplete>
      </GoogleMap>
    </div>
  );
}

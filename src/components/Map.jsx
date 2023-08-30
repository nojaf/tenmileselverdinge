import React, { useRef, useState } from "react";
import Map, { Layer, Marker, Source } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useCopyToClipboard } from "usehooks-ts";

const accessToken =
  "pk.eyJ1Ijoibm9qYWYiLCJhIjoiY2p6eHV4ODkwMWNoaTNidXRqeGlrb2JpMSJ9.x6fTQsfCfGMKwxpdKxjhMQ";

const markers = [
  {
    lat: 50.881292321721105,
    lng: 2.81596133678334,
    route: "both",
    description: "Den Elver",
    icon: "🏁",
  },
  {
    lat: 50.878142749359164,
    lng: 2.813619642260984,
    route: "both",
    description: "Hospitaalstraat & Vlamertingestraat",
  },
  {
    lat: 50.87398821587512,
    lng: 2.80282677413475,
    route: "both",
    description: "Hospitaalstraat richting serres",
  },
  {
    lat: 50.876219216808,
    lng: 2.798493329215011,
    route: "both",
    description: "Aardeweg & Gasthuisstraat",
  },
  {
    lat: 50.873873841197465,
    lng: 2.7941751235351737,
    route: "both",
    description: "Gasthuisstraat & Sint-Pietersstraat",
  },
  {
    lat: 50.87097489045763,
    lng: 2.7901427918828006,
    route: "10miles",
  },
  {
    lat: 50.86814782347449,
    lng: 2.787944249301347,
    route: "10miles",
  },
  {
    lat: 50.86642999979452,
    lng: 2.7891453402431807,
    route: "10miles",
  },
  {
    lat: 50.86612497185766,
    lng: 2.7862050766370317,
    route: "10miles",
  },
  {
    lat: 50.86663822721144,
    lng: 2.7857131918010793,
    route: "both",
    description: "Sint-Pietersstraat & Plankenweg",
  },
  {
    lat: 50.86874147124411,
    lng: 2.782457565160996,
    route: "10miles",
    description: "Plankenweg tweede kruispunt",
  },
  {
    lat: 50.86766110355788,
    lng: 2.7842202482207483,
    route: "8km",
    description: "Plankenweg eerste kruispunt",
  },
  {
    lat: 50.868991805184635,
    lng: 2.7854885257060573,
    route: "8km",

    description: "Hoek weide bos",
  },
  {
    lat: 50.86988388852464,
    lng: 2.7838349437545844,
    route: "both",

    description: "Andere hoek weide bos",
  },
  {
    lat: 50.87266859479061,
    lng: 2.7863804461975974,
    route: "both",
  },
  {
    lat: 50.87494402353525,
    lng: 2.7864849287620927,
    route: "both",
  },
  {
    lat: 50.87632798392019,
    lng: 2.790304463506857,
    route: "both",

    description: "De Vuile Seule",
  },
  {
    lat: 50.88212840814376,
    lng: 2.786758691483385,
    route: "both",
    icon: "👮",
    description: "Elverdingseweg",
  },
  {
    lat: 50.88259103569297,
    lng: 2.7874493769939193,
    route: "both",
    description: "Steentjemolenstraat & Elzendammestraat",
  },
  {
    lat: 50.887910144665994,
    lng: 2.781887431827613,
    route: "8km",
    description: "Canada Farm",
  },
  {
    lat: 50.88955631407342,
    lng: 2.78511742771002,
    route: "8km",

    description: "Omloop-Zuid",
  },
  {
    lat: 50.89201845353659,
    lng: 2.773882294678458,
    route: "10miles",
  },
  {
    lat: 50.89059315194808,
    lng: 2.7950047128491917,
    route: "8km",
    description: "Omloop-Zuid & aardeweg",
  },
  {
    lat: 50.885532606827894,
    lng: 2.801525026444324,
    route: "8km",

    description: "Aardeweg & Steentjemolenstraat",
  },
  {
    lat: 50.894760353792265,
    lng: 2.770860835291245,
    route: "10miles",
  },
  {
    lat: 50.89226875571572,
    lng: 2.7582607677177293,
    route: "10miles",
  },
  {
    lat: 50.894389755429074,
    lng: 2.7572696500968163,
    route: "10miles",
  },
  {
    lat: 50.89812304764678,
    lng: 2.7577040715449925,
    route: "10miles",
  },
  {
    lat: 50.89972227178026,
    lng: 2.7667358785223826,
    route: "10miles",
  },
  {
    lat: 50.90234334771941,
    lng: 2.7655299569345004,
    route: "10miles",
  },
  {
    lat: 50.904562595636776,
    lng: 2.770560934568323,
    route: "10miles",
  },
  {
    lat: 50.90280232963892,
    lng: 2.772477054984847,
    route: "10miles",
  },
  {
    lat: 50.90347898469847,
    lng: 2.776058741545512,
    route: "10miles",
  },
  {
    lat: 50.902848343532185,
    lng: 2.78555868169596,
    route: "10miles",
  },
  {
    lat: 50.9030253217318,
    lng: 2.7860486644638343,
    route: "10miles",
    icon: "👮",
  },
  {
    lat: 50.90074120845901,
    lng: 2.7890603820260935,
    route: "10miles",
    icon: "👮",
  },
  {
    lat: 50.901147459990625,
    lng: 2.7905469620886265,
    route: "10miles",
  },
  {
    lat: 50.900427746786676,
    lng: 2.791554071450463,
    route: "10miles",
  },
  {
    lat: 50.90098305810412,
    lng: 2.793999378992595,
    route: "10miles",
  },
  {
    lat: 50.90262712607628,
    lng: 2.801223976760184,
    route: "10miles",
  },
  {
    lat: 50.90078661895683,
    lng: 2.8047116370867684,
    route: "10miles",
  },
  {
    lat: 50.89606483808379,
    lng: 2.8111709293612535,
    route: "10miles",
  },
  {
    lat: 50.89002307371115,
    lng: 2.809569951490431,
    route: "10miles",
  },
  {
    lat: 50.88783499936673,
    lng: 2.811098583658719,
    route: "10miles",
    icon: "👮",
  },
  {
    lat: 50.88609349676548,
    lng: 2.814168112944941,
    route: "both",

    description: "Veurnseweg & Bollemeersstraat",
  },
  {
    lat: 50.88517261447143,
    lng: 2.8138415352066772,
    route: "both",

    description: "Bollemeersstraat 1",
  },
  {
    lat: 50.88487912469128,
    lng: 2.815820084856199,
    route: "both",

    description: "Bollemeersstraat 2",
  },
  {
    lat: 50.8843292637757,
    lng: 2.816747706185822,
    route: "both",

    description: "Bollemeersstraat & d'Ennetièresplein",
  },
  {
    lat: 50.88385964876446,
    lng: 2.8178291449946187,
    route: "both",

    description: "Sint-Livinusstraat & Vlamertingestraat",
  },
  {
    lat: 50.88188273881593,
    lng: 2.821177265990457,
    route: "both",

    description: "Sint-Livinusstraat & Boswegel",
  },
  {
    lat: 50.88291266845792,
    lng: 2.817047890387556,
    route: "both",

    description: "Boswegel & Vlamertingestraat",
  },
];

function routeToColor(route) {
  switch (route) {
    case "8km":
      return "#4871f7";
    case "10miles":
      return "#fff000";
    case "both":
      return "#c9f29b";
  }
}

import tenMilesCoords from "./ten-miles-trail.json";

const tenMilesData = {
  type: "Feature",
  geometry: {
    type: "LineString",
    coordinates: tenMilesCoords.map(({ lat, lng }) => [lng, lat]),
  },
};

const tenMilesTrail = {
  id: "ten-miles-trail-line",
  type: "line",
  source: "tenMilesTrail",
  layout: {
    "line-join": "round",
    "line-cap": "round",
  },
  paint: {
    "line-color": "#fb778f",
    "line-width": 6,
    "line-opacity": 0.7,
  },
};

import eightKmCoords from "./8km-trail.json";

const eightKmData = {
  type: "Feature",
  geometry: {
    type: "LineString",
    coordinates: eightKmCoords.map(({ lat, lng }) => [lng, lat]),
  },
};

const eightKmTrail = {
  id: "trail-line",
  type: "line",
  source: "8kmTrail",
  layout: {
    "line-join": "round",
    "line-cap": "round",
  },
  paint: {
    "line-color": "#fef160",
    "line-width": 6,
    "line-opacity": 0.7,
  },
};

const centerPoint = eightKmCoords[eightKmCoords.length - 1];

const MapOfTenMiles = () => {
  const mapRef = useRef();
  const [_value, copy] = useCopyToClipboard();
  const [newCoords, setNewCoords] = useState([]);
  const onClick = (e) => {
    const { lat, lng } = e.lngLat;
    setNewCoords((prevCoords) => [...prevCoords, e.lngLat]);
    if (mapRef && mapRef.current) {
      mapRef.current.setCenter(e.lngLat);
    }
    //
    //     copy(
    //       `{
    //     lat: ${lat},
    //     lng: ${lng},
    //     route: "10miles",
    //
    // }`
    //     ).then(() => {
    //
    //     });
  };

  const onSave = () => {
    fetch("http://localhost:8080", {
      body: JSON.stringify(newCoords),
      method: "POST",
    }).then(() => {
      console.log("Saved!", newCoords);
    });
  };

  return (
    <div>
      <Map
        ref={mapRef}
        mapboxAccessToken={accessToken}
        initialViewState={{
          longitude: 2.799107241708615,
          latitude: 50.88091528571632,
          zoom: 13,
        }}
        style={{
          width: "100vw",
          height: "100vh",
          position: "fixed",
          top: "0",
          left: "0",
        }}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        // mapStyle="mapbox://styles/mapbox/satellite-streets-v12"
        onClick={onClick}
      >
        <Source id={"tenMilesTrail"} type="geojson" data={tenMilesData}>
          <Layer {...tenMilesTrail} />
        </Source>
        <Source id={"8kmTrail"} type={"geojson"} data={eightKmData}>
          <Layer {...eightKmTrail} />
        </Source>
        {/*{markers.map(({ lat, lng, route, icon, description }, idx) => {*/}
        {/*  return (*/}
        {/*    <Marker*/}
        {/*      key={idx}*/}
        {/*      color={routeToColor(route)}*/}
        {/*      latitude={lat}*/}
        {/*      longitude={lng}*/}
        {/*      title={description}*/}
        {/*    >*/}
        {/*      {icon && <span style={{ fontSize: "30px" }}>{icon}</span>}*/}
        {/*    </Marker>*/}
        {/*  );*/}
        {/*})}*/}
      </Map>
      {/*<button onClick={onSave} style={{ position: "fixed", zIndex: "100" }}>*/}
      {/*  Save*/}
      {/*</button>*/}
    </div>
  );
};

export default MapOfTenMiles;

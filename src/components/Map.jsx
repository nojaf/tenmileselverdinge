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

const signallers = [
  {
    lat: 50.87813300941394,
    lng: 2.8136473517632794,
  },
  {
    lat: 50.871585663496774,
    lng: 2.799673192854982,
  },
  {
    lat: 50.873883391702435,
    lng: 2.794189685669977,
  },
  {
    lat: 50.8920058485717,
    lng: 2.7738245870981757,
  },
  {
    lat: 50.88652317464289,
    lng: 2.763214281358131,
  },
  {
    lat: 50.90106414210953,
    lng: 2.7738675598193367,
  },
  {
    lat: 50.90278379005679,
    lng: 2.77241026151205,
  },
  {
    lat: 50.90288227519875,
    lng: 2.785766526179117,
  },
  {
    lat: 50.89995139392852,
    lng: 2.7895205315813314,
  },
  {
    lat: 50.89991080520397,
    lng: 2.7895574718544935,
  },
  {
    lat: 50.89360387075001,
    lng: 2.79375606413754,
    optional: true,
  },
  {
    lat: 50.8843502039762,
    lng: 2.816773681942209,
  },
  {
    lat: 50.883876556061864,
    lng: 2.8178122438020523,
  },
];

const nadars = [
  {
    lat: 50.87398837569941,
    lng: 2.802831181271614,
  },
  {
    lat: 50.87623481522604,
    lng: 2.798444356729277,
  },
  {
    lat: 50.874606827541726,
    lng: 2.793234574502577,
  },
  {
    lat: 50.903481787293856,
    lng: 2.7759905083100023,
  },
  {
    lat: 50.902989424934304,
    lng: 2.7860376568629306,
  },
  {
    lat: 50.893592363395555,
    lng: 2.793800367227533,
  },
  {
    lat: 50.88605705714102,
    lng: 2.806674461741295,
  },
  {
    lat: 50.88612914265508,
    lng: 2.813157793190584,
  },
  {
    lat: 50.8860650142401,
    lng: 2.8142060993079383,
  },
];

const police = [
  {
    lat: 50.88213990674248,
    lng: 2.786741172420136,
  },
  {
    lat: 50.88552952584783,
    lng: 2.801531596750152,
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

const Signaller = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 20 20"
    >
      <path fill="#7f75b9" d="M17 6L3 1v18h2v-6.87z" />
    </svg>
  );
};

const Nadar = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 48 48"
    >
      <path
        fill="none"
        stroke="#333"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="4"
        d="M9 4v40m7-35v28m8-28v28m8-28v28m10 7H6m36-7H6M39 4v40m3-35H6"
      />
    </svg>
  );
};

const Police = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 128 128"
    >
      <path
        fill="#2a56c6"
        d="M17.5 118.45v10h93.87v-10c0-15.34-23.4-23.13-46.94-23.1c-23.38.02-46.93 6.85-46.93 23.1z"
      />
      <path
        fill="#004373"
        d="M64.52 95.27c-8.69 0-14.54 1.06-14.54 1.06l6 31.67h8.54V95.27z"
      />
      <path
        fill="#004373"
        d="M64.08 95.27c8.4 0 14.12 1.05 14.12 1.05L72.73 128h-8.65V95.27z"
      />
      <path
        fill="#e49800"
        d="M64 90.08h-9.08v9.59c0 4.34 3.7 7.86 8.26 7.86h1.65c4.56 0 8.26-3.52 8.26-7.86v-9.59H64z"
      />
      <path
        fill="#fc0"
        d="M67.16 114.09h-5.64l-1.77-7.5h9.12zm2 18.29h-9.64l2-18.29h5.64z"
      />
      <path
        fill="#6d4c41"
        d="M26.74 54.93s-.01-8.39-.01-19.81c0-11.94 8.76-28.47 38.04-28.47c20.44 0 28.08 8.09 28.08 13.48c0 0 7.59 1.36 8.34 11.09c.52 6.83-.15 23.25-.15 23.25s-.83-.73-1.76-1.16c-.5-.23-1-.33-1-.33l-1.38 9.37l-10.15-19.68a.324.324 0 0 0-.32-.17l-4.12.49a156.564 156.564 0 0 1-35.75.13L41 42.5a.332.332 0 0 0-.32.18L31.3 62.29l-1.42-9.54s-.98.39-1.86 1.07c-.83.64-1.28 1.11-1.28 1.11z"
      />
      <path
        fill="#e59600"
        d="M97.09 52.31s6.06 1.05 6.06 7.57c0 5.75-4.42 8.03-8.84 8.03v-15.6h2.78zm-66.06 0s-6.06 1.05-6.06 7.57c0 5.75 4.42 8.03 8.84 8.03v-15.6h-2.78z"
      />
      <path
        fill="#fcc21b"
        d="M64.06 9.59c-26.1 0-32.93 20.23-32.93 48.66c0 29.48 18.95 37.1 32.93 37.1c13.78 0 32.93-7.4 32.93-37.1C97 29.83 90.17 9.59 64.06 9.59z"
      />
      <path
        fill="#4c3734"
        d="M73.5 77.88H54.64c-1.08 0-1.55.73-.83 1.82c1 1.52 4.72 4.46 10.26 4.46s9.26-2.93 10.26-4.46c.71-1.09.25-1.82-.83-1.82z"
      />
      <path
        fill="#513f35"
        d="M73.5 77.88H54.64c-1.08 0-1.55.73-.83 1.82c1 1.52 4.72 4.46 10.26 4.46s9.26-2.93 10.26-4.46c.71-1.09.25-1.82-.83-1.82z"
      />
      <path
        fill="#e59600"
        d="M68.62 69.86c-1.61.45-3.27.68-4.56.68c-1.29 0-2.95-.22-4.56-.68c-.69-.19-.96.46-.71.89c.51.9 2.56 2.7 5.27 2.7c2.71 0 4.76-1.81 5.27-2.7c.25-.43-.02-1.08-.71-.89z"
      />
      <path
        fill="#444"
        d="M53.33 60.11c0 2.9-1.94 5.26-4.35 5.26c-2.41 0-4.36-2.36-4.36-5.26c0-2.91 1.96-5.27 4.36-5.27c2.41 0 4.35 2.36 4.35 5.27m21.46 0c0 2.9 1.95 5.26 4.36 5.26c2.4 0 4.36-2.36 4.36-5.26c0-2.91-1.96-5.27-4.36-5.27c-2.41 0-4.36 2.36-4.36 5.27"
      />
      <path
        fill="#6d4c41"
        d="M31.13 60.11L29.39 49.4S25.62 8.1 64.96 8.1s33.21 43.09 33.21 43.09l-1.2 8.92L86.75 42.8s-19.42 1.56-44.64-.33L31.13 60.11z"
      />
      <path
        fill="#262626"
        d="M64 39.75c-18.69.13-35.62 3.51-35.62 3.51S37.09 53.2 64 53.41c26.91-.21 35.62-10.15 35.62-10.15S82.69 39.88 64 39.75z"
      />
      <path
        fill="#2a56c6"
        d="M103.02 22.38c-2.3-2.94-4.11-4.72-7.08-6.87c-9.26-6.66-22.11-9.65-31.59-9.65c-.11 0-.23.01-.35.01c-.11 0-.24-.01-.35-.01c-9.48 0-22.33 2.99-31.59 9.65c-2.98 2.15-4.78 3.93-7.08 6.87c-3.38 4.32-4.08 10.96-1.97 16.55c1.69 4.47 3.69 7.52 3.69 7.52c1.87-3.79 4.52-6.13 8.15-7.14c3.72-1.03 17.24-2.16 29.15-2.67c11.91.5 25.43 1.64 29.15 2.67c3.63 1.01 6.27 3.35 8.15 7.14c0 0 2.01-3.05 3.69-7.52c2.11-5.59 1.42-12.23-1.97-16.55z"
      />
      <path
        fill="#3b78e7"
        d="M97.54 32.72S82.96 23.99 64 23.89c-18.96.1-33.54 8.83-33.54 8.83l-1.6 10.54s16.15-3.53 35.13-3.57c18.98.04 35.13 3.57 35.13 3.57l-1.58-10.54z"
      />
      <path
        fill="#f7cb4d"
        d="M71.59 16.55c-.27 0-.51.14-.65.36c-.57.91-1.4 1.53-2.87 1.53c-1.43 0-2.47-1.39-3.1-2.26c-.2-.27-.51-.44-.84-.44c-.34 0-.65.17-.85.45c-.61.86-1.61 2.25-3.03 2.25c-1.47 0-2.3-.62-2.87-1.53a.758.758 0 0 0-.65-.36c-.25 0-.48.12-.63.32l-.32.44c-.38.52-.44 1.22-.15 1.8c.43.87.66 1.83.66 2.8v3.79c0 2.76 4.26 8.41 7.87 8.41c3.61 0 7.87-5.65 7.87-8.41v-3.8c0-.97.23-1.93.66-2.8c.29-.58.23-1.27-.15-1.8l-.32-.44a.821.821 0 0 0-.63-.31z"
      />
      <path
        fill="#004373"
        d="M45.18 103.91c-9.37 2.11-14.35 2.11-23.72 0c-1.34-.3-2.17-1.52-1.86-2.66c.29-1.08.44-1.62.74-2.69c.31-1.14 1.5-1.79 2.67-1.53c8.15 1.83 12.48 1.83 20.63 0c1.17-.26 2.35.4 2.67 1.53c.29 1.08.44 1.62.74 2.69c.3 1.13-.53 2.36-1.87 2.66zm38.11 0c9.37 2.11 14.35 2.11 23.72 0c1.34-.3 2.17-1.52 1.86-2.66c-.29-1.08-.44-1.62-.74-2.69c-.31-1.14-1.5-1.79-2.67-1.53c-8.15 1.83-12.48 1.83-20.63 0c-1.17-.26-2.35.4-2.67 1.53c-.29 1.08-.44 1.62-.74 2.69c-.29 1.13.53 2.36 1.87 2.66z"
      />
      <path
        fill="#3b78e7"
        d="M73.27 95.67c0 1.53-1.31 4.42-3.4 6.82c-2.12 2.44-5.65 3.95-5.65 3.95l13.24 11.08l.87-21.19c0 .01-3.08-.47-5.06-.66z"
      />
      <path
        fill="#3b78e7"
        d="M55.25 95.66c0 1.53 1.31 4.42 3.4 6.82c2.12 2.44 5.65 3.95 5.65 3.95l-13.55 11.09l-.56-21.21s3.03-.48 5.06-.65z"
      />
    </svg>
  );
};

const MapOfTenMiles = () => {
  const mapRef = useRef();
  const [_value, copy] = useCopyToClipboard();
  const [newCoords, setNewCoords] = useState([]);
  const onClick = (e) => {
    const { lat, lng } = e.lngLat;
    // setNewCoords((prevCoords) => [...prevCoords, e.lngLat]);
    // if (mapRef && mapRef.current) {
    //   mapRef.current.setCenter(e.lngLat);
    // }
    //
    copy(
      `{
        "lat": ${lat},
        "lng": ${lng}
    }`,
    ).then(() => {});
    console.log(`{
        "lat": ${lat},
        "lng": ${lng}
    }`);
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
    <div id={"map-container"}>
      <Map
        ref={mapRef}
        mapboxAccessToken={accessToken}
        initialViewState={{
          longitude: 2.799107241708615,
          latitude: 50.88091528571632,
          zoom: 12,
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
        <Marker
          key={"start"}
          color={"white"}
          longitude={2.815821520790268}
          latitude={50.881251529116746}
          title={"Start en finish!"}
        >
          <span style={{ fontSize: "1rem" }}>🏁</span>
        </Marker>
        {signallers.map((s, idx) => {
          return (
            <Marker
              key={`signaller-${idx}`}
              longitude={s.lng}
              latitude={s.lat}
              title={`Seingever ${idx + 1}`}
            >
              <Signaller />
            </Marker>
          );
        })}
        {nadars.map((n, idx) => {
          return (
            <Marker
              key={`nadar-${idx}`}
              longitude={n.lng}
              latitude={n.lat}
              title={`Nadar ${idx + 1}`}
            >
              <Nadar />
            </Marker>
          );
        })}
        {police.map((p, idx) => {
          return (
            <Marker
              key={`police-${idx}`}
              longitude={p.lng}
              latitude={p.lat}
              title={"Politie"}
            >
              <Police />
            </Marker>
          );
        })}
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

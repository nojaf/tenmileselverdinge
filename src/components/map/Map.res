%%raw("import 'mapbox-gl/dist/mapbox-gl.css';")

module ReactMapGL = {
  type viewState = {
    longitude: float,
    latitude: float,
    zoom: int,
  }

  type lngLat = {
    lat: float,
    lng: float,
  }

  type mapClickEvent = {lngLat: lngLat}

  module Map = {
    @module("react-map-gl") @react.component
    external make: (
      ~mapboxAccessToken: string,
      ~initialViewState: viewState,
      ~mapStyle: string,
      ~onClick: mapClickEvent => unit,
      ~children: React.element,
    ) => React.element = "default"
  }

  type layerLayout = {"line-join": string, "line-cap": string}

  type layerPaint = {"line-color": string, "line-width": int, "line-opacity": float}

  module Layer = {
    @module("react-map-gl") @react.component
    external make: (
      ~id: string,
      @as("type") ~type_: string,
      ~source: string,
      ~layout: layerLayout,
      ~paint: layerPaint,
    ) => React.element = "Layer"
  }

  module Marker = {
    @module("react-map-gl") @react.component
    external make: (
      ~key: string,
      ~longitude: float,
      ~latitude: float,
      ~title: string,
      ~children: React.element,
    ) => React.element = "Marker"
  }

  type sourceDataGeometry = {
    @as("type")
    type_: string,
    coordinates: array<(float, float)>,
  }

  type sourceData = {
    @as("type")
    type_: string,
    geometry: sourceDataGeometry,
  }

  module Source = {
    @module("react-map-gl") @react.component
    external make: (
      ~id: string,
      @as("type") ~type_: string,
      ~data: sourceData,
      ~children: React.element,
    ) => React.element = "Source"
  }
}

let accessToken = "pk.eyJ1Ijoibm9qYWYiLCJhIjoiY2p6eHV4ODkwMWNoaTNidXRqeGlrb2JpMSJ9.x6fTQsfCfGMKwxpdKxjhMQ"

@module("usehooks-ts")
external useCopyToClipboard: unit => (_, string => unit) = "useCopyToClipboard"

@module("./ten-miles-trail.json")
external tenMilesCoords: array<ReactMapGL.lngLat> = "default"

let tenMilesData: ReactMapGL.sourceData = {
  type_: "Feature",
  geometry: {
    type_: "LineString",
    coordinates: tenMilesCoords->Array.map(({lat, lng}) => (lng, lat)),
  },
}

@module("./8km-trail.json")
external eightKmCoords: array<ReactMapGL.lngLat> = "default"

let eightKmData: ReactMapGL.sourceData = {
  type_: "Feature",
  geometry: {
    type_: "LineString",
    coordinates: eightKmCoords->Array.map(({lat, lng}) => (lng, lat)),
  },
}

@react.component
let make = () => {
  let (_, copy) = useCopyToClipboard()

  let onClick = (ev: ReactMapGL.mapClickEvent) => {
    copy(
      `{
        "lat": ${Belt.Float.toString(ev.lngLat.lat)},
        "lng": ${Belt.Float.toString(ev.lngLat.lng)}
      }`,
    )
  }

  <div id="map-container">
    <ReactMapGL.Map
      mapboxAccessToken={accessToken}
      initialViewState={{
        longitude: 2.799107241708615,
        latitude: 50.88091528571632,
        zoom: 12,
      }}
      mapStyle="mapbox://styles/mapbox/streets-v12"
      onClick={onClick}>
      <ReactMapGL.Source id="tenMilesTrail" type_={"geojson"} data={tenMilesData}>
        <ReactMapGL.Layer
          id="ten-miles-trail-line"
          type_="line"
          source="tenMilesTrail"
          layout={{
            "line-join": "round",
            "line-cap": "round",
          }}
          paint={{
            "line-color": "#fb778f",
            "line-width": 6,
            "line-opacity": 0.7,
          }}
        />
      </ReactMapGL.Source>
      <ReactMapGL.Source id="8kmTrail" type_={"geojson"} data={eightKmData}>
        <ReactMapGL.Layer
          id="trail-line"
          type_="line"
          source="8kmTrail"
          layout={{
            "line-join": "round",
            "line-cap": "round",
          }}
          paint={{
            "line-color": "#fef160",
            "line-width": 6,
            "line-opacity": 0.7,
          }}
        />
      </ReactMapGL.Source>
      <ReactMapGL.Marker
        key={"start"}
        longitude={2.8158431713439995}
        latitude={50.881246418817}
        title={"Start en finish!"}>
        <iconify-icon
          icon="gis:finish"
          width="16"
          height="16"
          style={ReactDOM.Style.make(~color="var(--dark-900)", ())}
        />
      </ReactMapGL.Marker>
    </ReactMapGL.Map>
  </div>
}

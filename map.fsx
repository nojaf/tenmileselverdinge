#r "nuget: Suave, 2.7.0-beta1"
#r "nuget: Thoth.Json.Net, 11.0.0"

open System.IO
open Suave
open Thoth.Json.Net
open System.Xml.Linq

let decode: Decoder<string> =
        Decode.object (fun fields ->
            fields.Required.At["serviceType"; "case"]Decode.string)

let lngLatDecoder: string -> JsonValue -> Result<(float * float),DecoderError> =
    Decode.object (fun get ->
        let lng = get.Required.Field "lng" Decode.float
        let lat = get.Required.Field "lat" Decode.float
        lng, lat)

let lgnLatEncoder (lng: float) (lat: float): JsonValue =
    Encode.object [ "lng", Encode.float lng; "lat", Encode.float lat ]

let coords =
    Path.Combine(__SOURCE_DIRECTORY__, "src", "components", "8km-trail.json")

let addToFile (newCoords: (float * float) array) =
    async {
        let allCoords = File.ReadAllText(coords)

        match Decode.fromString (Decode.array lngLatDecoder) allCoords with
        | Result.Error error -> printfn "%A" error
        | Result.Ok allCoords ->
            [| yield! Array.map (fun (lng, lat) -> lgnLatEncoder lng lat) allCoords
               yield! Array.map (fun (lng, lat) -> lgnLatEncoder lng lat) newCoords |]
            |> Encode.array
            |> Encode.toString 4
            |> fun json -> File.WriteAllText(coords, json)
    }

let handler (ctx: HttpContext) =
    async {
        let json = System.Text.Encoding.UTF8.GetString(ctx.request.rawForm)

        match Decode.fromString (Decode.array lngLatDecoder) json with
        | Result.Error error ->
            printfn "%s" error
            return! RequestErrors.BAD_REQUEST "invalid json" ctx
        | Result.Ok newCoords ->
            do! addToFile newCoords
            return! Successful.ACCEPTED $"Added %A{newCoords}" ctx
    }

// startWebServer defaultConfig handler

#r "nuget: CoordinateSharp, 2.19.1.1"

open CoordinateSharp

let metersBetweenCoordinates ((lngA, latA), (lngB, latB)) =
    let coordinateA = Coordinate(lat = latA, longi = lngA)
    let coordinateB = Coordinate(lat = latB, longi = lngB)
    Distance(coordinateA, coordinateB).Meters

let totalDistance (file: FileInfo) =
    let content = File.ReadAllText(file.FullName)

    match Decode.fromString (Decode.array lngLatDecoder) content with
    | Result.Error _error -> 0.
    | Result.Ok coordinates ->
        coordinates
        |> Array.pairwise
        |> Array.Parallel.map metersBetweenCoordinates
        |> Array.sum

totalDistance (FileInfo(Path.Combine(__SOURCE_DIRECTORY__, "src", "components", "8km-trail.json")))

totalDistance (FileInfo(Path.Combine(__SOURCE_DIRECTORY__, "src", "components", "ten-miles-trail.json")))



let (!-) p = FileInfo p

let mkGpxFile (input:FileInfo) =
    let output = Path.ChangeExtension(input.FullName, ".gpx")
    let coordinates =
        let json = File.ReadAllText input.FullName
        match Decode.fromString (Decode.array lngLatDecoder) json with
        | Result.Error err-> failwith err
        | Result.Ok coordinates -> coordinates

    let gpx =
        XDocument(
            XElement(XName.Get("gpx", "http://www.topografix.com/GPX/1/1"),
                XAttribute(XName.Get("version"), "1.1"),
                XElement(XName.Get("trk"),
                    XElement(XName.Get("trkseg"),
                        Seq.map (fun (lng,lat) ->
                            XElement(XName.Get("trkpt"),
                                XAttribute(XName.Get("lat"), string lat),
                                XAttribute(XName.Get("lon"), string lng)
                            )
                        ) coordinates
                    )
                )
            )
        )
    gpx.Save(output)

mkGpxFile !- @"C:\Users\nojaf\Projects\tenmileselverdinge\src\components\8km-trail.json"
mkGpxFile !- @"C:\Users\nojaf\Projects\tenmileselverdinge\src\components\ten-miles-trail.json"
#r "nuget: Suave, 2.7.0-beta1"
#r "nuget: Thoth.Json.Net, 11.0.0"

open System.IO
open Suave
open Thoth.Json.Net

let lngLatDecoder =
    Decode.object (fun get ->
        let lng = get.Required.Field "lng" Decode.float
        let lat = get.Required.Field "lat" Decode.float
        lng, lat)

let lgnLatEncoder lng lat =
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

startWebServer defaultConfig handler

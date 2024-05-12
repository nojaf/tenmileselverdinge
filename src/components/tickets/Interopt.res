module ButtonGroup = {
  type item = {
    text: string,
    onClick: unit => unit,
  }

  @module("../ButtonGroup.jsx") @react.component
  external make: (
    ~options: array<item>,
    ~activeOption: string,
    ~required: option<bool>=?,
  ) => React.element = "default"
}

module Button = {
  @module("../Button.jsx") @react.component
  external make: (
    ~className: option<string>=?,
    ~children: React.element,
    ~type_: option<string>=?,
    ~primary: option<bool>=?,
    ~danger: option<bool>=?,
    ~large: option<bool>=?,
    ~onClick: option<JsxEvent.Mouse.t => unit>=?,
    ~disabled: option<bool>=?,
  ) => React.element = "default"
}

module Turnstile = {
  @module("@marsidev/react-turnstile") @react.component
  external make: (~siteKey: string, ~onSuccess: string => unit) => React.element = "Turnstile"
}

module Loader = {
  @module("../Loader.jsx") @react.component
  external make: unit => React.element = "default"
}

let str = (v: string) => React.string(v)
let euro = React.string("€")

let getEventValue = e => {
  let target = e->JsxEvent.Form.target
  (target["value"]: string)->Js.String.trim
}

type scrollIntoViewOptions = {behavior: string}

@send
external scrollIntoView: (Dom.element, ~scrollIntoViewOptions: scrollIntoViewOptions) => unit =
  "scrollIntoView"

let isNotEmptyString = (v: string) => v != ""

let isArrayNotEmpty = a => {
  let l = a->Belt.Array.length
  l > 0
}

let not = v => !v

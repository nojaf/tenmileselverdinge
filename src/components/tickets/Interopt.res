module ButtonGroup = {
  type item = {
    text: string,
    onClick: unit => unit,
  }

  @module("../ButtonGroup.jsx") @react.component
  external make: (~options: array<item>, ~activeOption: string) => React.element = "default"
}

module Button = {
  type buttonProps = {
    ...JsxDOM.domProps,
    danger?: bool,
    primary?: bool,
  }

  @module("../Button.jsx") @react.component(: buttonProps)
  external make: buttonProps => React.element = "default"
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
  let l = a->Array.length
  l > 0
}

let not = v => !v

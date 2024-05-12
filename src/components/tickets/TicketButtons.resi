type propsDef = {
  disabled: bool,
  addRunner: unit => unit,
  addWalker: unit => unit,
  addAdultSchnitzel: unit => unit,
  addAdultTartiflette: unit => unit,
  addChildSchnitzel: unit => unit,
  addChildTartiflette: unit => unit,
}

@react.component(: propsDef)
let make: props => Jsx.element

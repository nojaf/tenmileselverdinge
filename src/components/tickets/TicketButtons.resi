@react.component
let make: (
  ~disabled: bool,
  ~addRunner: unit => unit,
  ~addWalker: unit => unit,
  ~addAdultSchnitzel: unit => unit,
  ~addAdultTartiflette: unit => unit,
  ~addChildSchnitzel: unit => unit,
  ~addChildTartiflette: unit => unit,
) => Jsx.element

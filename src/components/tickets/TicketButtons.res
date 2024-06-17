open Interopt
open Domain

type propsDef = {
  disabled: bool,
  addRunner: unit => unit,
  addWalker: unit => unit,
  addAdultSchnitzel: unit => unit,
  addAdultTartiflette: unit => unit,
  addChildSchnitzel: unit => unit,
  addChildTartiflette: unit => unit,
}

let memo = React.memoCustomCompareProps(_, (p1, p2) => p1.disabled == p2.disabled)

@react.component(: propsDef)
let make = memo((
  ~disabled,
  ~addRunner,
  ~addWalker,
  ~addAdultSchnitzel,
  ~addAdultTartiflette,
  ~addChildSchnitzel,
  ~addChildTartiflette,
) => {
  <div id="tickets">
    <h2> {str("Bestelling")} </h2>
    <p>
      {str(`
            Kies welke soort tickets je bestelling. Voor de lopers en wandelaars
            hebben we extra informatie nodig.`)}
    </p>
    <Button
      disabled={disabled}
      className={"ticket"}
      onClick={ev => ev->JsxEvent.Mouse.preventDefault->addRunner}>
      <iconify-icon icon="mdi:plus" width="30" height="30" />
      <span> {str("Loopwedstrijd")} </span>
      <strong> {React.int(prices["runner"])} </strong>
    </Button>
    <Button
      disabled={disabled}
      className={"ticket"}
      onClick={ev => ev->JsxEvent.Mouse.preventDefault->addWalker}>
      <iconify-icon icon="mdi:plus" width="30" height="30" />
      <span> {str("Wandeling")} </span>
      <strong> {React.int(prices["walker"])} </strong>
    </Button>
    <Button
      disabled={disabled}
      className={"ticket"}
      onClick={ev => ev->JsxEvent.Mouse.preventDefault->addAdultSchnitzel}>
      <iconify-icon icon="mdi:plus" width="30" height="30" />
      <span> {str("Schnitzel")} </span>
      <small> {str("volwassene")} </small>
      <strong> {React.int(prices["adultSchnitzel"])} </strong>
    </Button>
    <Button
      disabled={disabled}
      className={"ticket"}
      onClick={ev => ev->JsxEvent.Mouse.preventDefault->addAdultTartiflette}>
      <iconify-icon icon="mdi:plus" width="30" height="30" />
      <span> {str("Tartiflette")} </span>
      <small> {str("volwassene")} </small>
      <strong> {React.int(prices["adultTartiflette"])} </strong>
    </Button>
    <Button
      disabled={disabled}
      className={"ticket"}
      onClick={ev => ev->JsxEvent.Mouse.preventDefault->addChildSchnitzel}>
      <iconify-icon icon="mdi:plus" width="30" height="30" />
      <span> {str("Schnitzel")} </span>
      <small> {str("kind")} </small>
      <strong> {React.int(prices["childSchnitzel"])} </strong>
    </Button>
    <Button
      disabled={disabled}
      className={"ticket"}
      onClick={ev => ev->JsxEvent.Mouse.preventDefault->addChildTartiflette}>
      <iconify-icon icon="mdi:plus" width="30" height="30" />
      <span> {str("Tartiflette")} </span>
      <small> {str("kind")} </small>
      <strong> {React.int(prices["childTartiflette"])} </strong>
    </Button>
  </div>
})

open Interopt
open Domain

let isValid = (walker: walker) => {
  walker.firstName->isNotEmptyString && walker.lastName->isNotEmptyString
}

@react.component
let make = (
  ~walker: walker,
  ~update: walker => unit,
  ~cancel: unit => unit,
  ~submit: unit => unit,
) => {
  let (className, setClassName) = React.useState(_ => "")
  let detailRef = React.useRef(Nullable.null)
  React.useEffect0(() => {
    switch detailRef.current {
    | Value(node) => scrollIntoView(node, ~scrollIntoViewOptions={behavior: "smooth"})
    | _ => ()
    }

    None
  })

  let submitHandler = ev => {
    ev->JsxEvent.Mouse.preventDefault
    if isValid(walker) {
      submit()
    } else {
      setClassName(_ => "invalid-form")
    }
  }

  <div id="detail" ref={ReactDOM.Ref.domRef(detailRef)} className={className}>
    <h3> {React.string("Info wandelaar")} </h3>
    <div>
      <label> {React.string("Voornaam")} </label>
      <input
        type_="text"
        required={true}
        autoComplete={"given-name"}
        defaultValue={walker.firstName}
        placeholder="Jimmy"
        onChange={ev => ev->getEventValue->(v => {...walker, firstName: v}->update)}
      />
    </div>
    <div>
      <label> {React.string("Familienaam")} </label>
      <input
        type_="text"
        required={true}
        autoComplete={"family-name"}
        defaultValue={walker.lastName}
        placeholder="Frey"
        onChange={ev => ev->getEventValue->(v => {...walker, lastName: v}->update)}
      />
    </div>
    <div id="actions">
      <Button
        danger={true}
        onClick={ev => {
          JsxEvent.Mouse.preventDefault(ev)
          cancel()
        }}>
        {React.string("Annuleer")}
      </Button>
      <Button primary={true} type_={"submit"} onClick={submitHandler}>
        {React.string("Bevestig!")}
      </Button>
    </div>
  </div>
}

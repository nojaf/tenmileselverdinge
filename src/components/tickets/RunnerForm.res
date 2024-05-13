open Domain
open Interopt

let isValid = (runner: runner) => {
  runner.firstName->isNotEmptyString &&
  runner.lastName->isNotEmptyString &&
  runner.email->isNotEmptyString &&
  runner.phone->isNotEmptyString &&
  runner.birthyear > 1945 &&
  runner.birthyear <= 2013 &&
  runner.residence->isNotEmptyString
}

@react.component
let make = (
  ~runner: runner,
  ~update: runner => unit,
  ~cancel: unit => unit,
  ~submit: unit => unit,
) => {
  let (className, setClassName) = React.useState(_ => "")
  let detailRef = React.useRef(Js.Nullable.null)
  React.useEffect0(() => {
    switch detailRef.current {
    | Value(node) => scrollIntoView(node, ~scrollIntoViewOptions={behavior: "smooth"})
    | _ => ()
    }

    None
  })

  let submitHandler = ev => {
    ev->JsxEvent.Mouse.preventDefault
    if isValid(runner) {
      submit()
    } else {
      setClassName(_ => "invalid-form")
    }
  }

  <div id="detail" ref={ReactDOM.Ref.domRef(detailRef)} className={className}>
    <h3> {React.string("Info loper")} </h3>
    <div>
      <label> {React.string("Afstand")} </label>
      <ButtonGroup
        options={[
          {
            text: "16 km",
            onClick: () => {update({...runner, race: TenMiles})},
          },
          {
            text: "8 km",
            onClick: () => {
              update({...runner, race: EightKm})
            },
          },
        ]}
        activeOption={switch runner.race {
        | TenMiles => "16 km"
        | EightKm => "8 km"
        }}
      />
      <label> {React.string("Voornaam")} </label>
      <input
        type_="text"
        required={true}
        autoComplete={"given-name"}
        defaultValue={runner.firstName}
        placeholder="Jimmy"
        onChange={ev => ev->getEventValue->(v => {...runner, firstName: v}->update)}
      />
      <label> {React.string("Familienaam")} </label>
      <input
        type_="text"
        required={true}
        autoComplete={"family-name"}
        defaultValue={runner.lastName}
        placeholder="Frey"
        onChange={ev => ev->getEventValue->(v => {...runner, lastName: v}->update)}
      />
      <label> {React.string("Email")} </label>
      <input
        type_="email"
        required={true}
        defaultValue={runner.email}
        placeholder="jimmy.frey@gmail.com"
        onChange={ev => ev->getEventValue->(v => {...runner, email: v}->update)}
      />
    </div>
    <div>
      <label> {React.string("Telefoon (in geval van nood)")} </label>
      <small> {React.string("Dus niet het nummer van de huidige loper 😉")} </small>
      <input
        type_="tel"
        required={true}
        defaultValue={runner.phone}
        placeholder="0491 23 45 67"
        onChange={ev => ev->getEventValue->(v => {...runner, phone: v}->update)}
      />
      <label> {React.string("Geboortejaar")} </label>
      <input
        type_="number"
        min={"1945"}
        max={"2013"}
        required={true}
        defaultValue={runner.birthyear->Belt.Int.toString}
        placeholder="1997"
        onChange={ev =>
          ev
          ->getEventValue
          ->(
            v => {
              switch Belt.Int.fromString(v) {
              | None => ()
              | Some(by) => update({...runner, birthyear: by})
              }
            }
          )}
      />
      <label> {React.string("Woonplaats")} </label>
      <input
        type_="text"
        required={true}
        defaultValue={runner.residence}
        placeholder="Ieper"
        onChange={ev => ev->getEventValue->(v => {...runner, residence: v}->update)}
      />
      <label> {React.string("Geslacht")} </label>
      <ButtonGroup
        options={[
          {
            text: "M",
            onClick: () => {update({...runner, gender: Male})},
          },
          {
            text: "V",
            onClick: () => {update({...runner, gender: Female})},
          },
          {
            text: "X",
            onClick: () => {update({...runner, gender: Domain.Unknown})},
          },
        ]}
        activeOption={switch runner.gender {
        | Male => "M"
        | Female => "V"
        | Domain.Unknown => "X"
        }}
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

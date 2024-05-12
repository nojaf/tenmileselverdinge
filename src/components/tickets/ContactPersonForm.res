open Domain
open Interopt

@scope("import.meta.env") @val external _turnstileKey: string = "PUBLIC_TURNSTILE"
/*
Dummy sitekeys and secret keys

Sitekey	Description	Visibility
1x00000000000000000000AA	Always passes	visible
2x00000000000000000000AB	Always blocks	visible
1x00000000000000000000BB	Always passes	invisible
2x00000000000000000000BB	Always blocks	invisible
3x00000000000000000000FF	Forces an interactive challenge	visible
 */

let turnstileKey = _turnstileKey

@react.component
let make = (~contactPerson: contactPerson, ~update: contactPerson => unit) => {
  let updateContactPerson = (map: (contactPerson, string) => contactPerson) => {
    ev => {
      ev
      ->getEventValue
      ->(
        v => {
          map(contactPerson, v)->update
        }
      )
    }
  }
  let updateContactPersonFirstName = updateContactPerson((p, v) => {...p, firstName: v})
  let updateContactPersonLastName = updateContactPerson((p, v) => {...p, lastName: v})
  let updateContactPersonEmail = updateContactPerson((p, v) => {...p, email: v})
  let contactPersonOptions: array<ButtonGroup.item> = [
    {
      text: "Ja",
      onClick: () => {
        update({...contactPerson, collector: None})
      },
    },
    {
      text: "Nee",
      onClick: () => {
        switch contactPerson.collector {
        | Some(_) => ()
        | None => update({...contactPerson, collector: Some("")})
        }
      },
    },
  ]
  let activeContactPersonOption = Belt.Option.isNone(contactPerson.collector) ? "Ja" : "Nee"
  let updateContactPersonCollector = updateContactPerson((p, v) => {
    {
      ...p,
      collector: Belt.Option.map(p.collector, _ => v),
    }
  })
  let updateTurnStileKey = token => update({...contactPerson, turnstileToken: Some(token)})

  <div id="info">
    <h2> {str("Besteller")} </h2>
    //
    <label> {str("Voornaam")} </label>
    <input
      type_="text"
      autoComplete="given-name"
      placeholder="Jimmy"
      required={true}
      defaultValue={contactPerson.firstName}
      onChange={updateContactPersonFirstName}
    />
    //
    <label> {str("Familienaam")} </label>
    <input
      type_="text"
      autoComplete="family-name"
      placeholder="Frey"
      required={true}
      defaultValue={contactPerson.lastName}
      onChange={updateContactPersonLastName}
    />
    //
    <label> {str("Email")} </label>
    <input
      type_="email"
      autoComplete="email"
      placeholder="jimmy.frey@gmail.com"
      required={true}
      defaultValue={contactPerson.email}
      onChange={updateContactPersonEmail}
    />
    //
    <label> {str("Is deze bestelling voor jezelf?")} </label>
    <ButtonGroup options={contactPersonOptions} activeOption={activeContactPersonOption} />
    //
    {switch contactPerson.collector {
    | None => React.null
    | Some(collector) =>
      <>
        <label> {str("Wie haalt de tickets op?")} </label>
        <input
          type_="text"
          placeholder="vb Sandra of familie Frey"
          required={true}
          defaultValue={collector}
          onChange={updateContactPersonCollector}
        />
      </>
    }}
    //
    <label> {str("Even checken of je een echte persoon bent!")} </label>
    <Turnstile siteKey={turnstileKey} onSuccess={updateTurnStileKey} />
  </div>
}

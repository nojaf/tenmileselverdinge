open Interopt
open Domain

type contactPerson = {
  firstName: string,
  lastName: string,
  email: string,
  collector: option<string>,
}

type model = {
  contactPerson: contactPerson,
  tickets: array<ticket>,
  currentTicketDetail: option<ticket>,
  formSubmitted: bool,
}

let initialModel = {
  contactPerson: {
    firstName: "",
    lastName: "",
    email: "",
    collector: None,
  },
  tickets: [],
  currentTicketDetail: None,
  formSubmitted: false,
}

type msg =
  | UpdateContactPerson(contactPerson => contactPerson)
  | AddTicket(ticket)
  | AddRunner
  | AddWalker
  | UpdateRunner(runner)
  | UpdateWalker(walker)
  | CancelSport
  | SubmitSport

let update = (model: model, msg: msg) => {
  switch msg {
  | UpdateContactPerson(mapFn) => {...model, contactPerson: mapFn(model.contactPerson)}
  | AddTicket(ticket) => {
      ...model,
      tickets: Array.concat(model.tickets, [ticket]),
    }
  | AddRunner => {...model, currentTicketDetail: Some(emptyRunner)}
  | AddWalker => {...model, currentTicketDetail: Some(emptyWalker)}
  | UpdateRunner(nextRunner) =>
    switch model.currentTicketDetail {
    | Some(Runner(_)) => {
        ...model,
        currentTicketDetail: nextRunner->Runner->Some,
      }
    | _ => model
    }
  | UpdateWalker(nextWalker) =>
    switch model.currentTicketDetail {
    | Some(Walker(_)) => {
        ...model,
        currentTicketDetail: nextWalker->Walker->Some,
      }
    | _ => model
    }
  | CancelSport => {...model, currentTicketDetail: None}
  | SubmitSport => {
      let tickets = switch model.currentTicketDetail {
      | None => model.tickets
      | Some(ticket) => Belt.Array.concat(model.tickets, [ticket])
      }
      {...model, tickets, currentTicketDetail: None}
    }
  }
}

let orderTotal = (items: array<ticket>) => {
  items->Belt.Array.reduce(0, (acc, t) => {
    acc + priceInEuro(t)
  })
}

@react.component
let make = () => {
  let (model, setModel) = React.useReducer(update, initialModel)
  let updateContactPerson = (map: (contactPerson, string) => contactPerson) => {
    ev => {
      ev
      ->getEventValue
      ->(
        v => {
          setModel(UpdateContactPerson(p => map(p, v)))
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
        setModel(UpdateContactPerson(p => {...p, collector: None}))
      },
    },
    {
      text: "Nee",
      onClick: () => {
        setModel(
          UpdateContactPerson(
            p =>
              switch p.collector {
              | Some(_) => p
              | None => {...p, collector: Some("")}
              },
          ),
        )
      },
    },
  ]
  let activeContactPersonOption = Belt.Option.isNone(model.contactPerson.collector) ? "Ja" : "Nee"
  let updateContactPersonCollector = updateContactPerson((p, v) => {
    {
      ...p,
      collector: Belt.Option.map(p.collector, _ => v),
    }
  })

  let addTicket = (ticket: ticket) => {
    () => setModel(AddTicket(ticket))
  }

  let overviewData =
    model.tickets
    ->mkSummary
    ->Belt.Array.mapWithIndex((idx, item) => {
      switch item {
      | Sport({fullName, price, disciplineName}) =>
        <li key={idx->Belt.Int.toString}>
          {React.string(`${disciplineName} voor ${fullName}`)}
          <strong>
            {euro}
            {React.int(price)}
          </strong>
        </li>
      | Food({amount, pricePerItem, dishName}) =>
        <li key={idx->Belt.Int.toString}>
          {React.int(amount)}
          {React.string(` x ${dishName}`)}
          <strong>
            {euro}
            {React.int(amount * pricePerItem)}
          </strong>
        </li>
      }
    })

  <React.StrictMode>
    <form>
      <div id="description">
        <h2> {str("Info")} </h2>
        <p>
          {str("Wanneer we je bestelling hebben verwerkt, sturen we je een bevestigingsmail.")}
        </p>
        <p>
          {str(
            "Op de dag van het evenement moet je je registreren met de opgegeven naam om je tickets te ontvangen.",
          )}
        </p>
      </div>
      <div id="info">
        <h2> {str("Besteller")} </h2>
        //
        <label> {str("Voornaam")} </label>
        <input
          type_="text"
          placeholder="Voornaam"
          required={true}
          defaultValue={model.contactPerson.firstName}
          onChange={updateContactPersonFirstName}
        />
        //
        <label> {str("Familienaam")} </label>
        <input
          type_="text"
          placeholder="Familienaam"
          required={true}
          defaultValue={model.contactPerson.lastName}
          onChange={updateContactPersonLastName}
        />
        //
        <label> {str("Email")} </label>
        <input
          type_="email"
          placeholder="Email?"
          required={true}
          defaultValue={model.contactPerson.email}
          onChange={updateContactPersonEmail}
        />
        //
        <label> {str("Is deze bestelling voor jezelf?")} </label>
        <ButtonGroup options={contactPersonOptions} activeOption={activeContactPersonOption} />
        //
        {switch model.contactPerson.collector {
        | None => React.null
        | Some(collector) =>
          <>
            <label> {str("Wie haalt de tickets op?")} </label>
            <input
              type_="text"
              placeholder="Contactpersoon"
              required={true}
              defaultValue={collector}
              onChange={updateContactPersonCollector}
            />
          </>
        }}
        //
        <label> {str("Even checken of je een echte persoon bent!")} </label>
        {str("Turnstille ding")}
      </div>
      //
      <TicketButtons
        disabled={Belt.Option.isSome(model.currentTicketDetail)}
        addRunner={() => AddRunner->setModel}
        addWalker={() => AddWalker->setModel}
        addAdultSchnitzel={addTicket(Schnitzel({adult: true}))}
        addAdultTartiflette={addTicket(Tartiflette({adult: true}))}
        addChildSchnitzel={addTicket(Schnitzel({adult: false}))}
        addChildTartiflette={addTicket(Tartiflette({adult: false}))}
      />
      {switch model.currentTicketDetail {
      | Some(Runner(runner)) =>
        <RunnerForm
          runner={runner}
          update={r => r->UpdateRunner->setModel}
          cancel={() => setModel(CancelSport)}
          submit={() => setModel(SubmitSport)}
        />
      | Some(Walker(walker)) =>
        <WalkerForm
          walker={walker}
          update={w => w->UpdateWalker->setModel}
          cancel={() => setModel(CancelSport)}
          submit={() => setModel(SubmitSport)}
        />
      | _ => React.null
      }}
      <div id="payment">
        <h2> {str("Betaling")} </h2>
        <h3>
          {str("Totaal: ")}
          <strong>
            {React.string("€")}
            {model.tickets->orderTotal->React.int}
          </strong>
        </h3>
        <div id="overview">
          <ul> {overviewData->React.array} </ul>
        </div>
        <Button primary={Some(true)} type_={Some("submit")}> {str("Betalen!")} </Button>
      </div>
    </form>
  </React.StrictMode>
}

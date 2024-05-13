open Interopt
open Domain

type state =
  | Active
  | Loading
  | Error

type model = {
  state: state,
  contactPerson: contactPerson,
  tickets: array<ticket>,
  food: food,
  currentTicketDetail: option<ticket>,
}

let initialModel = {
  state: Active,
  contactPerson: {
    firstName: "",
    lastName: "",
    email: "",
    collector: None,
    turnstileToken: None,
  },
  tickets: [],
  food: {
    adultSchnitzel: 0,
    adultTartiflette: 0,
    childSchnitzel: 0,
    childTartiflette: 0,
  },
  currentTicketDetail: None,
}

type msg =
  | UpdateContactPerson(contactPerson)
  | UpdateFood(food => food)
  | AddRunner
  | AddWalker
  | UpdateRunner(runner)
  | UpdateWalker(walker)
  | CancelSport
  | SubmitSport
  | Submit
  | OrderSaveFailed

let update = (model: model, msg: msg) => {
  switch msg {
  | UpdateContactPerson(nextContactPerson) => {...model, contactPerson: nextContactPerson}
  | UpdateFood(mapFood) => {...model, food: mapFood(model.food)}
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
      | Some(ticket) => [...model.tickets, ticket]
      }
      {...model, tickets, currentTicketDetail: None}
    }
  | Submit => {...model, state: Loading}
  | OrderSaveFailed => {...model, state: Error}
  }
}

let orderTotal = (model: model) => {
  let sportCost = Array.reduce(model.tickets, 0, (acc, t) => {
    switch t {
    | Runner(_) => prices["runner"] + acc
    | Walker(_) => prices["walker"] + acc
    }
  })

  let foodCost =
    model.food.adultSchnitzel * prices["adultSchnitzel"] +
    model.food.adultTartiflette * prices["adultTartiflette"] +
    model.food.childSchnitzel * prices["childSchnitzel"] +
    model.food.childTartiflette * prices["childTartiflette"]

  sportCost + foodCost
}

let hasPurchaises = (model: model) => {
  model.tickets->isArrayNotEmpty ||
  model.food.adultSchnitzel > 0 ||
  model.food.adultTartiflette > 0 ||
  model.food.childSchnitzel > 0 ||
  model.food.childTartiflette > 0
}

@react.component
let make = () => {
  let (model, setModel) = React.useReducer(update, initialModel)

  let onSubmit = ev => {
    ev->JsxEvent.Form.preventDefault
    setModel(Submit)
  }

  <React.StrictMode>
    <form onSubmit={onSubmit}>
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
      {switch model.state {
      | Error | Loading => React.null
      | Active =>
        <ContactPersonForm
          contactPerson={model.contactPerson} update={cp => cp->UpdateContactPerson->setModel}
        />
      }}
      //
      {switch model.state {
      | Error =>
        <div id="error">
          {React.string("Er ging iets stevig mis! We konden niet overgaan tot de betaling.")}
        </div>
      | Loading => <Loader />
      | Active =>
        <>
          <TicketButtons
            disabled={Belt.Option.isSome(model.currentTicketDetail)}
            addRunner={() => AddRunner->setModel}
            addWalker={() => AddWalker->setModel}
            addAdultSchnitzel={() =>
              setModel(UpdateFood(food => {...food, adultSchnitzel: food.adultSchnitzel + 1}))}
            addAdultTartiflette={() =>
              setModel(UpdateFood(food => {...food, adultTartiflette: food.adultTartiflette + 1}))}
            addChildSchnitzel={() =>
              setModel(UpdateFood(food => {...food, childSchnitzel: food.childSchnitzel + 1}))}
            addChildTartiflette={() =>
              setModel(UpdateFood(food => {...food, childTartiflette: food.childTartiflette + 1}))}
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
        </>
      }}
      {if model->hasPurchaises->not {
        React.null
      } else {
        <div id="payment">
          <h2> {str("Betaling")} </h2>
          <h3>
            {str("Totaal: ")}
            <strong>
              {React.string("€")}
              {model->orderTotal->React.int}
            </strong>
          </h3>
          <div id="overview">
            <ul>
              {model.tickets
              ->Array.mapWithIndex((ticket, idx) => {
                let (price, text) = switch ticket {
                | Runner(runner) => {
                    let disciplineName = switch runner.race {
                    | TenMiles => "Loopwedstrijd (10 miles)"
                    | EightKm => "Loopwedstrijd (8 km)"
                    }
                    (
                      prices["runner"],
                      `${disciplineName} voor ${runner.firstName} ${runner.lastName}`,
                    )
                  }
                | Walker(walker) => (
                    prices["walker"],
                    `Wandeling voor ${walker.firstName} ${walker.lastName}`,
                  )
                }
                <li key={`ticket-${Belt.Int.toString(idx)}`} className="ticket">
                  <span> {React.string(text)} </span>
                  <strong>
                    {euro}
                    {React.int(price)}
                  </strong>
                  <button>
                    <iconify-icon icon="bitcoin-icons:trash-filled" width="24" height="24" />
                  </button>
                </li>
              })
              ->React.array}
              // FOOD
              {if model.food.adultSchnitzel == 0 {
                React.null
              } else {
                <li key="adult-schnitzel" className="food">
                  <div className="actions">
                    <button
                      onClick={ev => {
                        ev->JsxEvent.Mouse.preventDefault
                        setModel(
                          UpdateFood(food => {...food, adultSchnitzel: food.adultSchnitzel + 1}),
                        )
                      }}>
                      <iconify-icon icon="mdi:plus" width="24" height="24" />
                    </button>
                    <button
                      onClick={ev => {
                        ev->JsxEvent.Mouse.preventDefault
                        setModel(
                          UpdateFood(
                            food => {
                              ...food,
                              adultSchnitzel: Math.Int.max(food.adultSchnitzel - 1, 0),
                            },
                          ),
                        )
                      }}>
                      <iconify-icon icon="mdi:minus" width="24" height="24" />
                    </button>
                  </div>
                  <span>
                    {React.int(model.food.adultSchnitzel)}
                    {React.string(` x Schnitzel (volwassene)`)}
                  </span>
                  <strong>
                    {euro}
                    {React.int(model.food.adultSchnitzel * prices["adultSchnitzel"])}
                  </strong>
                  <button
                    onClick={ev => {
                      ev->JsxEvent.Mouse.preventDefault
                      setModel(
                        UpdateFood(
                          food => {
                            ...food,
                            adultSchnitzel: 0,
                          },
                        ),
                      )
                    }}>
                    <iconify-icon icon="bitcoin-icons:trash-filled" width="24" height="24" />
                  </button>
                </li>
              }}
              //
              {if model.food.adultTartiflette == 0 {
                React.null
              } else {
                <li key="adult-tartiflette" className="food">
                  <div className="actions">
                    <button
                      onClick={ev => {
                        ev->JsxEvent.Mouse.preventDefault
                        setModel(
                          UpdateFood(
                            food => {...food, adultTartiflette: food.adultTartiflette + 1},
                          ),
                        )
                      }}>
                      <iconify-icon icon="mdi:plus" width="24" height="24" />
                    </button>
                    <button
                      onClick={ev => {
                        ev->JsxEvent.Mouse.preventDefault
                        setModel(
                          UpdateFood(
                            food => {
                              ...food,
                              adultTartiflette: Math.Int.max(food.adultTartiflette - 1, 0),
                            },
                          ),
                        )
                      }}>
                      <iconify-icon icon="mdi:minus" width="24" height="24" />
                    </button>
                  </div>
                  <span>
                    {React.int(model.food.adultTartiflette)}
                    {React.string(` x Tartiflette (volwassene)`)}
                  </span>
                  <strong>
                    {euro}
                    {React.int(model.food.adultTartiflette * prices["adultTartiflette"])}
                  </strong>
                  <button
                    onClick={ev => {
                      ev->JsxEvent.Mouse.preventDefault
                      setModel(
                        UpdateFood(
                          food => {
                            ...food,
                            adultTartiflette: 0,
                          },
                        ),
                      )
                    }}>
                    <iconify-icon icon="bitcoin-icons:trash-filled" width="24" height="24" />
                  </button>
                </li>
              }}
              //
              {if model.food.childSchnitzel == 0 {
                React.null
              } else {
                <li key="child-schnitzel" className="food">
                  <div className="actions">
                    <button
                      onClick={ev => {
                        ev->JsxEvent.Mouse.preventDefault
                        setModel(
                          UpdateFood(food => {...food, childSchnitzel: food.childSchnitzel + 1}),
                        )
                      }}>
                      <iconify-icon icon="mdi:plus" width="24" height="24" />
                    </button>
                    <button
                      onClick={ev => {
                        ev->JsxEvent.Mouse.preventDefault
                        setModel(
                          UpdateFood(
                            food => {
                              ...food,
                              childSchnitzel: Math.Int.max(food.childSchnitzel - 1, 0),
                            },
                          ),
                        )
                      }}>
                      <iconify-icon icon="mdi:minus" width="24" height="24" />
                    </button>
                  </div>
                  <span>
                    {React.int(model.food.childSchnitzel)}
                    {React.string(` x Schnitzel (kind)`)}
                  </span>
                  <strong>
                    {euro}
                    {React.int(model.food.childSchnitzel * prices["childSchnitzel"])}
                  </strong>
                  <button
                    onClick={ev => {
                      ev->JsxEvent.Mouse.preventDefault
                      setModel(
                        UpdateFood(
                          food => {
                            ...food,
                            childSchnitzel: 0,
                          },
                        ),
                      )
                    }}>
                    <iconify-icon icon="bitcoin-icons:trash-filled" width="24" height="24" />
                  </button>
                </li>
              }}
              //
              {if model.food.childTartiflette == 0 {
                React.null
              } else {
                <li key="child-tartiflette" className="food">
                  <div className="actions">
                    <button
                      onClick={ev => {
                        ev->JsxEvent.Mouse.preventDefault
                        setModel(
                          UpdateFood(
                            food => {...food, childTartiflette: food.childTartiflette + 1},
                          ),
                        )
                      }}>
                      <iconify-icon icon="mdi:plus" width="24" height="24" />
                    </button>
                    <button
                      onClick={ev => {
                        ev->JsxEvent.Mouse.preventDefault
                        setModel(
                          UpdateFood(
                            food => {
                              ...food,
                              childTartiflette: Math.Int.max(food.childTartiflette - 1, 0),
                            },
                          ),
                        )
                      }}>
                      <iconify-icon icon="mdi:minus" width="24" height="24" />
                    </button>
                  </div>
                  <span>
                    {React.int(model.food.childTartiflette)}
                    {React.string(` x Tartiflette (kind)`)}
                  </span>
                  <strong>
                    {euro}
                    {React.int(model.food.childTartiflette * prices["childTartiflette"])}
                  </strong>
                  <button
                    onClick={ev => {
                      ev->JsxEvent.Mouse.preventDefault
                      setModel(
                        UpdateFood(
                          food => {
                            ...food,
                            childTartiflette: 0,
                          },
                        ),
                      )
                    }}>
                    <iconify-icon icon="bitcoin-icons:trash-filled" width="24" height="24" />
                  </button>
                </li>
              }}
            </ul>
          </div>
          {switch model.state {
          | Error | Loading => React.null
          | Active => <Button primary={true} type_={"submit"}> {str("Betalen!")} </Button>
          }}
        </div>
      }}
    </form>
  </React.StrictMode>
}

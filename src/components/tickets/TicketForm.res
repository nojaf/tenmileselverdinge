open Interopt
open Domain

type state =
  | Active
  | Loading
  | Error

type turnstileState =
  | Unknown
  | Set(string)
  | Missing

type model = {
  state: state,
  contactPerson: contactPerson,
  turnstile: turnstileState,
  tickets: array<ticket>,
  food: food,
  currentTicketDetail: option<ticket>,
  editTicketIndex: option<int>,
}

let initialModel = {
  state: Active,
  contactPerson: {
    firstName: "",
    lastName: "",
    email: "",
    collector: None,
  },
  turnstile: Unknown,
  tickets: [],
  food: {
    adultSchnitzel: 0,
    adultTartiflette: 0,
    childSchnitzel: 0,
    childTartiflette: 0,
  },
  currentTicketDetail: None,
  editTicketIndex: None,
}

type msg =
  | UpdateContactPerson(contactPerson)
  | SetTurnStile(string)
  | TurnStileMissing
  | UpdateFood(food => food)
  | AddRunner
  | AddWalker
  | UpdateRunner(runner)
  | UpdateWalker(walker)
  | EditTicket(int)
  | CancelSport
  | SubmitSport
  | Submit
  | SetInvalid
  | OrderSaveFailed

let update = (model: model, msg: msg) => {
  switch msg {
  | UpdateContactPerson(nextContactPerson) => {...model, contactPerson: nextContactPerson}
  | SetTurnStile(token) => {...model, turnstile: Set(token)}
  | TurnStileMissing => {...model, turnstile: Missing, state: Active}
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
  | EditTicket(ticketIndex) =>
    switch model.tickets[ticketIndex] {
    | None => model
    | Some(ticket) => {
        ...model,
        currentTicketDetail: Some(ticket),
        editTicketIndex: Some(ticketIndex),
      }
    }
  | CancelSport => {...model, currentTicketDetail: None}
  | SubmitSport => {
      let tickets = switch model.currentTicketDetail {
      | None => model.tickets
      | Some(ticket) =>
        switch model.editTicketIndex {
        | None => [...model.tickets, ticket]
        | Some(ticketIdx) =>
          model.tickets->Array.mapWithIndex((t, idx) => {
            ticketIdx == idx ? ticket : t
          })
        }
      }
      {...model, tickets, currentTicketDetail: None, editTicketIndex: None}
    }
  | Submit => {...model, state: Loading}
  | SetInvalid => {...model, state: Active}
  | OrderSaveFailed => {...model, state: Error}
  }
}

@scope("import.meta.env") @val external turnstileKey: string = "PUBLIC_TURNSTILE"
// let turnstileKey = "3x00000000000000000000FF"
/*
Dummy sitekeys and secret keys

Sitekey	Description	Visibility
1x00000000000000000000AA	Always passes	visible
2x00000000000000000000AB	Always blocks	visible
1x00000000000000000000BB	Always passes	invisible
2x00000000000000000000BB	Always blocks	invisible
3x00000000000000000000FF	Forces an interactive challenge	visible
 */

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

@val external location: Dom.location = "location"
@set external setHref: (Dom.location, string) => unit = "href"

@react.component
let make = () => {
  let contactPersonFormRef = React.useRef(Nullable.null)
  let (model, setModel) = React.useReducer(update, initialModel)
  let updateTurnStileKey = token => setModel(SetTurnStile(token))

  let onSubmit = ev => {
    ev->JsxEvent.Mouse.preventDefault
    setModel(Submit)
    switch contactPersonFormRef.current {
    | Nullable.Null
    | Nullable.Undefined => ()
    | Nullable.Value(contactPersonFormElement) =>
      if !(contactPersonFormElement->checkValidity()) {
        contactPersonFormElement->addToClassList("invalid-form")
        scrollIntoView(contactPersonFormElement, ~scrollIntoViewOptions={behavior: "smooth"})
        setModel(SetInvalid)
      } else {
        switch model.turnstile {
        | Unknown
        | Missing =>
          setModel(TurnStileMissing)
        | Set(token) =>
          if model->hasPurchaises {
            let requestData = {
              turnstileToken: token,
              contactPerson: model.contactPerson,
              tickets: model.tickets,
              food: model.food,
            }

            Api.createOrder(~data=requestData)
            ->Promise.thenResolve(response => {
              setHref(location, response.data)
              ()
            })
            ->Promise.catch(exn => {
              Console.error(exn)
              setModel(OrderSaveFailed)
              Promise.resolve()
            })
            ->Promise.done
          }
        }
      }
    }
  }

  <React.StrictMode>
    {<div id="form-container">
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
      //
      {switch model.state {
      | Error =>
        <div id="error">
          {React.string("Er ging iets stevig mis! We konden niet overgaan tot de betaling.")}
        </div>
      | Loading => <Loader />
      | Active =>
        <>
          <ContactPersonForm
            contactPerson={model.contactPerson}
            update={cp => cp->UpdateContactPerson->setModel}
            formRef={ReactDOM.Ref.domRef(contactPersonFormRef)}
          />
          <div
            id="turnstile-container"
            className={switch model.turnstile {
            | Missing => "missing"
            | _ => ""
            }}>
            //
            <label> {str("Even checken of je een echte persoon bent!")} </label>
            <Turnstile siteKey={turnstileKey} onSuccess={updateTurnStileKey} />
          </div>
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
      <div id="payment">
        <h2> {str("Betaling")} </h2>
        <h3>
          {str("Totaal: ")}
          <strong>
            {React.string("€")}
            {model->orderTotal->React.int}
          </strong>
        </h3>
        {if model->hasPurchaises->not {
          React.null
        } else {
          <>
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
                    <div className="actions">
                      <button
                        onClick={ev => {
                          ev->JsxEvent.Mouse.preventDefault
                          setModel(EditTicket(idx))
                        }}>
                        <iconify-icon icon="material-symbols-light:edit" width="24" height="24" />
                      </button>
                    </div>
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
            | Active =>
              <Button primary={true} type_={"submit"} onClick={onSubmit}>
                {str("Betalen!")}
              </Button>
            }}
          </>
        }}
      </div>
    </div>}
  </React.StrictMode>
}

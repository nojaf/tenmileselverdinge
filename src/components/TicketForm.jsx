import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { addDoc } from "firebase/firestore/lite";
import { useMediaQuery } from "usehooks-ts";
import { ordersCollections, apiUrl } from "../firebase-config.js";
import { Turnstile } from "@marsidev/react-turnstile";

const ticketTypes = {
  "race-schnitzel": {
    price: 26,
    title: "Loopwedstrijd + Schnitzel (Volwassene)",
    summary: "Loopwedstrijd + Schnitzel",
  },
  "race-tartiflette": {
    price: 26,
    title: "Loopwedstrijd + Tartiflette (Volwassene)",
    summary: "Loopwedstrijd + Tartiflette",
  },
  race: {
    price: 10,
    title: "Loopwedstrijd",
    summary: "Loopwedstrijd",
  },
  schnitzel: {
    price: 18,
    title: "Schnitzel (Volwassene)",
    summary: "Schnitzel Volwassene",
  },
  tartiflette: {
    price: 18,
    title: "Tartiflette (Volwassene)",
    summary: "Tartiflette Volwassene",
  },
  "child-schnitzel": {
    price: 10,
    title: "Schnitzel (Kind t.e.m. 12 jaar)",
    summary: "Schnitzel Kind",
  },
  "child-tartiflette": {
    price: 10,
    title: "Tartiflette (Kind t.e.m. 12 jaar)",
    summary: "Tartiflette Kind",
  },
};

function AddTicket({ onSelect }) {
  useEffect(() => {
    const loader = document.querySelector("#dom-loader");
    if (loader) {
      loader.remove();
    }
  }, []);

  const [isOpen, setIsOpen] = useState(false);
  const onItemSelect = (item) => (ev) => {
    ev.preventDefault();
    onSelect(item);
    setIsOpen(false);
  };

  return (
    <div id="add-ticket">
      <button
        className={"primary"}
        title={"Klik om je soort ticket te kiezen!"}
        onClick={(ev) => {
          ev.preventDefault();
          setIsOpen(!isOpen);
        }}
      >
        <span>Voeg ticket toe!</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="1024"
          height="1024"
          viewBox="0 0 1024 1024"
        >
          <path
            fill="currentColor"
            d="M884 256h-75c-5.1 0-9.9 2.5-12.9 6.6L512 654.2L227.9 262.6c-3-4.1-7.8-6.6-12.9-6.6h-75c-6.5 0-10.3 7.4-6.5 12.7l352.6 486.1c12.8 17.6 39 17.6 51.7 0l352.6-486.1c3.9-5.3.1-12.7-6.4-12.7z"
          />
        </svg>
      </button>
      {isOpen && (
        <div className={"items"}>
          {Object.keys(ticketTypes).map((key) => {
            const ticketType = ticketTypes[key];
            return (
              <a key={key} href={"#"} onClick={onItemSelect(key)}>
                {ticketType.title}
                <strong>€{ticketType.price}</strong>
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}

function TrashCan() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="512"
      height="512"
      viewBox="0 0 512 512"
    >
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="32"
        d="m112 112l20 320c.95 18.49 14.4 32 32 32h184c17.67 0 30.87-13.51 32-32l20-320"
      />
      <path
        fill="currentColor"
        stroke="currentColor"
        strokeLinecap="round"
        strokeMiterlimit="10"
        strokeWidth="32"
        d="M80 112h352"
      />
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="32"
        d="M192 112V72h0a23.93 23.93 0 0 1 24-24h80a23.93 23.93 0 0 1 24 24h0v40m-64 64v224m-72-224l8 224m136-224l-8 224"
      />
    </svg>
  );
}

function Plus() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
    >
      <path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2Z" />
    </svg>
  );
}

function Minus() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
    >
      <path fill="currentColor" d="M19 13H5v-2h14v2Z" />
    </svg>
  );
}

function CartSummary({ tickets }) {
  const summaryData = tickets.reduce((acc, ticket) => {
    if (acc[ticket.type]) {
      acc[ticket.type] += ticket.amount;
    } else {
      acc[ticket.type] = ticket.amount;
    }

    return acc;
  }, {});

  const summaryItems = Object.keys(summaryData).map((ticketType) => {
    return {
      type: ticketType,
      amount: summaryData[ticketType],
      summary: ticketTypes[ticketType].summary,
    };
  });

  return (
    <summary>
      <h4>Winkelmandje:</h4>
      <ul>
        {summaryItems.map((si) => (
          <li key={si.type}>
            {si.summary} x {si.amount} (
            <em>€{si.amount * ticketTypes[si.type].price}</em>)
          </li>
        ))}
      </ul>
    </summary>
  );
}

function TicketForm() {
  const { register, handleSubmit, control, setValue, getValues } = useForm();
  const [currentState, setCurrentState] = useState("form");
  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "tickets",
  });
  const [token, setToken] = useState(null);
  const isTablet = useMediaQuery("screen and (min-width: 960px)");
  const removeTicket = (removeIdx) => {
    remove(removeIdx);
  };

  const increaseAmount = (idx) => {
    const field = fields[idx];
    update(idx, { ...field, amount: field.amount + 1 });
  };

  const decreaseAmount = (idx) => {
    const field = fields[idx];
    const amount = field.amount - 1;
    if (amount === 0) {
      removeTicket(idx);
    } else {
      update(idx, { ...field, amount: field.amount - 1 });
    }
  };
  const totalPrice = () => {
    if (fields.length === 0) {
      return 0;
    } else {
      return fields.reduce((acc, ticket) => {
        const price = ticketTypes[ticket.type].price * ticket.amount;
        return acc + price;
      }, 0);
    }
  };

  const onSubmit = async (data) => {
    try {
      console.log(data);
      console.table(data.tickets);
      setCurrentState("loading");
      const document = await addDoc(ordersCollections, data);
      const orderId = document.id;
      console.log(orderId);
      console.log("Order created in FireBase, use ID to create payment");
      const response = await fetch(`${apiUrl}?orderId=${orderId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: token }),
      });
      const { paymentUrl } = await response.json();
      window.location.href = paymentUrl;
    } catch (error) {
      console.error(error);
      setCurrentState("error");
    }
  };

  switch (currentState) {
    case "error":
      return (
        <div id="error">
          <h2>Yikes, er ging iets mis</h2>
          <p>
            Er ging iets mis bij het verwerken van je bestelling. Probeer het
            later opnieuw aub. <br />
            Indien het probleem zich blijft voordoen kan je contact opnemen via{" "}
            <a href="mailto:info@tenmileselverdinge.be">
              info@tenmileselverdinge.be
            </a>
          </p>
        </div>
      );
    case "loading":
      return (
        <div className="loading">
          <div></div>
        </div>
      );
    default:
      return (
        <div id={"ticket-form"}>
          {isTablet && fields.length > 0 && <CartSummary tickets={fields} />}
          <form onSubmit={handleSubmit(onSubmit)}>
            <div id={"turnstile-wrapper"}>
              <em>Even checken of je echt bent!</em>
              <Turnstile
                siteKey="0x4AAAAAAAF9j0iVC3TA7pbG"
                onSuccess={setToken}
              />
            </div>
            {fields.map((field, idx) => {
              const ticketType = ticketTypes[field.type];
              const firstName = getValues([`tickets.${idx}.firstName`], null);
              const hasRace = field.type.startsWith("race");
              const price = hasRace
                ? ticketType.price
                : ticketType.price * field.amount;

              return (
                <div key={field.id} className={"ticket"}>
                  <div className="heading">
                    {!hasRace && <strong>{`${field.amount} x `} </strong>}
                    {!hasRace && (
                      <strong
                        className={"plus"}
                        onClick={() => {
                          increaseAmount(idx);
                        }}
                      >
                        <Plus />
                      </strong>
                    )}
                    {!hasRace && (
                      <strong
                        className={"minus"}
                        onClick={() => {
                          decreaseAmount(idx);
                        }}
                      >
                        <Minus />
                      </strong>
                    )}
                    <h3>
                      {ticketType.title}{" "}
                      {hasRace && firstName.length === 1 && firstName[0] && (
                        <span>
                          <br />
                          voor {firstName[0]}
                        </span>
                      )}
                    </h3>
                    <div>
                      <strong>€{price}</strong>
                      <strong
                        onClick={() => removeTicket(idx)}
                        className="delete"
                      >
                        <TrashCan />
                      </strong>
                    </div>
                    <input
                      type={"hidden"}
                      {...register(`tickets.${idx}.type`, { required: true })}
                    />
                    <input
                      type={"hidden"}
                      {...register(`tickets.${idx}.amount`, { required: true })}
                    />
                  </div>
                  {hasRace && (
                    <div className="body">
                      <div>
                        <label className={"required"}>Afstand</label>
                        <div className="radio-container">
                          <input
                            {...register(`tickets.${idx}.distance`, {
                              required: true,
                            })}
                            type="radio"
                            value={"10miles"}
                            id={`tickets.${idx}.distance-10miles`}
                            defaultChecked={true}
                          />
                          <label
                            className={"radio"}
                            htmlFor={`tickets.${idx}.distance-10miles`}
                          >
                            Ten Miles
                          </label>
                          <input
                            {...register(`tickets.${idx}.distance`, {
                              required: true,
                            })}
                            type="radio"
                            value={"8km"}
                            id={`tickets.${idx}.distance-8km`}
                          />
                          <label
                            className={"radio"}
                            htmlFor={`tickets.${idx}.distance-8km`}
                          >
                            8 km
                          </label>
                        </div>
                      </div>
                      <div>
                        <label
                          className={"required"}
                          htmlFor={`tickets.${idx}.firstName`}
                        >
                          Voornaam
                        </label>
                        <input
                          type="text"
                          id={`tickets.${idx}.firstName`}
                          required={true}
                          placeholder={"Voornaam"}
                          {...register(`tickets.${idx}.firstName`, {
                            required: true,
                          })}
                        />
                      </div>
                      <div>
                        <label
                          className={"required"}
                          htmlFor={`tickets.${idx}.lastName`}
                        >
                          Familienaam
                        </label>
                        <input
                          type="text"
                          id={`tickets.${idx}.lastName`}
                          placeholder={"Familienaam"}
                          {...register(`tickets.${idx}.lastName`, {
                            required: true,
                          })}
                        />
                      </div>
                      <div>
                        <label
                          htmlFor={`tickets.${idx}.birthDate`}
                          className={"required"}
                        >
                          Geboortedatum
                        </label>
                        <input
                          type="date"
                          id={`tickets.${idx}.birthDate`}
                          placeholder={"Geboortedatum"}
                          min={"1950-01-01"}
                          max={"2011-06-10"}
                          {...register(`tickets.${idx}.birthDate`, {
                            required: true,
                            valueAsDate: true,
                          })}
                        />
                      </div>
                      <div>
                        <label htmlFor={`tickets.${idx}.residence`}>
                          Woonplaats
                        </label>
                        <input
                          type="text"
                          id={`tickets.${idx}.residence`}
                          placeholder={"Woonplaats"}
                          {...register(`tickets.${idx}.residence`, {
                            required: false,
                          })}
                        />
                      </div>
                      <div>
                        <label htmlFor={`tickets.${idx}.phone`}>Telefoon</label>
                        <input
                          type="text"
                          id={`tickets.${idx}.phone`}
                          placeholder={"Telefoon  (in geval van nood)"}
                          {...register(`tickets.${idx}.phone`, {
                            required: false,
                          })}
                        />
                      </div>
                      <div>
                        <label>Geslacht</label>
                        <div className="radio-container">
                          <input
                            {...register(`tickets.${idx}.gender`, {
                              required: true,
                            })}
                            type="radio"
                            value={"m"}
                            id={`tickets.${idx}.gender-m`}
                            defaultChecked={true}
                          />
                          <label
                            className={"radio"}
                            htmlFor={`tickets.${idx}.gender-m`}
                          >
                            M
                          </label>
                          <input
                            {...register(`tickets.${idx}.gender`, {
                              required: true,
                            })}
                            type="radio"
                            value={"v"}
                            id={`tickets.${idx}.gender-v`}
                          />
                          <label
                            className={"radio"}
                            htmlFor={`tickets.${idx}.gender-v`}
                          >
                            V
                          </label>
                          <input
                            {...register(`tickets.${idx}.gender`, {
                              required: true,
                            })}
                            type="radio"
                            value={"x"}
                            id={`tickets.${idx}.gender-x`}
                          />
                          <label
                            className={"radio"}
                            htmlFor={`tickets.${idx}.gender-x`}
                          >
                            X
                          </label>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
            <AddTicket
              onSelect={(newTicket) => {
                if (newTicket.startsWith("race")) {
                  append({ type: newTicket, amount: 1 });
                } else {
                  const existingTicket = fields.find(
                    (ticket) => ticket.type === newTicket
                  );
                  if (existingTicket) {
                    update(
                      fields.findIndex((ticket) => ticket.type === newTicket),
                      { ...existingTicket, amount: existingTicket.amount + 1 }
                    );
                  } else {
                    append({ type: newTicket, amount: 1 });
                  }
                }
              }}
            />
            {!isTablet && fields.length > 0 && <CartSummary tickets={fields} />}
            <h2>Totaal: €{totalPrice()}</h2>
            <input
              type="submit"
              disabled={fields.length === 0}
              title={
                fields.length === 0
                  ? "Gelieve eerst tickets toe te voegen."
                  : "Ga verder om te betalen."
              }
              className={"btn primary"}
              value={"Bestellen!"}
            />
          </form>
        </div>
      );
  }
}

export default TicketForm;

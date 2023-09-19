import { timeRegistrationApiUrl } from "../firebase-config.js";
import { useEffect, useState } from "react";

function TimeRegistration() {
  const [apiHeader, setApiHeader] = useState("");
  const [apiKey, setApiKey] = useState("");
  useEffect(() => {
    setApiHeader(localStorage.getItem("apiHeader") || "");
    setApiKey(localStorage.getItem("apiKey") || "");
  }, []);
  const [savingNumbers, setSavingNumbers] = useState([]);

  function setHeader(header) {
    localStorage.setItem("apiHeader", header);
    setApiHeader(header);
  }

  function setKey(key) {
    localStorage.setItem("apiKey", key);
    setApiKey(key);
  }

  const [runners, setRunners] = useState([""]);
  function isNumber(value) {
    return typeof value === "number" && !Number.isNaN(value);
  }

  function updateRunner(idx) {
    return (evt) => {
      setRunners((prevRunners) => {
        const nextRunners = prevRunners.map((r, rIdx) =>
          rIdx === idx ? parseInt(evt.target.value) : r
        );

        const addNext = nextRunners.every(isNumber);
        return addNext ? [...nextRunners, ""] : nextRunners;
      });
    };
  }

  function removeRunner(number) {
    setRunners((prevRunners) => {
      return prevRunners.filter((r) => r !== number);
    });
  }

  function registerTime(number) {
    return (evt) => {
      evt.preventDefault();

      const isLocal = window.location.hostname === "localhost";
      const start = isLocal ? new Date() : new Date(2023, 8, 23, 16, 0, 0, 0);
      const end = (() => {
        if (isLocal) {
          const date = new Date();
          const randomMinutes = Math.floor(Math.random() * (120 - 60 + 1)) + 60;
          date.setMinutes(date.getMinutes() + randomMinutes);
          return date;
        } else {
          return new Date();
        }
      })();

      const timing = {
        number,
        start,
        end,
      };

      setSavingNumbers((prevSavingNumbers) => {
        return [...prevSavingNumbers, number];
      });

      fetch(timeRegistrationApiUrl, {
        method: "POST",
        body: JSON.stringify(timing),
        headers: {
          [apiHeader]: apiKey,
        },
      })
        .then(() => {
          console.log(`${number} was registered!`);
          removeRunner(number);
          setSavingNumbers((prevSavingNumbers) => {
            return prevSavingNumbers.filter((prev) => prev !== number);
          });
        })
        .catch((err) => {
          console.log(`Could not save ${number}`);
          console.error(err);
          setSavingNumbers((prevSavingNumbers) => {
            return prevSavingNumbers.filter((prev) => prev !== number);
          });
        });
    };
  }

  return (
    <form onSubmit={(ev) => ev.preventDefault()}>
      {runners.map((r, idx) => {
        return (
          <div key={`runner-${idx}`}>
            <input
              type="number"
              value={r}
              onChange={updateRunner(idx)}
              placeholder={"Nummer loper"}
            />
            <button
              className={"primary"}
              onClick={registerTime(r)}
              disabled={savingNumbers.indexOf(r) !== -1}
            >
              Save
            </button>
          </div>
        );
      })}
      <input
        name="apiHeader"
        placeholder="API header"
        required
        value={apiHeader}
        onChange={(ev) => setHeader(ev.target.value)}
      />
      <input
        name="apiKey"
        placeholder="API key"
        required
        value={apiKey}
        onChange={(evt) => setKey(evt.target.value)}
      />
    </form>
  );
}

export default TimeRegistration;

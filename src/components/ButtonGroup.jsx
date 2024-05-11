import styled from "@emotion/styled";

const StyledButtonGroup = styled.div`
  display: flex;
  margin-bottom: var(--spacing-300);
  font-family: var(--heading-font);

  button {
    border-radius: 0;
    border: 1px solid var(--dark-200);
    color: var(--dark-900);
    background-color: var(--dark-50);
    padding: var(--spacing-50) var(--spacing-300);
    font-size: var(--font-300);
    position: relative;
    text-transform: uppercase;
  }

  button:first-of-type {
    border-radius: var(--radius) 0 0 var(--radius);
  }

  button:last-of-type {
    border-radius: 0 var(--radius) var(--radius) 0;
  }

  button.active {
    outline: 2px solid var(--tenmiles-500);
    background-color: var(--tenmiles-50);
    border: none;
    z-index: 2;
    box-shadow:
      var(--white) 0 0 0 0,
      var(--primary) 0 0 0 2px,
      transparent 0 0 0 0;
  }

  button:hover {
    background-color: var(--tenmiles-100);
    cursor: pointer;
  }

  button:active {
    background-color: var(--tenmiles-200);
  }
`;

function ButtonGroup({ options = [], activeOption = null }) {
  return (
    <StyledButtonGroup>
      {options.map((o, i) => {
        const className = o.text === activeOption ? "active" : "";

        return (
          <button
            className={className}
            onClick={(ev) => {
              ev.preventDefault();
              if (o.onClick) {
                o.onClick();
              }
            }}
            key={o.text}
          >
            {o.text}
          </button>
        );
      })}
    </StyledButtonGroup>
  );
}

export default ButtonGroup;

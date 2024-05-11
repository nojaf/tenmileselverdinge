/*
.btn,
button {
  text-decoration: none;
  appearance: none;
  background-color: #fafbfc;
  border: 1px solid var(--dark-200);
  border-radius: var(--radius);
  box-shadow:
    var(--dark-50) 0 1px 0,
    rgba(255, 255, 255, 0.25) 0 1px 0 inset;
  box-sizing: border-box;
  color: var(--dark);
  cursor: pointer;
  display: inline-block;
  font-family: var(--font);
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  list-style: none;
  padding: 6px 16px;
  position: relative;
  transition: background-color 0.2s cubic-bezier(0.3, 0, 0.5, 1);
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  vertical-align: middle;
  white-space: nowrap;
  word-wrap: break-word;
}

.btn:hover,
button:hover {
  background-color: #f3f4f6;
  text-decoration: none;
  transition-duration: 0.1s;
  transform: translateY(1px);
}

.btn:disabled,
button:disabled,
.btn.primary:disabled {
  background-color: #fafbfc;
  border-color: rgba(27, 31, 35, 0.15);
  color: #959da5;
  cursor: not-allowed;
}

.btn:active,
button:active {
  background-color: #edeff2;
  box-shadow: rgba(225, 228, 232, 0.2) 0 1px 0 inset;
  transition: none 0s;
}

.btn:focus,
button:focus {
  outline: 1px transparent;
}

.btn:before,
button:before {
  display: none;
}

.btn::-webkit-details-marker {
  display: none;
}

.btn.primary,
button.primary {
  background-color: var(--tenmiles-400);
  border-color: var(--tenmiles-500);
  color: var(--white);
}

.btn.primary:hover,
button.primary:hover,
.btn.primary:focus,
button.primary:focus {
  background-color: var(--tenmiles-200);
  color: var(--dark);
}

*/

import styled from "@emotion/styled";

const Button = ({
  children,
  primary = false,
  danger = false,
  large = false,
  ...props
}) => {
  let color = "var(--dark-900)";
  let backgroundColor = "var(--tenmiles-50)";
  let backgroundColorHover = "var(--tenmiles-100)";
  let backgroundColorActive = "var(--tenmiles-200)";
  let fontSize = "var(--font-300);";
  let padding = "var(--spacing-100) var(--spacing-200)";
  let borderColor = "var(--dark-200)";

  if (primary) {
    color = "var(--white)";
    backgroundColor = "var(--tenmiles-500)";
    backgroundColorHover = "var(--tenmiles-600)";
    backgroundColorActive = "var(--tenmiles-700)";
    borderColor = "var(--tenmiles-600)";
  }

  if (danger) {
    backgroundColor = "var(--danger)";
    color = "var(--white)";
    backgroundColorHover = "var(--danger-hover)";
    backgroundColorActive = "var(--danger-border);";
    borderColor = "var(--danger-border);";
  }

  if (large) {
    fontSize = "var(--font-500);";
    padding = "var(--spacing-300) var(--spacing-500)";
  }

  const StyledButton = styled.button`
    text-decoration: none;
    appearance: none;
    border: 1px solid ${borderColor};
    border-radius: var(--radius);
    box-shadow:
      transparent 0 0px 0,
      rgba(255, 255, 255, 0.25) 0 1px 0 inset;
    color: ${color};
    background-color: ${backgroundColor};
    cursor: pointer;
    display: inline-block;
    font-family: var(--heading-font);
    font-size: ${fontSize};
    font-weight: 600;
    line-height: 20px;
    list-style: none;
    padding: ${padding};
    position: relative;
    transition: background-color 0.2s cubic-bezier(0.3, 0, 0.5, 1);
    transition-duration: 0.1s;
    user-select: none;
    -webkit-user-select: none;
    touch-action: manipulation;
    vertical-align: middle;
    white-space: nowrap;
    word-wrap: break-word;
    text-transform: uppercase;

    &:hover {
      background-color: ${backgroundColorHover};
    }

    &:active {
      background-color: ${backgroundColorActive};
      box-shadow: rgba(225, 228, 232, 0.2) 0 1px 0 inset;
      transition: none 0s;
    }

    &:focus {
      outline: 1px transparent;
    }

    &:disabled {
      background-color: var(--dark-200);
      color: var(--dark-50);
      opacity: 0.25;
      cursor: not-allowed;
    }
  `;

  return <StyledButton {...props}>{children}</StyledButton>;
};

export default Button;

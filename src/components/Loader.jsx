import styled from "@emotion/styled";

const StyledLoader = styled.div`
  display: flex;
  --size: var(--spacing-700);

  .loader {
    margin: auto;
    width: var(--size);
    height: var(--size);
    border-radius: 50%;
    display: inline-block;
    position: relative;
    background: linear-gradient(
      0deg,
      var(--tenmiles-50) 33%,
      var(--tenmiles-500) 100%
    );
    box-sizing: border-box;
    animation: rotation 1s linear infinite;
  }
  .loader::after {
    content: "";
    box-sizing: border-box;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: calc(var(--size) - 5px);
    height: calc(var(--size) - 5px);
    border-radius: 50%;
    background: var(--white);
  }
  @keyframes rotation {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const Loader = () => {
  return (
    <StyledLoader>
      <span className="loader"></span>
    </StyledLoader>
  );
};

export default Loader;

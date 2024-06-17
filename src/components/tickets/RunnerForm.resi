open Domain

@react.component
let make: (
  ~runner: runner,
  ~update: runner => unit,
  ~cancel: unit => unit,
  ~submit: unit => unit,
) => Jsx.element

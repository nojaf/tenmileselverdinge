open Domain

@react.component
let make: (
  ~walker: walker,
  ~update: walker => unit,
  ~cancel: unit => unit,
  ~submit: unit => unit,
) => Jsx.element

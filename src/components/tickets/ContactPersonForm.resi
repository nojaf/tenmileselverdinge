open Domain

@react.component
let make: (~contactPerson: contactPerson, ~update: contactPerson => unit) => Jsx.element

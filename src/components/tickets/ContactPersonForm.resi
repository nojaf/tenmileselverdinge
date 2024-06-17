open Domain

@react.component
let make: (
  ~contactPerson: contactPerson,
  ~update: contactPerson => unit,
  ~formRef: ReactDOM.domRef,
) => Jsx.element

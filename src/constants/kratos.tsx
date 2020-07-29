interface FormLabel {
  label: string;
  priority: number;
}

export const FORM_LABELS: { [key: string]: FormLabel } = {
  "to_verify": {
    label: "Email",
    priority: 100
  },
  "csrf_token": {
    label: "",
    priority: 100
  },
  "traits.email": {
    label: "Email",
    priority: 90,
  },
  email: {
    label: "Email",
    priority: 80
  },
  identifier: {
    label: "Email",
    priority: 80
  },
  password: {
    label: "Password",
    priority: 80
  }
}

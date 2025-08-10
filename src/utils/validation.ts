export function validateField(
  value: string,
  rules: { required?: boolean; minLength?: number } = {}
) {
  if (rules.required && !value.trim()) {
    return "This field is required";
  }
  if (rules.minLength && value.length < rules.minLength) {
    return `Minimum length is ${rules.minLength}`;
  }
  return null;
}

export function runValidations(
  formData: Record<string, any>,
  validationRules: Record<string, { required?: boolean; minLength?: number }>
) {
  const errors: Record<string, string | null> = {};

  for (const field in validationRules) {
    const value = formData[field] ?? "";
    const rules = validationRules[field];
    const error = validateField(value, rules);
    if (error) {
      errors[field] = error;
    }
  }

  return errors;
}

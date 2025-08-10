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

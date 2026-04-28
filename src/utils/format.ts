export const formatPhoneNumber = (value: string) => {
  const cleaned = ('' + value).replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{0,4})(\d{0,4})$/);
  if (match) {
    if (match[2] && match[3]) return `${match[1]}-${match[2]}-${match[3]}`;
    if (match[2]) return `${match[1]}-${match[2]}`;
    return match[1];
  }
  return cleaned;
};

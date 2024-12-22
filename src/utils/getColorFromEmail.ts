const colors = [
  '#1976d2',
  '#388e3c',
  '#d32f2f',
  '#7b1fa2',
  '#f57c00',
  '#0288d1',
];

export const getColorFromEmail = (email: string) => {
  const hash = email
    .split('')
    .reduce((acc, char) => char.charCodeAt(0) + acc, 0);
  return colors[hash % colors.length];
};

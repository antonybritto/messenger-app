export function getLocaleString(date, o) {
  const config = Object.assign({
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }, o);
  return new Date(date).toLocaleDateString('en-US', config);
}

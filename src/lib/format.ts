// dates
export const cs_formatDate = (value: string | Date, options: Intl.DateTimeFormatOptions = { dateStyle: "medium" }) =>
  new Intl.DateTimeFormat("en-US", options).format(new Date(value));

// money
export const cs_formatMoney = (value: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);

// query string from filters
export const cs_buildQuery = (params: Record<string, string | number | undefined>) => {
  const cs_search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") cs_search.set(key, String(value));
  });
  return cs_search.toString();
};

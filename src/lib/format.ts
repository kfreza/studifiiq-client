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

// booking date "YYYY-MM-DD" shown without timezone shift
export const cs_formatBookingDate = (date: string) =>
  new Intl.DateTimeFormat("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric", timeZone: "UTC" }).format(
    new Date(`${date}T00:00:00.000Z`)
  );

// local today as "YYYY-MM-DD"
export const cs_todayString = () => new Date().toLocaleDateString("en-CA");

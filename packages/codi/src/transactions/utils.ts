const parseNumberStringDE = (s: string) => Number.parseFloat(s.replace(/\./, "").replace(/,/, "."));

const parseDateStringDE = (s: string) => {
  const [day, month, year] = s.split(/\./).map((value) => Number.parseInt(value, 10));
  return new Date(year, month - 1, day);
};

export { parseDateStringDE, parseNumberStringDE };

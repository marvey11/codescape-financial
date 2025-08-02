const locale = "en-GB"; // This could be dynamic in a real app
const pluralRules = new Intl.PluralRules(locale);

type PluralizationStrings = {
  [key in Intl.LDMLPluralRule]?: string;
};

// In a real app, this would come from JSON files per locale.
const translations: { [key: string]: PluralizationStrings } = {
  "table.footer.rows": {
    zero: "No rows",
    one: "{count} row",
    other: "{count} rows",
  },
};

export const t = (
  key: keyof typeof translations,
  values: { count: number },
) => {
  const strings = translations[key];
  if (!strings) {
    return key;
  }

  const rule = pluralRules.select(values.count);

  // Fallback to 'other' is a good practice
  const template = strings[rule] ?? strings.other;
  if (!template) {
    return key;
  }

  return template.replace("{count}", values.count.toString());
};

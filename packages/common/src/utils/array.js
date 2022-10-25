export const indexBy = (computeKey, list) =>
  list.reduce((acc, item) => {
    acc[computeKey(item, list)] = item;
    return acc;
  }, {});

export const groupBy = (computeKey, list) =>
  list.reduce((acc, item) => {
    const key = computeKey(item, list);
    const group = acc[key] ?? [];
    acc[key] = [...group, item];
    return acc;
  }, {});

export const unique = (list) => [...new Set(list)];

export const reverse = (list) => [...list].reverse();

export const comparator = (...sortValueExtractors) => {
  return (e1, e2) => {
    for (const sortValueExtractor of sortValueExtractors) {
      const extractValue =
        typeof sortValueExtractor === "string"
          ? (e) => e[sortValueExtractor]
          : typeof sortValueExtractor === "function"
          ? sortValueExtractor
          : typeof sortValueExtractor.value === "string"
          ? (e) => e[sortValueExtractor.value]
          : sortValueExtractor.value;

      const desc = sortValueExtractor?.order === "desc";

      const [v1, v2] = [e1, e2].map(extractValue);
      if (v1 < v2) return desc ? 1 : -1;
      if (v1 > v2) return desc ? -1 : 1;
    }
    return 0;
  };
};

export const sort = (comparator, list) => [...list].sort(comparator);

export const sortBy = (...args) => {
  const sortValueExtractors = args.slice(0, -1);
  const list = args.slice(-1)[0];
  return sort(comparator(sortValueExtractors), list);
};

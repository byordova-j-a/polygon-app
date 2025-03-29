export const isNull = (value: unknown) => {
  return value === null;
};

export const createEvent = <T>(event: string, detail: T): CustomEvent<T> => {
  return new CustomEvent(event, {
    bubbles: true,
    detail
  });
};

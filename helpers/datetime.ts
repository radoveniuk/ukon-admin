import { DateTime, DurationLike } from 'luxon';

const FORMAT = 'dd.MM.yyyy';

export const formatIso = (iso: string) => {
  const date = DateTime.fromISO(iso);
  return date.toFormat(FORMAT);
};

export const getToday = () => {
  return formatIso((new Date()).toISOString());
};

export const plus = (value: string, duration: DurationLike) => {
  const date = DateTime.fromFormat(value, 'dd.MM.yyyy');
  return date.plus(duration).toFormat(FORMAT);
};
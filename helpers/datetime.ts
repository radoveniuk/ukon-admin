import { DateTime, DurationLike } from 'luxon';

import { DATE_FORMAT } from 'constants/datetime';

export const formatIso = (iso: string) => {
  const date = DateTime.fromISO(iso);
  return date.toFormat(DATE_FORMAT);
};

export const getToday = () => {
  return formatIso((new Date()).toISOString());
};

export const plus = (value: string, duration: DurationLike) => {
  const date = DateTime.fromFormat(value, DATE_FORMAT);
  return date.plus(duration).toFormat(DATE_FORMAT);
};
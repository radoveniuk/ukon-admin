import { ChangeEventHandler } from 'react';

type Dispatcher<T> = (value: T) => void;
type Handler<T> = (dispatcher: Dispatcher<T>) => ChangeEventHandler<HTMLInputElement>

const textFieldHandler: Handler<string> = (dispatcher) => (e) => {
  dispatcher(e.target.value);
};
export const checkboxHandler: Handler<boolean> = (dispatcher) => (e) => {
  dispatcher(e.target.checked);
};

export default textFieldHandler;

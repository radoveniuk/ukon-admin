import { ChangeEventHandler } from 'react';

type Dispatcher = (value: string) => void;
type Handler = (dispatcher: Dispatcher) => ChangeEventHandler<HTMLInputElement>

const textFieldHandler: Handler = (dispatcher) => (e) => {
  dispatcher(e.target.value);
};

export default textFieldHandler;

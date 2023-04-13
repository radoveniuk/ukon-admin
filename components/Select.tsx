type Option = {
  value: string;
  text: string;
};

type Props = {
  options: Option[];
  onChange(value: Option): void;
  value: string;
};

export const Select = ({ options, value, onChange }: Props) => {
  return (
    <select
      autoFocus
      value={value}
      onChange={(e) => {
        const value = options.find((item) => item.value === e.target.value);
        onChange(value);
      }}
      style={{ minWidth: 200 }}
    >
      <option disabled value={null}></option>
      {options.map((item) => (
        <option value={item.value} key={item.value}>{item.text}</option>
      ))}
    </select>
  );
};

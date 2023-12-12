type Option = {
  value: string | boolean | number;
  text: string;
  color?: string;
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
        onChange(value || { value: null, text: '' });
      }}
      style={{ minWidth: 200, maxWidth: 200, background: options.find(item=> item.value === value)?.color || '#ffffff' }}
    >
      <option value={null}></option>
      {options.map((item) => (
        <option value={item.value.toString()} key={item.value.toString()} style={{ background: item.color || '#ffffff' }}>{item.text}</option>
      ))}
    </select>
  );
};

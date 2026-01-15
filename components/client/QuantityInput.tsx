type QuantityInputProps = {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
};

export function QuantityInput({
  value,
  onChange,
  min = 1,
  max = 99,
}: QuantityInputProps) {
  const decrease = () => {
    if (value > min) onChange(value - 1);
  };

  const increase = () => {
    if (value < max) onChange(value + 1);
  };

  return (
    <div className="flex items-center border rounded-md overflow-hidden">
      <button
        type="button"
        onClick={decrease}
        className="px-3 py-1 text-lg hover:bg-muted"
      >
        −
      </button>

      <input
        type="number"
        value={value}
        min={min}
        max={max}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-12 text-center outline-none"
      />

      <button
        type="button"
        onClick={increase}
        className="px-3 py-1 text-lg hover:bg-muted"
      >
        +
      </button>
    </div>
  );
}

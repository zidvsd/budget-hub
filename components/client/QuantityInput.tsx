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
        className="px-2  text-lg hover:bg-muted"
      >
        −
      </button>

      <input
        inputMode="numeric"
        type="number"
        value={value}
        min={min}
        max={max}
        onChange={(e) => {
          const num = Number(e.target.value);
          if (!isNaN(num)) onChange(num);
        }}
        className="w-12 text-center outline-none appearance-none"
      />

      <button
        type="button"
        onClick={increase}
        className="px-2  text-lg hover:bg-muted"
      >
        +
      </button>
    </div>
  );
}

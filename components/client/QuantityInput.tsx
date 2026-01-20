type QuantityInputProps = {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
};

export function QuantityInput({
  value,
  onChange,
  min = 1,
  max = 99,
  disabled = false,
}: QuantityInputProps) {
  const decrease = () => {
    if (!disabled && value > min) onChange(value - 1);
  };

  const increase = () => {
    if (!disabled && value < max) onChange(value + 1);
  };

  return (
    <div
      className={`flex items-center border rounded-md overflow-hidden transition-colors ${
        disabled
          ? "bg-muted/50 border-muted text-muted-foreground cursor-not-allowed"
          : null
      }`}
    >
      <button
        type="button"
        onClick={decrease}
        disabled={disabled}
        className="cursor-pointer px-2 text-lg hover:bg-muted disabled:pointer-events-none disabled:opacity-50"
      >
        −
      </button>

      <input
        inputMode="numeric"
        type="number"
        value={value}
        min={min}
        max={max}
        disabled={disabled}
        onChange={(e) => {
          const num = Number(e.target.value);
          if (!isNaN(num)) onChange(num);
        }}
        // disabled:bg-transparent ensures the input doesn't have its own background color
        className="w-12 text-center outline-none appearance-none bg-transparent disabled:cursor-not-allowed"
      />

      <button
        type="button"
        onClick={increase}
        disabled={disabled}
        className="cursor-pointer  px-2 text-lg hover:bg-muted disabled:pointer-events-none disabled:opacity-50"
      >
        +
      </button>
    </div>
  );
}

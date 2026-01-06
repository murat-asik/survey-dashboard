import '../styles/Selector.css';

interface SelectorProps<T> {
    label: string;
    options: { value: T; label: string }[];
    value: T;
    onChange: (value: T) => void;
}

function Selector<T extends string>({ label, options, value, onChange }: SelectorProps<T>) {
    return (
        <div className="selector-container">
            <label className="selector-label">{label}</label>
            <select
                className="selector-dropdown"
                value={value}
                onChange={(e) => onChange(e.target.value as T)}
            >
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
}

export default Selector;

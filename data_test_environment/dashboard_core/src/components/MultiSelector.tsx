import React from 'react';
import '../styles/Selector.css';

interface MultiSelectorProps {
    label: string;
    options: { value: string; label: string }[];
    values: string[];
    onChange: (values: string[]) => void;
}

function MultiSelector({ label, options, values, onChange }: MultiSelectorProps) {
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
        onChange(selectedOptions);
    };

    return (
        <div className="selector-container">
            <label className="selector-label">{label}</label>
            <select
                className="selector-dropdown multi-select"
                value={values}
                onChange={handleChange}
                multiple
                size={5}
            >
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            <div className="multi-select-hint">
                Ctrl/Cmd tuşuyla birden fazla ay seçebilirsiniz
            </div>
        </div>
    );
}

export default MultiSelector;

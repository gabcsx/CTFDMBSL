import React from 'react';

export default function QuantitySelector({ value, onChange, min = 1, max = 100 }) {
    return (
        <div className="quantity-selector-custom">
            <button
                type="button"
                onClick={() => onChange(Math.max(min, value - 1))}
                className="qty-btn"
                aria-label="Decrease quantity"
                disabled={value <= min}
            >
                –
            </button>
            <span className="qty-value">{value}</span>
            <button
                type="button"
                onClick={() => onChange(Math.min(max, value + 1))}
                className="qty-btn"
                aria-label="Increase quantity"
                disabled={value >= max}
            >
                +
            </button>
        </div>
    );
}

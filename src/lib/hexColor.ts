const HEX_COLOR_PATTERN = /^#?[0-9a-fA-F]{6}$/;

export function normalizeHexColor(value: string | null | undefined): string | null {
    if (!value) {
        return null;
    }

    const normalizedValue = value.trim().replace(/^(?:%25)*%?23/i, '#');
    if (!HEX_COLOR_PATTERN.test(normalizedValue)) {
        return null;
    }

    const hex = normalizedValue.startsWith('#') ? normalizedValue : `#${normalizedValue}`;
    return hex.toLowerCase();
}

export function getHexColorHashtag(hex: string): string {
    const normalizedHex = normalizeHexColor(hex);
    return normalizedHex ? normalizedHex.slice(1).toUpperCase() : hex.replace(/^#/, '').toUpperCase();
}

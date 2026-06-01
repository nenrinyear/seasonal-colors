const HEX_COLOR_PATTERN = /^#?[0-9a-fA-F]{6}$/;

export function normalizeHexColor(value: string | null | undefined): string | null {
    if (!value || !HEX_COLOR_PATTERN.test(value)) {
        return null;
    }

    const hex = value.startsWith('#') ? value : `#${value}`;
    return hex.toLowerCase();
}

export function getHexColorHashtag(hex: string): string {
    const normalizedHex = normalizeHexColor(hex);
    return normalizedHex ? normalizedHex.slice(1).toUpperCase() : hex.replace(/^#/, '').toUpperCase();
}

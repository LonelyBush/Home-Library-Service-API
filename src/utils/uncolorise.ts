export const uncolorize = (str: string) => str.replace(/\x1B\[\d+m/gi, '');

/** Roman capitals for article numbers (1 to 3999). Mirrors CSS `counter(x, upper-roman)`. */
export function toRoman(value: number): string {
  if (!Number.isInteger(value) || value < 1 || value > 3999) throw new RangeError(`toRoman: ${value} is outside 1 to 3999`);
  const table: Array<[number, string]> = [
    [1000, 'M'],
    [900, 'CM'],
    [500, 'D'],
    [400, 'CD'],
    [100, 'C'],
    [90, 'XC'],
    [50, 'L'],
    [40, 'XL'],
    [10, 'X'],
    [9, 'IX'],
    [5, 'V'],
    [4, 'IV'],
    [1, 'I'],
  ];
  let rest = value;
  let out = '';
  for (const [n, glyph] of table) {
    while (rest >= n) {
      out += glyph;
      rest -= n;
    }
  }
  return out;
}

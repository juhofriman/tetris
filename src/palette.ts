export interface Color {
  readonly hex: string;
}

export class Palette {
  static freeColor: Color = {hex: '#ddd'}
  static colors: Color[] = [
    {hex: "#D05B5B" },
    {hex: "#EED7D7" },
    {hex: "#DE9B9B" },
    {hex: "#BA1D1D" },
    {hex: "#AB0000" },

{ hex: "#524A90" },
{ hex: "#9998A5" },
{ hex: "#76729A" },
{ hex: "#2D2381" },
{ hex: "#160A77" },

{ hex: "#D0C15B" },
{ hex: "#EEEBD7" },
{ hex: "#DED69B" },
{ hex: "#BAA71D" },
{ hex: "#AB9600" }
]

  static random(): Color {
    return this.colors[Math.floor(Math.random() * Palette.colors.length)]
  }

  static fromHex(hex: string): Color {
    return { hex: hex };
  }
}

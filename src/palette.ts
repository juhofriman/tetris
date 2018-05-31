export interface Color {
  readonly hex: string;
}

export class Palette {
  static freeColor: Color = {hex: '#ddd'}
  static colors: Color[] = [
    {hex: "#479030"},
    {hex: "#1B5209"},
    {hex: "#205211"},
    {hex: "#7ACE60"},
    {hex: "#89CE73"},
    {hex: "#226765"},
    {hex: "#063B39"},
    {hex: "#0C3B39"},
    {hex: "#459491"},
    {hex: "#529491"},
    {hex: "#8AA236"},
    {hex: "#4A5D0A"},
    {hex: "#4C5D13"},
    {hex: "#CCE86C"},
    {hex: "#D1E882"}]

  static random(): Color {
    return this.colors[Math.floor(Math.random() * this.colors.length)]
  }
}

class Mask extends Tiny.Graphics {
  constructor() {
    super();
    this._shape = null;
  }

  setCircle(x, y, radius) {
    this.clear();
    this.beginFill(0xffffff);
    this.drawCircle(
      x,
      y,
      radius
    );
    this.endFill();
  }
  setRectanle(x, y, width, height) {
    this.clear();
    this.beginFill(0xffffff);
    this.drawRect(
      x,
      y,
      width,
      height
    );
    this.endFill();
  }
}

export default Mask;


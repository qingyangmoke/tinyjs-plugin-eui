import Component from './Component';
import { STATE } from '../const';

class ASprite extends Tiny.Sprite {
  _onTextureUpdate() {
    super._onTextureUpdate();
    this.emit('$onTextureUpdate');
  }
}

class Image extends Component {
  constructor(width, height) {
    super(width, height);
    this._scale9Grid = null;
    this._nineGridImage = new ASprite();
    this._nineGridImage.on('$onTextureUpdate', () => {
      if (!this.displayWidth) {
        this.displayWidth = this._nineGridImage.width;
      }
      if (!this.displayHeight) {
        this.displayHeight = this._nineGridImage.height;
      }
      this.invalidate();
    });
    this.addChildAt(this._nineGridImage);
    this.tagName = 'Image';
    this.onResize();
  }

  get scale9Grid() {
    return this._scale9Grid;
  }
  set scale9Grid(value) {
    this._scale9Grid = value;
    this.invalidate();
  }

  onResize() {
    // this._nineGridImage.width = this.width;
    // this._nineGridImage.height = this.height;
  }

  set source(value) {
    this._stateData[STATE.NORMAL] = value;
    this.setTexture(value);
  }

  setTexture(value) {
    if (this._isTexture(value)) {
      this._nineGridImage.texture = typeof value === 'string' ? Tiny.TextureCache[value] : value;
    }
  }
}

export default Image;

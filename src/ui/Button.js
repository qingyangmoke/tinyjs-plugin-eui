import Component from './Component';
import Label from './Label';
import Image from './Image';
import { STATE } from '../const';
class Button extends Component {
  constructor(width, height) {
    super(width, height);
    this._stateData[STATE.DOWN] = {
      alpha: 0.9,
      scaleX: 0.99,
      scaleY: 0.99,
    };
    this._deafultLabelStyle = {
      fontFamily: 'Arial',
      fontSize: 36,
      fontStyle: 'italic',
      fontWeight: 'bold',
      // fill: ['#ffffff', '#00ff99'], // gradient
      // stroke: '#4a1850',
      // strokeThickness: 5,
      // dropShadow: true,
      // dropShadowColor: '#000000',
      // dropShadowBlur: 4,
      // dropShadowAngle: Math.PI / 6,
      // dropShadowDistance: 6,
      // wordWrap: true,
      // breakWords: true,
      // wordWrapWidth: 100,
      // textBaseline: 'middle',
      align: 'center',
    };
    this._label = null;
    this.setEventEnabled(true);
    this.tagName = 'Button';
  }
  // containsPoint(point, debug) {
  //   return super.containsPoint(point, true);
  // }
  set source(value) {
    this.backgroundImage = value;
  }

  get source() {
    return this.backgroundImage;
  }

  set backgroundImage(value) {
    if (this._backgroundImage) {
      this.removeChild(this._backgroundImage);
    }
    if (value instanceof Image) {
      this._backgroundImage = value;
    } else {
      this._backgroundImage = new Image();
      this._backgroundImage.source = value;
    }
    // this.displayWidth = this.displayWidth || this.backgroundImage.width;

    // this.displayHeight = this.displayHeight || this.backgroundImage.height;
    if (this._stateData[STATE.NORMAL] === null) {
      this._stateData[STATE.NORMAL] = {
        backgroundImage: this._backgroundImage,
      };
    }
    this.addChildAt(this._backgroundImage, 0);
  }

  get backgroundImage() {
    return this._backgroundImage || null;
  }

  setStateData(state, data) {
    if (typeof data === 'string') {
      data = {
        backgroundImage: data,
      };
    }
    const backgroundImage = data['backgroundImage'] || data['source'];
    if (backgroundImage && !(backgroundImage instanceof Image)) {
      const image = new Image();
      image.source = backgroundImage;
      data['backgroundImage'] = image;
      delete data['source'];
    }
    this._stateData[state] = data;
  }

  get label() {
    return this._label;
  }
  set label(value) {
    if (value instanceof Label) {
      if (this._label) {
        this.removeChild(this._label);
      }
      this._label = value;
      this.addChild(this._label);
    } else {
      if (!this._label) {
        this._label = new Label(value, 0, 0, this._deafultLabelStyle);
        this._container.addChild(this._label);
      }
      this._label.text = value;
    }
    this.invalidate();
  }
  invalidate() {
    super.invalidate();
    if (this._label) {
      this._label.displayWidth = this.displayWidth;
      this._label.displayHeight = this.displayHeight;
      this._label.invalidate();
      console.log('_updateLabel', this._label.displayWidth, this._label.displayHeight, this.displayWidth, this.displayHeight);
    }
  }
}

export default Button;

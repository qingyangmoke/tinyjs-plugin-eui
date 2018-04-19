import Component from './Component';
import { mixinObserver, propertyObserver } from '../utils';
class Label extends Component {
  constructor(text, width, height, options) {
    super(width, height);
    options = Object.assign({
      fontFamily: 'Arial',
      fontSize: 16,
      fill: '#000',
      wordWrapWidth: width || 100,
      wordWrap: true,
      breakWords: true,
    }, options || {});
    this._text = new Tiny.Text(text, options);
    this.addChild(this._text);
    this._valign = 'middle';
    this._style = {};
    mixinObserver(this._text.style,
      this._style,
      [
        'align',
        'fontFamily',
        'fontSize',
        'fontStyle',
        'fontWeight',
        'fontVariant',
        'letterSpacing',
        'fill',
        'fillGradientStops',
        'fillGradientType',
        'strokeThickness',
        'dropShadow',
        'dropShadowColor',
        'dropShadowBlur',
        'dropShadowAngle',
        'dropShadowDistance',
        'dropShadowBlur',
        'wordWrap',
        'breakWords',
        'lineHeight',
        'lineJoin',
        'padding',
        'trim',
        'wordWrapWidth',
      ],
      this.invalidate,
      this);
    propertyObserver(this._text.style, 'fill', this._style, 'color');
    setTimeout(() => this.invalidate());
  }

  /**
   * hack 锁死宽高
   */
  get width() {
    return Math.abs(this.scale.x) * (this.displayWidth || (this._text ? this._text.width : 0));
  }

  /**
   * hack 锁死宽高
   */
  get height() {
    return Math.abs(this.scale.y) * (this.displayHeight || (this._text ? this._text.height : 0));
  }

  get style() {
    return this._style;
  }
  _kebabCaseToCamelCase(kebabCase) {
    return kebabCase.replace(/(\-\w)/g, function (m) { return m[1].toUpperCase(); });
  }
  // 需要判断一下
  set style(value) {
    console.log('set style', value);
    // 设置
    if (typeof value === 'string') {
      const property = value.split(';');
      if (property.length > 0) {
        property.forEach((p) => {
          const p2 = p.split(':');
          if (p2.length === 2) {
            const key = this._kebabCaseToCamelCase(p2[0]).trim();
            let value = p2[1].trim();
            // value = JSON.parse(value);
            if (/^\[(.)*\]$/gi.test(value)) {
              /* eslint-disable no-useless-escape */
              value = value.replace(/\[|\]|\'|\"/g, '').split(',');
            }
            if (key) {
              this._style[key] = +value || value;
            }
          }
        });
      }
    }
  }

  get text() {
    return this._text.text;
  }

  set text(value) {
    this._text.text = value;
    this.invalidate();
  }

  get vAlign() {
    return this._valign;
  }

  set vAlign(value) {
    this._valign = value;
    this.invalidate();
  }

  invalidate() {
    super.invalidate();
    this._text.style.wordWrapWidth = this.displayWidth;
    if (!this._text) return;
    const oriText = this._text;
    oriText.x = 0;
    oriText.y = 0;
    if (oriText.width < this.displayWidth) {
      switch (this.style.align) {
        // case 'left': oriText.x = (this.displayWidth - oriText.width) / 2; break;
        case 'center': oriText.x += (this.displayWidth - oriText.width) / 2; break;
        case 'right': oriText.x += (this.displayWidth - oriText.width); break;
      }
    }
    if (oriText.height < this.displayHeight) {
      switch (this.vAlign) {
        // case 'top': oriText.x = (this.displayWidth - oriText.width) / 2; break;
        case 'middle': oriText.y += (this.displayHeight - oriText.height) / 2; break;
        case 'bottom': oriText.y += (this.displayHeight - oriText.height); break;
      }
    }
  }
}

export default Label;

import { STATE } from '../const';
import Button from './Button';
/**
 * 复选按钮
 */
class CheckBoxButton extends Button {
  constructor(width, height) {
    super(width, height);
    this._stateData[STATE.DOWN] = null;
    this._stateData[STATE.CHECKED] = null;
    this._checked = false;
    this.on('pointertap', (e) => {
      console.log('tap2');
      if (this.enabled) {
        this.checked = !this._checked;
      }
    });
    this.setEventEnabled(true);
    this.hitArea = null;
    this.tagName = 'CheckBoxButton';
  }

  // set source(value) {
  //   this._stateData[this._state] = value;
  //   this.setTexture(value);
  // }

  get checked() {
    return this._checked;
  }

  set checked(value) {
    if (this._checked !== value) {
      this._checked = value;
      console.log('checke', this._checked);
      this.state = this._checked ? STATE.CHECKED : STATE.NORMAL;
      this.emit('change', {
        target: this,
        checked: this._checked,
      });
    }
  }
}

export default CheckBoxButton;

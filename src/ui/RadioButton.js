import { STATE } from '../const';
import Button from './Button';
/**
 * 单选按钮
 */
class RadioButton extends Button {
  constructor(width, height) {
    super(width, height);
    this.groupName = '';
    this._stateData[STATE.DOWN] = null;
    this._stateData[STATE.CHECKED] = null;
    this._checked = false;
    this.on('pointertap', (e) => {
      if (this.enabled && !this._checked) {
        this.checked = true;
      }
    });
    this.setEventEnabled(true);
    this.tagName = 'RadioButton';
  }

  // set source(value) {
  //   this._stateData[STATE.NORMAL] = value;
  //   this.setTexture(value);
  // }

  get checked() {
    return this._checked;
  }

  set checked(value) {
    if (this._checked !== value) {
      this.parent.children.forEach((e) => {
        if (e instanceof RadioButton && e !== this && e.groupName === this.groupName) {
          e.checked = false;
        }
      });
      this._checked = value;
      this.state = this._checked ? STATE.CHECKED : STATE.NORMAL;
      this.emit('change', {
        target: this,
        checked: this._checked,
      });
    }
  }

  invalidate() {
    super.invalidate();
  }
}

export default RadioButton;

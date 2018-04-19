let id = 0;
import { STATE } from '../const';
import { debug } from '../config';
import Mask from './Mask';
const tempPoint = new Tiny.Point();

class Component extends Tiny.Sprite {
  /**
   *
   * @param {number} width - displayWidth
   * @param {number} height - displayHeight
   */
  constructor(width, height) {
    super();
    this.id = ++id;
    // 当前状态
    this._state = STATE.NORMAL;
    // 长按定时器句柄
    this._longpressTimer = 0;
    // 状态对应的数据
    this._stateData = {
      [STATE.NORMAL]: null,
      [STATE.DOWN]: null,
      [STATE.DISABLED]: null,
    };
    this._initEvents();
    this._displayWidth = width || 0;
    this._displayHeight = height || 0;
    this._enabled = true;
    // this._supportProperty = ['x', 'y', 'alpha', 'scaleX', 'scaleY'];
    // 内部容器 所有数据都放到这里
    this._container = new Tiny.Container();
    super.addChild(this._container);
    // 是否启用调试
    this.debug = debug.enable;
    this.debugStroke = Object.assign({}, debug.debugStroke);
    this.debugFill = Object.assign({}, debug.debugFill);
    // 是否启用长按 默认不启用
    this.longpressEnabled = false;
    this._containerMask = null;
    this._eventEnabled = false;
    this._clip = {
      x: 0, y: 0, width: 0, height: 0,
    };
    this.tagName = 'Component';
    this._renderDebug();
    // this.hitArea = new Tiny.Rectangle(0, 0, this.displayWidth, this.displayHeight);
  }

  /**
   * 重写父类方法 优化touch事件
   * @param {Tiny.Point} point - 点
   */
  containsPoint(point, debug) {
    this.worldTransform.applyInverse(point, tempPoint);
    debug && console.log(point, tempPoint);
    const width = this.width;
    const height = this.height;
    const x1 = -width * this.anchor.x;
    let y1 = 0;

    if (tempPoint.x > x1 && tempPoint.x < x1 + width) {
      y1 = -height * this.anchor.y;

      if (tempPoint.y > y1 && tempPoint.y < y1 + height) {
        return true;
      }
    }
    return false;
  }

  get width() {
    return this.displayWidth || (super.width / this.scale.width);
    // return this.displayWidth ? Math.abs(this.scale.x) * this.displayWidth : super.width;
  }

  set width(value) {
    this.displayWidth = value;
  }

  get height() {
    return this.displayHeight || (super.height / this.scale.y);
    // return this.displayHeight ? Math.abs(this.scale.y) * this.displayHeight : super.height;
  }

  set height(value) {
    this.displayHeight = value;
  }

  /**
   * mask 必须是sprite graphics等基础元素 切记不可使用UI组件做mask
   * 不允许设置mask
   */
  set mask(mask) {
  }

  get mask() {
    return null;
  }

  clipCircle(x, y, radius) {
    this._clip.x = 0;
    this._clip.y = 0;
    this._clip.width = radius;
    this._clip.height = radius;
    if (!this._containerMask) {
      // 方法一、使用缓存中的1像素创建一个sprite，dpi=1的时候 很模糊 不知道为什么 奇怪 canvas渲染下 sprite作为mask不可用
      // const mask = new Tiny.Sprite(Tiny.TextureCache['white_bg_png']);
      // mask.width = width;
      // mask.height = height;

      // 方法二、使用Graphics 缺点是多了比较浪费性能
      const mask = new Mask();
      // this.mask = mask;
      if (!mask) {
        if (this._containerMask) {
          super.removeChild(this._containerMask);
        }
      } else if (mask !== this._containerMask) {
        this._container.mask = mask;
        super.addChild(mask);
        this._containerMask = mask;
        this._updateChild();
      }
    }
    this._containerMask.setCircle(x, y, radius);
    this._updateChild();
  }
  clip(x, y, width, height) {
    this._clip.x = x;
    this._clip.y = y;
    this._clip.width = width;
    this._clip.height = height;
    if (!this._containerMask) {
      // 方法一、使用缓存中的1像素创建一个sprite，dpi=1的时候 很模糊 不知道为什么 奇怪 canvas渲染下 sprite作为mask不可用
      // const mask = new Tiny.Sprite(Tiny.TextureCache['white_bg_png']);
      // mask.width = width;
      // mask.height = height;

      // 方法二、使用Graphics 缺点是多了比较浪费性能
      const mask = new Mask();
      mask.setRectanle(
        0,
        0,
        width,
        height
      );
      // this.mask = mask;
      if (!mask) {
        if (this._containerMask) {
          super.removeChild(this._containerMask);
        }
      } else if (mask !== this._containerMask) {
        this._container.mask = mask;
        super.addChild(mask);
        this._containerMask = mask;
        this._updateChild();
      }
    } else {
      // this._containerMask.width = width;
      // this._containerMask.height = height;
      this._containerMask.setRectanle(
        0,
        0,
        width,
        height
      );
    }
    this._updateChild();
  }

  get debug() {
    return this._debug;
  }

  set debug(enabled) {
    if (this._debug === enabled) return;
    this._debug = enabled;
    if (enabled) {
      if (!this._debugRect) {
        this._debugRect = new Tiny.Graphics();
      }
      super.addChildAt(this._debugRect, 0);
      this._renderDebug();
    } else {
      if (this._debugRect) {
        super.removeChild(this._debugRect);
      }
    }
  }

  _renderDebug() {
    if (this._debug && this._debugRect) {
      const rect = this._debugRect;
      rect.name = 'debug';
      rect.clear();
      this.debugStroke && rect.lineStyle(this.debugStroke.width, this.debugStroke.color, this.debugStroke.alpha);
      this.debugFill && rect.beginFill(this.debugFill.color, this.debugFill.alpha);
      rect.drawRect(
        0,
        0,
        this.width,
        this.height
      );
      rect.endFill();
    }
  }

  get displayWidth() {
    return this._displayWidth;
  }

  set displayWidth(value) {
    this._displayWidth = value;
    this.onResize();
  }

  get displayHeight() {
    return this._displayHeight;
  }

  set displayHeight(value) {
    this._displayHeight = value;
    this.onResize();
  }

  onResize() {
    this.invalidate();
    // if (this.hitArea) {
    //   this.hitArea.height = this._displayHeight;
    //   this.hitArea.width = this._displayWidth;
    // }
    this.emit('resize');
  }

  _initEvents() {
    this._downData = {
      x: 0,
      y: 0,
      scaleX: 1,
      scaleY: 1,
      isDown: false,
      isValid: false,
    };
    this.on('pointerdown', (e) => {
      if (!this.enabled) {
        this._downData.isValid = false;
        this._downData.isDown = false;
        return;
      }
      this.onTouchDown(e);
    });
    this.on('pointermove', (e) => {
      if (!this._downData.isDown) return;
      this.onTouchMove(e);
    });
    this.on('pointercancel', (e) => {
      if (!this._downData.isDown) return;
      this.onTouchUp(e);
    });
    this.on('pointerup', (e) => {
      if (!this._downData.isDown) return;
      this.onTouchUp(e);
    });
    this.on('pointerupoutside', (e) => {
      if (!this._downData.isDown) return;
      this.onTouchUp(e);
    });
  }

  onTouchDown(e) {
    if (this.longpressEnabled) {
      this._longpressTimer = setTimeout(() => {
        this.emit('longpress');
      }, 800);
    }
    this._downData.state = this._state;
    const stateData = this._stateData[STATE.DOWN];
    if (this.enabled && stateData && typeof stateData === 'object') {
      this._saveCurrentStateData(this._downData);
      this._downData.isValid = true;
      this.state = STATE.DOWN;
    } else {
      this._downData.isValid = false;
    }
    this._downData.isDown = true;
  }

  onTouchMove(e) {
    if (!this._downData.isDown) return;
    if (e.touchendoutside && this.longpressEnabled) {
      clearTimeout(this.longPressTimer);
    }
  }

  onTouchUp() {
    if (!this._downData.isDown) return;
    if (this.longpressEnabled) {
      clearTimeout(this._longpressTimer);
    }
    if (this._downData.isValid) {
      this._restoreCurrentStateData(this._downData);
      this.state = this._downData.state;
    }
    this._downData.isDown = false;
  }

  _isTexture(texture) {
    return texture && (typeof texture === 'string' || texture instanceof Tiny.Texture);
  }

  _updateState(state) {
    console.log('_updateState:', state);
    const stateData = this._stateData[state];
    if (this._isTexture(stateData)) {
      this.setTexture(stateData);
    } else if (stateData && typeof stateData === 'object') {
      this._restoreCurrentStateData(stateData);
      // const texture = stateData['source'];
      // if (this._isTexture(texture)) {
      //   this.setTexture(texture);
      // }
    }
    this.invalidate();
  }

  set state(newState) {
    if (this._state === newState) {
      return;
    }
    this._state = newState;
    this._updateState(this._state);
  }

  get state() {
    return this._enabled ? this._state : STATE.DISABLED;
  }

  setEventEnabled(value) {
    this._eventEnabled = value;
    super.setEventEnabled(value);
  }

  _saveCurrentStateData(data) {
    data = data || {};
    data.x = this.x;
    data.y = this.y;
    data.scaleX = this.scale.x;
    data.scaleY = this.scale.y;
    data.backgroundImage = this.backgroundImage;
    data.alpha = this.alpha;
    return data;
  }

  _restoreCurrentStateData(stateData) {
    ('x' in stateData) && (this.x = stateData.x);
    ('y' in stateData) && (this.y = stateData.y);
    ('alpha' in stateData) && (this.alpha = stateData.alpha);
    ('scaleX' in stateData) && (this.scale.x = stateData.scaleX);
    ('scaleY' in stateData) && (this.scale.y = stateData.scaleY);
    ('backgroundImage' in stateData) && (this.backgroundImage = stateData.backgroundImage);
    return stateData;
  }

  set enabled(value) {
    if (this._enabled === value) return;
    this._enabled = value;
    if (!value) {
      setTimeout(() => {
        this._stateEnableSave = this._saveCurrentStateData(this._stateEnableSave);
      });
    } else {
      if (this._stateEnableSave) {
        this._restoreCurrentStateData(this._stateEnableSave);
      }
    }
    super.setEventEnabled(value && this._eventEnabled);
    this._updateState(this._enabled ? this._state : STATE.DISABLED);
  }

  get enabled() {
    return this._enabled;
  }

  setStateData(state, source) {
    this._stateData[state] = source;
  }

  getStateData(state) {
    return this._stateData[state];
  }

  setTexture(value) {
    console.log('setTexture1：', value);
    if (this._isTexture(value)) {
      this.texture = typeof value === 'string' ? Tiny.TextureCache[value] : value;
    }
  }

  invalidate() {
    if (this._state !== STATE.DOWN) {
      this._renderDebug();
    }
  }

  _updateChild() {
    const x = -this.anchor.x * this.width;
    const y = -this.anchor.y * this.height;
    if (this._containerMask) {
      this._containerMask.x = this._clip.x + x;
      this._containerMask.y = this._clip.y + y;
    }
    this._container.x = x;
    this._container.y = y;
  }

  _onAnchorUpdate() {
    super._onAnchorUpdate();
    this._updateChild();
  }

  _onTextureUpdate() {
    super._onTextureUpdate();
    console.log('_onTextureUpdate');
    if (!this.displayWidth) {
      this.displayWidth = super.width;
    }
    if (!this.displayHeight) {
      this.displayHeight = super.height;
    }
    this.invalidate();
  }

  /**
   * Adds one or more children to the container.
   *
   * Multiple items can be added like so: `myContainer.addChild(thingOne, thingTwo, thingThree)`
   *
   * @param {...Tiny.DisplayObject} child - The DisplayObject(s) to add to the container
   * @return {Tiny.DisplayObject} The first child that was added.
   */
  addChild(child) {
    return this._container.addChild(child);
  }

  /**
   * Adds a child to the container at a specified index. If the index is out of bounds an error will be thrown
   *
   * @param {Tiny.DisplayObject} child - The child to add
   * @param {number} index - The index to place the child in
   * @return {Tiny.DisplayObject} The child that was added.
   */
  addChildAt(child, index) {
    return this._container.addChildAt(child, index);
  }

  /**
   * Swaps the position of 2 Display Objects within this container.
   *
   * @param {Tiny.DisplayObject} child - First display object to swap
   * @param {Tiny.DisplayObject} child2 - Second display object to swap
   */
  swapChildren(child, child2) {
    return this._container.swapChildren(child, child2);
  }

  /**
   * Returns the index position of a child DisplayObject instance
   *
   * @param {Tiny.DisplayObject} child - The DisplayObject instance to identify
   * @return {number} The index position of the child display object to identify
   */
  getChildIndex(child) {
    return this._container.getChildIndex(child);
  }

  /**
   * Changes the position of an existing child in the display object container
   *
   * @param {Tiny.DisplayObject} child - The child DisplayObject instance for which you want to change the index number
   * @param {number} index - The resulting index number for the child display object
   */
  setChildIndex(child, index) {
    return this._container.setChildIndex(child, index);
  }

  /**
   * Returns the child at the specified index
   *
   * @param {number} index - The index to get the child at
   * @return {Tiny.DisplayObject} The child at the given index, if any.
   */
  getChildAt(index) {
    return this._container.getChildAt(index);
  }

  /**
   * Removes one or more children from the container.
   *
   * @param {...Tiny.DisplayObject} child - The DisplayObject(s) to remove
   * @return {Tiny.DisplayObject} The first child that was removed.
   */
  removeChild(child) {
    return this._container.removeChild.apply(this._container, arguments);
  }

  /**
   * Removes a child from the specified index position.
   *
   * @param {number} index - The index to get the child from
   * @return {Tiny.DisplayObject} The child that was removed.
   */
  removeChildAt(index) {
    return this._container.removeChildAt(index);
  }

  /**
   * Removes all children from this container that are within the begin and end indexes.
   *
   * @param {number} [beginIndex=0] - The beginning position.
   * @param {number} [endIndex=this.children.length] - The ending position. Default value is size of the container.
   * @return {DisplayObject[]} List of removed children
   */
  removeChildren(beginIndex = 0, endIndex = null) {
    return this._container.removeChildren(beginIndex, endIndex);
  }

  getChildBy(key, value) {
    const len = this._container.children.length;
    if (len < 1) return null;
    for (let i = 0; i < len; i++) {
      const child = this._container.children[i];
      if (child[key] === value) return child;
    }
    return null;
  }

  getChildById(id) {
    return this.getChildBy('id', id);
  }

  getChildByName(name) {
    return this.getChildBy('name', id);
  }
}

export default Component;

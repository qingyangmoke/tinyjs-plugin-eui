import Component from './Component';
class ScrollerView extends Component {
  constructor(width, height) {
    super(width, height);
    this._viewport = null;
    this._touchDownPoint = new Tiny.Point();
    this._touchDownViewportPoint = new Tiny.Point();
    this._touchPointTemp = new Tiny.Point();
    this.force = 150;
    this._lastMoveTime = 0;
    this._lastMoveY = 0;
    this._moveY = 0;
    this._isTouchDown = false;
    this._timer = 0;
    this.clip(0, 0, this.width, this.height);
    this.setEventEnabled(true);
    this.tagName = 'Scroller';
  }

  get viewport() {
    return this._viewport;
  }

  set viewport(value) {
    if (this._viewport) {
      this.removeChild(this._viewport);
    }
    this._viewport = value;
    this.addChild(this._viewport);
  }

  _getTouchPoint(e, pt) {
    return e.data.getLocalPosition(this, pt);
  }

  onResize() {
    this.clip(0, 0, this.displayWidth, this.displayHeight);
  }

  onTouchDown(e) {
    super.onTouchDown(e);
    clearInterval(this._timer);
    this._getTouchPoint(e, this._touchDownPoint);
    this._touchDownViewportPoint.x = this._viewport.x;
    this._touchDownViewportPoint.y = this._viewport.y;
    this._lastMoveTime = Date.now();
    this._lastMoveY = this._touchDownPoint.y;
    this._moveY = 0;
    this._isTouchDown = true;
  }

  onTouchMove(e) {
    super.onTouchMove(e);
    if (!this._isTouchDown) return;
    this._getTouchPoint(e, this._touchPointTemp);
    const deltaY = this._touchPointTemp.y - this._touchDownPoint.y;
    let y = this._touchDownViewportPoint.y + deltaY;
    if (y > 0) {
      y *= this.force / (this.force + y);// 列表位置带入弹力模拟,公式只能死记硬背了,公式为:位置 *=弹力/(弹力+位置)
    } else if (y < this.height - this.viewport.height) {
      const oh = this.viewport.height;//列表的高度
      const ch = this.height;//容器的高度
      //如果列表位置小于 容器高度减列表高度(因为需要负数,所以反过来减),既向上滑动到最底部时。
      //当列表滑动到最底部时,cur的值其实是等于 容器高度减列表高度的,假设窗口高度为10,列表为30,那此时cur为 10 - 30 = -20,但这里的判断是小于,所以当cur<-20时才会触发,如 -21;
      y += oh - ch;//列表位置加等于 列表高度减容器高度(这是与上面不同,这里是正减,得到了一个正数) ,这里 cur 为负数,加上一个正数,延用上面的假设,此时 cur = -21 + (30-10=20) = -1 ,所以这里算的是溢出数
      y = y * this.force / (this.force - y) - oh + ch;//然后给溢出数带入弹力,延用上面的假设,这里为   cur = -1 * 150 /(150 - -1 = 151)~= -0.99 再减去 30  等于 -30.99  再加上容器高度 -30.99+10=-20.99  ,这也是公式,要死记。。
    }
    this._viewport.y = y;
    /**
    * 缓动代码
    */
    const nowTime = Date.now();
    if (nowTime - this._lastMoveTime > 40) {
      this._lastMoveTime = nowTime;
      this._moveY = this._touchPointTemp.y - this._lastMoveY;
      this._lastMoveY = this._touchPointTemp.y;
    }
  }

  onTouchUp(e) {
    super.onTouchUp(e);
    if (!this._isTouchDown) return;
    this._isTouchDown = false;
    let vy = this._moveY;
    let cur = this.viewport.y;
    const _this = this;
    const offset = 0; //最大溢出值
    const friction = ((vy >> 31) * 2 + 1) * 0.5; //根据力度套用公式计算出惯性大小,公式要记住
    const oh = this.viewport.height - this.height;
    clearInterval(this._timer);
    this._timer = setInterval(function () { //
      vy -= friction;//力度按 惯性的大小递减
      cur += vy;//转换为额外的滑动距离
      _this.viewport.y = cur;

      if (-cur - oh > offset) { //如果列表底部超出了
        clearInterval(_this._timer);
        _this.ease(-oh);//回弹
        return;
      }
      if (cur > offset) { //如果列表顶部超出了
        clearInterval(_this._timer);
        _this.ease(0);//回弹
        return;
      }
      if (Math.abs(vy) < 1) { //如果力度减小到小于1了,再做超出回弹
        clearInterval(_this._timer);
        if (cur > 0) {
          _this.ease(0);
          return;
        }
        if (-cur > oh) {
          _this.ease(-oh);
          return;
        }
      }
    }, 20);
  }

  ease(target) {
    const ctx = this;
    let cur = this.viewport.y;
    clearInterval(this._timer);
    ctx._timer = setInterval(function () { //回弹算法为  当前位置 减 目标位置 取2个百分点 递减
      cur -= (cur - target) * 0.2;
      if (Math.abs(cur - target) < 1) { //减到 当前位置 与 目标位置相差小于1 之后直接归位
        cur = target;
        clearInterval(ctx._timer);
      }
      ctx.viewport.y = cur;
    }, 20);
  }
}

export default ScrollerView;


function mixinObserver(source, target, props, callback, thisContext) {
  props.forEach((e) => {
    // console.log(e);
    Object.defineProperty(target, e, {
      get() {
        return source[e];
      },
      set(newValue) {
        const oldValue = source[e];
        source[e] = newValue;
        callback && callback.call(thisContext, e, oldValue, newValue);
      },
      // writable: false,
      enumerable: true,
      configurable: true,
    });
  });
}

export default mixinObserver;

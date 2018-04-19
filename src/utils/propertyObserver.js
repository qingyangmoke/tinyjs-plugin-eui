function propertyObserver(source, sourcePropertyName, target, targetPropertyName, callback, thisContext) {
  Object.defineProperty(target, targetPropertyName, {
    get() {
      return source[sourcePropertyName];
    },
    set(newValue) {
      const oldValue = source[sourcePropertyName];
      source[sourcePropertyName] = newValue;
      callback && callback.call(thisContext, targetPropertyName, oldValue, newValue);
    },
    // writable: false,
    enumerable: true,
    configurable: true,
  });
}

export default propertyObserver;

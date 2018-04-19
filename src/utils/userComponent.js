const userComponents = {};
export function registerComponent(tagName, className) {
  userComponents[name] = className;
}

export function initComponent(tagName) {
  if (tagName in userComponents) {
    const UserComponent = userComponents[tagName];
    return new UserComponent();
  }
  return null;
}

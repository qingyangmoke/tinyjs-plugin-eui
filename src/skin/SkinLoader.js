import Component from '../ui/Component';
import { STATE } from '../const';
const TAG_DEFINE = {};

function numberPreset(value) {
  return parseFloat(value) || 0;
};

function booleanPreset(value) {
  return value.toLowerCase() === 'true';
};

const SUPPORT_ATTRIBUTES = [
  {
    name: 'source',
  },
  {
    name: 'x',
    default: 0,
    preset: numberPreset,
  },
  {
    name: 'y',
    default: 0,
    preset: numberPreset,
  },
  {
    name: 'scaleX',
    path: 'scale.x',
    default: 1,
    preset: numberPreset,
  },
  {
    name: 'scaleY',
    path: 'scale.y',
    default: 1,
    preset: numberPreset,
  },
  {
    name: 'id',
  },
  {
    name: 'name',
  },
  {
    name: 'text',
  },
  {
    name: 'groupName',
  },
  {
    name: 'style',
  },
  {
    name: 'enabled',
    default: true,
    preset: booleanPreset,
  },
];

const STATE_DEFINE = [
  ['down', STATE.DOWN],
  ['disabled', STATE.DISABLED],
  ['checked', STATE.CHECKED],
];

function register(tagName, classConstructor) {
  TAG_DEFINE[tagName] = classConstructor;
}

function hasAttr(node, name, defaultValue) {
  return node.hasAttribute(name);
}

function getAttr(node, name, defaultValue) {
  if (node.hasAttribute(name)) {
    return node.getAttribute(name);
  }
  return defaultValue || null;
}

function clean(node, deep) {
  for (let n = 0; n < node.childNodes.length; n++) {
    const child = node.childNodes[n];
    if (child.nodeType === 8 || (child.nodeType === 3 && !/\S/.test(child.nodeValue))) {
      node.removeChild(child);
      n--;
    } else if (child.nodeType === 1) {
      deep && clean(child);
    }
  }
}

function loadSkinUI(skinXml, target) {
  // console.log(skinXml);
  let skin;
  try {
    skin = new DOMParser().parseFromString(skinXml, 'text/xml');
    if (skin.documentElement.nodeName === 'parsererror') {
      console.error('error while parsing');
      return;
    }
  } catch (e) {
    return;
  }

  const docRoot = skin.documentElement;
  clean(docRoot, true);
  console.log(docRoot.childNodes);
  if (docRoot.tagName === 'Skin') {
    const width = +getAttr(docRoot, 'width', 0);
    const height = +getAttr(docRoot, 'height', 0);
    if (!target) {
      if (docRoot.childNodes.length === 1) {
        target = getComponent(docRoot.childNodes[0]);
        return target;
      }
      target = new Component(width, height);
    } else {
      width && (target.displayWidth = width);
      height && (target.displayHeight = height);
    }
    docRoot.childNodes.forEach((childNode) => {
      const child = getComponent(childNode);
      if (child) {
        target.addChild(child);
        console.log('addChild1', child);
      }
    });
  }
  return target;
}

function setProperty(target, path, value) {
  console.log('setProperty:', path, value);
  if (value === null) return;
  if (path.indexOf('.') > -1) {
    const subPaths = path.split('.');
    const len = subPaths.length;
    for (let i = 0; i < len - 1; i++) {
      target = target[subPaths[i]];
      if (!target) break;
    }
    if (target) {
      const lastKey = subPaths[len - 1];
      console.log(`lastKey=${lastKey},value=${value}`);
      (lastKey in target) && (target[lastKey] = value);
    }
  } else {
    // if (path in target) {
    target[path] = value;
    // }
  }
}

function getComponent(node, tagName) {
  let component = null;
  tagName = tagName || node.tagName;
  if (node.tagName === '#text') return null;
  if (TAG_DEFINE[tagName]) {
    console.log(tagName, node.tagName);
    const width = +getAttr(node, 'width', 0);
    const height = +getAttr(node, 'height', 0);
    const Constructor = TAG_DEFINE[node.tagName];
    component = new Constructor(width, height);
    component._tagName = tagName;
    node.childNodes.forEach((childNode) => {
      console.log(childNode);
      const childComponent = getComponent(childNode);
      if (childComponent) {
        console.log(childComponent);
        const ref = getAttr(childNode, 'ref', '');
        if (ref) {
          component[ref] = childComponent;
        } else {
          component.addChild(childComponent);
        }
      }
    });
    SUPPORT_ATTRIBUTES.forEach((a) => {
      // component[a.name] = attr(node, a.name, a.default);
      if (hasAttr(node, a.name)) {
        let value = getAttr(node, a.name, a.default);
        if (typeof a.preset === 'function') {
          value = a.preset(value);
        }
        setProperty(component, ('path' in a ? a.path : a.name), value);
      }
      STATE_DEFINE.forEach((e) => {
        const stateKey = `${a.name}.${e[0]}`;
        if (hasAttr(node, stateKey)) {
          let stateValue = getAttr(node, stateKey, null);
          if (typeof a.preset === 'function') {
            stateValue = a.preset(stateValue);
          }
          if (e[1] === STATE.DOWN) {
            component.setEventEnabled(true);
          }
          console.log(`stateKey=${stateKey},stateValue=${stateValue}`);
          const stateData = component.getStateData(e[1]) || {};
          stateData[a.name] = stateValue;
          console.log(`stateData=`, stateData);
          component.setStateData(e[1], stateData);
        }
      });
    });
    return component;
  } else {
    // #text 无效的node 类似回车等特殊字符
    if (node.nodeName !== '#text') {
      console.error(`tag ${node.tagName} not defined`, node);
    }
  }
  return null;
}

export default {
  register,
  loadSkinUI,
};

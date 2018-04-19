/**
 * @file        The Tiny.js plugin
 * @author      fusheng.sfs
 */

/**
 * Tiny.js
 * @external Tiny
 * @see {@link http://tinyjs.net/}
 */

/**
* eui
* @external eui
* @see {@link https://github.com/qingyangmoke/tinyjs-plugin-eui.git}
*/

require('./pollyfill');
import Component from './ui/Component';
import Image from './ui/Image';
import Button from './ui/Button';
import RadioButton from './ui/RadioButton';
import CheckBoxButton from './ui/CheckBoxButton';
import Label from './ui/Label';
import Group from './ui/Group';
import ScrollerView from './ui/ScrollerView';
import SkinLoader from './skin/SkinLoader';
export * from './const';
export * from './utils';
export * from './config';

SkinLoader.register('Component', Component);
SkinLoader.register('Image', Image);
SkinLoader.register('Button', Button);
SkinLoader.register('RadioButton', RadioButton);
SkinLoader.register('CheckBoxButton', CheckBoxButton);
SkinLoader.register('Label', Label);
SkinLoader.register('Group', Group);
SkinLoader.register('Scroller', ScrollerView);

// 1像素 白色背景
const base64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFYAAABEAQMAAAAhhlAkAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAADUExURf///6fEG8gAAAAQSURBVCjPY2AYBaNgFBALAAMwAAGR2NilAAAAAElFTkSuQmCC';
Tiny.TextureCache['white_bg_png'] = Tiny.Texture.from(Tiny.BaseTexture.fromImage(base64));

const VERSION = '0.0.1';

export {
  VERSION,
  Component,
  Image,
  Label,
  Button,
  CheckBoxButton,
  RadioButton,
  Group,
  ScrollerView,
  SkinLoader,
};

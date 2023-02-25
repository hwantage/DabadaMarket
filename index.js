/**
 * @file : index.js
 * @Package : DABADA Market
 * @description : 직장 또는 그룹 내에서 온정을 주고 받는 마켓플레이스
 * @version : 3(1.2)
 * @author  : SOMANSA UX Team
 * @date    : 2023-02-04
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);

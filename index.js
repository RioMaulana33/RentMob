import { AppRegistry } from 'react-native';
import App from './src/screen/App'; 
import { name as appName } from './app.json';
import "./global.css"

AppRegistry.registerComponent(appName, () => App);

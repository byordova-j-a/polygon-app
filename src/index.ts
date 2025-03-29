import '~/styles/main.css';
import ActionButton from './components/action-button/index';
import ActionPanel from './components/action-panel/index';
import PolygonCanvas from './components/polygon-canvas/index';
import ControllerComponent from './components/controller-component/index';

customElements.define('action-button', ActionButton);
customElements.define('action-panel', ActionPanel);
customElements.define('polygon-canvas', PolygonCanvas);
customElements.define('controller-component', ControllerComponent);

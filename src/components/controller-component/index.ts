import html from './template.html';

import {EActionType, EPointType, type TActionButtonClickParams, type TMountedEventParams, type TSetPointEventParams, type TUpdatePointsAmountParams} from '~/types/main';
import './style.scss';

function setPolygonCanvasMountedState(e: CustomEvent<TMountedEventParams>) {
  this.isPolygonCanvasMounted = e.detail.isMounted;
  this.polygonCanvas = document.getElementsByTagName('polygon-canvas')[0] || null;

  if (!this.isActionPanelMounted) return;
  this.setChildProps();
}

function setActionPanelMountedState(e: CustomEvent<TMountedEventParams>) {
  this.isActionPanelMounted = e.detail.isMounted;
  this.actionPanel = document.getElementsByTagName('action-panel')[0] || null;

  if (!this.isPolygonCanvasMounted) return;
  this.setChildProps();
}

function updatePointsAmount(e: CustomEvent<TUpdatePointsAmountParams>) {
  if (!this.actionPanel) return;

  this.actionPanel.setAttribute('points-amount', e.detail.amount);
}

function actionButtonClick(e: CustomEvent<TActionButtonClickParams>) {
  if (!this.polygonCanvas || !this.actionPanel) return;

  this.polygonCanvas.setAttribute('state', e.detail.type);
  this.actionPanel.setAttribute('state', e.detail.type);

  if (e.detail.type === EActionType.CHANGE_CLOCKWISE) {
    this.clockwise = !this.clockwise;
    this.polygonCanvas.setAttribute('clockwise', String(this.clockwise));
    this.actionPanel.setAttribute('clockwise', String(this.clockwise));
  }
}

function setPoint(type: EPointType, point: string) {
  if (!this.actionPanel) return;
  this.actionPanel.setAttribute(`${type}-point`, point);
}

function setFirstPoint(event: CustomEvent<TSetPointEventParams>) {
  console.log(event.detail.point);
  this.setPoint(EPointType.FIRST, event.detail.point);
}

function setSecondPoint(event: CustomEvent<TSetPointEventParams>) {
  this.setPoint(EPointType.SECOND, event.detail.point);
}

function setChildProps() {
  if (!this.polygonCanvas || !this.actionPanel) return;

  if (localStorage.pointList) {
    const list = JSON.parse(localStorage.pointList);
    if (list.length < 3 || list.length > 15) {
      delete localStorage.pointList;
    } else {
      this.initialPointAmount = list.length;
      this.initalState = EActionType.DRAW;
    }
  }

  this.polygonCanvas.setAttribute('state', this.initalState);
  this.polygonCanvas.setAttribute('set-canvas-sizes', 'true');

  this.actionPanel.setAttribute('state', this.initalState);
  this.actionPanel.setAttribute('clockwise', String(this.clockwise));
  this.actionPanel.setAttribute('points-amount', String(this.initialPointAmount));
}

export default class ControllerComponent extends HTMLElement {
  clockwise: boolean = true;
  initialPointAmount: number = 0;
  initalState: EActionType = EActionType.NONE;

  actionPanel: Element | null = null;
  polygonCanvas: Element | null = null;

  isActionPanelMounted: boolean = false;
  isPolygonCanvasMounted: boolean = false;

  setPoint: (type: EPointType, point: string) => void;
  setChildProps: () => void;

  setActionPanelMountedState: (e: CustomEvent<TMountedEventParams>) => void;
  setPolygonCanvasMountedState: (e: CustomEvent<TMountedEventParams>) => void;

  setFirstPoint: (e: CustomEvent<TSetPointEventParams>) => void;
  setSecondPoint: (e: CustomEvent<TSetPointEventParams>) => void;

  updatePointsAmount: (e: CustomEvent<TUpdatePointsAmountParams>) => void;
  actionButtonClick: (e: CustomEvent<TActionButtonClickParams>) => void;

  constructor() {
    super();
    this.setPoint = setPoint;

    this.setChildProps = setChildProps;

    this.setActionPanelMountedState = setActionPanelMountedState;
    this.setPolygonCanvasMountedState = setPolygonCanvasMountedState;

    this.updatePointsAmount = updatePointsAmount;
    this.actionButtonClick = actionButtonClick;

    this.setFirstPoint = setFirstPoint;
    this.setSecondPoint = setSecondPoint;

    this.addEventListener('set-polygon-canvas-mounted-state', this.setPolygonCanvasMountedState);
    this.addEventListener('set-action-panel-mounted-state', this.setActionPanelMountedState);
    this.addEventListener('set-first-point', setFirstPoint);
    this.addEventListener('set-second-point', setSecondPoint);
    this.addEventListener('update-point-list', this.updatePointsAmount);
    this.addEventListener('action-button-click', this.actionButtonClick);
  }

  connectedCallback() {
    this.innerHTML = html;
  }

  disconnectedCallback() {
    this.removeEventListener('set-polygon-canvas-mounted-state', this.setPolygonCanvasMountedState);
    this.removeEventListener('update-mounted-state', this.setActionPanelMountedState);
    this.removeEventListener('set-first-point', setFirstPoint);
    this.removeEventListener('set-second-point', setSecondPoint);
    this.removeEventListener('update-point-list', this.updatePointsAmount);
    this.removeEventListener('action-button-click', this.actionButtonClick);
  }
}

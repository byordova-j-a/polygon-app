import html from './template.html';
import './style.scss';
import {debounce} from 'lodash-es';
import {EActionType, ESelectedPointType, type TPoint, type TMountedEventParams, type TSetPointEventParams, type TUpdatePointsAmountParams} from '~/types/main';
import {isNull, createEvent} from '~/helpers';

const loadingHiddenClassName = 'loading-hidden';
const loadingVisibleClassName = 'loading-visible';

function clearPolygon() {
  this.percentPointList = [];
  this.pointList = [];

  this.firstSelectedPointId = null;
  this.secondSelectedPointId = null;
  delete localStorage.pointList;

  const event1 = createEvent<TSetPointEventParams>('set-first-point', {point: this.firstSelectedPointId});
  const event2 = createEvent<TSetPointEventParams>('set-second-point', {point: this.secondSelectedPointId});
  const event3 = createEvent<TUpdatePointsAmountParams>('update-point-list', {amount: this.pointList.length});

  this.dispatchEvent(event1);
  this.dispatchEvent(event2);
  this.dispatchEvent(event3);

  this.pointCanvasContext?.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
  this.lineCanvasContext?.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
  this.selectCanvasContext?.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
}

function createPath(clockwise: boolean) {
  if (!this.selectCanvasContext || isNull(this.firstSelectedPoint) || isNull(this.secondSelectedPoint)) return;

  this.selectCanvasContext.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
  this.selectCanvasContext.beginPath();

  if (this.firstSelectedPointId === this.secondSelectedPointId) {
    this.pointList.forEach(({x, y}: TPoint) => {
      this.selectCanvasContext.lineTo(x, y);
    });

    this.selectCanvasContext.lineTo(this.pointList[0].x, this.pointList[0].y);
    this.selectCanvasContext.stroke();
  }

  const pointAId: number = clockwise ? this.firstSelectedPointId : this.secondSelectedPointId;
  const pointBId: number = clockwise ? this.secondSelectedPointId : this.firstSelectedPointId;

  if (pointAId < pointBId) {
    const pointPathList = this.pointList.slice(pointAId + 1, pointBId + 1);
    this.selectCanvasContext.moveTo(this.pointList[pointAId].x, this.pointList[pointAId].y);

    pointPathList.forEach(({x, y}: TPoint) => {
      this.selectCanvasContext.lineTo(x, y);
    });
  } else {
    if (pointBId > 0) {
      const pointPathList1 = this.pointList.slice(1, pointBId + 1);
      this.selectCanvasContext.moveTo(this.pointList[0].x, this.pointList[0].y);

      pointPathList1.forEach(({x, y}: TPoint) => {
        this.selectCanvasContext.lineTo(x, y);
      });
    }

    this.selectCanvasContext.moveTo(this.pointList[pointAId].x, this.pointList[pointAId].y);
    if (pointAId < this.pointList.length - 1) {
      const pointPathList2 = this.pointList.slice(pointAId + 1, this.pointList.length);

      pointPathList2.forEach(({x, y}: TPoint) => {
        this.selectCanvasContext.lineTo(x, y);
      });
    }
    this.selectCanvasContext.lineTo(this.pointList[0].x, this.pointList[0].y);
  }
  this.selectCanvasContext.stroke();
}

function selectPoint(pointType: ESelectedPointType, point: TPoint) {
  const selectedPointId = this.pointList.findIndex(({x, y}: TPoint) => {
    return Math.sqrt(Math.pow(x - point.x, 2) + Math.pow(y - point.y, 2)) < this.radius;
  });

  if (selectedPointId === -1) return;
  if (pointType === ESelectedPointType.FIRST) {
    this.firstSelectedPointId = selectedPointId;

    const event = createEvent<TSetPointEventParams>('set-first-point', {point: this.firstSelectedPointId});

    this.dispatchEvent(event);
  } else {
    this.secondSelectedPointId = selectedPointId;

    const event = createEvent<TSetPointEventParams>('set-second-point', {point: this.secondSelectedPointId});

    this.dispatchEvent(event);
  }

  if (!(isNull(this.firstSelectedPointId) || isNull(this.secondSelectedPointId))) {
    this.createPath(this.clockwise);
  }
}

function drawPolygonLines() {
  if (this.pointList.length < 3 || this.pointList.length > 15 || !this.lineCanvasContext || !this.pointCanvasContext) return;

  this.pointCanvasContext.font = `bold ${this.radius * 4}px serif`;

  this.lineCanvasContext.beginPath();
  this.lineCanvasContext.moveTo(this.pointList[0].x, this.pointList[0].y);

  this.pointList.forEach((point: TPoint, idx: number) => {
    const x = point.x;
    const y = point.y;
    this.lineCanvasContext.lineTo(x, y);
    this.pointCanvasContext.fillText('p' + (idx + 1), x + this.radius * 2, y - this.radius * 2);
  });

  this.lineCanvasContext.lineTo(this.pointList[0].x, this.pointList[0].y);
  this.lineCanvasContext.stroke();
  localStorage.pointList = JSON.stringify(this.percentPointList);
}

function sortPointList() {
  if (this.pointList.length <= 1) return;

  const sortedByXList = [...this.pointList];
  sortedByXList.sort((a, b) => {
    return Math.sign(a.x - b.x);
  });

  const sortedByPositiveYList: TPoint[] = [];
  const sortedByNegativeYList: TPoint[] = [];

  const firstLinePoint = {x: sortedByXList[0].x, y: sortedByXList[0].y};
  const secondLinePoint = {x: sortedByXList[sortedByXList.length - 1].x, y: sortedByXList[sortedByXList.length - 1].y};

  const getLine = (x: number) => ((secondLinePoint.y - firstLinePoint.y) * (x - firstLinePoint.x)) / (secondLinePoint.x - firstLinePoint.x) + firstLinePoint.y;

  sortedByXList.forEach(({x, y}: TPoint) => {
    if ((firstLinePoint.x === x && firstLinePoint.y === y) || (secondLinePoint.x === x && secondLinePoint.y === y) || getLine(x) - y >= 0) {
      sortedByPositiveYList.push({x, y});
    } else {
      sortedByNegativeYList.push({x, y});
    }
  });

  this.pointList = [...sortedByPositiveYList, ...sortedByNegativeYList.reverse()];
  this.percentPointList = this.pointList.map(({x, y}: TPoint) => ({x: x / this.canvasWidth, y: y / this.canvasHeight}));
  this.drawPolygonLines();
}

function setLoadingElemState(isShown: boolean = false) {
  if (!this.loadingElem) return;

  if (isShown) {
    this.loadingElem.classList.remove(loadingHiddenClassName);
    this.loadingElem.classList.add(loadingVisibleClassName);
  } else {
    this.loadingElem.classList.remove(loadingVisibleClassName);
    this.loadingElem.classList.add(loadingHiddenClassName);
  }
}

function updateCanvasSize() {
  if (!(this.adaptiveElem && this.lineCanvas && this.selectCanvas && this.pointCanvas)) return;
  const isDesktop = window.matchMedia('(orientation: landscape)').matches;
  const size = isDesktop ? this.desktopSize : this.mobileSize;

  this.unit = this.adaptiveElem.getBoundingClientRect().width / 1000;
  this.lineCanvas.width = this.unit * size.x;
  this.lineCanvas.height = this.unit * size.y;
  this.selectCanvas.width = this.unit * size.x;
  this.selectCanvas.height = this.unit * size.y;
  this.pointCanvas.width = this.unit * size.x;
  this.pointCanvas.height = this.unit * size.y;
  this.radius = isDesktop ? this.unit * 6 : this.unit * 3;

  const canvasProperties = this.pointCanvas.getBoundingClientRect();

  this.canvasWidth = canvasProperties.width;
  this.canvasHeight = canvasProperties.height;
  this.canvasLeft = canvasProperties.left;
  this.canvasTop = canvasProperties.top;

  if (this.lineCanvasContext) {
    this.lineCanvasContext.lineWidth = 2;
  }

  if (this.selectCanvasContext) {
    this.selectCanvasContext.lineWidth = 4;
    this.selectCanvasContext.strokeStyle = '#3399ff';
  }

  if (this.canvasBlock) {
    this.canvasBlock.classList.remove('display-none');
  }

  this.setLoadingElemState(false);

  this.pointCanvasContext.fillStyle = '#fff4c3';
  this.pointList = this.percentPointList.map(({x, y}: TPoint) => ({x: x * this.canvasWidth, y: y * this.canvasHeight}));

  this.pointList.forEach((point: TPoint) => {
    this.drawPoint(point);
  });

  if (this.state !== EActionType.CREATING && this.state !== EActionType.CLEAR && this.state !== EActionType.NONE) {
    this.pointCanvasContext.fillStyle = 'white';
    this.drawPolygonLines();
  }

  if (isNull(this.secondSelectedPointId) || isNull(this.firstSelectedPointId)) return;

  if (this.state === EActionType.SELECTING_FIRST || this.state === EActionType.SELECTING_SECOND || this.state === EActionType.CHANGE_CLOCKWISE) {
    this.createPath(this.clockwise);
  }
}

function resetCanvasSize() {
  if (!(this.lineCanvas.width && this.lineCanvas.height && this.selectCanvas.width && this.selectCanvas.height && this.pointCanvas.width && this.pointCanvas.height)) return;

  this.lineCanvas.width = 0;
  this.lineCanvas.height = 0;
  this.selectCanvas.width = 0;
  this.selectCanvas.height = 0;
  this.pointCanvas.width = 0;
  this.pointCanvas.height = 0;
}

function addPoint(point: TPoint) {
  const hasIntersection = !this.pointList.every(({x, y}: TPoint) => {
    return Math.sqrt(Math.pow(x - point.x, 2) + Math.pow(y - point.y, 2)) > this.radius * 2;
  });

  if (hasIntersection) return;

  const newPoint = {x: point.x, y: point.y};
  const newPercentPoint = {x: point.x / this.canvasWidth, y: point.y / this.canvasHeight};

  this.pointList.push(newPoint);
  this.percentPointList.push(newPercentPoint);
  this.drawPoint(newPoint);
  const event = createEvent<TUpdatePointsAmountParams>('update-point-list', {amount: this.pointList.length});

  this.dispatchEvent(event);
}

function drawPoint({x, y}: TPoint) {
  if (!this.pointCanvasContext) return;
  this.pointCanvasContext.beginPath();
  this.pointCanvasContext.arc(x, y, this.radius, 0, 2 * Math.PI);
  this.pointCanvasContext.fill();
  this.pointCanvasContext.stroke();
}

export default class PolygonCanvas extends HTMLElement {
  adaptiveElem: null | HTMLElement = null;
  lineCanvas: null | HTMLCanvasElement = null;
  selectCanvas: null | HTMLCanvasElement = null;
  pointCanvas: null | HTMLCanvasElement = null;
  canvasBlock: null | HTMLElement = null;
  state: EActionType = EActionType.NONE;
  canvasWidth: number = 300;
  canvasHeight: number = 300;
  canvasLeft: number = 0;
  canvasTop: number = 0;
  clockwise: boolean = true;
  isMounted: boolean = false;

  pointList: TPoint[] = [];
  percentPointList: TPoint[] = [];

  pointCanvasContext: null | CanvasRenderingContext2D;
  lineCanvasContext: null | CanvasRenderingContext2D;
  selectCanvasContext: null | CanvasRenderingContext2D;
  firstSelectedPointId: number | null = null;
  secondSelectedPointId: number = null;

  loadingElem: null | HTMLElement = null;
  unit: number = 1;
  radius: number = 6;
  mobileSize: {x: number; y: number} = {
    x: 300,
    y: 340
  };
  desktopSize: {x: number; y: number} = {
    x: 1400,
    y: 1000
  };

  updateCanvasSize: () => void;
  debouncedUpdateCanvasSize: () => void;
  setLoadingElemState: (isShown: boolean) => void;
  drawPoint: (point: TPoint) => void;
  addPoint: (point: TPoint) => void;
  resetCanvasSize: () => void;
  sortPointList: () => void;
  drawPolygonLines: () => void;
  selectPoint: (type: ESelectedPointType, point: TPoint) => void;
  createPath: (clockwise: boolean) => void;
  clearPolygon: () => void;
  pointCanvasClickHander: (e: MouseEvent | PointerEvent) => void;
  resize: () => void;

  constructor() {
    super();
    this.updateCanvasSize = updateCanvasSize;
    this.setLoadingElemState = setLoadingElemState;
    this.drawPoint = drawPoint;
    this.addPoint = addPoint;
    this.resetCanvasSize = resetCanvasSize;
    this.sortPointList = sortPointList;
    this.drawPolygonLines = drawPolygonLines;
    this.selectPoint = selectPoint;
    this.createPath = createPath;
    this.clearPolygon = clearPolygon;
    this.debouncedUpdateCanvasSize = debounce(() => {
      this.updateCanvasSize();
    }, 800);

    this.pointCanvasClickHander = (e: MouseEvent | PointerEvent) => {
      if (this.state === EActionType.CREATING) {
        this.addPoint({x: e.pageX - this.canvasLeft, y: e.pageY - this.canvasTop});
      }
      if (this.state === EActionType.SELECTING_FIRST) {
        this.selectPoint(ESelectedPointType.FIRST, {x: e.pageX - this.canvasLeft, y: e.pageY - this.canvasTop});
      }
      if (this.state === EActionType.SELECTING_SECOND) {
        this.selectPoint(ESelectedPointType.SECOND, {x: e.pageX - this.canvasLeft, y: e.pageY - this.canvasTop});
      }
    };

    this.resize = () => {
      this.setLoadingElemState(true);
      this.resetCanvasSize();
      this.debouncedUpdateCanvasSize();
    };
  }

  connectedCallback() {
    this.innerHTML = html;
    this.lineCanvas = (document.getElementById('line-canvas') as HTMLCanvasElement) || null;
    this.selectCanvas = (document.getElementById('select-canvas') as HTMLCanvasElement) || null;
    this.pointCanvas = (document.getElementById('point-canvas') as HTMLCanvasElement) || null;

    this.adaptiveElem = document.getElementById('adaptive-elem') || null;
    this.loadingElem = document.getElementById('loading-elem') || null;
    this.canvasBlock = document.getElementById('canvas-block') || null;

    this.pointCanvasContext = this.pointCanvas?.getContext('2d') || null;
    this.lineCanvasContext = this.lineCanvas?.getContext('2d') || null;
    this.selectCanvasContext = this.selectCanvas?.getContext('2d') || null;

    if (!(this.lineCanvas && this.selectCanvas && this.pointCanvas)) return;

    window.addEventListener('resize', this.resize);

    this.pointCanvas.addEventListener('click', this.pointCanvasClickHander);
    this.isMounted = true;
    const event = createEvent<TMountedEventParams>('set-polygon-canvas-mounted-state', {isMounted: this.isMounted});

    this.dispatchEvent(event);
  }

  static get observedAttributes(): string[] {
    return ['state', 'set-canvas-sizes', 'clockwise'];
  }
  attributeChangedCallback(name: string, oldValue: EActionType, newValue: EActionType) {
    if (oldValue === newValue || !this.isMounted || !this.pointCanvasContext || !this.lineCanvasContext || !this.selectCanvasContext) return;

    switch (name) {
      case 'state': {
        this.state = newValue;

        if (this.state === EActionType.CREATING) {
          this.pointCanvasContext.fillStyle = '#fff4c3';
        }

        if (this.state === EActionType.DRAW) {
          this.pointCanvasContext.fillStyle = 'white';
          if (localStorage.pointList && JSON.parse(localStorage.pointList)) {
            this.percentPointList = JSON.parse(localStorage.pointList);
            this.pointList = this.percentPointList.map(({x, y}: TPoint) => ({x: x * this.canvasWidth, y: y * this.canvasHeight}));

            this.pointCanvasContext.fillStyle = '#fff4c3';
            this.pointList.forEach((point: TPoint) => {
              this.drawPoint(point);
            });

            this.pointCanvasContext.fillStyle = 'white';
            this.drawPolygonLines();
          } else {
            this.sortPointList();
          }
        }

        if (this.state === EActionType.CLEAR) {
          this.clearPolygon();
        }
        break;
      }
      case 'set-canvas-sizes': {
        if (newValue && JSON.parse(newValue)) {
          this.updateCanvasSize();
        }
        break;
      }
      case 'clockwise': {
        if (newValue) {
          this.clockwise = JSON.parse(newValue);
          this.createPath(this.clockwise);
        }
        break;
      }
      default: {
        break;
      }
    }
  }

  disconnectedCallback() {
    window.removeEventListener('resize', this.resize);
    if (!this.pointCanvas) return;
    this.pointCanvas.removeEventListener('click', this.pointCanvasClickHander);
  }
}

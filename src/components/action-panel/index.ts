import html from './template.html';
import './style.scss';
import {isNull, createEvent} from '~/helpers';
import {EActionType, type TMountedEventParams} from '~/types/main';

const greenIndicatorClassName = 'green-indicator';
const redIndicatorClassName = 'red-indicator';

function createPath() {
  if (!this.pathElement || isNull(this.firstPathPoint) || isNull(this.secondPathPoint)) {
    this.pathElement.innerHTML = '';
    return;
  }

  let text = '';
  const pointA = this.firstPathPoint;
  const pointB = this.secondPathPoint;

  const list = Array.from(Array(this.pointAmount).keys());
  let finalList: number[] = [];
  if (pointA === pointB) {
    if (this.clockwise) {
      const list1 = list.splice(0, pointA);
      finalList = [...list, ...list1];
    } else {
      const list1 = list.splice(0, pointA + 1);
      finalList = [...list1.reverse(), ...list.reverse()];
    }

    finalList.forEach((item) => {
      text += `p${item + 1} - `;
    });
    text += `p${pointA + 1}`;
  }

  if (pointA < pointB) {
    if (this.clockwise) {
      finalList = list.slice(pointA, pointB + 1);
    } else {
      const list1 = list.slice(0, pointA + 1).reverse();
      const list2 = list.slice(pointB).reverse();
      finalList = [...list1, ...list2];
    }
  }

  if (pointA > pointB) {
    if (this.clockwise) {
      const list1 = list.slice(pointA);
      const list2 = list.slice(0, pointB + 1);
      finalList = [...list1, ...list2];
    } else {
      finalList = list.slice(pointB, pointA + 1).reverse();
    }
  }

  if (pointA !== pointB) {
    finalList.forEach((item, idx) => {
      text += `p${item + 1}${idx + 1 === finalList.length ? '' : ' - '}`;
    });
  }

  this.pathElement.innerHTML = text ? 'Path: ' + text : '';
}

export default class ActionPanel extends HTMLElement {
  isMounted: boolean = false;
  firstPathPoint: number | null = null;
  secondPathPoint: number | null = null;
  pointAmount: number = 0;
  clockwise: boolean = true;
  state: EActionType = EActionType.NONE;
  pathElement: null | HTMLElement = null;
  pointIndicatorElement: null | HTMLElement = null;
  actionButtonList: Element[] = [];
  drawButton: null | Element = null;
  clockwiseButton: null | Element = null;
  clearButton: null | Element = null;
  firstPointElement: null | HTMLElement = null;
  secondPointElement: null | HTMLElement = null;

  createPath: () => void;
  constructor() {
    super();
    this.createPath = createPath;
  }

  connectedCallback() {
    this.innerHTML = html;
    this.isMounted = true;
    this.pathElement = document.getElementById('path') || null;
    this.pointIndicatorElement = document.getElementById('point-indicator') || null;
    this.actionButtonList = Array.from(document.querySelectorAll("[is='action-button']"));
    this.firstPointElement = document.getElementById('first-point') || null;
    this.secondPointElement = document.getElementById('second-point') || null;

    this.drawButton = document.querySelector(`[is='action-button'][action-type='${EActionType.DRAW}']`);
    this.clockwiseButton = document.querySelector(`[is='action-button'][action-type='${EActionType.CHANGE_CLOCKWISE}']`);
    this.clearButton = document.querySelector(`[is='action-button'][action-type='${EActionType.CLEAR}']`);

    const event = createEvent<TMountedEventParams>('set-action-panel-mounted-state', {isMounted: this.isMounted});
    this.dispatchEvent(event);
  }

  static get observedAttributes() {
    return ['points-amount', 'first-point', 'second-point', 'clockwise', 'state'];
  }

  attributeChangedCallback(name: string, _oldValue: string, newValue: string) {
    if (!this.isMounted) return;

    switch (name) {
      case 'points-amount': {
        if (!this.pointIndicatorElement) return;

        const value = +newValue;
        if (isNaN(value)) return;

        this.pointAmount = value;
        this.pointIndicatorElement.innerHTML = `Created ${this.pointAmount} points`;

        if (value > 2 && value < 16) {
          this.pointIndicatorElement.classList.add(greenIndicatorClassName);
          this.pointIndicatorElement.classList.remove(redIndicatorClassName);

          if (this.state === EActionType.CREATING && this.drawButton && !!this.drawButton.getAttribute('disabled')) {
            this.drawButton.removeAttribute('disabled');
          }
        } else {
          this.pointIndicatorElement.classList.remove(greenIndicatorClassName);
          this.pointIndicatorElement.classList.add(redIndicatorClassName);
          if (value > 0 && this.state === EActionType.CREATING && this.clearButton && this.clearButton.getAttribute('disabled')) {
            this.clearButton.removeAttribute('disabled');
          }

          if (this.state === EActionType.CREATING && this.drawButton && !this.drawButton.getAttribute('disabled')) {
            this.drawButton.setAttribute('disabled', 'true');
          }
        }
        break;
      }

      case 'first-point': {
        if (!isNaN(+newValue)) {
          this.firstPathPoint = +newValue;
        }
        const html = isNull(this.firstPathPoint) ? '' : `p${this.firstPathPoint + 1}`;

        if (this.firstPointElement) {
          this.firstPointElement.innerHTML = html;
        }

        if (!isNull(this.firstPathPoint) && !isNull(this.secondPathPoint)) {
          this.createPath();
          if (this.clockwiseButton.getAttribute('disabled')) {
            this.clockwiseButton.removeAttribute('disabled');
          }
        }
        break;
      }

      case 'second-point': {
        if (!isNaN(+newValue)) {
          this.secondPathPoint = +newValue;
        }
        const html = isNull(this.secondPathPoint) ? '' : `p${this.secondPathPoint + 1}`;

        if (this.secondPointElement) {
          this.secondPointElement.innerHTML = html;
        }

        if (!isNull(this.firstPathPoint) && !isNull(this.secondPathPoint)) {
          this.createPath();
          if (this.clockwiseButton.getAttribute('disabled')) {
            this.clockwiseButton.removeAttribute('disabled');
          }
        }
        break;
      }

      case 'clockwise': {
        if (!newValue) return;
        this.clockwise = JSON.parse(newValue);
        this.createPath();
        break;
      }

      case 'state': {
        this.state = newValue as EActionType;
        if (newValue === EActionType.NONE || newValue === EActionType.CLEAR || newValue === EActionType.CREATING) {
          this.actionButtonList.forEach((button) => {
            if (button.getAttribute('action-type') === EActionType.CREATING && button.getAttribute('disabled')) {
              button.removeAttribute('disabled');
            }

            if (button.getAttribute('action-type') !== EActionType.CREATING && !button.getAttribute('disabled')) {
              button.setAttribute('disabled', 'true');
            }
          });
        }

        if (newValue === EActionType.DRAW) {
          this.actionButtonList.forEach((button) => {
            if ((button.getAttribute('action-type') === EActionType.CREATING || button.getAttribute('action-type') === EActionType.DRAW || button.getAttribute('action-type') === EActionType.CHANGE_CLOCKWISE) && !button.getAttribute('disabled')) {
              button.setAttribute('disabled', 'true');
            }
            if ((button.getAttribute('action-type') === EActionType.SELECTING_FIRST || button.getAttribute('action-type') === EActionType.SELECTING_SECOND || button.getAttribute('action-type') === EActionType.CLEAR) && button.getAttribute('disabled')) {
              button.removeAttribute('disabled');
            }
          });
        }

        if (newValue === EActionType.CLEAR) {
          this.firstPathPoint = null;
          this.secondPathPoint = null;
          this.createPath();
        }
        break;
      }

      default: {
        break;
      }
    }
  }
}

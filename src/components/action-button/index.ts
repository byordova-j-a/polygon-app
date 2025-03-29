import './style.scss';
import {EActionType, type TActionButtonClickParams} from '~/types/main';
import {createEvent} from '~/helpers';

export default class ActionButton extends HTMLButtonElement {
  actionType: EActionType;

  constructor() {
    super();
    this.addEventListener('click', () => {
      const event = createEvent<TActionButtonClickParams>('action-button-click', {type: this.actionType});
      this.dispatchEvent(event);
    });
  }
  connectedCallback() {
    this.actionType = (this.getAttribute('action-type') as EActionType) || EActionType.CREATING;
    switch (this.actionType) {
      case EActionType.CREATING: {
        this.textContent = 'Create points';
        break;
      }
      case EActionType.DRAW: {
        this.textContent = 'Draw pogygon';
        break;
      }
      case EActionType.SELECTING_FIRST: {
        this.textContent = 'First point';
        break;
      }
      case EActionType.SELECTING_SECOND: {
        this.textContent = 'Second point';
        break;
      }
      case EActionType.CHANGE_CLOCKWISE: {
        this.textContent = 'clockwise order';
        break;
      }
      case EActionType.CLEAR: {
        this.textContent = 'clear';
        break;
      }
      default: {
        this.textContent = '';
        break;
      }
    }
  }
  static get observedAttributes() {
    return ['action-type'];
  }
  //  attributeChangedCallback(actionType: string, oldValue: string, newValue: string) {
  //    console.log(newValue)
  //   // вызывается при изменении одного из перечисленных выше атрибутов
  // }
}

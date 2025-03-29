import './style.scss';
import {EActionType, type TActionButtonClickParams} from '~/types/main';
import {createEvent} from '~/helpers';
import html from './template.html';

export default class ActionButton extends HTMLElement {
  actionType: EActionType;
  disabled: boolean = false;
  text: string = '';
  button: HTMLButtonElement | null = null;

  constructor() {
    super();
    this.addEventListener('click', () => {
      const event = createEvent<TActionButtonClickParams>('action-button-click', {type: this.actionType});
      this.dispatchEvent(event);
    });
  }
  connectedCallback() {
    this.innerHTML = html;
    console.log(html);
    this.button = this.getElementsByTagName('button')[0] || null;
    this.actionType = (this.getAttribute('action-type') as EActionType) || EActionType.CREATING;

    switch (this.actionType) {
      case EActionType.CREATING: {
        this.text = 'Create points';
        break;
      }
      case EActionType.DRAW: {
        this.text = 'Draw pogygon';
        break;
      }
      case EActionType.SELECTING_FIRST: {
        this.text = 'First point';
        break;
      }
      case EActionType.SELECTING_SECOND: {
        this.text = 'Second point';
        break;
      }
      case EActionType.CHANGE_CLOCKWISE: {
        this.text = 'clockwise order';
        break;
      }
      case EActionType.CLEAR: {
        this.text = 'clear';
        break;
      }
      default: {
        this.text = '';
        break;
      }
    }
    if (this.button) {
      this.button.textContent = this.text;
    }
  }
  static get observedAttributes() {
    return ['action-type', 'disabled'];
  }
  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (oldValue === newValue) return;
    if (name === 'disabled') {
      this.disabled = true;
      if (newValue && this.button && !this.button.getAttribute('disabled')) this.button.setAttribute('disabled', 'true');
      if (!newValue && this.button && this.button.getAttribute('disabled')) this.button.removeAttribute('disabled');
    } else {
      this.disabled = false;
    }
  }
}

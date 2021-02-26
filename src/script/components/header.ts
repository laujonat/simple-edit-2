import { LitElement, css, html, customElement } from 'lit-element';

@customElement('app-header')
export class AppHeader extends LitElement {

  static get styles() {
    return css`
      header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-left: 16px;
        padding-right: 16px;
        background: var(--app-color-primary);
        color: white;
        height: 3.6em;
      }

      nav {
        width: 9em;
        display: flex;
        justify-content: space-between;
      }

      nav fast-anchor {
        margin-left: 10px;
      }

      #info {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 8.6em;
      }

      #info img {
        width: 2.4em;
      }

      #info h1 {
        font-size: 18px;
        margin-left: 8px;
        font-weight: bold;
      }

      @media(prefers-color-scheme: light) {
        header {
          color: black;
        }
      }
    `;
  }

  constructor() {
    super();
  }

  render() {
    return html`
      <header>
        <div id ="info">
          <img src="/assets/icons/icon_64.png" alt="Simple Edit app icon">

          <h1>SimpleEdit</h1>
        </div>
      </header>
    `;
  }
}

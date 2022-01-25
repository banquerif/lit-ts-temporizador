import { LitElement, customElement, css, html, property } from 'lit-element';
import './ban-temporizador';

@customElement('ban-anadir')
export class BanAnadir extends LitElement {
    static styles = css`
    div {
        position: fixed;
        bottom: 0;
        right: 0;
        padding: 10px 10px 10px 10px;
    }
    `;

    @property({ type: Number })
    contador: number = 1;

    render() {
        return html `
        <div>
            <button @click=${this.anadir}>Añadir</button>
        </div>
        `;
    }

    anadir() {
        this.contador++;
        var newDiv = document.createElement('ban-temporizador');
        newDiv.setAttribute('numeroTemporizador', String(this.contador));
        var currentDiv = document.getElementById("main");
        document.body.insertBefore(newDiv, currentDiv);
    }
}

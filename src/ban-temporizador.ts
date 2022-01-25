import {
  LitElement,
  html,
  customElement,
  property,
  css,
  query,
  TemplateResult,
} from 'lit-element';

@customElement('ban-temporizador')
export class BanTemporizador extends LitElement {
  static styles = css`
  #main {
    border: 1px solid;
    padding: 10px 10px 10px 10px;
    margin: 10px 10px 10px 10px;
    border-radius: 10px;
    max-width: 350px;
  }
    /*input[type=number] {
      outline: none;
      border: 0;
      background-color: rgb(24, 26, 27);
      font-size: 50px;
      width: 250px;
      height: 200px;
      text-align: center;
      -moz-appearance:textfield;
      border-radius: 5px;

    color: transparent;
    text-shadow: 0 0 0 gray;
    }

    input[type=number]:focus {
      background-color: rgba(24, 26, 27, 0.2);
    }

    .contador {
      display: inline-block;
      background-color: tomato;
      border-radius: 5px;
      padding: 35px 35px 35px 35px
    }

    input[type=number]::-webkit-inner-spin-button, 
    input[type=number]::-webkit-outer-spin-button { 
      -webkit-appearance: none; 
      margin: 0; 
    }*/
    input[autofocus=autofocus] {
      background-color: pink;
    }
  `;

  @query('#horas')
  inputHoras!: HTMLInputElement;

  @query('#minutos')
  inputMinutos!: HTMLInputElement;

  @query('#segundos')
  inputSegundos!: HTMLInputElement;

  @property({ type: Number })
  horas: number = 0;

  @property({ type: Number })
  minutos: number = 0;

  @property({ type: Number })
  segundos: number = 0;

  @property({ type: Number })
  horasCopia: number = 0;

  @property({ type: Number })
  minutosCopia: number = 0;

  @property({ type: Number })
  segundosCopia: number = 0;

  @property({type: Number})
  numeroTemporizador: number = 1;

  @property({ type: Boolean })
  anadirDeshabilitado: boolean = true;

  @property({ type: Boolean })
  iniciarDeshabilitado: boolean = true;

  @property({ type: Boolean })
  pausarDeshabilitado: boolean = true;

  @property({ type: Boolean })
  reiniciarDeshabilitado: boolean = true;

  @property({ type: Boolean })
  restarHorasDeshabilitado: boolean = false;

  @property({ type: Boolean })
  banderaSegundos: boolean = false;

  @property({ type: Object })
  temporizador: TemplateResult = html``;

  public intervalo: any;

  public contadorParHoras: number = 0;

  public eventoTeclado: any = document.addEventListener('keyup', (event) => {
    var keyValue = event.key;
    var codeValue = event.code;

    console.log("keyValue: " + keyValue);
    console.log("codeValue: " + codeValue);
    console.log('restar ' + this.restarHorasDeshabilitado);
    console.log('input horas ' + parseInt(this.inputHoras.value));
  }, false);


  public cancelarEventoTeclado: any = document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
      console.log('cancelar evento ' + event.key);
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();

      let atributoHoras = this.shadowRoot?.querySelector('#horas')?.getAttribute('autofocus');
      let atributoMinutos = this.shadowRoot?.querySelector('#minutos')?.getAttribute('autofocus');
      let atributoSegundos = this.shadowRoot?.querySelector('#segundos')?.getAttribute('autofocus');

      if (event.key === 'ArrowUp') {
        if (atributoHoras === 'autofocus') {
          this.sumarHoras();
        } else if (atributoMinutos === 'autofocus') {
          this.sumarMinutos();
        } else if (atributoSegundos === 'autofocus') {
          this.sumarSegundos();
        }
      } else if (event.key === 'ArrowDown') {
        if (atributoHoras === 'autofocus') {
          this.restarHoras();
        } else if (atributoMinutos === 'autofocus') {
          this.restarMinutos();
        } else if (atributoSegundos === 'autofocus') {
          this.restarSegundos();
        }
      }
      this.comprobarAnadir();
    }
    
    if (event.key === 'Enter' && (this.inputHoras.value !== '' || this.inputMinutos.value !== '' || this.inputSegundos.value !== '')) {
      // this.iniciarTiempo();
      this.anadirTiempo();
      this.iniciarTiempo();
    } else if (event.key === 'Enter' && (this.inputHoras.value === '' || this.inputMinutos.value === '' || this.inputSegundos.value === '')) {
      alert('Introduce tiempo en las horas, minutos o segundos');
    }

    if (event.code === 'Digit0' || event.code === 'Digit1' || event.code === 'Digit2' || event.code === 'Digit3' || event.code === 'Digit4' ||
      event.code === 'Digit5' || event.code === 'Digit6' || event.code === 'Digit7' || event.code === 'Digit8' || event.code === 'Digit9') {
      console.log('cancelar evento ' + event.key);
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();

      if (this.inputHoras.value === '') {
        this.inputHoras.value = '00';
      }

      let valor1 = this.inputHoras.value.charAt(1);
      let valor2 = this.inputHoras.value.charAt(0);
      let nuevoValor1;
      let nuevoValor2;
      console.log('valor 1 ' + valor1);
      console.log('valor 2 ' + valor2);

      this.contadorParHoras++;

      if (this.contadorParHoras % 2 !== 0) {
        nuevoValor1 = valor1.replace(valor1, event.key);
        this.inputHoras.value = valor2 + nuevoValor1;
      } else {
        nuevoValor2 = valor2.replace(valor2, event.key);
        this.inputHoras.value = valor1 + nuevoValor2;
      }

      console.log('conversion ' + this.inputHoras.value);

    }

    let inputHoras: HTMLInputElement | null | undefined = this.shadowRoot?.querySelector('#horas');
    let atributoHoras = this.shadowRoot?.querySelector('#horas')?.getAttribute('autofocus');

    let inputMinutos: HTMLInputElement | null | undefined = this.shadowRoot?.querySelector('#minutos');
    let atributoMinutos = this.shadowRoot?.querySelector('#minutos')?.getAttribute('autofocus');

    let inputSegundos: HTMLInputElement | null | undefined = this.shadowRoot?.querySelector('#segundos');
    let atributoSegundos = this.shadowRoot?.querySelector('#segundos')?.getAttribute('autofocus');

    // if 0 y <- 2
    if (event.code === 'ArrowLeft' && atributoHoras === 'autofocus') {
      inputHoras?.removeAttribute('autofocus');
      inputMinutos?.removeAttribute('autofocus');

      inputSegundos?.setAttribute('autofocus', 'autofocus');

      // if 0 y -> 1
    } else if (event.code === 'ArrowRight' && atributoHoras === 'autofocus') {
      inputHoras?.removeAttribute('autofocus');
      inputSegundos?.removeAttribute('autofocus');

      inputMinutos?.setAttribute('autofocus', 'autofocus');

      // if 1 y <- 0
    } else if (event.code === 'ArrowLeft' && atributoMinutos === 'autofocus') {
      inputMinutos?.removeAttribute('autofocus');
      inputSegundos?.removeAttribute('autofocus');

      inputHoras?.setAttribute('autofocus', 'autofocus');

      // if 1 y -> 2
    } else if (event.code === 'ArrowRight' && atributoMinutos === 'autofocus') {
      inputHoras?.removeAttribute('autofocus');
      inputMinutos?.removeAttribute('autofocus');

      inputSegundos?.setAttribute('autofocus', 'autofocus');

      // if 2 y <- 1
    } else if (event.code === 'ArrowLeft' && atributoSegundos === 'autofocus') {
      inputHoras?.removeAttribute('autofocus');
      inputSegundos?.removeAttribute('autofocus');

      inputMinutos?.setAttribute('autofocus', 'autofocus');

      // if 2 y -> 0
    } else if (event.code === 'ArrowRight' && atributoSegundos === 'autofocus') {
      inputMinutos?.removeAttribute('autofocus');
      inputSegundos?.removeAttribute('autofocus');

      inputHoras?.setAttribute('autofocus', 'autofocus');
    }
  }, false);


  public eventoFocus: any = document.addEventListener('focus', (event) => {
    var value1 = event.detail;

    console.log("focus: " + value1);
  }, false);

  firstUpdated() {
    let input: HTMLInputElement | null | undefined = this.shadowRoot?.querySelector('#horas');
    input?.setAttribute('autofocus', 'autofocus');
    let atributos = this.shadowRoot?.querySelector('#horas')?.getAttribute('autofocus');

    console.log('atributo ' + atributos);
  }

  render() {
    return html`
      <div id="main">
        <p>Temporizador ${this.numeroTemporizador}</p>
        <span>${this.horas === 0 && this.minutos === 0 && this.segundos === 0 ? '00:00:00' :
          this.temporizador}</span><br /><br />
        <input id="horas" type="number" placeholder="00" />
        <input id="minutos"  type="number" placeholder="00" />
        <input id="segundos" type="number" placeholder="00" />
      
        <button id="btnSumarHoras" @click="${() => this.dispararFunciones('+h')}" @mousedown="${this.llamarSumarHoras}"
          @mouseup="${this.limpiarLlamarSumarHoras}">
          + h
        </button>
      
        <button id="btnRestarHoras" @click="${() => this.dispararFunciones('-h')}" @mousedown="${this.llamarRestarHoras}"
          @mouseup="${this.limpiarLlamarRestarHoras}">
          - h
        </button>
      
        <button id="btnSumarMinutos" @click="${() => this.dispararFunciones('+m')}" @mousedown="${this.llamarSumarMinutos}"
          @mouseup="${this.limpiarLlamarSumarMinutos}">
          + m
        </button>
      
        <button id="btnRestarMinutos" @click="${() => this.dispararFunciones('-m')}" @mousedown="${this.llamarRestarMinutos}"
          @mouseup="${this.limpiarLlamarRestarMinutos}">
          - m
        </button>
      
        <button id="btnSumarSegundos" @click="${() => this.dispararFunciones('+s')}" @mousedown="${this.llamarSumarSegundos}"
          @mouseup="${this.limpiarLlamarSumarSegundos}">
          + s
        </button>
      
        <button id="btnRestarSegundos" @click="${() => this.dispararFunciones('-s')}" @mousedown="${this.llamarRestarSegundos}"
          @mouseup="${this.limpiarLlamarRestarSegundos}">
          - s
        </button>
      
        <button id="btnAnadir" @click="${this.anadirTiempo}" ?disabled="${this.anadirDeshabilitado}">Añadir</button>
      
        <button id="btnIniciar"  @click="${this.iniciarTiempo}" ?disabled="${this.iniciarDeshabilitado}">Iniciar</button>
      
        <button id="btnPausar" @click="${this.pausarTiempo}" ?disabled="${this.pausarDeshabilitado}">Pausar</button>
      
        <button id="btnReiniciar" @click="${this.reiniciarTiempo}" ?disabled="${this.reiniciarDeshabilitado}">Reiniciar</button>
      
      </div>

      <div>
        
      </div>
    `;
  }

  comprobarAnadir() {
    if (
      parseInt(this.inputHoras.value, 10) > 0 ||
      parseInt(this.inputMinutos.value, 10) > 0 ||
      parseInt(this.inputSegundos.value, 10) > 0
    ) {
      this.anadirDeshabilitado = false;
    } else {
      this.anadirDeshabilitado = true;
    }
  }

  anadirTiempo() {
    window.clearInterval(this.intervalo);

    this.horas =
      this.inputHoras.value === ''
        ? (this.horas = 0)
        : (this.horas = parseInt(this.inputHoras.value, 10))
    this.horasCopia = this.horas;
    console.log('horas copia ' + this.horasCopia)

    this.minutos =
      this.inputMinutos.value === ''
        ? (this.minutos = 0)
        : (this.minutos = parseInt(this.inputMinutos.value, 10))
    this.minutosCopia = this.minutos;
    console.log('minutos copia ' + this.minutosCopia)

    this.segundos =
      this.inputSegundos.value === ''
        ? (this.segundos = 0)
        : (this.segundos = parseInt(this.inputSegundos.value, 10))
    this.segundosCopia = this.segundos;
    console.log('segundos copia ' + this.segundosCopia)

    if (this.horas !== 0 || this.minutos !== 0 || this.segundos !== 0) {
      this.iniciarDeshabilitado = false;
    }

    this.formatoTemporizador();

    this.inputHoras.value = '';
    this.inputMinutos.value = '';
    this.inputSegundos.value = '';
    this.anadirDeshabilitado = true;
    this.banderaSegundos = this.segundos === 0 ? this.banderaSegundos = false : this.banderaSegundos = true;
  }

  iniciarTiempo() {
    window.clearInterval(this.intervalo);
    this.iniciarDeshabilitado = true;
    this.pausarDeshabilitado = false;
    this.reiniciarDeshabilitado = false;

    if (this.segundos !== 0) {

      this.intervalo = window.setInterval(() => {
        this.segundos--;
        this.formatoTemporizador();

        if (this.segundos === 0) {
          if (this.minutos !== 0) {
            this.minutos--;
            this.segundos = 60;
          } else if (this.minutos === 0 && this.horas !== 0) {
            this.horas--;
            this.minutos = 59;
            this.segundos = 60;
          } else if (this.horas === 0 && this.minutos === 0 && this.segundos === 0) {
            window.clearInterval(this.intervalo);
          }
        }
      }, 1000);
    } else {
      this.intervalo = window.setInterval(() => {
        if (this.banderaSegundos) {
          this.segundos--;
          this.formatoTemporizador();
        }
        if (this.segundos === 0) {
          if (this.minutos !== 0) {
            this.minutos--;
            this.segundos = 60;
            this.banderaSegundos = true;
          } else if (this.minutos === 0 && this.horas !== 0) {
            this.horas--;
            this.minutos = 59;
            this.segundos = 60;
            this.banderaSegundos = true;
          } else if (this.horas === 0 && this.minutos === 0 && this.segundos === 0) {
            window.clearInterval(this.intervalo);
          }
        }
      }, 1000);
    }
  }

  pausarTiempo() {
    let btnAnadir: HTMLButtonElement | null | undefined = this.shadowRoot?.querySelector('#btnPausar');

    if (btnAnadir?.innerText === 'Pausar') {
      btnAnadir.innerText = 'Reanudar';
      window.clearInterval(this.intervalo);
    } else if (btnAnadir?.innerText === 'Reanudar') {
      btnAnadir.innerText = 'Pausar';
      this.iniciarTiempo();
    }

    console.log('pausar')
  }

  reiniciarTiempo() {
    this.horas = this.horasCopia;
    this.minutos = this.minutosCopia;
    this.segundos = this.segundosCopia;
    this.banderaSegundos = this.segundos === 0 ? this.banderaSegundos = false : this.banderaSegundos = true;
    this.formatoTemporizador();
  }

  formatoTemporizador() {

    const numeroMenor = '0';

    // 2 numeros rellenos
    if (this.horas !== 0 && this.minutos !== 0 && this.segundos !== 0) {
      this.temporizador = html`${this.horas <= 9 ? numeroMenor : '' }${this.horas}:${this.minutos <=9 ? numeroMenor : '' }${this.minutos}:${this.segundos <=9 ? numeroMenor : '' }${this.segundos}`;
      console.log(`${this.horas}:${this.minutos}:${this.segundos}`)

    } else if (this.horas !== 0 && this.minutos !== 0 && this.segundos === 0) {
      this.temporizador = html`${this.horas <= 9 ? numeroMenor : '' }${this.horas}:${this.minutos <=9 ? numeroMenor : '' }${this.minutos}:00`;
      console.log(`${this.horas}:${this.minutos}:00`)

    } else if (this.horas !== 0 && this.minutos === 0 && this.segundos !== 0) {
      this.temporizador = html`${this.horas <= 9 ? numeroMenor : ''}${this.horas}:00:${this.segundos <= 9 ? numeroMenor : ''}${this.segundos}`;
      console.log(`${this.horas}:00:${this.segundos}`)

    } else if (this.horas === 0 && this.minutos !== 0 && this.segundos !== 0) {
      this.temporizador = html`00:${this.minutos <= 9 ? numeroMenor : '' }${this.minutos}:${this.segundos <=9 ? numeroMenor : '' }${this.segundos}`;
      console.log(`00:${this.minutos}:${this.segundos}`)
    }

    // 1 numero relleno
    else if (this.horas !== 0 && this.minutos === 0 && this.segundos === 0) {
      this.temporizador = html`${this.horas <= 9 ? numeroMenor : ''}${this.horas}:00:00`;
      console.log(`${this.horas}:00:00`)

    } else if (this.horas === 0 && this.minutos !== 0 && this.segundos === 0) {
      this.temporizador = html`00:${this.minutos <= 9 ? numeroMenor : ''}${this.minutos}:00`;
      console.log(`00:${this.minutos}:00`)

    } else if (this.horas === 0 && this.minutos === 0 && this.segundos !== 0) {
      this.temporizador = html`00:00:${this.segundos <= 9 ? numeroMenor : ''}${this.segundos}`;
      console.log(`00:00:${this.segundos}`)
    }

  }

  dispararFunciones(valor: any) {
    switch (valor) {
      case '+h':
        this.sumarHoras();
        this.comprobarAnadir();
        break;
      case '-h':
        this.restarHoras();
        this.comprobarAnadir();
        break;
      case '+m':
        this.sumarMinutos();
        this.comprobarAnadir();
        break;
      case '-m':
        this.restarMinutos();
        this.comprobarAnadir();
        break;
      case '+s':
        this.sumarSegundos();
        this.comprobarAnadir();
        break;
      case '-s':
        this.restarSegundos();
        this.comprobarAnadir();
        break;
    }
  }

  sumarHoras() {
    let sumatorio: number = 0;
    sumatorio++;

    this.inputHoras.value = this.inputHoras.value === '' ? '0' : this.inputHoras.value;
    let resultado = parseInt(this.inputHoras.value, 10) + sumatorio;

    if (resultado <= 99 || resultado <= 0) {
      this.inputHoras.value = resultado < 10 ? '0' + String(resultado) : String(resultado);
    } else if (resultado > 99) {
      this.inputHoras.value = '00';
    }
  }

  restarHoras() {
    let sumatorio: number = 0;
    sumatorio++;

    this.inputHoras.value = this.inputHoras.value === '' ? '0' : this.inputHoras.value;
    let resultado = parseInt(this.inputHoras.value, 10) - sumatorio;

    if (resultado <= 99 && resultado >= 0) {
      this.inputHoras.value = resultado < 10 ? '0' + String(resultado) : String(resultado);
    } else if (resultado < 0) {
      this.inputHoras.value = '99';
    }
  }

  llamarSumarHoras() {
    this.intervalo = window.setInterval(() => {
      this.sumarHoras();
    }, 100);
  }

  limpiarLlamarSumarHoras() {
    clearInterval(this.intervalo);
  }

  llamarRestarHoras() {
    this.intervalo = window.setInterval(() => {
      this.restarHoras();
    }, 100);
  }

  limpiarLlamarRestarHoras() {
    clearInterval(this.intervalo);
  }

  sumarMinutos() {
    let sumatorio: number = 0;
    sumatorio++;

    this.inputMinutos.value = this.inputMinutos.value === '' ? '0' : this.inputMinutos.value;
    let resultado = parseInt(this.inputMinutos.value, 10) + sumatorio;

    if (resultado <= 59 || resultado <= 0) {
      this.inputMinutos.value = resultado < 10 ? '0' + String(resultado) : String(resultado);
    } else if (resultado > 59) {
      this.inputMinutos.value = '00';
    }
  }

  restarMinutos() {
    let sumatorio: number = 0;
    sumatorio++;

    this.inputMinutos.value = this.inputMinutos.value === '' ? '0' : this.inputMinutos.value;
    let resultado = parseInt(this.inputMinutos.value, 10) - sumatorio;

    if (resultado <= 59 && resultado >= 0) {
      this.inputMinutos.value = resultado < 10 ? '0' + String(resultado) : String(resultado);
    } else if (resultado < 0) {
      this.inputMinutos.value = '59';
    }
  }

  llamarSumarMinutos() {
    this.intervalo = window.setInterval(() => {
      this.sumarMinutos();
    }, 100);
  }

  limpiarLlamarSumarMinutos() {
    clearInterval(this.intervalo);
  }

  llamarRestarMinutos() {
    this.intervalo = window.setInterval(() => {
      this.restarMinutos();
    }, 100);
  }

  limpiarLlamarRestarMinutos() {
    clearInterval(this.intervalo);
  }

  sumarSegundos() {
    let sumatorio: number = 0;
    sumatorio++;

    this.inputSegundos.value = this.inputSegundos.value === '' ? '0' : this.inputSegundos.value;
    let resultado = parseInt(this.inputSegundos.value, 10) + sumatorio;

    if (resultado <= 59 || resultado <= 0) {
      this.inputSegundos.value = resultado < 10 ? '0' + String(resultado) : String(resultado);
    } else if (resultado > 59) {
      this.inputSegundos.value = '00';
    }
  }

  restarSegundos() {
    let sumatorio: number = 0;
    sumatorio++;

    this.inputSegundos.value = this.inputSegundos.value === '' ? '0' : this.inputSegundos.value;
    let resultado = parseInt(this.inputSegundos.value, 10) - sumatorio;

    if (resultado <= 59 && resultado >= 0) {
      this.inputSegundos.value = resultado < 10 ? '0' + String(resultado) : String(resultado);
    } else if (resultado < 0) {
      this.inputSegundos.value = '59';
    }
  }

  llamarSumarSegundos() {
    this.intervalo = window.setInterval(() => {
      this.sumarSegundos();
    }, 100);
  }

  limpiarLlamarSumarSegundos() {
    clearInterval(this.intervalo);
  }

  llamarRestarSegundos() {
    this.intervalo = window.setInterval(() => {
      this.restarSegundos();
    }, 100);
  }

  limpiarLlamarRestarSegundos() {
    clearInterval(this.intervalo);
  }

  concatenarValorInput(horas: number) {
    if (horas < 10) {
      this.inputHoras.value = '0' + horas;
    }
    console.log('concatenar horas ' + this.inputHoras.value)
  }

}

declare global {
  interface HTMLElementTagNameMap {
    'ban-temporizador': BanTemporizador;
  }
}

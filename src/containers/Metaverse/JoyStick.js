export default class JoyStick {
  constructor(options) {
    const circle = document.createElement('div');
    circle.style.cssText = `
      position: absolute;
      bottom: 35px;
      width: 80px;
      height: 80px;
      background: rgba(126, 126, 126, .5);
      border: #444 solid medium;
      border-radius: 50%;
      left: 50%;
      transform: translateX(-50%);
    `;
    const thumb = document.createElement('div');
    thumb.style.cssText = `
      position: absolute;
      left: 20px;
      top: 20px;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: #fff;
    `;
    circle.appendChild(thumb);
    document.body.appendChild(circle);

    this.domElement = thumb;
    this.maxRadius = options.maxRadius || 40;
    this.maxRadiusSquared = this.maxRadius * this.maxRadius;
    this.onMove = options.onMove;
    this.game = options.game;
    this.origin = {
      left: this.domElement.offsetLeft,
      top: this.domElement.offsetTop
    }
    this.rotationDamping = options.rotationDamping || .06;
    this.moveDamping = options.moveDamping || .01;
    if (this.domElement !== undefined) {
      const joystick = this;
      if ('ontouchstart' in window) {
        this.document.addEventListener('touchstart', function (evt) {
          joystick.tap(evt)
        })
      } else {
        this.domElement.addEventListener('mousedown', function (evt) {
          joystick.tap(evt);
        })
      }
    }
  }

  getMousePosition (evt) {
    let clientX = evt.targetTouches ? evt.targetTouches[0].pageX : evt.clientX;
    let clientY = evt.targetTouches ? evt.targetTouches[0].pageY : evt.clientY;
    return {
      x: clientX,
      y: clientY
    }
  }

  tap(evt) {
    evt = evt || window.event;
    this.offset = this.getMousePosition(evt);
    const joystick = this;
    if ('ontouchstart' in window) {
      document.ontouchmove = function (evt) {
        joystick.move(evt);
      };
      document.ontouchend = function (evt) {
        joystick.getMousePosition(evt);
      };
    } else {
      document.onmousemove = function (evt) {
        joystick.move(evt);
      };
      document.onmouseup = function (evt) {
        joystick.up(evt);
      }
    }
  }

  move (evt) {
    evt = evt || window.event;
    const mouse = this.getMousePosition(evt);
    let left = mouse.x - this.offset.x;
    let top = mouse.y - this.offset.y;

    const sqMag = left * left + top * top;
    if (sqMag > this.maxRadiusSquared) {
      const magnitude = Math.sqrt(sqMag);
      left /= magnitude;
      top /= magnitude;
      left *= this.maxRadius;
      top *= this.maxRadius;
    }

    this.domElement.style.top = `${top + this.domElement.clientHeight / 2}px`;
    this.domElement.style.left = `${left + this.domElement.clientWidth / 2}px`;

    const forward = -(top - this.origin.top + this.domElement.clientHeight / 2) / this.maxRadius;
    const turn = (left - this.origin.left + this.document.clientWidth / 2) / this.maxRadius;
    if (this.onMove !== undefined) {
      this.onMove.call(this.game, forward, turn);
    }
  }

  up(evt) {
    if ('ontouchstart' in window) {
      document.ontouchmove = null;
      document.touched = null;
    } else {
      document.onmousemove = null;
      document.onmouseup = null;
    }
    this.domElement.style.top = `${this.origin.top}px`;
    this.domElement.style.left = `${this.origin.left}px`;
    this.onMove.call(this.game, 0, 0);
  }
}
class SketchPad {
  constructor(container, size = 400) {
    this.canvas = document.createElement('canvas');
    this.canvas.width = size;
    this.canvas.height = size;
    this.canvas.style = `
            background-color:white;
            box-shadow:0px 0px 10px 2px black;
        `;
    this.paths = [];
    this.isDrawing = false;

    container.appendChild(this.canvas);
    const lineBreak = document.createElement('br');
    container.appendChild(lineBreak);

    this.undoBtn = document.createElement('button');
    this.undoBtn.innerHTML = 'Undo';
    container.appendChild(this.undoBtn);

    this.ctx = this.canvas.getContext('2d');
    this.#redraw();
    this.reset();
    this.#addEventListeners();
  }

  reset() {
    this.paths = [];
    this.isDrawing = false;
    this.#redraw();
  }

  #addEventListeners() {
    // mouse event web
    this.canvas.onmousedown = (evt) => {
      const mouse = this.#getMousePath(evt);
      this.paths.push([mouse]);
      this.isDrawing = true;
    };
    this.canvas.onmousemove = (evt) => {
      if (this.isDrawing) {
        const mouse = this.#getMousePath(evt);
        const lastPath = this.paths[this.paths.length - 1];
        lastPath.push(mouse);
        this.#redraw();
      }
    };
    document.onmouseup = () => {
      this.isDrawing = false;
    };
    // touch event mobile
    this.canvas.ontouchstart = (evt) => {
      const loc = evt.touches[0];
      this.canvas.onmousedown(loc);
    };
    this.canvas.ontouchmove = (evt) => {
      const loc = evt.touches[0];
      this.canvas.onmousemove(loc);
    };
    document.ontouchend = () => {
      document.onmouseup();
    };
    // undo btn
    this.undoBtn.onclick = () => {
      this.paths.pop();
      this.#redraw();
    };
  }

  #redraw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    // from draw.js
    draw.paths(this.ctx, this.paths);
    if (!this.paths.length) {
      this.undoBtn.disabled = true;
    } else {
      this.undoBtn.disabled = false;
    }
  }

  #getMousePath(evt) {
    const rect = this.canvas.getBoundingClientRect();
    return [
      Math.round(evt.clientX - rect.left),
      Math.round(evt.clientY - rect.top),
    ];
  }
}

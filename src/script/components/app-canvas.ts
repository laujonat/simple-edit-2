import { fileSave } from 'browser-fs-access';
import { LitElement, css, html, customElement, internalProperty } from 'lit-element';

import { classMap } from 'lit-html/directives/class-map';

const typeMap = [
  { name: "grayscale", filter: new (window as any).fabric.Image.filters.Grayscale() },
  { name: "sepia", filter: new (window as any).fabric.Image.filters.Sepia() },
  { name: "brightness", filter: new (window as any).fabric.Image.filters.Brightness({ brightness: 80 }) },
  { name: "saturation", filter: new (window as any).fabric.Image.filters.Saturation({ saturation: 50 }) },
  { name: "blur", filter: new (window as any).fabric.Image.filters.Blur({ blur: 0.5 }) },
  { name: "invert", filter: new (window as any).fabric.Image.filters.Invert() },
  { name: "pixelate", filter: new (window as any).fabric.Image.filters.Pixelate({ blocksize: 50 }) }
];

@customElement('app-canvas')
export class AppCanvas extends LitElement {

  @internalProperty() canvas: any;
  @internalProperty() ctx: any;
  @internalProperty() image: HTMLImageElement | undefined | null;
  @internalProperty() imgInstance: any;

  worker: any | undefined;

  static get styles() {
    return css`
      :host {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;

        background: #1e1e1e;

        height: 100%;
        width: 100%;
      }

    `;
  }

  constructor() {
    super();
  }

  firstUpdated() {
    const canvas = this.shadowRoot?.querySelector("canvas");

    if (canvas) {
      console.log('setting up');
      // this.ctx = this.canvas.getContext('2d');
      (window as any).fabric.textureSize = 8000;
      this.canvas = new (window as any).fabric.Canvas(canvas);

      this.canvas.setDimensions({
        width: window.innerWidth,
        height: window.innerHeight - 40
      });

      this.canvas.on('mouse:wheel', (opt) => {
        var delta = opt.e.deltaY;
        var zoom = this.canvas.getZoom();
        zoom *= 0.999 ** delta;
        if (zoom > 20) zoom = 20;
        if (zoom < 0.01) zoom = 0.01;
        this.canvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
        opt.e.preventDefault();
        opt.e.stopPropagation();
      });

      // init(this.canvas, this.ctx);
    }
  }

  public drawImage(blob: Blob | File) {
    if (this.canvas) {
      console.info("Drawing image");

      const reader = new FileReader();

      reader.onloadend = (e) => {
        this.image = new Image();

        this.image.onload = (e) => {
          this.imgInstance = new (window as any).fabric.Image(this.image, {
            left: 0,
            top: 0,
            angle: 0
          });

          this.imgInstance.scaleToWidth(window.innerWidth - 100);

          this.canvas.add(this.imgInstance);

          this.imgInstance.bringToFront();
        }

        if (e.target.result) {
          this.image.src = (e.target.result as string);
        }
      }

      reader.readAsDataURL(blob);
    }
  }

  public async applyWebglFilter(type: string) {

    try {
      const active = this.canvas.getActiveObject();

      if (active) {
        const filter = typeMap.find((filter) => {
          if (filter.name === type) {
            return filter;
          }
        });

        active.filters.push(filter.filter);

        // apply filters and re-render canvas when done
        active.applyFilters();

        this.canvas.add(active);
      }
      else {
        // add filter
        const filter = typeMap.find((filter) => {
          if (filter.name === type) {
            return filter;
          }
        });

        this.imgInstance.filters.push(filter.filter);

        // apply filters and re-render canvas when done
        this.imgInstance.applyFilters();

        this.canvas.add(this.imgInstance);
      }

      // this.applying = false;
    }
    catch (err) {
      console.error(err);
    }
  }

  public async save() {
    this.canvas?.toBlob(async (blob) => {
      if (blob) {
        await fileSave(blob, {
          fileName: 'Untitled.png',
          extensions: ['.png'],
        });
      }
    });
  }

  public shareImage() {
    this.canvas?.toBlob(async (blob) => {
      if (blob) {
        const file = new File([blob], "untitled.png", {
          type: "image/png"
        });

        if ((navigator as any).canShare && (navigator as any).canShare({ files: [file] })) {
          await (navigator as any).share({
            files: [file],
            title: 'Edited image',
            text: 'edited image',
          })
        } else {
          console.log(`Your system doesn't support sharing files.`);
        }
      }
    });
  }

  render() {
    return html`
      <canvas></canvas>
    `;
  }
}

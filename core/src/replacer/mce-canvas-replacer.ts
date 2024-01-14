import { MceImage, MceRect, MceTextbox } from '../shapes';
import { fitImage } from './fit-image';
import { stretchImage } from './stretch-image';
import { MceStaticCanvas } from '../mce-static-canvas';
import { Object as FabricObject } from 'fabric';
import { loadImage } from './load-image';
import { MceLayer } from '../mce-layer';

export class MceCanvasReplacer {
	public static create(canvas: MceStaticCanvas) {
		const objects = canvas.getObjects();
		return new MceCanvasReplacer(canvas, objects);
	}

	public constructor(
		private readonly canvas: MceStaticCanvas,
		private readonly objects: FabricObject[]
	) {}

	public getText(layer: MceLayer): string {
		const textbox = this.objects[layer.realIndex] as MceTextbox;
		return textbox.text;
	}

	public replaceText(layer: MceLayer, text: string) {
		const textbox = this.objects[layer.realIndex] as MceTextbox;
		if (textbox.visible) {
			textbox.setText(text);
		}
	}

	/**
	 * Replace rectangle to image.
	 * @param layer Layer.
	 * @param sourceImage Image element or URL (for example data URL: `data:image/png;base64,...`).
	 * @param mode Mode of fitting image to the rectangle.
	 * @returns Promise that resolves when the rect is replaced.
	 */
	public async replaceRectToImage(layer: MceLayer, sourceImage: HTMLImageElement | string, mode: 'stretch' | 'fit'): Promise<void> {
		const rect = this.objects[layer.realIndex] as MceRect;
		if (!rect.visible) {
			// If the layer is hidden, do nothing.
			return;
		}
		if (typeof sourceImage === 'string') {
			sourceImage = await loadImage(sourceImage);
		}

		let image: MceImage;
		switch (mode) {
			case 'stretch':
				image = stretchImage(rect, sourceImage);
				break;
			case 'fit':
				image = fitImage(rect, sourceImage);
				break;
			default:
				throw new Error(`Unknown mode: ${mode}`);
		}

		this.canvas.remove(rect);
		this.canvas.insertAt(layer.realIndex, image);
	}
}

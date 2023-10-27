import { Editor, EditorMode } from 'mini-canvas-editor';
import { MceImage } from 'mini-canvas-core';

import 'mini-canvas-editor/css/editor.css';

export class App {
	public static preload() {
		const preloader = new Image();
		preloader.src = './assets/cat.jpg';
		preloader.onload = () => {
			App.create(preloader);
		};
	}

	public static create(image: HTMLImageElement) {
		const placeholder = document.getElementById('placeholder') as HTMLElement;
		const previewImage = document.getElementById('previewImage') as HTMLImageElement;
		const previewMaskImage = document.getElementById('previewMaskImage') as HTMLImageElement;

		const editor = Editor.createFromImage(
			placeholder,
			image,
			{
				selectable: false
			},
			{
				initialMode: EditorMode.brush,
				brush: {
					brushColor: '#ff0000',
					brushSize: 20
				},
				rect: {
					fillColor: '#ff0000'
				},
				image: false,
				textbox: false
			}
		);
		const app = new App(editor, previewImage, previewMaskImage);
		editor.onChanged.subscribe(app.reloadPreview);
		app.reloadPreview();
		return app;
	}

	private constructor(
		private readonly editor: Editor,
		private readonly previewImage: HTMLImageElement,
		private readonly previewMaskImage: HTMLImageElement
	) {}

	private readonly reloadPreview = async () => {
		const objects = this.editor.getWorkspaceObjects();
		const image = objects.find(o => o instanceof MceImage) as MceImage;
		if (!image || !image.visible) {
			this.previewImage.src = '';
			this.previewMaskImage.src = '';
			return;
		}

		const [maskCanvas, maskCanvasContext] = createMemoryCanvas(this.editor.getWidth(), this.editor.getHeight());
		objects.forEach(obj => {
			if (obj !== image) {
				obj.render(maskCanvasContext);
			}
		});

		const [imageCanvas, imageCanvasContext] = createMemoryCanvas(this.editor.getWidth(), this.editor.getHeight());
		image.render(imageCanvasContext);

		applyMask(this.editor.getWidth(), this.editor.getHeight(), imageCanvasContext, maskCanvasContext);

		this.previewImage.src = imageCanvas.toDataURL();
		this.previewMaskImage.src = maskCanvas.toDataURL();
	};
}

document.addEventListener('DOMContentLoaded', App.preload, false);

function createMemoryCanvas(width: number, height: number): [HTMLCanvasElement, CanvasRenderingContext2D] {
	const canvas = document.createElement('canvas');
	canvas.width = width;
	canvas.height = height;
	const canvasContext = canvas.getContext('2d') as CanvasRenderingContext2D;
	canvasContext.fillStyle = '#ffffff00';
	canvasContext.fillRect(0, 0, width, height);
	return [canvas, canvasContext];
}

function applyMask(width: number, height: number, target: CanvasRenderingContext2D, mask: CanvasRenderingContext2D) {
	const imageCanvasData = target.getImageData(0, 0, width, height);
	const maskCanvasData = mask.getImageData(0, 0, width, height);
	for (let i = 0; i < imageCanvasData.data.length; i += 4) {
		imageCanvasData.data[i + 3] = 255 - maskCanvasData.data[i + 3];
	}
	target.putImageData(imageCanvasData, 0, 0);
}

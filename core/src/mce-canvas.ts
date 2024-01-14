import { Canvas, CanvasOptions, TOptions, Pattern } from 'fabric';
import { MceImageJSON } from './mce-image-json';
import { createCanvasGrid } from './canvas-grid';
import { MceRect } from './shapes';
import { MceCanvasCommon } from './mce-canvas-common';

export class MceCanvas extends Canvas {
	public static createBlank(
		workspaceWidth: number,
		workspaceHeight: number,
		canvasElement: HTMLCanvasElement,
		options?: TOptions<CanvasOptions>
	): MceCanvas {
		const workspaceBackground = new MceRect({
			left: 0,
			top: 0,
			width: workspaceWidth,
			height: workspaceHeight,
			fill: new Pattern({
				repeat: 'repeat',
				source: createCanvasGrid()
			}),
			selectable: false
		});
		const canvas = new MceCanvas(workspaceWidth, workspaceHeight, canvasElement, {
			clipPath: workspaceBackground,
			...options
		});
		canvas.add(workspaceBackground);
		canvas.workspaceBackground = workspaceBackground;
		return canvas;
	}

	public static async createFromJSON(
		json: MceImageJSON,
		canvasElement: HTMLCanvasElement,
		options?: TOptions<CanvasOptions>
	): Promise<MceCanvas> {
		const canvas = new MceCanvas(json.width, json.height, canvasElement, options);
		await canvas.loadFromJSON(json.data);
		const objects = canvas.getObjects();
		canvas.workspaceBackground = objects[0] as MceRect;
		if (!canvas.workspaceBackground) {
			throw new Error('JSON does not contain a workspace background');
		}
		canvas.clipPath = canvas.workspaceBackground;
		return canvas;
	}

	public workspaceBackground!: MceRect;
	private readonly common = new MceCanvasCommon(this);

	private constructor(
		public workspaceWidth: number,
		public workspaceHeight: number,
		canvasElement: HTMLCanvasElement,
		options?: TOptions<CanvasOptions>
	) {
		super(canvasElement, options);
	}

	public readonly getWorkspaceObjects = this.common.getWorkspaceObjects;
	public readonly getLayers = this.common.getLayers;

	public toImageJSON(): MceImageJSON {
		const json = {
			width: this.workspaceWidth,
			height: this.workspaceHeight,
			data: this.toJSON()
		};
		return json;
	}
}

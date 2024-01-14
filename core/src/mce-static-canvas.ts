import { ImageFormat, StaticCanvas, TOptions, StaticCanvasOptions } from 'fabric';
import { MceCanvasReplacer } from './replacer/mce-canvas-replacer';
import { MceImageJSON } from './mce-image-json';
import { MceCanvasCommon } from './mce-canvas-common';
import { MceRect } from './shapes';

export class MceStaticCanvas extends StaticCanvas {
	public static async createFromJSON(json: MceImageJSON): Promise<MceStaticCanvas> {
		const canvas = new MceStaticCanvas(json.width, json.height, {
			width: json.width,
			height: json.height
		});
		await canvas.loadFromJSON(json.data);
		canvas.workspaceBackground = canvas.getObjects()[0] as MceRect;
		if (!canvas.workspaceBackground) {
			throw new Error('JSON does not contain a workspace background');
		}
		return canvas;
	}

	public workspaceBackground!: MceRect;
	private readonly common = new MceCanvasCommon(this);

	private constructor(
		private workspaceWidth: number,
		private workspaceHeight: number,
		options?: TOptions<StaticCanvasOptions>
	) {
		super(null as unknown as HTMLCanvasElement, options);
	}

	public readonly getWorkspaceObjects = this.common.getWorkspaceObjects;
	public readonly getLayers = this.common.getLayers;

	public getReplacer(): MceCanvasReplacer {
		return MceCanvasReplacer.create(this);
	}

	public exportToDataURL(format: ImageFormat, quality = 1): string {
		this.workspaceBackground.visible = false;

		return this.toDataURL({
			width: this.workspaceWidth,
			height: this.workspaceHeight,
			multiplier: 1,
			format,
			quality
		});
	}
}

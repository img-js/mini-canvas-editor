import { StaticCanvas } from 'fabric';
import { MceRect } from './shapes';
import { MceLayer } from './mce-layer';

export class MceCanvasCommon {
	public constructor(private readonly canvas: StaticCanvas & { workspaceBackground: MceRect }) {}

	public readonly getWorkspaceObjects = () => {
		return this.canvas.getObjects().filter(object => object !== this.canvas.workspaceBackground);
	};

	public readonly getLayers = (): MceLayer[] => {
		const objects = this.canvas.getObjects();
		const layers: MceLayer[] = [];
		for (let i = 0; i < objects.length; i++) {
			const object = objects[i];
			if (object !== this.canvas.workspaceBackground) {
				layers.push({
					index: layers.length,
					realIndex: i,
					name: object.get('label') ?? object.type,
					type: object.type
				});
			}
		}
		return layers;
	};
}

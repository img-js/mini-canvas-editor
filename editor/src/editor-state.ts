import { FabricObject, MceCanvas, Point } from 'mini-canvas-core';
import { SimpleEvent } from './core/simple-event';
import { BrushModeConfiguration, EditorConfiguration, EditorMode, RectModeConfiguration } from './editor-configuration';

export class EditorState {
	public readonly onModeChanged = new SimpleEvent<EditorMode>();
	public readonly onZoomChanged = new SimpleEvent<void>();
	public readonly onLayerOrderChanged = new SimpleEvent<void>();
	public readonly onPropertiesChanged = new SimpleEvent<FabricObject | MceCanvas>();
	public readonly onBrushConfigurationChanged = new SimpleEvent<void>();

	public brush: Required<BrushModeConfiguration> = {
		brushSize: 10,
		brushColor: '#ff0000',
		...(this.configuration.brush || {})
	};

	public rect: Required<RectModeConfiguration> = {
		fillColor: '#ff0000',
		...(this.configuration.rect || {})
	};

	public constructor(
		public readonly canvas: MceCanvas,
		public mode: EditorMode,
		private readonly configuration: EditorConfiguration,
		private readonly container: HTMLElement
	) {}

	public center() {
		const scale = Math.min(
			1,
			this.container.clientWidth / this.canvas.workspaceWidth,
			this.container.clientHeight / this.canvas.workspaceHeight
		);
		const width = this.canvas.workspaceWidth * scale;
		const height = this.canvas.workspaceHeight * scale;
		const x = this.container.clientWidth / 2 - width / 2;
		const y = this.container.clientHeight / 2 - height / 2;
		this.canvas.setZoom(scale);
		this.canvas.absolutePan(new Point(-x, -y));
		this.onZoomChanged.forward();
	}

	public add(object: FabricObject) {
		this.canvas.add(object);
		this.canvas.requestRenderAll();
	}

	public selectObject(object: FabricObject) {
		this.canvas.discardActiveObject();
		this.canvas.setActiveObject(object);
		this.canvas.renderAll();
	}

	public forEachObject(callback: (object: FabricObject, index: number, isLast: boolean) => void) {
		const objects = this.canvas.getWorkspaceObjects();
		for (let index = 0; index < objects.length; index++) {
			callback(objects[index], index, index + 1 === objects.length);
		}
	}

	public disableSelection(): SelectionReverter {
		this.canvas.selection = false;
		const map = new Map<FabricObject, boolean>();
		this.forEachObject(o => {
			map.set(o, o.selectable);
			if (o.selectable) {
				o.set('selectable', false);
			}
		});
		return new SelectionReverter(map);
	}

	public setMode(mode: EditorMode) {
		this.mode = mode;
		this.onModeChanged.forward(mode);
	}
}

export class SelectionReverter {
	public constructor(private readonly map: Map<FabricObject, boolean>) {}

	public revert() {
		this.map.forEach((value, key) => key.set('selectable', value));
	}
}

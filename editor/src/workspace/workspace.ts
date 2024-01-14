import { Component } from '../components/component';
import { Html } from '../core/html';
import { EditorConfiguration, EditorMode } from '../editor-configuration';
import { WorkspaceMode } from './modes/workspace-mode';
import { EditorState } from '../editor-state';
import { WorkspaceModeFactory } from './modes/workspace-mode-factory';
import { CanvasOptions, MceCanvas, MceImageJSON, Point, TOptions, TPointerEventInfo } from 'mini-canvas-core';

function createRoot() {
	const view = Html.div({
		class: 'mce-workspace'
	});

	const nativeCanvas = document.createElement('canvas');
	nativeCanvas.width = 1;
	nativeCanvas.height = 1;
	view.appendChild(nativeCanvas);
	return { view, nativeCanvas };
}

const canvasOptions: TOptions<CanvasOptions> = {
	imageSmoothingEnabled: true,
	preserveObjectStacking: true,
	controlsAboveOverlay: true,
	enableRetinaScaling: true,
	skipOffscreen: true
};

export class Workspace implements Component {
	public static createBlank(workspaceWidth: number, workspaceHeight: number, configuration: EditorConfiguration): Workspace {
		const { view, nativeCanvas } = createRoot();
		const canvas = MceCanvas.createBlank(workspaceWidth, workspaceHeight, nativeCanvas, canvasOptions);
		return Workspace.create(view, canvas, configuration);
	}

	public static async createFromJSON(json: MceImageJSON, configuration: EditorConfiguration): Promise<Workspace> {
		const { view, nativeCanvas } = createRoot();
		const canvas = await MceCanvas.createFromJSON(json, nativeCanvas, canvasOptions);
		return Workspace.create(view, canvas, configuration);
	}

	private static create(view: HTMLElement, canvas: MceCanvas, configuration: EditorConfiguration): Workspace {
		const initialMode = configuration.initialMode || EditorMode.select;
		const state = new EditorState(canvas, initialMode, configuration, view);

		const workspace = new Workspace(view, canvas, state);
		canvas.on('mouse:wheel', workspace.onWheel);
		state.onModeChanged.subscribe(workspace.reloadMode);
		workspace.reloadMode();

		return workspace;
	}

	private currentMode?: WorkspaceMode;

	private constructor(
		public readonly view: HTMLElement,
		public readonly canvas: MceCanvas,
		public readonly state: EditorState
	) {}

	public startAutoLayout(center: boolean) {
		setTimeout(() => {
			this.reloadLayout();
			if (center) {
				this.state.center();
			}
		});
		window.addEventListener('resize', this.reloadLayout, false);
	}

	public async destroy(): Promise<void> {
		if (this.currentMode) {
			this.currentMode.destroy();
		}
		window.removeEventListener('resize', this.reloadLayout, false);
		await this.canvas.dispose();
	}

	private readonly reloadLayout = () => {
		if (!this.view.parentElement) {
			throw new Error('Workspace is not attached to the DOM');
		}
		this.canvas.setWidth(this.view.clientWidth);
		this.canvas.setHeight(this.view.clientHeight);
	};

	private readonly onWheel = (opt: TPointerEventInfo<WheelEvent>) => {
		opt.e.preventDefault();
		opt.e.stopPropagation();

		const delta = opt.e.deltaY;
		let zoom = this.canvas.getZoom();
		zoom *= 0.999 ** delta;
		if (zoom > 20) {
			zoom = 20;
		}
		if (zoom < 0.01) {
			zoom = 0.01;
		}
		this.canvas.zoomToPoint(new Point(opt.e.offsetX, opt.e.offsetY), zoom);
		this.state.onZoomChanged.forward();
	};

	private readonly reloadMode = () => {
		if (this.currentMode) {
			this.currentMode.destroy();
		}
		this.currentMode = WorkspaceModeFactory.get(this.state.mode, this.state);
		this.currentMode.init();
	};
}

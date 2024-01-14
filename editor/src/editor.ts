import { Sidebar } from './sidebar/sidebar';
import { Html } from './core/html';
import { Workspace } from './workspace/workspace';
import { EditorConfiguration } from './editor-configuration';
import { Toolbox } from './toolbox/toolbox';
import { SimpleEvent } from './core/simple-event';
import { EditorState } from './editor-state';
import { FabricObject, MceImage, MceImageJSON, MceImageProps, MceStaticCanvas, Point, TOptions } from 'mini-canvas-core';
import { LayoutController } from './layout-controller';
import { Toolbar } from './toolbar/toolbar';

export interface CreateFromImageOptions {
	selectable?: boolean;
	select?: boolean;
	workspaceWidth?: number;
	workspaceHeight?: number;
	fitToWorkspace?: boolean;
}

export class Editor {
	public static createBlank(
		placeholder: HTMLElement,
		workspaceWidth: number,
		workspaceHeight: number,
		configuration: EditorConfiguration
	): Editor {
		const workspace = Workspace.createBlank(workspaceWidth, workspaceHeight, configuration);
		return Editor.create(placeholder, workspace, configuration);
	}

	public static createFromImage(
		placeholder: HTMLElement,
		image: HTMLImageElement,
		imageOptions: CreateFromImageOptions,
		configuration: EditorConfiguration
	): Editor {
		const workspaceWidth = imageOptions.workspaceWidth ?? image.width;
		const workspaceHeight = imageOptions.workspaceHeight ?? image.height;

		const editor = Editor.createBlank(placeholder, workspaceWidth, workspaceHeight, configuration);

		const layerOptions: TOptions<MceImageProps> = {
			width: image.width,
			height: image.height,
			selectable: imageOptions.selectable ?? true
		};
		if (imageOptions.fitToWorkspace) {
			const scale = Math.max(workspaceWidth / image.width, workspaceHeight / image.height);
			layerOptions.left = (workspaceWidth - image.width * scale) / 2;
			layerOptions.top = (workspaceHeight - image.height * scale) / 2;
			layerOptions.scaleX = scale;
			layerOptions.scaleY = scale;
		}
		const layer = new MceImage(image, layerOptions);
		editor.add(layer);

		if (imageOptions.selectable === false && imageOptions.select) {
			throw new Error('Cannot select an image that is not selectable');
		}
		if (imageOptions.selectable !== false && imageOptions.select) {
			editor.state.canvas.setActiveObject(layer);
		}
		return editor;
	}

	public static async createFromJSON(json: MceImageJSON, placeholder: HTMLElement, configuration: EditorConfiguration): Promise<Editor> {
		const workspace = await Workspace.createFromJSON(json, configuration);
		return Editor.create(placeholder, workspace, configuration);
	}

	private static create(placeholder: HTMLElement, workspace: Workspace, configuration: EditorConfiguration) {
		const view = Html.div({
			class: 'mce-editor'
		});

		const state = workspace.state;
		const toolbox = Toolbox.create(state, configuration);
		const toolbar = Toolbar.create(state);

		view.appendChild(toolbox.view);
		view.appendChild(toolbar.view);
		view.appendChild(workspace.view);

		if (configuration.sidebar !== false) {
			const sidebar = Sidebar.create(state, typeof configuration.sidebar === 'object' ? configuration.sidebar : {});
			view.appendChild(sidebar.view);
		}

		placeholder.appendChild(view);

		workspace.startAutoLayout(true);

		const layoutController = LayoutController.create(view);

		const editor = new Editor(view, workspace, state, layoutController);
		state.canvas.on('object:added', editor.onAnyChange);
		state.canvas.on('object:modified', editor.onAnyChange);
		state.canvas.on('object:moving', editor.onAnyChange);
		state.canvas.on('object:removed', editor.onAnyChange);
		state.canvas.on('object:resizing', editor.onAnyChange);
		state.canvas.on('object:rotating', editor.onAnyChange);
		state.canvas.on('object:scaling', editor.onAnyChange);
		state.canvas.on('object:skewing', editor.onAnyChange);
		state.canvas.on('text:changed', editor.onAnyChange);
		state.canvas.on('text:editing:exited', editor.onAnyChange);
		state.canvas.on('selection:cleared', editor.onAnyChange);
		state.canvas.on('selection:created', editor.onAnyChange);
		state.canvas.on('selection:updated', editor.onAnyChange);
		state.onLayerOrderChanged.subscribe(editor.onAnyChange);
		state.onPropertiesChanged.subscribe(editor.onAnyChange);
		return editor;
	}

	public readonly onChanged = new SimpleEvent<void>();

	private constructor(
		private readonly view: HTMLElement,
		private readonly workspace: Workspace,
		private readonly state: EditorState,
		private readonly layoutController: LayoutController
	) {}

	private readonly onAnyChange = () => {
		this.onChanged.forward();
	};

	public getWidth(): number {
		return this.state.canvas.workspaceWidth;
	}

	public getHeight(): number {
		return this.state.canvas.workspaceHeight;
	}

	public getWorkspaceObjects(): FabricObject[] {
		return this.state.canvas.getWorkspaceObjects();
	}

	public add(object: FabricObject) {
		this.state.add(object);
	}

	public toJSON(): MceImageJSON {
		return this.state.canvas.toImageJSON();
	}

	public cloneToStaticCanvas(): Promise<MceStaticCanvas> {
		// TODO: this is not too efficient
		return MceStaticCanvas.createFromJSON(this.toJSON());
	}

	public render(): HTMLCanvasElement {
		const currentZoom = this.state.canvas.getZoom();
		const currentWidth = this.state.canvas.width;
		const currentHeight = this.state.canvas.height;
		const currentViewport = this.state.canvas.viewportTransform;

		const activeObjects = this.state.canvas.getActiveObjects().map(object => {
			const controls = object.controls;
			const hasBorders = object.hasBorders;
			object.controls = {};
			object.hasBorders = false;
			return {
				object,
				controls,
				hasBorders
			};
		});

		this.state.canvas.setWidth(this.state.canvas.workspaceWidth);
		this.state.canvas.setHeight(this.state.canvas.workspaceHeight);
		this.state.canvas.setZoom(1);
		this.state.canvas.absolutePan(new Point(0, 0));
		this.state.canvas.workspaceBackground.visible = false;

		const result = this.state.canvas.toCanvasElement(1, {
			left: 0,
			top: 0,
			width: this.state.canvas.workspaceWidth,
			height: this.state.canvas.workspaceHeight
		});

		this.state.canvas.setZoom(currentZoom);
		this.state.canvas.setWidth(currentWidth);
		this.state.canvas.setHeight(currentHeight);
		this.state.canvas.setViewportTransform(currentViewport);
		this.state.canvas.workspaceBackground.visible = true;

		activeObjects.forEach(({ object, controls, hasBorders }) => {
			object.controls = controls;
			object.hasBorders = hasBorders;
		});
		return result;
	}

	public async destroy(): Promise<void> {
		await this.workspace.destroy();
		this.layoutController.destroy();
		this.view.parentElement?.removeChild(this.view);
	}
}

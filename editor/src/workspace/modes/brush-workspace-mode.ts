import { McePath, Path, PencilBrush } from 'mini-canvas-core';
import { EditorState } from '../../editor-state';
import { WorkspaceMode } from './workspace-mode';

export class BrushWorkspaceMode implements WorkspaceMode {
	private readonly brush = new PencilBrush(this.state.canvas);

	public constructor(private readonly state: EditorState) {}

	public init() {
		this.reloadBrush();

		this.state.canvas.freeDrawingBrush = this.brush;
		this.state.canvas.isDrawingMode = true;

		this.state.canvas.on('path:created', result => {
			const path = result.path as Path;
			this.state.canvas.remove(path);

			const newPath = new McePath(path.path, path);
			this.state.canvas.add(newPath);
		});
		this.state.onBrushConfigurationChanged.subscribe(this.reloadBrush);
	}

	public destroy() {
		this.state.canvas.freeDrawingBrush = undefined;
		this.state.canvas.isDrawingMode = false;
		this.state.onBrushConfigurationChanged.unsubscribe(this.reloadBrush);
	}

	private readonly reloadBrush = () => {
		this.brush.width = this.state.brush.brushSize;
		this.brush.color = this.state.brush.brushColor;
	};
}

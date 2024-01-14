import { MceRect } from 'mini-canvas-core';
import { EditorState } from '../../editor-state';
import { BoxPainter } from './box-painter';
import { WorkspaceMode } from './workspace-mode';
import { EditorMode } from '../../editor-configuration';

export class RectWorkspaceMode implements WorkspaceMode {
	private painter?: BoxPainter;

	public constructor(private readonly state: EditorState) {}

	public init() {
		this.painter = BoxPainter.create(this.state, () => {
			return new MceRect({
				fill: this.state.rect.fillColor,
				stroke: this.state.rect.fillColor,
				strokeWidth: 0
			});
		});
		this.painter.onFinished.subscribe(rect => {
			this.state.canvas.setActiveObject(rect);
			this.state.setMode(EditorMode.select);
		});
	}

	public destroy() {
		if (this.painter) {
			this.painter.destroy();
			this.painter = undefined;
		}
	}
}

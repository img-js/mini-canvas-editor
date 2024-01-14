import { MceTextbox, Rect } from 'mini-canvas-core';
import { EditorState } from '../../editor-state';
import { BoxPainter } from './box-painter';
import { WorkspaceMode } from './workspace-mode';
import { EditorMode } from '../../editor-configuration';

const MIN_HEIGHT = 10;
const MAX_FONT_SIZE = 20;

export class TextboxWorkspaceMode implements WorkspaceMode {
	private painter?: BoxPainter;

	public constructor(private readonly state: EditorState) {}

	public init() {
		this.painter = BoxPainter.create(this.state, () => {
			return new Rect({
				fill: 'transparent',
				stroke: '#26aa5a',
				strokeWidth: 1
			});
		});
		this.painter.onFinished.subscribe(rect => {
			const maxHeight = Math.max(rect.getScaledHeight(), MIN_HEIGHT);
			const fontSize = Math.min(maxHeight, MAX_FONT_SIZE);
			const textbox = new MceTextbox('Text', {
				left: rect.left,
				top: rect.top,
				width: rect.getScaledWidth(),
				maxHeight,
				fontSize,
				fill: '#000000'
			});

			this.state.canvas.remove(rect);
			this.state.add(textbox);
			this.state.canvas.setActiveObject(textbox);
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

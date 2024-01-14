import { EditorState } from '../../editor-state';
import { WorkspaceMode } from './workspace-mode';

export class SelectWorkspaceMode implements WorkspaceMode {
	public constructor(private readonly state: EditorState) {
		// nothing
	}

	public init() {
		this.state.canvas.setCursor('move');
		this.state.canvas.selection = true;
	}

	public destroy() {
		// nothing
	}
}

import { EditorState } from '../../editor-state';
import { WorkspaceMode } from './workspace-mode';
import { SelectWorkspaceMode } from './select-workspace-mode';
import { RectWorkspaceMode } from './rect-workspace-mode';
import { TextboxWorkspaceMode } from './textbox-workspace-mode';
import { BrushWorkspaceMode } from './brush-workspace-mode';
import { EditorMode } from '../../editor-configuration';

export class WorkspaceModeFactory {
	public static get(mode: EditorMode, state: EditorState): WorkspaceMode {
		switch (mode) {
			case EditorMode.select:
				return new SelectWorkspaceMode(state);
			case EditorMode.rect:
				return new RectWorkspaceMode(state);
			case EditorMode.brush:
				return new BrushWorkspaceMode(state);
			case EditorMode.textbox:
				return new TextboxWorkspaceMode(state);
		}
	}
}

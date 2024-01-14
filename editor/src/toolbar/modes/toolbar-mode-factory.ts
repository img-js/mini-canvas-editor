import { EditorState } from '../../editor-state';
import { EditorMode } from '../../editor-configuration';
import { DestroyableComponent } from '../../components/component';
import { RectToolbarMode } from './rect-toolbar-mode';
import { BrushToolbarMode } from './brush-toolbar-mode';

export class ToolbarModeFactory {
	public static create(mode: EditorMode, state: EditorState): DestroyableComponent | null {
		switch (mode) {
			case EditorMode.rect:
				return RectToolbarMode.create(state);
			case EditorMode.brush:
				return BrushToolbarMode.create(state);
		}
		return null;
	}
}

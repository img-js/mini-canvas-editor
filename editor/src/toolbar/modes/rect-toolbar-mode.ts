import { DestroyableComponent } from '../../components/component';
import { Html } from '../../core/html';
import { EditorState } from '../../editor-state';
import { colorToolbarInput } from '../editors/color-toolbar-input';

export class RectToolbarMode implements DestroyableComponent {
	public static create(state: EditorState): RectToolbarMode {
		const view = Html.div({
			class: 'mce-toolbar-brush'
		});

		const fillInput = colorToolbarInput('Fill', state.rect.fillColor);

		view.appendChild(fillInput.view);
		const toolbar = new RectToolbarMode(view, state);
		fillInput.onChanged.subscribe(toolbar.onFillColorChanged);
		return toolbar;
	}

	private constructor(
		public readonly view: HTMLElement,
		private readonly state: EditorState
	) {}

	private readonly onFillColorChanged = (newColor: string) => {
		this.state.brush.brushColor = newColor;
		this.state.onBrushConfigurationChanged.forward();
	};

	public destroy() {
		//
	}
}

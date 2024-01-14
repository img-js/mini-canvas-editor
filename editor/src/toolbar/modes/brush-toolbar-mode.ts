import { DestroyableComponent } from '../../components/component';
import { Html } from '../../core/html';
import { EditorState } from '../../editor-state';
import { colorToolbarInput } from '../editors/color-toolbar-input';
import { numberToolbarInput } from '../editors/number-toolbar-input';

export class BrushToolbarMode implements DestroyableComponent {
	public static create(state: EditorState): BrushToolbarMode {
		const view = Html.div({
			class: 'mce-toolbar-brush'
		});

		const sizeInput = numberToolbarInput('Size', state.brush.brushSize);
		const colorInput = colorToolbarInput('Color', state.brush.brushColor);

		view.appendChild(sizeInput.view);
		view.appendChild(colorInput.view);
		const toolbar = new BrushToolbarMode(view, state);
		sizeInput.onChanged.subscribe(toolbar.onBrushSizeChanged);
		colorInput.onChanged.subscribe(toolbar.onBrushColorChanged);
		return toolbar;
	}

	private constructor(
		public readonly view: HTMLElement,
		private readonly state: EditorState
	) {}

	private readonly onBrushSizeChanged = (newSize: number) => {
		this.state.brush.brushSize = newSize;
		this.state.onBrushConfigurationChanged.forward();
	};

	private readonly onBrushColorChanged = (newColor: string) => {
		this.state.brush.brushColor = newColor;
		this.state.onBrushConfigurationChanged.forward();
	};

	public destroy() {
		//
	}
}

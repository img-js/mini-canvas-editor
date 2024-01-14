import { DestroyableComponent } from '../components/component';
import { Html } from '../core/html';
import { EditorState } from '../editor-state';
import { ToolbarModeFactory } from './modes/toolbar-mode-factory';

export class Toolbar implements DestroyableComponent {
	public static create(state: EditorState): Toolbar {
		const view = Html.div({
			class: 'mce-toolbar'
		});

		const toolbar = new Toolbar(view, state);
		state.onModeChanged.subscribe(toolbar.reload);
		toolbar.reload();
		return toolbar;
	}

	private current: DestroyableComponent | null = null;

	private constructor(
		public readonly view: HTMLElement,
		private readonly state: EditorState
	) {}

	private readonly reload = () => {
		if (this.current) {
			this.view.removeChild(this.current.view);
			this.current = null;
		}
		const component = ToolbarModeFactory.create(this.state.mode, this.state);
		if (component) {
			this.current = component;
			this.view.appendChild(this.current.view);
			this.view.classList.remove('mce-hidden');
		} else {
			this.view.classList.add('mce-hidden');
		}
	};

	public destroy() {
		if (this.current) {
			this.current.destroy();
		}
	}
}

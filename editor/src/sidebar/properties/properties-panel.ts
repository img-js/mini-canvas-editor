import { EditorState } from '../../editor-state';
import { Component, DestroyableComponent } from '../../components/component';
import { panelComponent } from '../../components/panel-component';
import { ObjectPropertiesEditor } from './object-properties-editor';
import { RootPropertiesEditor } from './root-properties-editor';

export class PropertiesPanel implements Component {
	public static create(state: EditorState): PropertiesPanel {
		const container = document.createElement('div');

		const panel = panelComponent('Properties', container);

		const pp = new PropertiesPanel(panel.view, state, container);
		state.canvas.on('selection:cleared', pp.onSelectionUpdated);
		state.canvas.on('selection:updated', pp.onSelectionUpdated);
		state.canvas.on('selection:created', pp.onSelectionUpdated);
		pp.refresh();
		return pp;
	}

	private component?: DestroyableComponent;

	private constructor(
		public readonly view: HTMLElement,
		private readonly state: EditorState,
		private readonly container: HTMLElement
	) {}

	private readonly onSelectionUpdated = () => {
		this.refresh();
	};

	private refresh() {
		const activeObjects = this.state.canvas.getActiveObjects();

		if (this.component) {
			this.container.removeChild(this.component.view);
		}
		if (activeObjects.length === 1) {
			const activeObject = activeObjects[0];
			this.component = ObjectPropertiesEditor.create(this.state, activeObject);
		} else {
			this.component = RootPropertiesEditor.create(this.state);
		}
		this.container.appendChild(this.component.view);
	}
}

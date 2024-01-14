import { FabricObject, ObjectEvents } from 'mini-canvas-core';
import { DestroyableComponent } from '../../components/component';
import { Html } from '../../core/html';
import { EditorState } from '../../editor-state';
import { UpdateManager } from './update-manager';
import { ShapeEditorFactory } from './shapes/shape-editor-factory';

export class ObjectPropertiesEditor implements DestroyableComponent {
	public static create(state: EditorState, object: FabricObject) {
		const container = Html.div({
			class: 'mce-properties-editor'
		});

		const manager = UpdateManager.create<FabricObject, ObjectEvents>(state, ['modified', 'scaling'], object);
		manager.onChanged.subscribe(() => state.onPropertiesChanged.forward(object));

		const editor = ShapeEditorFactory.create(object.type, manager);

		container.appendChild(editor.view);
		return new ObjectPropertiesEditor(container, manager, editor);
	}

	private constructor(
		public readonly view: HTMLElement,
		private readonly manager: UpdateManager<FabricObject, ObjectEvents>,
		private readonly editor: DestroyableComponent
	) {}

	public destroy() {
		this.manager.destroy();
		this.editor.destroy();
	}
}

import { CanvasEvents, MceCanvas } from 'mini-canvas-core';
import { DestroyableComponent } from '../../components/component';
import { EditorState } from '../../editor-state';
import { numberPropertyEditor } from './editors/number-property-editor';
import { propertyEditorRows } from './layout/property-editor-rows';
import { UpdateManager } from './update-manager';
import { propertyEditorRow } from './layout/property-editor-row';
import { Html } from '../../core/html';

export class RootPropertiesEditor implements DestroyableComponent {
	public static create(state: EditorState) {
		const manager = UpdateManager.create<MceCanvas, CanvasEvents>(state, [], state.canvas);
		manager.onChanged.subscribe(() => state.onPropertiesChanged.forward(state.canvas));

		const view = Html.div({
			class: 'mce-properties-editor'
		});

		const rows = propertyEditorRows([
			propertyEditorRow([
				numberPropertyEditor(
					'Width',
					manager.bind(
						o => o.workspaceWidth,
						(o, v) => {
							o.workspaceBackground.set('width', v);
							o.workspaceWidth = v;
						}
					),
					{
						decimals: 0
					}
				)
			]),
			propertyEditorRow([
				numberPropertyEditor(
					'Height',
					manager.bind(
						o => o.workspaceHeight,
						(o, v) => {
							o.workspaceBackground.set('height', v);
							o.workspaceHeight = v;
						}
					),
					{
						decimals: 0
					}
				)
			])
		]);

		view.appendChild(rows.view);
		return new RootPropertiesEditor(view);
	}

	private constructor(public readonly view: HTMLElement) {}

	public destroy() {
		//
	}
}

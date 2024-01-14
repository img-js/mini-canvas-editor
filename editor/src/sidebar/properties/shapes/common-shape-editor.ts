import { FabricObject } from 'mini-canvas-core';
import { DestroyableComponent } from '../../../components/component';
import { numberPropertyEditor } from '../editors/number-property-editor';
import { propertyEditorRow } from '../layout/property-editor-row';
import { propertyEditorRows } from '../layout/property-editor-rows';
import { UpdateManager } from '../update-manager';

export function commonShapeEditor(manager: UpdateManager<FabricObject>, rows: DestroyableComponent[]): DestroyableComponent {
	function destroy() {
		allRows.forEach(r => r.destroy());
	}

	const row1 = propertyEditorRow([
		numberPropertyEditor(
			'X',
			manager.bind(
				o => o.left,
				(o, v) => o.set('left', v)
			)
		),
		numberPropertyEditor(
			'Y',
			manager.bind(
				o => o.top,
				(o, v) => o.set('top', v)
			)
		)
	]);

	const row2 = propertyEditorRow([
		numberPropertyEditor(
			'Angle',
			manager.bind(
				o => o.angle,
				(o, v) => o.set('angle', v)
			)
		)
	]);

	const row3 = propertyEditorRow([
		numberPropertyEditor(
			'Opacity',
			manager.bind(
				o => Math.round(o.opacity * 100),
				(o, v) => o.set('opacity', Math.min(100, Math.max(v, 0)) / 100)
			),
			{
				step: 2,
				decimals: 0,
				min: 0,
				max: 100
			}
		)
	]);

	const allRows = [...rows, row1, row2, row3];
	return {
		view: propertyEditorRows(allRows).view,
		destroy
	};
}

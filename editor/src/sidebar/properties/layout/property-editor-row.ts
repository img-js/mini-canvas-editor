import { DestroyableComponent } from '../../../components/component';
import { Html } from '../../../core/html';

export function propertyEditorRow(components: DestroyableComponent[]): DestroyableComponent {
	function destroy() {
		components.forEach(c => c.destroy());
	}

	const view = Html.div({
		class: 'mce-prop-row'
	});

	for (const editor of components) {
		const col = Html.div({
			class: 'mce-prop-col'
		});
		col.appendChild(editor.view);
		view.appendChild(col);
	}

	return {
		view,
		destroy
	};
}

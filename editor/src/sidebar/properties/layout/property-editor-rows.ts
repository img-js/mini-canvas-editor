import { Html } from '../../../core/html';
import { DestroyableComponent } from '../../../components/component';

export function propertyEditorRows(components: DestroyableComponent[]): DestroyableComponent {
	function destroy() {
		components.forEach(c => c.destroy());
	}

	const view = Html.div({
		class: 'mce-prop-rows'
	});

	for (const component of components) {
		view.appendChild(component.view);
	}

	return {
		view,
		destroy
	};
}

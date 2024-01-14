import { Html } from '../../../core/html';
import { Component } from '../../../components/component';

export function simplePropertyEditor(label: string, input: HTMLElement): Component {
	const view = Html.div({
		class: 'mce-prop-simple'
	});
	const lb = Html.div({
		class: 'mce-prop-simple-label'
	});
	lb.innerText = label;

	const body = Html.div({
		class: 'mce-prop-simple-body'
	});

	view.appendChild(lb);
	view.appendChild(body);
	body.appendChild(input);

	return {
		view
	};
}

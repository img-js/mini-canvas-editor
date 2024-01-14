import { Html } from '../core/html';
import { Icons } from '../core/icons';
import { SimpleEvent } from '../core/simple-event';
import { Component } from './component';

export interface IconButtonComponent extends Component {
	onClicked: SimpleEvent<void>;
	setIcon(icon: string): void;
}

export function iconButtonComponent(icon: string, title: string, size: 'sm'): IconButtonComponent {
	const onClicked = new SimpleEvent<void>();

	const view = Html.element('span', {
		class: `mce-icon-button mce-icon-button-${size}`,
		title
	});
	const svg = Icons.createSvg(icon, 'mce-icon-button-icon');
	const path = svg.querySelector('path') as SVGPathElement;
	view.appendChild(svg);

	view.addEventListener(
		'click',
		e => {
			e.preventDefault();
			e.stopPropagation();
			onClicked.forward();
		},
		false
	);

	return {
		view,
		onClicked,
		setIcon(newIcon: string) {
			path.setAttribute('d', newIcon);
		}
	};
}

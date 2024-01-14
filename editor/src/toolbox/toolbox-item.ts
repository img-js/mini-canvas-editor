import { Component } from '../components/component';
import { Html } from '../core/html';
import { Icons } from '../core/icons';
import { SimpleEvent } from '../core/simple-event';
import { EditorMode } from '../editor-configuration';

export class ToolboxItem implements Component {
	public static create(icon: string, title: string, mode: EditorMode | null) {
		const view = Html.div({
			class: 'mce-toolbox-item',
			title
		});
		view.appendChild(Icons.createSvg(icon, 'mce-toolbox-item-icon'));

		const item = new ToolboxItem(view, mode);
		view.addEventListener(
			'click',
			e => {
				e.preventDefault();
				item.onClicked.forward(item);
			},
			false
		);
		return item;
	}

	public readonly onClicked = new SimpleEvent<ToolboxItem>();

	private constructor(
		public readonly view: HTMLElement,
		public readonly mode: EditorMode | null
	) {}

	public setIsSelected(isSelected: boolean) {
		this.view.classList.toggle('mce-selected', isSelected);
	}
}

import { Component } from '../components/component';
import { Html } from '../core/html';
import { Icons } from '../core/icons';
import { EditorState } from '../editor-state';
import { ToolboxItem } from './toolbox-item';
import { ToolboxZoom } from './toolbox-zoom';
import { openImageAction } from './actions/open-image-action';
import { EditorConfiguration, EditorMode } from '../editor-configuration';

export class Toolbox implements Component {
	public static create(state: EditorState, configuration: EditorConfiguration) {
		const view = Html.div({
			class: 'mce-toolbox'
		});
		const top = Html.div({
			class: 'mce-toolbox-top'
		});
		const bottom = Html.div({
			class: 'mce-toolbox-bottom'
		});
		view.appendChild(top);
		view.appendChild(bottom);

		let imageItem: ToolboxItem | null = null;
		const items = [
			ToolboxItem.create(Icons.cursor, 'Select', EditorMode.select),
			configuration.rect !== false && ToolboxItem.create(Icons.rect, 'Rect', EditorMode.rect),
			configuration.textbox !== false && ToolboxItem.create(Icons.text, 'Textbox', EditorMode.textbox),
			configuration.brush !== false && ToolboxItem.create(Icons.brush, 'Brush', EditorMode.brush),
			configuration.image !== false && (imageItem = ToolboxItem.create(Icons.image, 'Image', null))
		].filter(Boolean) as ToolboxItem[];

		const toolbox = new Toolbox(view, state, items);
		for (const item of items) {
			top.appendChild(item.view);
			if (item.mode) {
				item.onClicked.subscribe(toolbox.onItemClicked);
			}
		}

		if (imageItem) {
			imageItem.onClicked.subscribe(toolbox.onOpenImageClicked);
		}

		const zoom = ToolboxZoom.create(state);
		bottom.appendChild(zoom.view);

		toolbox.reloadSelection();
		state.onModeChanged.subscribe(toolbox.reloadSelection);
		return toolbox;
	}

	private constructor(
		public readonly view: HTMLElement,
		private readonly state: EditorState,
		private readonly items: ToolboxItem[]
	) {}

	private readonly onItemClicked = (item: ToolboxItem) => {
		if (item.mode) {
			this.state.setMode(item.mode);
		}
	};

	private readonly onOpenImageClicked = async () => {
		openImageAction(this.state);
	};

	private readonly reloadSelection = () => {
		this.items.forEach(item => {
			item.setIsSelected(item.mode === this.state.mode);
		});
	};
}

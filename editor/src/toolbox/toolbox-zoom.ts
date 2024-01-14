import { Component } from '../components/component';
import { Html } from '../core/html';
import { EditorState } from '../editor-state';

export class ToolboxZoom implements Component {
	public static create(state: EditorState) {
		const view = Html.div({
			class: 'mce-toolbox-item',
			title: 'Zoom / Center'
		});
		const text = Html.div({
			class: 'mce-toolbox-item-zoom'
		});
		view.appendChild(text);

		const zoom = new ToolboxZoom(view, text, state);
		view.addEventListener('click', zoom.onClick, false);
		zoom.reloadZoom();
		state.onZoomChanged.subscribe(zoom.reloadZoom);
		return zoom;
	}

	private constructor(
		public readonly view: HTMLElement,
		private readonly text: HTMLElement,
		private readonly state: EditorState
	) {}

	private readonly reloadZoom = () => {
		const zoom = Math.round(this.state.canvas.getZoom() * 100);
		this.text.innerText = `${zoom}%`;
	};

	private readonly onClick = () => {
		this.state.center();
		this.reloadZoom();
	};
}

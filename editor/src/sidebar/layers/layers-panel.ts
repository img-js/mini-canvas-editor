import { LayerItem } from './layer-item';
import { EditorState } from '../../editor-state';
import { Component } from '../../components/component';
import { panelComponent } from '../../components/panel-component';

export class LayersPanel implements Component {
	public static create(state: EditorState): LayersPanel {
		const list = document.createElement('div');
		list.className = 'mce-layers-list';

		const panel = panelComponent('Layers', list);

		const inst = new LayersPanel(panel.view, state, list);
		state.canvas.on('object:added', inst.reloadList);
		state.canvas.on('object:removed', inst.reloadList);
		state.canvas.on('selection:cleared', inst.reloadSelection);
		state.canvas.on('selection:created', inst.reloadSelection);
		state.canvas.on('selection:updated', inst.reloadSelection);
		state.onLayerOrderChanged.subscribe(inst.reloadList);
		inst.reloadList();
		return inst;
	}

	private readonly layers: LayerItem[] = [];

	private constructor(
		public readonly view: HTMLElement,
		private readonly state: EditorState,
		private readonly list: HTMLElement
	) {}

	private readonly reloadList = () => {
		while (this.list.firstChild) {
			this.list.removeChild(this.list.firstChild);
		}

		this.state.forEachObject((object, index, isLast) => {
			const isFirst = index === 0;
			const item = LayerItem.create(this.state, object, isFirst, isLast);
			this.layers.push(item);
			if (this.list.firstChild) {
				this.list.insertBefore(item.view, this.list.firstChild);
			} else {
				this.list.appendChild(item.view);
			}
		});
		this.reloadSelection();
	};

	private readonly reloadSelection = () => {
		const a = this.state.canvas.getActiveObjects();
		for (const layer of this.layers) {
			layer.setIsSelected(a.includes(layer.object));
		}
	};
}

import { Component } from '../components/component';
import { Html } from '../core/html';
import { Icons } from '../core/icons';
import { SidebarConfiguration } from '../editor-configuration';
import { EditorState } from '../editor-state';
import { LayersPanel } from './layers/layers-panel';
import { PropertiesPanel } from './properties/properties-panel';

export class Sidebar implements Component {
	public static create(state: EditorState, configuration: SidebarConfiguration) {
		const root = Html.div({
			class: 'mce-sidebar'
		});

		const _switch = Html.div({
			class: 'mce-sidebar-switch'
		});
		_switch.appendChild(Icons.createSvg(Icons.menu, 'mce-sidebar-switch-icon'));
		const body = Html.div({
			class: 'mce-sidebar-body'
		});

		if (configuration.properties !== false) {
			const propertiesPanel = PropertiesPanel.create(state);
			body.appendChild(propertiesPanel.view);
		}

		if (configuration.layers !== false) {
			const layersPanel = LayersPanel.create(state);
			body.appendChild(layersPanel.view);
		}

		root.appendChild(_switch);
		root.appendChild(body);
		const sidebar = new Sidebar(root);
		_switch.addEventListener('click', sidebar.onSwitchClicked, false);
		return sidebar;
	}

	private constructor(public readonly view: HTMLElement) {}

	private readonly onSwitchClicked = () => {
		this.view.classList.toggle('mce-visible');
	};
}

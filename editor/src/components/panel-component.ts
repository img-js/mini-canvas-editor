import { Html } from '../core/html';
import { Component } from './component';

export function panelComponent(tabLabel: string, bodyContent: HTMLElement): Component {
	const view = Html.div({
		class: 'mce-panel'
	});

	const tabs = Html.div({
		class: 'mce-panel-tabs'
	});
	const firstTab = Html.div({
		class: 'mce-panel-tab'
	});
	firstTab.innerText = tabLabel;
	tabs.appendChild(firstTab);

	const body = Html.div({
		class: 'mce-panel-body'
	});
	body.className = 'mce-panel-body';
	body.appendChild(bodyContent);

	view.appendChild(tabs);
	view.appendChild(body);
	return { view };
}

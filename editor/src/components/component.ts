export interface Component {
	view: HTMLElement;
}

export interface DestroyableComponent extends Component {
	destroy(): void;
}

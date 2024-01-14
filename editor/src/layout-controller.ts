export class LayoutController {
	public static create(root: HTMLElement): LayoutController {
		const controller = new LayoutController(root);
		window.addEventListener('resize', controller.reload, false);
		controller.reload();
		return controller;
	}

	private constructor(private readonly root: HTMLElement) {}

	private readonly reload = () => {
		const isMobile = this.root.clientWidth < 400; // TODO
		if (isMobile) {
			this.root.classList.add('mce-mobile');
		} else {
			this.root.classList.remove('mce-mobile');
		}
	};

	public destroy() {
		window.removeEventListener('resize', this.reload, false);
	}
}

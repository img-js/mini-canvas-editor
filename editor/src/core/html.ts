export interface Attributes {
	[name: string]: string | number;
}

export class Html {
	public static attrs(element: Element, attributes: Attributes) {
		Object.keys(attributes).forEach(name => {
			const value = attributes[name];
			element.setAttribute(name, typeof value === 'string' ? value : value.toString());
		});
	}

	public static element<T extends keyof HTMLElementTagNameMap>(name: T, attributes?: Attributes): HTMLElementTagNameMap[T] {
		const element = document.createElement(name);
		if (attributes) {
			Html.attrs(element, attributes);
		}
		return element;
	}

	public static div(attributes?: Attributes): HTMLDivElement {
		return Html.element('div', attributes);
	}
}

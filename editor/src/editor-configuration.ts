export interface EditorConfiguration {
	initialMode?: EditorMode;
	rect?: RectModeConfiguration | false;
	brush?: BrushModeConfiguration | false;
	textbox?: TextboxModeConfiguration | false;
	image?: ImageModeConfiguration | false;
	sidebar?: SidebarConfiguration | boolean;
}

export interface SidebarConfiguration {
	/**
	 * Whether to show the properties panel.
	 * @default true
	 */
	properties?: boolean;

	/**
	 * Whether to show the layers panel.
	 * @default true
	 */
	layers?: boolean;
}

export interface RectModeConfiguration {
	fillColor?: string;
}

export interface BrushModeConfiguration {
	brushSize?: number;
	brushColor?: string;
}

export interface TextboxModeConfiguration {}

export interface ImageModeConfiguration {}

export enum EditorMode {
	select = 'select',
	rect = 'rect',
	brush = 'brush',
	textbox = 'textbox'
}

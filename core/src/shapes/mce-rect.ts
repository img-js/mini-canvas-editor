import { Rect, TOptions, RectProps, classRegistry } from 'fabric';

export interface MceMceRect extends RectProps {
	label: string;
}

export class MceRect extends Rect {
	public label!: string;

	public constructor(options: TOptions<MceMceRect>) {
		super({
			fill: '#000000',
			strokeWidth: 0,
			stroke: '#000000',
			label: 'Rect',
			...options
		});
		this.on('scaling', this.onScaled);
	}

	private readonly onScaled = () => {
		const width = this.width * this.scaleX;
		const height = this.height * this.scaleY;
		this.set({
			width,
			height,
			scaleX: 1,
			scaleY: 1
		});
	};

	// @ts-expect-error TS this typing limitations
	public toObject(propertiesToInclude: string[] = []) {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		return super.toObject(propertiesToInclude.concat(['label', 'selectable']) as any);
	}
}

classRegistry.setClass(MceRect);

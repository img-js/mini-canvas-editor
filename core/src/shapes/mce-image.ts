import { Image, ImageProps, TOptions, classRegistry } from 'fabric';

export interface MceImageProps extends ImageProps {
	label: string;
}

export class MceImage extends Image {
	public label!: string;

	public constructor(image: HTMLImageElement, options: TOptions<MceImageProps>) {
		super(image, {
			label: 'Image',
			...options
		});
	}

	// @ts-expect-error TS this typing limitations
	public toObject(propertiesToInclude: string[] = []) {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		return super.toObject(propertiesToInclude.concat(['label', 'selectable']) as any);
	}
}

classRegistry.setClass(MceImage);

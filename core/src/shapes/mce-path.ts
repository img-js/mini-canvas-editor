import { Path, PathProps, TOptions, classRegistry } from 'fabric';

export interface McePathProps extends PathProps {
	label: string;
}

export class McePath extends Path {
	public label!: string;

	public set type(_: string) {
		// This override is needed to silent "Setting type has no effect" log.
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	public constructor(path: any, options: TOptions<McePathProps>) {
		super(path, {
			label: 'Path',
			...options
		});
	}

	// @ts-expect-error TS this typing limitations
	public toObject(propertiesToInclude: string[] = []) {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		return super.toObject(propertiesToInclude.concat(['label', 'selectable']) as any);
	}
}

classRegistry.setClass(McePath);

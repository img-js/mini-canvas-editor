import { SimpleEvent } from '../../core/simple-event';

export interface PropertyAccessor<Val = unknown> {
	onExternalChanged: SimpleEvent<Val>;
	lastValue: Val;
	getValue: () => Val;
	setValue: (value: Val) => void;
}

import { UpdateManager } from '../update-manager';
import { DestroyableComponent } from '../../../components/component';
import { commonShapeEditor } from './common-shape-editor';
import { propertyEditorRow } from '../layout/property-editor-row';
import { numberPropertyEditor } from '../editors/number-property-editor';
import { choicePropertyEditor } from '../editors/choice-property-editor';
import { FillType, colorPropertyEditor } from '../editors/color-property-editor';
import { MceTextBackground, MceTextbox, MceVerticalAlign } from 'mini-canvas-core';

export function textShapeEditor(manager: UpdateManager<MceTextbox>): DestroyableComponent {
	const row1 = propertyEditorRow([
		numberPropertyEditor(
			'Font size',
			manager.bind(
				o => o.fontSize,
				(o, v) => o.set('fontSize', v)
			)
		)
	]);

	const row2 = propertyEditorRow([
		numberPropertyEditor(
			'Line height',
			manager.bind(
				o => o.lineHeight,
				(o, v) => o.set('lineHeight', v)
			),
			{
				step: 0.05,
				decimals: 2
			}
		)
	]);

	const row3 = propertyEditorRow([
		colorPropertyEditor(
			'Color',
			manager.bind(
				o => o.fill,
				(o, v) => o.set('fill', v)
			)
		)
	]);

	const row4 = propertyEditorRow([
		choicePropertyEditor(
			'Text align',
			{
				Left: 'left',
				Center: 'center',
				Right: 'right',
				Justify: 'justify'
			},
			manager.bind(
				o => o.textAlign,
				(o, v) => o.set('textAlign', v)
			)
		)
	]);

	const row5 = propertyEditorRow([
		choicePropertyEditor(
			'Vertical align',
			{
				Top: MceVerticalAlign.top,
				Middle: MceVerticalAlign.middle,
				Bottom: MceVerticalAlign.bottom
			},
			manager.bind(
				o => o.verticalAlign,
				(o, v) => o.set('verticalAlign', v)
			)
		)
	]);

	const row6 = propertyEditorRow([
		choicePropertyEditor(
			'Font',
			{
				// https://www.w3schools.com/cssref/css_websafe_fonts.php
				Arial: 'arial',
				Verdana: 'verdana',
				Tahoma: 'tahoma',
				Georgia: 'georgia',
				'Courier New': 'courier new',
				Serif: 'serif'
			},
			manager.bind(
				o => o.fontFamily,
				(o, v) => o.set('fontFamily', v)
			)
		)
	]);

	const row7 = propertyEditorRow([
		choicePropertyEditor(
			'Weight',
			{
				Bold: 'bold',
				Normal: 'normal'
			},
			manager.bind(
				o => o.fontWeight,
				(o, v) => o.set('fontWeight', v)
			)
		)
	]);

	const row8 = propertyEditorRow([
		choicePropertyEditor<number>(
			'Bg',
			{
				Off: MceTextBackground.none,
				Behind: MceTextBackground.behind
			},
			manager.bind(
				o => o.textBackground,
				(o, v) => o.set('textBackground', v)
			)
		),
		colorPropertyEditor(
			'Color',
			manager.bind(
				o => o.textBackgroundFill as FillType,
				(o, v) => o.set('textBackgroundFill', v)
			)
		)
	]);

	const row9 = propertyEditorRow([
		numberPropertyEditor(
			'SW',
			manager.bind(
				o => o.strokeWidth,
				(o, v) => o.set('strokeWidth', v)
			),
			{
				min: 0
			}
		),
		colorPropertyEditor(
			'SC',
			manager.bind(
				o => o.stroke as FillType,
				(o, v) => o.set('stroke', v)
			)
		)
	]);

	return commonShapeEditor(manager, [row1, row2, row3, row4, row5, row6, row7, row8, row9]);
}

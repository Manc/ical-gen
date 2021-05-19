import { foldLine, filterAndJoinICalLines } from './utils';

export interface ICalComponentOptions {
	children?: Array<ICalComponent | string>;
};

export default abstract class ICalComponent {
	/**
	 * The `tagName` will result in opening and closing tag lines like this
	 * when the component is rendered:
	 * 
	 * ```
	 * BEGIN:tagName
	 * ...
	 * END:tagName
	 * ```
	 */
	public abstract readonly tagName: string;

	/**
	 * Child components.
	 */
	public children: Array<ICalComponent | string>;

	/**
	 * Default component constructor.
	 */
	constructor(options?: ICalComponentOptions) {
		this.children = options?.children || [];
	}

	public addChild(child: ICalComponent | string): this {
		this.children.push(child);
		return this;
	}

	/**
	 * This method must be implemented to return all time zone strings used
	 * by the instance if the component deals with time zones (e.g. an event
	 * component). If the component has no capabilities of introducing time
	 * zones, this method should return an empty array.
	 */
	public abstract getTimeZones: () => Array<string>;

	/**
	 * An opportunity for a component to dynamically manipulate the child
	 * components when the component is rendered. For example, it can be used
	 * to return more generated components based on the `children` property,
	 * or to filter components.
	 */
	public getChildrenForRender = (): Promise<Readonly<Array<ICalComponent | string>>> => {
		return Promise.resolve(this.children);
	};

	/**
	 * Render component instance as lines in iCalendar format. This method must
	 * be implmented by each component. It is called when the component is
	 * rendered.
	 */
	protected abstract renderToLines(): Promise<Array<ICalComponent | string | undefined>>;

	 /**
	 * Render the component and its child components to a string.
	 */
	public async renderToString(): Promise<string> {
		const unfilteredLines = await Promise.all(
			(await this.renderToLines()).map<Promise<string | undefined>>(async (row) => {
				if (typeof row === 'string') {
					return foldLine(row.trimEnd());
					// if (trimmed) {
					// 	return trimmed;
					// }
				} else if (row instanceof ICalComponent) {
					// const childLines = await row.renderToLines();
					return row.renderToString();
					// if (childStr) {
					// 	return childStr;
					// }
				}
			})
		);

		return filterAndJoinICalLines([
			foldLine(`BEGIN:${this.tagName}`),
			...unfilteredLines,
			foldLine(`END:${this.tagName}`),
		]);
	}
}

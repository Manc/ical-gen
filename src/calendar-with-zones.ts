import type ICalComponent from './component';
import ICalCalendar, { ICalCalendarOptions } from './calendar';
import type ICalTimeZone from './timezone';

/**
 * An async function that, given a time zone string (e.g. `America/Los_Angeles`)
 * either resolves with a `ICalTimeZone` component (`VTIMEZONE`) or rejects the
 * Promise.
 */
export type ICalVTimezoneGenerator = (timezone: string) => Promise<ICalTimeZone>;

export type ICalCalendarWithZonesOptions = ICalCalendarOptions & {
	/**
	 * An async function that, given a time zone string (e.g. `America/Los_Angeles`)
	 * either resolves with a `ICalTimeZone` component (`VTIMEZONE`) or rejects the
	 * Promise.
	 */
	vTimeZoneGenerator: ICalVTimezoneGenerator;
};

export default class ICalCalendarWithZones extends ICalCalendar {
	public vTimeZoneGenerator: ICalVTimezoneGenerator;

	constructor(options: ICalCalendarWithZonesOptions) {
		super(options);
		this.vTimeZoneGenerator = options.vTimeZoneGenerator;
	}

	/**
	 * This implementation of `getChildrenForRender()` resolves all time zones
	 * to time zone components and dynamically adds them in front of all other
	 * other children.
	 */
	public getChildrenForRender = async (): Promise<Readonly<Array<ICalComponent | string>>> => {
		// Get all time zones, but ignore UTC.
		const timeZones = this.getTimeZones().filter(tz => tz !== 'UTC');

		// Try to generate a `VTIMEZONE` string for each time zone.
		const tzComponents: Array<ICalTimeZone> = (
			await Promise.all(
				timeZones.map(tz =>
					this.vTimeZoneGenerator(tz).catch(() => undefined)
				)
			)
		).filter(component => !!component) as ICalTimeZone[];

		return [
			...tzComponents, // Insert `VTIMEZONE`s first
			...this.children, // Then the rest like `VENENT` etc.
		];
	};
}

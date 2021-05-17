import {
	escapeICalValue,
	cleanLines,
	calLinesToString,
	toDurationString,
} from './utils';
import type ICalEvent from './event';

export interface ICalCalendarProdId {
	company: string;
	product: string;
	language: string;
}

export type ICalCalendarMethod =
	| 'PUBLISH'
	| 'REQUEST'
	| 'REPLY'
	| 'ADD'
	| 'CANCEL'
	| 'REFRESH'
	| 'COUNTER'
	| 'DECLINECOUNTER'
;

/**
 * A function that, given a time zone (e.g. `America/Los_Angeles`) returns
 * an iCalendar Time Zone Component (`VTIMEZONE`) if the time zone could be
 * resolved.
 */
export type ICalVTimezoneGenerator = (timezone: string) => string | null | undefined;

export type ICalCalendarOptions =
	Pick<ICalCalendar, 'prodId'> &
	Partial<
		Pick<ICalCalendar, 'method' | 'name' | 'description' | 'url' | 'ttl' | 'timezone' | 'events' | 'customLines' | 'vTimeZoneGenerator'>
	>;

export default class ICalCalendar {
	/**
	 * The identifier for the product that created the iCalendar object.
	 * 
	 * This property is required. If a new `ICalCalendar` is instantiated
	 * without options, a default with `Unnamed` values will be applied.
	 */
	public prodId: ICalCalendarProdId;

	/**
	 * Method.
	 */
	public method?: ICalCalendarMethod;

	/**
	 * Name of the calendar.
	 */
	public name?: string;

	/**
	 * An optional description for the calendar. This is a non-standard property
	 * only supported by some clients.
	 * 
	 * The value will be used for the property `X-WR-CALDESC`.
	 */
	public description?: string;

	/**
	 * If the calendar is being used as a feed, its URL.
	 * @example http://example.com/my/feed.ical
	 */
	public url?: string;

	/**
	 * If the calendar is being used as a feed, its TTL in seconds, in order
	 * to give the calendar client application a hint how often to fetch new
	 * data from the server. For example, `86400` would suggest to update the
	 * feed daily.
	 * 
	 * The value will be used for the properties `REFRESH-INTERVAL` and
	 * `X-PUBLISHED-TTL`.
	 */
	public ttl?: number;

	/**
	 * Time zone for the calendar as a whole. Usually you should define the
	 * time zone for individual events of the calendar.
	 */
	public timezone?: string;

	/**
	 * The event or events of this calendar instance.
	 */
	public events: ICalEvent[];

	/**
	 * An array of custom attribute lines that relate to the calendar object.
	 * The lines will be added to the final iCalendar file just before the
	 * closing `END:VCALENDAR` tag.
	 * 
	 * The line string must be properly formatted and the value must be escaped
	 * if necessary, but line-wrapping will be applied automatically when the
	 * calendar is being rendered.
	 */
	public customLines: string[];

	/**
	 * An optional callback function that, given a time zone (e.g.
	 * `America/Los_Angeles`) returns an iCalendar Time Zone Component
	 * (`VTIMEZONE`) if the time zone could be resolved.
	 * 
	 * For the best support of time zones, a `VTIMEZONE` entry in the calendar
	 * is recommended. It informs the client about the corresponding time zones
	 * including daylight saving time, deviation from UTC, etc.
	 * 
	 * It is your responsibility to provide this information through this
	 * callback. You can, for example, use `getVtimezoneComponent()` of the
	 * [@touch4it/ical-timezones](https://www.npmjs.com/package/@touch4it/ical-timezones)
	 * library. Example:
	 * 
	 * ```typescript
	 * import { getVtimezoneComponent } from '@touch4it/ical-timezones';
	 *
	 * const cal = new ICalCalendar();
	 * cal.vTimeZoneGenerator = getVtimezoneComponent;
	 * ```
	 */
	public vTimeZoneGenerator?: ICalVTimezoneGenerator;

	constructor(options?: ICalCalendarOptions) {
		const {
			prodId,
			method,
			name,
			description,
			url,
			ttl,
			timezone,
			events,
			customLines,
			vTimeZoneGenerator,
		} = options || {
			prodId: {
				company: 'Unnamed',
				product: 'Unnamed',
				language: 'EN',
			}
		};

		this.prodId = prodId;
		this.name = name;
		this.method = method;
		this.description = description;
		this.url = url;
		this.ttl = ttl;
		this.timezone = timezone;
		this.events = events || [];
		this.customLines = customLines || [];
		this.vTimeZoneGenerator = vTimeZoneGenerator;
	}

	/**
	 * Remove all events from the calendar instance.
	 */
	public removeAllEvents(): this {
		this.events = [];
		return this;
	}

	/**
	 * Add a single event to this calendar instance.
	 */
	public addEvent(event: ICalEvent): this {
		this.events.push(event);
		return this;
	}

	/**
	 * Add a custom attribute line to the calendar. The lines will be added to
	 * the final iCalendar file just before the closing `END:VCALENDAR` tag.
	 * 
	 * The line string must be properly formatted and the value must be escaped
	 * if necessary, but line-wrapping will be applied automatically when the
	 * calendar is being rendered.
	 */
	public addCustomLine(line: string): this {
		this.customLines.push(line);
		return this;
	}

	/**
	 * Add a custom attribute line to the calendar by supplying key and value
	 * separately. By default you are responsible to ensure that special
	 * characters in the value are escaped properly. For simple values you may
	 * set the `escapeValue` argument to `true` in order to escape the whole
	 * value.
	 */
	public addCustomAttribute(key: string, value: string, escapeValue = false): this {
		const escapedValue = escapeValue
			? escapeICalValue(value)
			: value;
		this.customLines.push(`${key}:${escapedValue}`);
		return this;
	}

	/**
	 * Render calendar instance as lines in iCalendar format.
	 */
	private renderRawLines(): Array<string | undefined> {
		const {
			prodId,
			url,
			method,
			name,
			description,
			timezone,
			ttl,
			events,
			customLines,
			vTimeZoneGenerator,
		} = this;
		const { company, product, language } = prodId;

		const ttlDuration = ttl && toDurationString(ttl);

		const lines: Array<string | undefined> = [
			'BEGIN:VCALENDAR',
			`PRODID:-//${company}//${product}//${language}`,
			'VERSION:2.0',
			'CALSCALE:GREGORIAN',
			url && `URL:${url}`,
			method && `METHOD:${method}`,
			description && `X-WR-CALDESC:${description}`,
			...(name ? [
				`NAME:${name}`,
				`X-WR-CALNAME:${name}`,
			] : []),
			...(ttlDuration ? [
				`REFRESH-INTERVAL;VALUE=DURATION:${ttlDuration}`,
				`X-PUBLISHED-TTL:${ttlDuration}`,
			] : []),
		];

		if (timezone) {
			// const generateVTZ = this.vTimeZoneGenerator;
			if (vTimeZoneGenerator) {
				// Make a list of all time zones used in this calendar.
				const allTimeZones = [
					...new Set<string>([
						timezone,
						...events
							.map(e => e.data.timezone)
							.filter(tz => !!tz) as string[]
					])
				];

				// Try to Generate `VTIMEZONE`s for each time zone.
				const vTZComponents = allTimeZones
					.map(tz => vTimeZoneGenerator(tz))
					.filter(str => !!str)
					.map<string[]>(str => {
						return (str as string)
							.split('\n')
							.map(l => l.trim());
					});

				// Add each Time Zone component as lines.
				lines.push(...vTZComponents.flat());
			}

			lines.push(
				`TIMEZONE-ID:${timezone}`,
				`X-WR-TIMEZONE:${timezone}`,
			);
		}

		// Events
		events.forEach(event => {
			lines.push(...event.renderRawLines());
		});

		// Custom attributes
		lines.push(...customLines);

		lines.push('END:VCALENDAR');

		return lines;
	}

	/**
	 * Render calendar instance in iCalendar format and return the result as
	 * string.
	 */
	public render(): string {
		return calLinesToString(
			cleanLines(
				this.renderRawLines()
			)
		);
	}
}

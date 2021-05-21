import { toDurationString } from './utils';
import ICalComponent from './component';

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

export type ICalCalendarOptions =
	Pick<ICalCalendar, 'prodId'> &
	Partial<
		Pick<ICalCalendar, 'method' | 'name' | 'description' | 'url' | 'ttl' | 'timezone' | 'children'>
	>;

export default class ICalCalendar extends ICalComponent {
	public tagName: string = 'VCALENDAR';

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

	constructor(options?: ICalCalendarOptions) {
		super(options);

		const {
			prodId,
			method,
			name,
			description,
			url,
			ttl,
			timezone,
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
	}

	public getTimeZones = (): string[] => {
		const timeZones = new Set<string>(
			this.timezone ? [this.timezone] : undefined
		);

		(this.children.filter(child => child instanceof ICalComponent) as ICalComponent[])
			.forEach(child => {
				child.getTimeZones().forEach(eventZone => timeZones.add(eventZone));
			});

		return [...timeZones];
	};

	/**
	 * Render calendar instance as lines in iCalendar format.
	 */
	// private renderRawLines(): Array<string | undefined> {
	protected async renderToLines(): Promise<Array<ICalComponent | string | undefined>> {
		const {
			prodId,
			url,
			method,
			name,
			description,
			timezone,
			ttl,
			// events,
			// customLines,
			// children,
			getChildrenForRender,
			// vTimeZoneGenerator,
		} = this;
		const { company, product, language } = prodId;

		const ttlDuration = ttl && toDurationString(ttl);

		const lines: Array<ICalComponent | string | undefined> = [
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
			...(timezone ? [
				`TIMEZONE-ID:${timezone}`,
				`X-WR-TIMEZONE:${timezone}`,
			] : []),
			...(await getChildrenForRender()),
		];

		return lines;
	}
}

// import { DateTime } from 'luxon';
// import type { RRule } from 'rrule';

import {
	// addOrGetCustomAttributes,
	// parseInputDate,
	// checkEnum,
	// checkNameAndMail,
	escapeICalValue,
	// formatDateOld
	// formatZonedDate,
	formatDateUTC,
	formatDateProp,
	getTimeZoneStr,
	// formatDateTZ,
	// attributesToLines,
	// calLinesToString,
	// generateCustomAttributes,
	// isRRule,
	// toDate,
	// toJSON,
	ICalZonedDate,
} from './utils';
import ICalComponent from './component';
import ICalAttendee, { ICalAttendeeData } from './attendee';
// import ICalAlarm, { ICalAlarmData } from './alarm';
import ICalCategory, { ICalCategoryData } from './category';
// import ICalCalendar from './calendar';
import {
	// ICalInternalDateTimeValue,
	ICalDescription,
	ICalEventRepeatingFreq,
	ICalLocation,
	ICalOrganizer,
	ICalRepeatingOptions,
	ICalWeekday
} from './types';


export type ICalEventStatus =
	| 'CONFIRMED'
	| 'TENTATIVE'
	| 'CANCELLED'
;

export type ICalEventBusyStatus =
	| 'FREE'
	| 'TENTATIVE'
	| 'BUSY'
	| 'OOF'
;

export type ICalEventTransparency =
	| 'TRANSPARENT'
	| 'OPAQUE'
;

export interface ICalEventData {
	uid: string;
	sequence: number;
	start: ICalZonedDate;
	end: ICalZonedDate;
	recurrenceId?: Date;
	stamp: Date;
	allDay?: boolean;
	floating?: boolean;
	repeating?: ICalRepeatingOptions | string; // | RRule
	/** Title of the event. */
	summary: string;
	/** Optional description of the event. */
	description?: ICalDescription | string;
	location?: ICalLocation;
	organizer?: ICalOrganizer | string;
	attendees?: ICalAttendee[];
	// alarms: ICalAlarm[];
	categories?: ICalCategory[];
	status?: ICalEventStatus;
	busystatus?: ICalEventBusyStatus;
	priority?: number;
	url?: string;
	transparency?: ICalEventTransparency;
	created?: Date;
	lastModified?: Date;
	x?: [string, string][];
}

// interface ICalEventInternalData {
// 	id: string,
// 	sequence: number,
// 	start: ICalInternalDateTimeValue | null,
// 	end: ICalInternalDateTimeValue | null,
// 	recurrenceId: ICalInternalDateTimeValue | null,
// 	timezone: string | null,
// 	stamp: ICalInternalDateTimeValue,
// 	allDay: boolean,
// 	floating: boolean,
// 	repeating: ICalEventInternalRepeatingData | RRule | string | null,
// 	summary: string,
// 	location: ICalLocation | null,
// 	description: ICalDescription | null,
// 	organizer: ICalOrganizer | null,
// 	attendees: ICalAttendee[],
// 	alarms: ICalAlarm[],
// 	categories: ICalCategory[],
// 	status: ICalEventStatus | null,
// 	busystatus: ICalEventBusyStatus | null,
// 	priority: number | null,
// 	url: string | null,
// 	transparency: ICalEventTransparency | null,
// 	created: ICalInternalDateTimeValue | null,
// 	lastModified: ICalInternalDateTimeValue | null,
// 	x: [string, string][];
// }

// export interface ICalEventJSONData {
// 	id: string,
// 	sequence: number,
// 	start: string | null,
// 	end: string | null,
// 	recurrenceId: string | null,
// 	timezone: string | null,
// 	stamp: string,
// 	allDay: boolean,
// 	floating: boolean,
// 	repeating: ICalEventInternalRepeatingData | string | null,
// 	summary: string,
// 	location: ICalLocation | null,
// 	description: ICalDescription | null,
// 	organizer: ICalOrganizer | null,
// 	attendees: ICalAttendee[],
// 	alarms: ICalAlarm[],
// 	categories: ICalCategory[],
// 	status: ICalEventStatus | null,
// 	busystatus: ICalEventBusyStatus | null,
// 	priority?: number | null,
// 	url: string | null,
// 	transparency: ICalEventTransparency | null,
// 	created: string | null,
// 	lastModified: string | null,
// 	x: {key: string, value: string}[];
// }

// interface ICalEventInternalRepeatingData {
// 	freq: ICalEventRepeatingFreq;
// 	count?: number;
// 	interval?: number;
// 	until?: Date;
// 	byDay?: ICalWeekday[];
// 	byMonth?: number[];
// 	byMonthDay?: number[];
// 	bySetPos?: number;
// 	exclude?: Date[];
// 	startOfWeek?: ICalWeekday;
// }


/**
 * Usually you get an `ICalCalendar` object like this:
 * ```javascript
 * import ical from 'ical-generator';
 * const calendar = ical();
 * const event = calendar.createEvent();
 * ```
 */
export default class ICalEvent extends ICalComponent {
	public tagName: string = 'VEVENT';

	public readonly data: ICalEventData;
	// private readonly calendar: ICalCalendar;

	/**
	 * Constructor of [[`ICalEvent`]. The calendar reference is
	 * required to query the calendar's timezone when required.
	 *
	 * @param data Calendar Event Data
	 * @param calendar Reference to ICalCalendar object
	 */
	// constructor(data: ICalEventData, calendar: ICalCalendar) {
	constructor(options: ICalEventData) {
		super();

		this.data = options;

		// this.data = {
		// 	id: uuid(),
		// 	sequence: 0,
		// 	start: null,
		// 	end: null,
		// 	recurrenceId: null,
		// 	timezone: null,
		// 	stamp: new Date(),
		// 	allDay: false,
		// 	floating: false,
		// 	repeating: null,
		// 	summary: '',
		// 	location: null,
		// 	description: null,
		// 	organizer: null,
		// 	attendees: [],
		// 	alarms: [],
		// 	categories: [],
		// 	status: null,
		// 	busystatus: null,
		// 	priority: null,
		// 	url: null,
		// 	transparency: null,
		// 	created: null,
		// 	lastModified: null,
		// 	x: []
		// };

		// this.calendar = calendar;
		// if (!calendar) {
		// 	throw new Error('`calendar` option required!');
		// }

		// data.id && this.id(data.id);
		// data.sequence !== undefined && this.sequence(data.sequence);
		// data.start && this.start(data.start);
		// data.end !== undefined && this.end(data.end);
		// data.recurrenceId !== undefined && this.recurrenceId(data.recurrenceId);
		// data.timezone !== undefined && this.timezone(data.timezone);
		// data.stamp !== undefined && this.stamp(data.stamp);
		// data.allDay !== undefined && this.allDay(data.allDay);
		// data.floating !== undefined && this.floating(data.floating);
		// data.repeating !== undefined && this.repeating(data.repeating);
		// data.summary !== undefined && this.summary(data.summary);
		// data.location !== undefined && this.location(data.location);
		// data.description !== undefined && this.description(data.description);
		// data.organizer !== undefined && this.organizer(data.organizer);
		// data.attendees !== undefined && this.attendees(data.attendees);
		// data.alarms !== undefined && this.alarms(data.alarms);
		// data.categories !== undefined && this.categories(data.categories);
		// data.status !== undefined && this.status(data.status);
		// data.busystatus !== undefined && this.busystatus(data.busystatus);
		// data.priority !== undefined && this.priority(data.priority);
		// data.url !== undefined && this.url(data.url);
		// data.transparency !== undefined && this.transparency(data.transparency);
		// data.created !== undefined && this.created(data.created);
		// data.lastModified !== undefined && this.lastModified(data.lastModified);
		// data.x !== undefined && this.x(data.x);
	}




	public setUID(value: ICalEventData['uid']): this {
		this.data.uid = value;
		return this;
	}

	public setSequence(value: ICalEventData['sequence']): this {
		this.data.sequence = value;
		return this;
	}

	public setStart(value: ICalEventData['start']): this {
		this.data.start = value;
		return this;
	}

	public setEnd(value: ICalEventData['end']): this {
		this.data.end = value;
		return this;
	}

	public setRecurrenceId(value: ICalEventData['recurrenceId']): this {
		this.data.recurrenceId = value;
		return this;
	}

	// public setTimezone(value: ICalEventData['timezone']): this {
	// 	this.data.timezone = value;
	// 	if (value) {
	// 		this.setFloating(false);
	// 	}
	// 	return this;
	// }

	public setStamp(value: ICalEventData['stamp']): this {
		this.data.stamp = value;
		return this;
	}

	public setAllDay(value: ICalEventData['allDay']): this {
		this.data.allDay = value;
		return this;
	}

	public setFloating(value: ICalEventData['floating']): this {
		this.data.floating = value;
		return this;
	}

	/**
	 * The summary is the title of the event.
	 */
	public setSummary(value: ICalEventData['summary']): this {
		this.data.summary = value;
		return this;
	}

	/**
	 * Set an optional description for the event.
	 */
	public setDescription(value: ICalEventData['description']): this {
		this.data.description = value;
		return this;
	}

	public setLocation(value: ICalEventData['location']): this {
		this.data.location = value;
		return this;
	}

	public setOrganizer(value: ICalEventData['organizer']): this {
		this.data.organizer = value;
		return this;
	}

	// TODO: Add more setters (timezone, attendees...)



	// /**
	//  * Get the event's timezone.
	//  * @since 0.2.6
	//  */
	// timezone(): string | null;

	// /**
	//  * Use this method to set your event's timezone using the TZID property parameter on start and end dates,
	//  * as per [date-time form #3 in section 3.3.5 of RFC 554](https://tools.ietf.org/html/rfc5545#section-3.3.5).
	//  *
	//  * This and the 'floating' flag (see below) are mutually exclusive, and setting a timezone will unset the
	//  * 'floating' flag.  If neither 'timezone' nor 'floating' are set, the date will be output with in UTC format
	//  * (see [date-time form #2 in section 3.3.5 of RFC 554](https://tools.ietf.org/html/rfc5545#section-3.3.5)).
	//  *
	//  * See [Readme](https://github.com/sebbo2002/ical-generator#-date-time--timezones) for details about
	//  * supported values and timezone handling.
	//  *
	//  * ```javascript
	//  * event.timezone('America/New_York');
	//  * ```
	//  *
	//  * @since 0.2.6
	//  */
	// timezone(timezone: string | null): this;
	// timezone(timezone?: string | null): this | string | null {
	// 	if (timezone === undefined && this.data.timezone !== null) {
	// 		return this.data.timezone;
	// 	}
	// 	if (timezone === undefined) {
	// 		return this.calendar.timezone();
	// 	}

	// 	this.data.timezone = timezone ? timezone.toString() : null;
	// 	if (this.data.timezone) {
	// 		this.data.floating = false;
	// 	}

	// 	return this;
	// }



	// TODO: repeating...
	// /**
	//  * Get the event's repeating options
	//  * @since 0.2.0
	//  */
	// repeating(): ICalEventInternalRepeatingData | RRule | string | null;

	// /**
	//  * Set the event's repeating options by passing an [[`ICalRepeatingOptions`]] object.
	//  *
	//  * ```javascript
	//  * event.repeating({
	//  *    freq: 'MONTHLY', // required
	//  *    count: 5,
	//  *    interval: 2,
	//  *    until: new Date('Jan 01 2014 00:00:00 UTC'),
	//  *    byDay: ['su', 'mo'], // repeat only sunday and monday
	//  *    byMonth: [1, 2], // repeat only in january and february,
	//  *    byMonthDay: [1, 15], // repeat only on the 1st and 15th
	//  *    bySetPos: 3, // repeat every 3rd sunday (will take the first element of the byDay array)
	//  *    exclude: [new Date('Dec 25 2013 00:00:00 UTC')], // exclude these dates
	//  *    excludeTimezone: 'Europe/Berlin', // timezone of exclude
	//  *    wkst: 'SU' // Start the week on Sunday, default is Monday
	//  * });
	//  * ```
	//  *
	//  * @since 0.2.0
	//  */
	// repeating(repeating: ICalRepeatingOptions | null): this;

	// /**
	//  * Set the event's repeating options by passing an [RRule object](https://github.com/jakubroztocil/rrule).
	//  * @since 2.0.0-develop.5
	//  */
	// repeating(repeating: RRule | null): this;

	// /**
	//  * Set the events repeating options by passing a string which is inserted in the ical file.
	//  * @since 2.0.0-develop.5
	//  */
	// repeating(repeating: string | null): this;

	// /**
	//  * @internal
	//  */
	// repeating(repeating: ICalRepeatingOptions | RRule | string | null): this;
	// repeating(repeating?: ICalRepeatingOptions | RRule | string | null): this | ICalEventInternalRepeatingData | RRule | string | null {
	// 	if (repeating === undefined) {
	// 		return this.data.repeating;
	// 	}
	// 	if (!repeating) {
	// 		this.data.repeating = null;
	// 		return this;
	// 	}
	// 	if(isRRule(repeating) || typeof repeating === 'string') {
	// 		this.data.repeating = repeating;
	// 		return this;
	// 	}

	// 	this.data.repeating = {
	// 		freq: checkEnum(ICalEventRepeatingFreq, repeating.freq) as ICalEventRepeatingFreq
	// 	};

	// 	if (repeating.count) {
	// 		if (!isFinite(repeating.count)) {
	// 			throw new Error('`repeating.count` must be a finite number!');
	// 		}

	// 		this.data.repeating.count = repeating.count;
	// 	}

	// 	if (repeating.interval) {
	// 		if (!isFinite(repeating.interval)) {
	// 			throw new Error('`repeating.interval` must be a finite number!');
	// 		}

	// 		this.data.repeating.interval = repeating.interval;
	// 	}

	// 	if (repeating.until !== undefined) {
	// 		this.data.repeating.until = parseInputDate(repeating.until, 'repeating.until');
	// 	}

	// 	if (repeating.byDay) {
	// 		const byDayArray = Array.isArray(repeating.byDay) ? repeating.byDay : [repeating.byDay];
	// 		this.data.repeating.byDay = byDayArray.map(day => checkEnum(ICalWeekday, day) as ICalWeekday);
	// 	}

	// 	if (repeating.byMonth) {
	// 		const byMonthArray = Array.isArray(repeating.byMonth) ? repeating.byMonth : [repeating.byMonth];
	// 		this.data.repeating.byMonth = byMonthArray.map(month => {
	// 			if (typeof month !== 'number' || month < 1 || month > 12) {
	// 				throw new Error('`repeating.byMonth` contains invalid value `' + month + '`!');
	// 			}

	// 			return month;
	// 		});
	// 	}

	// 	if (repeating.byMonthDay) {
	// 		const byMonthDayArray = Array.isArray(repeating.byMonthDay) ? repeating.byMonthDay : [repeating.byMonthDay];


	// 		this.data.repeating.byMonthDay = byMonthDayArray.map(monthDay => {
	// 			if (typeof monthDay !== 'number' || monthDay < 1 || monthDay > 31) {
	// 				throw new Error('`repeating.byMonthDay` contains invalid value `' + monthDay + '`!');
	// 			}

	// 			return monthDay;
	// 		});
	// 	}

	// 	if (repeating.bySetPos) {
	// 		if (!this.data.repeating.byDay) {
	// 			throw '`repeating.bySetPos` must be used along with `repeating.byDay`!';
	// 		}
	// 		if (typeof repeating.bySetPos !== 'number' || repeating.bySetPos < -1 || repeating.bySetPos > 4) {
	// 			throw '`repeating.bySetPos` contains invalid value `' + repeating.bySetPos + '`!';
	// 		}

	// 		this.data.repeating.byDay.splice(1);
	// 		this.data.repeating.bySetPos = repeating.bySetPos;
	// 	}

	// 	if (repeating.exclude) {
	// 		const excludeArray = Array.isArray(repeating.exclude) ? repeating.exclude : [repeating.exclude];
	// 		this.data.repeating.exclude = excludeArray.map((exclude, i) => {
	// 			return parseInputDate(exclude, `repeating.exclude[${i}]`);
	// 		});
	// 	}

	// 	if (repeating.startOfWeek) {
	// 		this.data.repeating.startOfWeek = checkEnum(ICalWeekday, repeating.startOfWeek) as ICalWeekday;
	// 	}

	// 	return this;
	// }

	// /**
	//  * Set the event's location by passing a string (minimum) or
	//  * an [[`ICalLocation`]] object which will also fill the iCal
	//  * `GEO` attribute and Apple's `X-APPLE-STRUCTURED-LOCATION`.
	//  *
	//  * ```javascript
	//  * event.location({
	//  *    title: 'Apple Store Kurfürstendamm',
	//  *    address: 'Kurfürstendamm 26, 10719 Berlin, Deutschland',
	//  *    radius: 141.1751386318387,
	//  *    geo: {
	//  *        lat: 52.503630,
	//  *        lon: 13.328650
	//  *    }
	//  * });
	//  * ```
	//  *
	//  * @since 0.2.0
	//  */
	// location(location: ICalLocation | string | null): this;
	// location(location?: ICalLocation | string | null): this | ICalLocation | null {
	// 	if (location === undefined) {
	// 		return this.data.location;
	// 	}
	// 	if (typeof location === 'string') {
	// 		this.data.location = {
	// 			title: location
	// 		};
	// 		return this;
	// 	}
	// 	if (
	// 		(location && !location.title) ||
	// 		(location?.geo && (!isFinite(location.geo.lat) || !isFinite(location.geo.lon)))
	// 	) {
	// 		throw new Error(
	// 			'`location` isn\'t formatted correctly. See https://sebbo2002.github.io/ical-generator/'+
	// 			'develop/reference/classes/icalevent.html#location'
	// 		);
	// 	}

	// 	this.data.location = location || null;
	// 	return this;
	// }



	// /**
	//  * Creates a new [[`ICalAttendee`]] and returns it. Use options to prefill
	//  * the attendee's attributes. Calling this method without options will create
	//  * an empty attendee.
	//  *
	//  * ```javascript
	//  * const cal = ical();
	//  * const event = cal.createEvent();
	//  * const attendee = event.createAttendee({email: 'hui@example.com', name: 'Hui'});
	//  *
	//  * // add another attendee
	//  * event.createAttendee('Buh <buh@example.net>');
	//  * ```
	//  *
	//  * As with the organizer, you can also add an explicit `mailto` address.
	//  *
	//  * ```javascript
	//  * event.createAttendee({email: 'hui@example.com', name: 'Hui', mailto: 'another@mailto.com'});
	//  *
	//  * // overwrite an attendee's mailto address
	//  * attendee.mailto('another@mailto.net');
	//  * ```
	//  *
	//  * @since 0.2.0
	//  */
	// createAttendee(data: ICalAttendee | ICalAttendeeData | string = {}): ICalAttendee {
	// 	if (data instanceof ICalAttendee) {
	// 		this.data.attendees.push(data);
	// 		return data;
	// 	}
	// 	if (typeof data === 'string') {
	// 		data = checkNameAndMail('data', data);
	// 	}

	// 	const attendee = new ICalAttendee(data, this);
	// 	this.data.attendees.push(attendee);
	// 	return attendee;
	// }


	// /**
	//  * Get all attendees
	//  * @since 0.2.0
	//  */
	// attendees(): ICalAttendee[];

	// /**
	//  * Add multiple attendees to your event
	//  *
	//  * ```javascript
	//  * const event = ical().createEvent();
	//  *
	//  * cal.attendees([
	//  *     {email: 'a@example.com', name: 'Person A'},
	//  *     {email: 'b@example.com', name: 'Person B'}
	//  * ]);
	//  *
	//  * cal.attendees(); // --> [ICalAttendee, ICalAttendee]
	//  * ```
	//  *
	//  * @since 0.2.0
	//  */
	// attendees(attendees: (ICalAttendee | ICalAttendeeData | string)[]): this;
	// attendees(attendees?: (ICalAttendee | ICalAttendeeData | string)[]): this | ICalAttendee[] {
	// 	if (!attendees) {
	// 		return this.data.attendees;
	// 	}

	// 	attendees.forEach(attendee => this.createAttendee(attendee));
	// 	return this;
	// }


	// /**
	//  * Creates a new [[`ICalAlarm`]] and returns it. Use options to prefill
	//  * the alarm's attributes. Calling this method without options will create
	//  * an empty alarm.
	//  *
	//  * ```javascript
	//  * const cal = ical();
	//  * const event = cal.createEvent();
	//  * const alarm = event.createAlarm({type: 'display', trigger: 300});
	//  *
	//  * // add another alarm
	//  * event.createAlarm({
	//  *     type: 'audio',
	//  *     trigger: 300, // 5min before event
	//  * });
	//  * ```
	//  *
	//  * @since 0.2.1
	//  */
	// createAlarm(data: ICalAlarm | ICalAlarmData = {}): ICalAlarm {
	// 	const alarm = data instanceof ICalAlarm ? data : new ICalAlarm(data, this);
	// 	this.data.alarms.push(alarm);
	// 	return alarm;
	// }


	// /**
	//  * Get all alarms
	//  * @since 0.2.0
	//  */
	// alarms(): ICalAlarm[];

	// /**
	//  * Add one or multiple alarms
	//  *
	//  * ```javascript
	//  * const event = ical().createEvent();
	//  *
	//  * cal.alarms([
	//  *     {type: 'display', trigger: 600},
	//  *     {type: 'audio', trigger: 300}
	//  * ]);
	//  *
	//  * cal.alarms(); // --> [ICalAlarm, ICalAlarm]
	//  ```
	//  *
	//  * @since 0.2.0
	//  */
	// alarms(alarms: ICalAlarm[] | ICalAlarmData[]): this;
	// alarms(alarms?: ICalAlarm[] | ICalAlarmData[]): this | ICalAlarm[] {
	// 	if (!alarms) {
	// 		return this.data.alarms;
	// 	}

	// 	alarms.forEach((alarm: ICalAlarm | ICalAlarmData) => this.createAlarm(alarm));
	// 	return this;
	// }


	// /**
	//  * Creates a new [[`ICalCategory`]] and returns it. Use options to prefill the categories' attributes.
	//  * Calling this method without options will create an empty category.
	//  *
	//  * ```javascript
	//  * const cal = ical();
	//  * const event = cal.createEvent();
	//  * const category = event.createCategory({name: 'APPOINTMENT'});
	//  *
	//  * // add another alarm
	//  * event.createCategory({
	//  *     name: 'MEETING'
	//  * });
	//  * ```
	//  *
	//  * @since 0.3.0
	//  */
	// createCategory(data: ICalCategory | ICalCategoryData = {}): ICalCategory {
	// 	const category = data instanceof ICalCategory ? data : new ICalCategory(data);
	// 	this.data.categories.push(category);
	// 	return category;
	// }


	// /**
	//  * Get all categories
	//  * @since 0.3.0
	//  */
	// categories(): ICalCategory[];

	// /**
	//  * Add categories to the event or return all selected categories.
	//  *
	//  * ```javascript
	//  * const event = ical().createEvent();
	//  *
	//  * cal.categories([
	//  *     {name: 'APPOINTMENT'},
	//  *     {name: 'MEETING'}
	//  * ]);
	//  *
	//  * cal.categories(); // --> [ICalCategory, ICalCategory]
	//  * ```
	//  *
	//  * @since 0.3.0
	//  */
	// categories(categories: (ICalCategory | ICalCategoryData)[]): this;
	// categories(categories?: (ICalCategory | ICalCategoryData)[]): this | ICalCategory[] {
	// 	if (!categories) {
	// 		return this.data.categories;
	// 	}

	// 	categories.forEach(category => this.createCategory(category));
	// 	return this;
	// }


	// /**
	//  * Get the event's status
	//  * @since 0.2.0
	//  */
	// status(): ICalEventStatus | null;

	// /**
	//  * Set the event's status
	//  *
	//  * ```javascript
	//  * import ical, {ICalEventStatus} from 'ical-generator';
	//  * event.status(ICalEventStatus.CONFIRMED);
	//  * ```
	//  *
	//  * @since 0.2.0
	//  */
	// status(status: ICalEventStatus | null): this;
	// status(status?: ICalEventStatus | null): this | ICalEventStatus | null {
	// 	if (status === undefined) {
	// 		return this.data.status;
	// 	}
	// 	if (status === null) {
	// 		this.data.status = null;
	// 		return this;
	// 	}

	// 	this.data.status = checkEnum(ICalEventStatus, status) as ICalEventStatus;
	// 	return this;
	// }


	// /**
	//  * Get the event's busy status
	//  * @since 1.0.2
	//  */
	// busystatus(): ICalEventBusyStatus | null;

	// /**
	//  * Set the event's busy status. Will add the
	//  * [`X-MICROSOFT-CDO-BUSYSTATUS`](https://docs.microsoft.com/en-us/openspecs/exchange_server_protocols/ms-oxcical/cd68eae7-ed65-4dd3-8ea7-ad585c76c736)
	//  * attribute to your event.
	//  *
	//  * ```javascript
	//  * import ical, {ICalEventBusyStatus} from 'ical-generator';
	//  * event.busystatus(ICalEventStatus.BUSY);
	//  * ```
	//  *
	//  * @since 1.0.2
	//  */
	// busystatus(busystatus: ICalEventBusyStatus | null): this;
	// busystatus(busystatus?: ICalEventBusyStatus | null): this | ICalEventBusyStatus | null {
	// 	if (busystatus === undefined) {
	// 		return this.data.busystatus;
	// 	}
	// 	if (busystatus === null) {
	// 		this.data.busystatus = null;
	// 		return this;
	// 	}

	// 	this.data.busystatus = checkEnum(ICalEventBusyStatus, busystatus) as ICalEventBusyStatus;
	// 	return this;
	// }


	// /**
	//  * Get the event's priority. A value of 1 represents
	//  * the highest priority, 9 the lowest. 0 specifies an undefined
	//  * priority.
	//  *
	//  * @since v2.0.0-develop.7
	//  */
	// priority(): number | null;

	// /**
	//  * Set the event's priority. A value of 1 represents
	//  * the highest priority, 9 the lowest. 0 specifies an undefined
	//  * priority.
	//  *
	//  * @since v2.0.0-develop.7
	//  */
	// priority(priority: number | null): this;
	// priority(priority?: number | null): this | number | null {
	// 	if (priority === undefined) {
	// 		return this.data.priority;
	// 	}
	// 	if (priority === null) {
	// 		this.data.priority = null;
	// 		return this;
	// 	}

	// 	if(priority < 0 || priority > 9) {
	// 		throw new Error('`priority` is invalid, musst be 0 ≤ priority ≤ 9.');
	// 	}

	// 	this.data.priority = Math.round(priority);
	// 	return this;
	// }


	// /**
	//  * Get the event's URL
	//  * @since 0.2.0
	//  */
	// url(): string | null;

	// /**
	//  * Set the event's URL
	//  * @since 0.2.0
	//  */
	// url(url: string | null): this;
	// url(url?: string | null): this | string | null {
	// 	if (url === undefined) {
	// 		return this.data.url;
	// 	}

	// 	this.data.url = url ? String(url) : null;
	// 	return this;
	// }

	// /**
	//  * Get the event's transparency
	//  * @since 1.7.3
	//  */
	// transparency(): ICalEventTransparency | null;

	// /**
	//  * Set the event's transparency
	//  *
	//  * Set the field to `OPAQUE` if the person or resource is no longer
	//  * available due to this event. If the calendar entry has no influence
	//  * on availability, you can set the field to `TRANSPARENT`. This value
	//  * is mostly used to find out if a person has time on a certain date or
	//  * not (see `TRANSP` in iCal specification).
	//  *
	//  * ```javascript
	//  * import ical, {ICalEventTransparency} from 'ical-generator';
	//  * event.transparency(ICalEventTransparency.OPAQUE);
	//  * ```
	//  *
	//  * @since 1.7.3
	//  */
	// transparency(transparency: ICalEventTransparency | null): this;
	// transparency(transparency?: ICalEventTransparency | null): this | ICalEventTransparency | null {
	// 	if (transparency === undefined) {
	// 		return this.data.transparency;
	// 	}
	// 	if (!transparency) {
	// 		this.data.transparency = null;
	// 		return this;
	// 	}

	// 	this.data.transparency = checkEnum(ICalEventTransparency, transparency) as ICalEventTransparency;
	// 	return this;
	// }


	// /**
	//  * Get the event's creation date
	//  * @since 0.3.0
	//  */
	// created(): ICalInternalDateTimeValue | null;

	// /**
	//  * Set the event's creation date
	//  * @since 0.3.0
	//  */
	// created(created: ICalInternalDateTimeValue | null): this;
	// created(created?: ICalInternalDateTimeValue | null): this | ICalInternalDateTimeValue | null {
	// 	if (created === undefined) {
	// 		return this.data.created;
	// 	}
	// 	if (created === null) {
	// 		this.data.created = null;
	// 		return this;
	// 	}

	// 	this.data.created = parseInputDate(created, 'created');
	// 	return this;
	// }


	// /**
	//  * Get the event's last modification date
	//  * @since 0.3.0
	//  */
	// lastModified(): ICalInternalDateTimeValue | null;

	// /**
	//  * Set the event's last modification date
	//  * @since 0.3.0
	//  */
	// lastModified(lastModified: ICalInternalDateTimeValue | null): this;
	// lastModified(lastModified?: ICalInternalDateTimeValue | null): this | ICalInternalDateTimeValue | null {
	// 	if (lastModified === undefined) {
	// 		return this.data.lastModified;
	// 	}
	// 	if (lastModified === null) {
	// 		this.data.lastModified = null;
	// 		return this;
	// 	}

	// 	this.data.lastModified = parseInputDate(lastModified, 'lastModified');
	// 	return this;
	// }


	// /**
	//  * Set X-* attributes. Woun't filter double attributes,
	//  * which are also added by another method (e.g. summary),
	//  * so these attributes may be inserted twice.
	//  *
	//  * ```javascript
	//  * event.x([
	//  *     {
	//  *         key: "X-MY-CUSTOM-ATTR",
	//  *         value: "1337!"
	//  *     }
	//  * ]);
	//  *
	//  * event.x([
	//  *     ["X-MY-CUSTOM-ATTR", "1337!"]
	//  * ]);
	//  *
	//  * event.x({
	//  *     "X-MY-CUSTOM-ATTR": "1337!"
	//  * });
	//  * ```
	//  *
	//  * @since 1.9.0
	//  */
	// x (keyOrArray: {key: string, value: string}[] | [string, string][] | Record<string, string>): this;

	// /**
	//  * Set a X-* attribute. Woun't filter double attributes,
	//  * which are also added by another method (e.g. summary),
	//  * so these attributes may be inserted twice.
	//  *
	//  * ```javascript
	//  * event.x("X-MY-CUSTOM-ATTR", "1337!");
	//  * ```
	//  *
	//  * @since 1.9.0
	//  */
	// x (keyOrArray: string, value: string): this;

	// /**
	//  * Get all custom X-* attributes.
	//  * @since 1.9.0
	//  */
	// x (): {key: string, value: string}[];
	// x(keyOrArray?: ({ key: string, value: string })[] | [string, string][] | Record<string, string> | string, value?: string): this | void | ({ key: string, value: string })[] {
	// 	if (keyOrArray === undefined) {
	// 		return addOrGetCustomAttributes(this.data);
	// 	}

	// 	if (typeof keyOrArray === 'string' && typeof value === 'string') {
	// 		addOrGetCustomAttributes(this.data, keyOrArray, value);
	// 	}
	// 	if (typeof keyOrArray === 'object') {
	// 		addOrGetCustomAttributes(this.data, keyOrArray);
	// 	}

	// 	return this;
	// }


	// /**
	//  * Return a shallow copy of the events's options for JSON stringification.
	//  * Third party objects like moment.js values or RRule objects are stringified
	//  * as well. Can be used for persistence.
	//  *
	//  * ```javascript
	//  * const event = ical().createEvent();
	//  * const json = JSON.stringify(event);
	//  *
	//  * // later: restore event data
	//  * const calendar = ical().createEvent(JSON.parse(json));
	//  * ```
	//  *
	//  * @since 0.2.4
	//  */
	// toJSON(): ICalEventJSONData {
	// 	let repeating: ICalEventInternalRepeatingData | string | null = null;
	// 	if(isRRule(this.data.repeating) || typeof this.data.repeating === 'string') {
	// 		repeating = this.data.repeating.toString();
	// 	}
	// 	else if(this.data.repeating) {
	// 		repeating = Object.assign({}, this.data.repeating, {
	// 			until: toJSON(this.data.repeating.until),
	// 			exclude: this.data.repeating.exclude?.map(d => toJSON(d)),
	// 		});
	// 	}

	// 	return Object.assign({}, this.data, {
	// 		start: toJSON(this.data.start) || null,
	// 		end: toJSON(this.data.end) || null,
	// 		recurrenceId: toJSON(this.data.recurrenceId) || null,
	// 		stamp: toJSON(this.data.stamp) || null,
	// 		created: toJSON(this.data.created) || null,
	// 		lastModified: toJSON(this.data.lastModified) || null,
	// 		repeating,
	// 		x: this.x()
	// 	});
	// }

	private _todo_to_lines(): string[] {
		let g = '';

		// const { timezone } = this.data;
		// const hasTimeZone = !!timezone;


		// TODO: REPEATING
		// if(isRRule(this.data.repeating) || typeof this.data.repeating === 'string') {
		// 	g += this.data.repeating
		// 		.toString()
		// 		.replace(/\r\n/g, '\n')
		// 		.split('\n')
		// 		.filter(l => l && !l.startsWith('DTSTART:'))
		// 		.join('\r\n') + '\r\n';
		// }
		// else if (this.data.repeating) {
		// 	g += 'RRULE:FREQ=' + this.data.repeating.freq;

		// 	if (this.data.repeating.count) {
		// 		g += ';COUNT=' + this.data.repeating.count;
		// 	}

		// 	if (this.data.repeating.interval) {
		// 		g += ';INTERVAL=' + this.data.repeating.interval;
		// 	}

		// 	if (this.data.repeating.until) {
		// 		g += ';UNTIL=' + formatDate(this.calendar.timezone(), this.data.repeating.until);
		// 	}

		// 	if (this.data.repeating.byDay) {
		// 		g += ';BYDAY=' + this.data.repeating.byDay.join(',');
		// 	}

		// 	if (this.data.repeating.byMonth) {
		// 		g += ';BYMONTH=' + this.data.repeating.byMonth.join(',');
		// 	}

		// 	if (this.data.repeating.byMonthDay) {
		// 		g += ';BYMONTHDAY=' + this.data.repeating.byMonthDay.join(',');
		// 	}

		// 	if (this.data.repeating.bySetPos) {
		// 		g += ';BYSETPOS=' + this.data.repeating.bySetPos;
		// 	}

		// 	if (this.data.repeating.startOfWeek) {
		// 		g += ';WKST=' + this.data.repeating.startOfWeek;
		// 	}

		// 	g += '\r\n';

		// 	// REPEATING EXCLUSION
		// 	if (this.data.repeating.exclude) {
		// 		if (this.data.allDay) {
		// 			g += 'EXDATE;VALUE=DATE:' + this.data.repeating.exclude.map(excludedDate => {
		// 				return formatDate(this.calendar.timezone(), excludedDate, true);
		// 			}).join(',') + '\r\n';
		// 		}
		// 		else {
		// 			g += 'EXDATE';
		// 			if (this.timezone()) {
		// 				g += ';TZID=' + this.timezone() + ':' + this.data.repeating.exclude.map(excludedDate => {
		// 					// This isn't a 'floating' event because it has a timezone;
		// 					// but we use it to omit the 'Z' UTC specifier in formatDate()
		// 					return formatDate(this.timezone(), excludedDate, false, true);
		// 				}).join(',') + '\r\n';
		// 			}
		// 			else {
		// 				g += ':' + this.data.repeating.exclude.map(excludedDate => {
		// 					return formatDate(this.timezone(), excludedDate);
		// 				}).join(',') + '\r\n';
		// 			}
		// 		}
		// 	}
		// }

		// // RECURRENCE
		// if (this.data.recurrenceId) {
		// 	g += formatDateTZ(hasTimeZone, 'RECURRENCE-ID', this.data.recurrenceId, this.data) + '\r\n';
		// }

		// SUMMARY
		g += 'SUMMARY:' + escapeICalValue(this.data.summary) + '\r\n';

		// TRANSPARENCY
		if (this.data.transparency) {
			g += 'TRANSP:' + escapeICalValue(this.data.transparency) + '\r\n';
		}

		// LOCATION
		if (this.data.location?.title) {
			const { title, address, geo, radius } = this.data.location;

			if (radius && geo) {
				g += 'LOCATION:' + escapeICalValue(
					title +
					(address ? '\n' + address : '')
				) + '\r\n';

				g += 'X-APPLE-STRUCTURED-LOCATION;VALUE=URI;' +
					(address ? 'X-ADDRESS=' + escapeICalValue(address) + ';' : '') +
					'X-APPLE-RADIUS=' + radius + ';' +
					'X-TITLE=' + escapeICalValue(title) +
					':geo:' + geo.lat + ',' + geo.lon + '\r\n';
			}
			else {
				g += 'LOCATION:' + escapeICalValue(title) + '\r\n';
			}

			if (geo) {
				g += 'GEO:' + geo.lat + ';' + geo.lon + '\r\n';
			}
		}

		// DESCRIPTION
		if (this.data.description) {
			if (typeof this.data.description === 'string') {
				g += 'DESCRIPTION:' + escapeICalValue(this.data.description) + '\r\n';
			} else {
				g += 'DESCRIPTION:' + escapeICalValue(this.data.description.plain) + '\r\n';

				// HTML DESCRIPTION
				if (this.data.description.html) {
					g += 'X-ALT-DESC;FMTTYPE=text/html:' + escapeICalValue(this.data.description.html) + '\r\n';
				}
			}
		}

		// ORGANIZER
		if (this.data.organizer) {
			if (typeof this.data.organizer === 'string') {
				g += 'ORGANIZER;CN="' + escapeICalValue(this.data.organizer) + '"';
			} else {
				g += 'ORGANIZER;CN="' + escapeICalValue(this.data.organizer.name) + '"';

				if (this.data.organizer.email && this.data.organizer.mailto) {
					g += ';EMAIL=' + escapeICalValue(this.data.organizer.email);
				}
				if(this.data.organizer.email) {
					g += ':mailto:' + escapeICalValue(this.data.organizer.mailto || this.data.organizer.email);
				}
			}
			g += '\r\n';
		}

		// TODO: ATTENDEES
		// this.data.attendees.forEach(function (attendee) {
		// 	g += attendee.toString();
		// });

		// TODO: ALARMS
		// this.data.alarms.forEach(function (alarm) {
		// 	g += alarm.toString();
		// });

		// TODO: CATEGORIES
		// if (this.data.categories.length > 0) {
		// 	g += 'CATEGORIES:' + this.data.categories.map(function (category) {
		// 		return category.toString();
		// 	}).join() + '\r\n';
		// }

		// URL
		if (this.data.url) {
			g += 'URL;VALUE=URI:' + escapeICalValue(this.data.url) + '\r\n';
		}

		// STATUS
		if (this.data.status) {
			g += 'STATUS:' + this.data.status.toUpperCase() + '\r\n';
		}

		// BUSYSTATUS
		if (this.data.busystatus) {
			g += 'X-MICROSOFT-CDO-BUSYSTATUS:' + this.data.busystatus.toUpperCase() + '\r\n';
		}

		// PRIORITY
		if (typeof this.data.priority === 'number') {
			g += 'PRIORITY:' + this.data.priority + '\r\n';
		}

		// CUSTOM X ATTRIBUTES
		// g += attributesToLines(this.data);

		// CREATED
		if (this.data.created) {
			// g += 'CREATED:' + formatDateOld(false, this.data.created) + '\r\n';
			g += 'CREATED:' + formatDateUTC(this.data.created) + '\r\n';
		}

		// LAST-MODIFIED
		if (this.data.lastModified) {
			g += 'LAST-MODIFIED:' + formatDateUTC(this.data.lastModified) + '\r\n';
		}

		return g.split('\r\n');
	}

	public getTimeZones = () => {
		const { start, end } = this.data;
		const startZone = getTimeZoneStr(start);
		const endZone = getTimeZoneStr(end);
		const timeZones: string[] = [];
		if (startZone) timeZones.push(startZone);
		if (endZone && endZone !== startZone) timeZones.push(endZone);
		return timeZones;
	};

	protected async renderToLines(): Promise<Array<ICalComponent | string | undefined>> {
		const {
			uid,
			sequence,
			stamp,
			floating,
			allDay,
			start,
			end,
			recurrenceId,
		} = this.data;

		const lines: Array<string | undefined> = [
			`UID:${uid}`,
			`SEQUENCE:${sequence}`,
			`DTSTAMP:${formatDateUTC(stamp)}`,
			formatDateProp('DTSTART', start, floating || false, allDay || false),
			end && formatDateProp('DTEND', end, floating || false, allDay || false),
			...(allDay ? [
				'X-MICROSOFT-CDO-ALLDAYEVENT:TRUE',
				'X-MICROSOFT-MSNCALENDAR-ALLDAYEVENT:TRUE',
			] : []),
			recurrenceId && `RECURRENCE-ID:${recurrenceId}`,
			...this._todo_to_lines(),
		];

		return lines;
	}
}

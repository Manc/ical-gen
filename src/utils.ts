import { ICalOrganizer } from './types';

/**
 * Converts a valid date/time object supported by this library to a string.
 */
export function formatDate(hasTimezone: boolean, d: Date, dateonly = false, floating = false): string {
	// TODO: Not sure about use case.
	// if (timezone?.startsWith('/')) {
	// 	timezone = timezone.substr(1);
	// }

	const m = new Date(d);

	// (!dateonly && !floating) || !timezone => utc
	let s = m.getUTCFullYear() +
		String(m.getUTCMonth() + 1).padStart(2, '0') +
		m.getUTCDate().toString().padStart(2, '0');

	// (dateonly || floating) && timezone => tz
	if (hasTimezone) {
		s = m.getFullYear() +
			String(m.getMonth() + 1).padStart(2, '0') +
			m.getDate().toString().padStart(2, '0');
	}

	if (dateonly) {
		return s;
	}

	if (hasTimezone) {
		s += 'T' + m.getHours().toString().padStart(2, '0') +
			m.getMinutes().toString().padStart(2, '0') +
			m.getSeconds().toString().padStart(2, '0');

		return s;
	}

	s += 'T' + m.getUTCHours().toString().padStart(2, '0') +
		m.getUTCMinutes().toString().padStart(2, '0') +
		m.getUTCSeconds().toString().padStart(2, '0') +
		(floating ? '' : 'Z');

	return s;
}

/**
 * Converts a valid date/time object supported by this library to a string.
 * For information about this format, see RFC 5545, section 3.3.5
 * https://tools.ietf.org/html/rfc5545#section-3.3.5
 */
export function formatDateTZ(hasTimeZone: boolean, property: string, date: Date, eventData?: {floating?: boolean | null, timezone?: string | null}): string {
	let tzParam = '';
	let floating = eventData?.floating || false;

	if (eventData?.timezone) {
		tzParam = ';TZID=' + eventData.timezone;

		// This isn't a 'floating' event because it has a timezone;
		// but we use it to omit the 'Z' UTC specifier in formatDate()
		floating = true;
	}

	return property + tzParam + ':' + formatDate(hasTimeZone, date, false, floating);
}

/**
 * Escape special characters in a string intended to be used as value in an
 * iCalendar file.
 */
export function escapeICalValue(str: string): string {
	return str.replace(/[\\;,"]/g, function (match) {
		return '\\' + match;
	}).replace(/(?:\r\n|\r|\n)/g, '\\n');
}

/**
 * Cleans up an array of unfiltered lines intendet to be used as lines of an
 * iCalendar file. This function should usually be used after generating the
 * lines and before calling `calLinesToString()`.
 */
export function cleanLines(lines: Array<string | undefined>): string[] {
	return lines
		.map(l => l?.trimEnd()) // Trim end of lines
		.filter(l => !!l) as string[]; // Remove empty lines including `undefined` values
}

/**
 * Cleans up an array of iCalendar lines and applies line wrapping.
 */
export function calLinesToString(lines: string[]): string {
	return lines
		.map((line) => {
			const str = line as string;
			let result = '';
			let c = 0;
			for (let i = 0; i < str.length; i++) {
				let ch = str.charAt(i);

				// surrogate pair, see https://mathiasbynens.be/notes/javascript-encoding#surrogate-pairs
				if (ch >= '\ud800' && ch <= '\udbff') {
					ch += str.charAt(++i);
				}

				const charsize = Buffer.from(ch, 'utf-8').length;
				c += charsize;
				if (c > 74) {
					result += '\r\n ';
					c = charsize;
				}

				result += ch;
			}
			return result;
		}).join('\r\n');
}

export function addOrGetCustomAttributes (data: {x: [string, string][]}, keyOrArray: ({key: string, value: string})[] | [string, string][] | Record<string, string>): void;
export function addOrGetCustomAttributes (data: {x: [string, string][]}, keyOrArray: string, value: string): void;
export function addOrGetCustomAttributes (data: {x: [string, string][]}): ({key: string, value: string})[];
export function addOrGetCustomAttributes (data: {x: [string, string][]}, keyOrArray?: ({key: string, value: string})[] | [string, string][] | Record<string, string> | string  | undefined, value?: string | undefined): void | ({key: string, value: string})[] {
	if (Array.isArray(keyOrArray)) {
		data.x = keyOrArray.map((o: {key: string, value: string} | [string, string]) => {
			if(Array.isArray(o)) {
				return o;
			}
			if (typeof o.key !== 'string' || typeof o.value !== 'string') {
				throw new Error('Either key or value is not a string!');
			}
			if (o.key.substr(0, 2) !== 'X-') {
				throw new Error('Key has to start with `X-`!');
			}

			return [o.key, o.value] as [string, string];
		});
	}
	else if (typeof keyOrArray === 'object') {
		data.x = Object.entries(keyOrArray).map(([key, value]) => {
			if (typeof key !== 'string' || typeof value !== 'string') {
				throw new Error('Either key or value is not a string!');
			}
			if (key.substr(0, 2) !== 'X-') {
				throw new Error('Key has to start with `X-`!');
			}

			return [key, value];
		});
	}
	else if (typeof keyOrArray === 'string' && typeof value === 'string') {
		if (keyOrArray.substr(0, 2) !== 'X-') {
			throw new Error('Key has to start with `X-`!');
		}

		data.x.push([keyOrArray, value]);
	}
	else {
		return data.x.map(a => ({
			key: a[0],
			value: a[1]
		}));
	}
}

// export function attributesToLines(attributes: Record<string, string>): string[] {
// 	return Object.entries(attributes)
// 		.map(([key, value]) => `${key.toUpperCase()}:${escapeICalValue(value)}`);
// }

/**
 * Check the given string or ICalOrganizer. Parses
 * the string for name and email address if possible.
 *
 * @param attribute Attribute name for error messages
 * @param value Value to parse name/email from
 */
export function checkNameAndMail(attribute: string, value: string | ICalOrganizer): ICalOrganizer {
	let result: ICalOrganizer | null = null;

	if (typeof value === 'string') {
		const match = value.match(/^(.+) ?<([^>]+)>$/);
		if (match) {
			result = {
				name: match[1].trim(),
				email: match[2].trim()
			};
		}
		else if(value.includes('@')) {
			result = {
				name: value.trim(),
				email: value.trim()
			};
		}
	}
	else if (typeof value === 'object') {
		result = {
			name: value.name,
			email: value.email,
			mailto: value.mailto
		};
	}

	if (!result && typeof value === 'string') {
		throw new Error(
			'`' + attribute + '` isn\'t formated correctly. See https://sebbo2002.github.io/ical-generator/develop/'+
			'reference/interfaces/icalorganizer.html'
		);
	}
	else if (!result) {
		throw new Error(
			'`' + attribute + '` needs to be a valid formed string or an object. See https://sebbo2002.github.io/'+
			'ical-generator/develop/reference/interfaces/icalorganizer.html'
		);
	}

	if (!result.name) {
		throw new Error('`' + attribute + '.name` is empty!');
	}

	return result;
}

/**
 * Checks if the given string `value` is a
 * valid one for the type `type`
 */
export function checkEnum(type: Record<string, string>, value: unknown): unknown {
	const allowedValues = Object.values(type);
	const valueStr = String(value).toUpperCase();

	if (!valueStr || !allowedValues.includes(valueStr)) {
		throw new Error(`Input must be one of the following: ${allowedValues.join(', ')}`);
	}

	return valueStr;
}

// /**
//  * Checks if the given input is a valid timestamp or `Date` and
//  * returns the internal representation in Epoch seconds.
//  */
// export function parseInputDate(value: ICalDateTime): Date {
// 	if (value instanceof Date) {
// 		return parseInputDate(value.getTime());
// 	}


// 	if (typeof value === 'number') {
// 		if (value > 0) {
// 			return value < 1e14
// 				? value
// 				: Math.floor(value / 1e3); // Interpret value as milliseconds and convert to seconds.
// 		}
// 	} else if (value instanceof Date) {
// 		return parseInputDate(value.getTime());
// 	}

// 	throw new Error('Invalid Date');
// }

// export function toDate(value: ICalInternalDateTimeValue): Date {
// 	if (typeof value === 'string' || value instanceof Date) {
// 		return new Date(value);
// 	}

// 	// @ts-ignore
// 	if(isLuxonDate(value)) {
// 		return value.toJSDate();
// 	}

// 	return value.toDate();
// }

// export function isMoment(value: ICalDateTimeValue): value is Moment {

// 	// @ts-ignore
// 	return value != null && value._isAMomentObject != null;
// }
// export function isMomentTZ(value: ICalDateTimeValue): value is MomentTZ {
// 	return isMoment(value) && typeof value.tz === 'function';
// }
// export function isDayjs(value: ICalDateTimeValue): value is Dayjs {
// 	return typeof value === 'object' &&
// 		value !== null &&
// 		!(value instanceof Date) &&
// 		!isMoment(value) &&
// 		!isLuxonDate(value);
// }
// export function isLuxonDate(value: ICalDateTimeValue): value is LuxonDateTime {
// 	return typeof value === 'object' && value !== null && typeof (value as LuxonDateTime).toJSDate === 'function';
// }

// export function isMomentDuration(value: unknown): value is Duration {

// 	// @ts-ignore
// 	return value !== null && typeof value === 'object' && typeof value.asSeconds === 'function';
// }

// export function isRRule(value: unknown): value is RRule {

// 	// @ts-ignore
// 	return value !== null && typeof value === 'object' && typeof value.between === 'function' && typeof value.toString === 'function';
// }

// export function toJSON(value: ICalDateTimeValue | null | undefined): string | null | undefined {
// 	if (!value) {
// 		return value;
// 	}
// 	if(typeof value === 'string') {
// 		return value;
// 	}

// 	return value.toJSON();
// }

/**
 * Converts a given duration in seconds to a iCalendar compatible durration
 * string.
 * @param seconds Duration in seconds
 * @returns Duration string
 */
export function toDurationString(seconds: number): string {
	let string = '';

	// < 0
	if (seconds < 0) {
		string = '-';
		seconds *= -1;
	}

	string += 'P';

	// DAYS
	if (seconds >= 86400) {
		string += Math.floor(seconds / 86400) + 'D';
		seconds %= 86400;
	}
	if (!seconds && string.length > 1) {
		return string;
	}

	string += 'T';

	// HOURS
	if (seconds >= 3600) {
		string += Math.floor(seconds / 3600) + 'H';
		seconds %= 3600;
	}

	// MINUTES
	if (seconds >= 60) {
		string += Math.floor(seconds / 60) + 'M';
		seconds %= 60;
	}

	// SECONDS
	if (seconds > 0) {
		string += seconds + 'S';
	} else if (string.length <= 2) {
		string += '0S';
	}

	return string;
}

// import ICalCalendar from './calendar';
// import type { CalendarOptions } from './calendar';
// import type ICalEvent from './event';

// export {
// 	default as ICalAlarm,
// 	ICalAlarmData,
// 	ICalAlarmType,
// 	ICalAlarmTypeValue,
// 	ICalAlarmJSONData,
// 	ICalAttachment
// } from './alarm';

export {
	default as ICalAttendee,
	ICalAttendeeData,
	ICalAttendeeType,
	ICalAttendeeRole,
	ICalAttendeeStatus,
	ICalAttendeeJSONData
} from './attendee';

export {
	default as ICalCalendar,
	// ICalCalendarData,
	ICalCalendarProdId as ICalCalendarProdIdData,
	ICalCalendarMethod,
	// ICalCalendarJSONData
} from './calendar';

export {
	default as ICalCategory,
	ICalCategoryData
} from './category';

export {
	default as ICalEvent,
	ICalEventStatus,
	ICalEventBusyStatus,
	ICalEventTransparency,
	ICalEventData,
	// ICalEventJSONData
} from './event';

export {
	// ICalInternalDateTimeValue as ICalDateTimeValue,
	ICalRepeatingOptions,
	ICalLocation,
	ICalGeo,
	ICalOrganizer,
	ICalDescription,
	ICalEventRepeatingFreq,
	ICalWeekday,
	// ICalTimezone
} from './types';

export {
	formatDate,
	formatDateTZ,
	escapeICalValue,
	calLinesToString,
} from './utils';

// /* istanbul ignore else */
// if (typeof module !== 'undefined') {
// 	module.exports = Object.assign(ical, module.exports);
// }



// /**
//  * Create a new, empty calendar and returns it.
//  *
//  * ```javascript
//  * import ical from 'ical-generator';
//  *
//  * // or use require:
//  * // const ical = require('ical-generator');
//  *
//  * const cal = ical();
//  * ```
//  *
//  * You can pass options to setup your calendar or use setters to do this.
//  *
//  * ```javascript
//  * import ical from 'ical-generator';
//  *
//  * // or use require:
//  * // const ical = require('ical-generator');
//  * const cal = ical({domain: 'sebbo.net'});
//  *
//  * // is the same as
//  *
//  * const cal = ical().domain('sebbo.net');
//  *
//  * // is the same as
//  *
//  * const cal = ical();
//  * cal.domain('sebbo.net');
//  * ```
//  */
// function ical(options: CalendarOptions = {}, events: ICalEvent[] = []): ICalCalendar {
// 	return new ICalCalendar(options, events);
// }

// export default ical;

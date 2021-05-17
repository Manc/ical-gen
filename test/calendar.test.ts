import ICalCalendar, { ICalCalendarOptions, ICalVTimezoneGenerator, ICalCalendarProdId } from '../src/calendar';
import ICalEvent from '../src/event';

describe('Calendar', () => {
	const demoEvent1 = new ICalEvent({
		timezone: 'Europe/London',
		start: new Date(1621036800000),
		end: new Date(1621123200000),
		sequence: 1,
		stamp: new Date(1621036800000),
		summary: 'Test 1',
		uid: 'testuid1',
	});

	const demoEvent2 = new ICalEvent({
		timezone: 'Europe/Berlin',
		start: new Date(1621036800000),
		end: new Date(1621123200000),
		sequence: 1,
		stamp: new Date(1621036800000),
		summary: 'Test 2',
		uid: 'testuid2',
	});

	const demoProdId: Readonly<ICalCalendarProdId> = {
		company: 'My Company X',
		product: 'My Product Name',
		language: 'XX',
	};

	describe('constructor()', () => {
		it('should apply default values when no options provided', () => {
			const cal = new ICalCalendar();
			expect(cal.prodId.company).toBe('Unnamed');
			expect(cal.prodId.product).toBe('Unnamed');
			expect(cal.prodId.language).toBe('EN');
			expect(cal.name).toBeUndefined();
			expect(cal.description).toBeUndefined();
			expect(cal.method).toBeUndefined();
			expect(cal.timezone).toBeUndefined();
			expect(cal.ttl).toBeUndefined();
			expect(cal.url).toBeUndefined();
			expect(cal.events).toEqual([]);
			expect(cal.vTimeZoneGenerator).toBeUndefined();
		});

		it('should apply values from options object', () => {
			const event1 = new ICalEvent({
				start: new Date(1621036800000),
				end: new Date(1621123200000),
				sequence: 1,
				stamp: new Date(1621036800000),
				summary: 'Test 1',
				uid: 'testuid1',
			});
			const testCalOptions1: ICalCalendarOptions = {
				prodId: demoProdId,
				name: 'My calendar',
				description: 'My description',
				method: 'CANCEL',
				timezone: 'America/Los_Angeles',
				ttl: 1234,
				url: 'https://example.com/test',
				events: [event1],
				vTimeZoneGenerator: (tz: string): undefined => { return; },
			};
			const cal = new ICalCalendar(testCalOptions1);
			expect(cal.prodId.company).toBe('My Company X');
			expect(cal.prodId.product).toBe('My Product Name');
			expect(cal.prodId.language).toBe('XX');
			expect(cal.name).toBe(testCalOptions1.name);
			expect(cal.description).toBe(testCalOptions1.description);
			expect(cal.method).toBe(testCalOptions1.method);
			expect(cal.timezone).toBe(testCalOptions1.timezone);
			expect(cal.ttl).toBe(testCalOptions1.ttl);
			expect(cal.url).toBe(testCalOptions1.url);
			expect(cal.events).toHaveLength(1);
			expect(cal.events[0]).toBe(event1);
			expect(cal.vTimeZoneGenerator).toBe(testCalOptions1.vTimeZoneGenerator);
		});
	});

	describe('addEvent()', () => {
		const cal = new ICalCalendar();

		it('should add an event', () => {
			expect(cal.events).toHaveLength(0);

			const event1 = new ICalEvent({
				start: new Date(1621036800000),
				end: new Date(1621123200000),
				sequence: 1,
				stamp: new Date(1621036800000),
				summary: 'Test 1',
				uid: 'test1',
			});

			const event2 = new ICalEvent({
				start: new Date(1621036800000),
				end: new Date(1621123200000),
				sequence: 1,
				stamp: new Date(1621036800000),
				summary: 'Test 2',
				uid: 'test2',
			});

			cal.addEvent(event1);
			expect(cal.events).toEqual([event1]);

			cal.addEvent(event2);
			expect(cal.events).toEqual([event1, event2]);

			cal.addEvent(event1);
			expect(cal.events).toEqual([event1, event2, event1]);
		});

		it('should return this', () => {
			const returnValue = cal.removeAllEvents();
			expect(returnValue).toBe(cal);
		});
	});

	describe('removeAllEvents()', () => {
		const cal = new ICalCalendar({
			prodId: {
				company: 'Test Co.',
				product: 'Test',
				language: 'EN',
			},
			events: [
				new ICalEvent({
					start: new Date(1621036800000),
					end: new Date(1621123200000),
					sequence: 1,
					stamp: new Date(1621036800000),
					summary: 'Test 1',
					uid: 'test1',
				}),
				new ICalEvent({
					start: new Date(1621036800000),
					end: new Date(1621123200000),
					sequence: 1,
					stamp: new Date(1621036800000),
					summary: 'Test 2',
					uid: 'test2',
				})
			]
		});

		it('should remove all events', () => {
			expect(cal.events).toHaveLength(2);
			cal.removeAllEvents();
			expect(cal.events).toHaveLength(0);
		});

		it('should return this', () => {
			const returnValue = cal.removeAllEvents();
			expect(returnValue).toBe(cal);
		});
	});

	describe('render()', () => {
		describe('without a VTIMEZONE genarator', () => {
			const cal = new ICalCalendar({
				prodId: demoProdId,
				//     12345678901234567890123456789012345678901234567890123456789012345678901234
				name: 'This calendar name is deliberately longer than 74 characters to force line-wrapping!',
				description: 'Test description',
				ttl: 60 * 60 * 24 * 3, // 3 days
				events: [demoEvent1, demoEvent2],
			});

			// Rendered string without a VTIMEZONE genarator.
			const str = cal.render();

			it('should have `\\r\\n` line breaks', () => {
				expect(str.split('\r\n').length).toBeGreaterThan(20); // > 20 because the test calender is expected to produce at least 20 lines
			});

			it('should limit lines to 74 characters', () => {
				// Find longest line
				const lines = str.split('\r\n');
				const maxLength = lines.reduce((currentMax, line) => {
					return Math.max(currentMax, line.length);
				}, 0);
				expect(maxLength).toBe(74);
			});

			it('should conatin the line-wrapped property `name`', () => {
				//                     12345678901234567890123456789012345678901234567890123456789012345678901234|
				expect(str).toContain('NAME:This calendar name is deliberately longer than 74 characters to force\r\n  line-wrapping!');
				expect(str).toContain('X-WR-CALNAME:This calendar name is deliberately longer than 74 characters \r\n to force line-wrapping!');
			});

			it('should conatin formatted product ID', () => {
				expect(str).toContain('PRODID:-//My Company X//My Product Name//XX');
			});

			it('should conatain property `description`', () => {
				expect(str).toContain('X-WR-CALDESC:Test description');
			});

			it('should conatain property `ttl`', () => {
				expect(str).toContain('REFRESH-INTERVAL;VALUE=DURATION:P3D');
				expect(str).toContain('X-PUBLISHED-TTL:P3D');
			});

			it('should conatin all events', () => {
				expect(str.match(/BEGIN:VEVENT/g) || []).toHaveLength(2);
				expect(str.match(/END:VEVENT/g) || []).toHaveLength(2);
				expect(str.match(/UID:testuid1/g) || []).toHaveLength(1);
				expect(str.match(/UID:testuid2/g) || []).toHaveLength(1);
			});

			it('should not contain any VTIMEZONE components', () => {
				expect(str).not.toContain('BEGIN:VTIMEZONE');
			});
		});

		describe('with a VTIMEZONE genarator', () => {
			// A mock VTIMEZONE genarator that returns a result if the provided
			// time zone string starts with `Europe/`.
			const mockVTZGenerator: ICalVTimezoneGenerator = (tz) => {
				if (tz.startsWith('Europe/')) {
					return [
						`BEGIN:VTIMEZONE`,
						`X-MOCK-VTIMEZONE:${tz}`,
						`END:VTIMEZONE`
					].join('\r\n');
				}
			};

			it('should apply all available VTIMEZONEs from the calendar and all events once', () => {
				const str = new ICalCalendar({
					prodId: demoProdId,
					events: [demoEvent1, demoEvent2, demoEvent1], // Include at least one time zone twice
					timezone: 'Europe/Paris',
					vTimeZoneGenerator: mockVTZGenerator,
				}).render();
				expect(str.match(/X-MOCK-VTIMEZONE:/g) || []).toHaveLength(3);
				expect(str).toContain('X-MOCK-VTIMEZONE:Europe/Paris');
				expect(str).toContain('X-MOCK-VTIMEZONE:Europe/London');
				expect(str).toContain('X-MOCK-VTIMEZONE:Europe/Berlin');
			});

			it('should ignore time zones that do not resolve to a VTIMEZONE', () => {
				const str = new ICalCalendar({
					prodId: demoProdId,
					events: [demoEvent1],
					timezone: 'Something/Wrong', // This will not resolve to a VTIMEZONE
					vTimeZoneGenerator: mockVTZGenerator,
				}).render();
				expect(str.match(/X-MOCK-VTIMEZONE:/g) || []).toHaveLength(1);
				expect(str).toContain('X-MOCK-VTIMEZONE:Europe/London');
			});
		});
	});
});

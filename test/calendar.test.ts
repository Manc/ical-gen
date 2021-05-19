// Import from `index.ts` to check that the main entry exports everything.
import {
	ICalCalendar,
	ICalCalendarOptions,
	ICalCalendarProdId,
	ICalEvent,
} from '../src';


describe('ICalCalendar', () => {
	const demoEvent1 = new ICalEvent({
		// timezone: 'Europe/London',
		start: {
			date: new Date(1621036800000),
			zone: 'Europe/London',
		},
		end: {
			date: new Date(1621123200000),
			zone: 'Europe/London',
		},
		sequence: 1,
		stamp: new Date(1621036800000),
		summary: 'Test 1',
		uid: 'testuid1',
	});

	const demoEvent2 = new ICalEvent({
		// timezone: 'Europe/Berlin',
		start: {
			date: new Date(1621036800000),
			zone: 'Europe/Berlin',
		},
		end: {
			date: new Date(1621123200000),
			zone: 'Europe/Berlin',
		},
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
			expect(cal.children).toEqual([]);
		});

		it('should apply values from options object', () => {
			const event1 = new ICalEvent({
				start: {
					date: new Date(1621036800000),
					zone: 'Europe/London',
				},
				end: {
					date: new Date(1621123200000),
					zone: 'Europe/London',
				},
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
				children: [event1],
				// vTimeZoneGenerator: (tz: string): undefined => { return; },
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
			expect(cal.children).toBeDefined();
			expect(cal.children).toHaveLength(1);
			expect(cal.children![0]).toBe(event1);
		});
	});

	describe('addChild()', () => {
		it('should add a child component object as often as requested', () => {
			const cal = new ICalCalendar();
			expect(cal.children).toHaveLength(0);

			const event1 = new ICalEvent({
				start: {
					date: new Date(1621036800000),
					zone: 'Europe/London',
				},
				end: {
					date: new Date(1621123200000),
					zone: 'Europe/London',
				},
				sequence: 1,
				stamp: new Date(1621036800000),
				summary: 'Test 1',
				uid: 'test1',
			});

			const event2 = new ICalEvent({
				start: {
					date: new Date(1621036800000),
					zone: 'Europe/London',
				},
				end: {
					date: new Date(1621123200000),
					zone: 'Europe/London',
				},
				sequence: 1,
				stamp: new Date(1621036800000),
				summary: 'Test 2',
				uid: 'test2',
			});

			cal.addChild(event1);
			expect(cal.children).toEqual([event1]);

			cal.addChild(event2);
			expect(cal.children).toEqual([event1, event2]);

			cal.addChild(event1);
			expect(cal.children).toEqual([event1, event2, event1]);
		});

		it('should add a string child as often as requested', () => {
			const cal = new ICalCalendar();
			expect(cal.children).toHaveLength(0);

			cal.addChild('Line 1');
			expect(cal.children).toEqual(['Line 1']);

			cal.addChild('Line 2');
			expect(cal.children).toEqual(['Line 1', 'Line 2']);
		});

		it('should return this', () => {
			const cal = new ICalCalendar();
			expect(cal.addChild('')).toBe(cal);
		});
	});

	describe('renderToString()', () => {
		const cal = new ICalCalendar({
			prodId: demoProdId,
			//             10        20        30        40        50        60        70  74
			//     ---------|---------|---------|---------|---------|---------|---------|---|
			name: 'This calendar name is deliberately longer than 74 characters to force line-wrapping!',
			description: 'Test description',
			ttl: 60 * 60 * 24 * 3, // 3 days
			children: [demoEvent1, demoEvent2],
		});

		const strPromise = cal.renderToString();

		it('should have `\\r\\n` line breaks', async () => {
			const str = await strPromise;
			// console.log(str.replace(/\r\n/g, '⏎\n'));
			expect(str.split('\r\n').length).toBeGreaterThan(6); // > 6 because the test calender is expected to produce more than 6 lines
		});

		it('should apply line-folding', async () => {
			const str = await strPromise;

			// Find longest line
			const maxLength = str
				.split('\r\n')
				.reduce((currentMax, line) => Math.max(currentMax, line.length), 0);
			expect(maxLength).toBe(74);
		});

		it('should contain the folded property `name`', async () => {
			const str = await strPromise;
			//                     12345678901234567890123456789012345678901234567890123456789012345678901234|
			expect(str).toContain('NAME:This calendar name is deliberately longer than 74 characters to force\r\n  line-wrapping!');
			expect(str).toContain('X-WR-CALNAME:This calendar name is deliberately longer than 74 characters \r\n to force line-wrapping!');
		});

		it('should contain formatted product ID', async () => {
			const str = await strPromise;
			expect(str).toContain('PRODID:-//My Company X//My Product Name//XX');
		});

		it('should conatain property `description`', async () => {
			const str = await strPromise;
			expect(str).toContain('X-WR-CALDESC:Test description');
		});

		it('should conatain property `ttl`', async () => {
			const str = await strPromise;
			expect(str).toContain('REFRESH-INTERVAL;VALUE=DURATION:P3D');
			expect(str).toContain('X-PUBLISHED-TTL:P3D');
		});

		it('should contain all events', async () => {
			const str = await strPromise;
			expect(str.match(/BEGIN:VEVENT/g) || []).toHaveLength(2);
			expect(str.match(/END:VEVENT/g) || []).toHaveLength(2);
			expect(str.match(/UID:testuid1/g) || []).toHaveLength(1);
			expect(str.match(/UID:testuid2/g) || []).toHaveLength(1);
		});

		it('should not contain any VTIMEZONE components', async () => {
			const str = await strPromise;
			expect(str).not.toContain('BEGIN:VTIMEZONE');
		});
	});
});

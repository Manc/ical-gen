// Import from `index.ts` to check that the main entry exports everything.
import {
	ICalCalendarProdId,
	ICalCalendarWithZones,
	ICalCalendarWithZonesOptions,
	ICalVTimezoneGenerator,
	ICalTimeZone,
	ICalTimeZoneOptions,
	ICalEvent,
} from '../src';


/**
 * Mock implementation of a time zone generator function, that will resolve
 * with a `ICalCalendarTimeZones` component if the input time zone string
 * starts with `Europe/`.
 */
const vTimeZoneGenerator: ICalVTimezoneGenerator = async (tz) => {
	if (tz.startsWith('Europe/')) {
		// Create options separately here for explicit testing of the type.
		const options: ICalTimeZoneOptions = {
			fromString: `X-MOCK-VTIMEZONE:${tz}`,
		};
		return new ICalTimeZone(options);
	}
	throw new Error('Time zone not found');
};

/**
 * Mock product ID.
 */
const prodId: Readonly<ICalCalendarProdId> = {
	company: 'My Company X',
	product: 'My Product Name',
	language: 'XX',
};

describe('ICalCalendarWithZones', () => {
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

	describe('constructor()', () => {
		it('should apply minimal options with sane defaults', () => {
			const cal = new ICalCalendarWithZones({
				prodId,
				vTimeZoneGenerator,
			});
			expect(cal.prodId.company).toBe('My Company X');
			expect(cal.prodId.product).toBe('My Product Name');
			expect(cal.prodId.language).toBe('XX');
			expect(cal.name).toBeUndefined();
			expect(cal.description).toBeUndefined();
			expect(cal.method).toBeUndefined();
			expect(cal.timezone).toBeUndefined();
			expect(cal.ttl).toBeUndefined();
			expect(cal.url).toBeUndefined();
			expect(cal.children).toEqual([]);
			expect(cal.vTimeZoneGenerator).toBe(vTimeZoneGenerator);
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
			const testCalOptions1: ICalCalendarWithZonesOptions = {
				prodId,
				name: 'My calendar',
				description: 'My description',
				method: 'CANCEL',
				timezone: 'America/Los_Angeles',
				ttl: 1234,
				url: 'https://example.com/test',
				children: [event1],
				vTimeZoneGenerator: async (tz: string) => { throw new Error(); },
			};
			const cal = new ICalCalendarWithZones(testCalOptions1);
			expect(cal.prodId.company).toBe('My Company X');
			expect(cal.prodId.product).toBe('My Product Name');
			expect(cal.prodId.language).toBe('XX');
			expect(cal.name).toBe(testCalOptions1.name);
			expect(cal.description).toBe(testCalOptions1.description);
			expect(cal.method).toBe(testCalOptions1.method);
			expect(cal.timezone).toBe(testCalOptions1.timezone);
			expect(cal.ttl).toBe(testCalOptions1.ttl);
			expect(cal.url).toBe(testCalOptions1.url);
			expect(cal.children).toHaveLength(1);
			expect(cal.children![0]).toBe(event1);
			expect(cal.vTimeZoneGenerator).toBe(testCalOptions1.vTimeZoneGenerator);
		});
	});

	describe('renderToString()', () => {
		it('should apply all available VTIMEZONEs from the calendar and all events once', async () => {
			const str = await new ICalCalendarWithZones({
				prodId,
				children: [demoEvent1, demoEvent2, demoEvent1], // Include at least one time zone twice
				timezone: 'Europe/Paris',
				vTimeZoneGenerator,
			}).renderToString();
			expect(str.match(/X-MOCK-VTIMEZONE:/g) || []).toHaveLength(3);
			expect(str).toContain('X-MOCK-VTIMEZONE:Europe/Paris');
			expect(str).toContain('X-MOCK-VTIMEZONE:Europe/London');
			expect(str).toContain('X-MOCK-VTIMEZONE:Europe/Berlin');
		});

		it('should ignore time zones that do not resolve to a VTIMEZONE', async () => {
			const str = await new ICalCalendarWithZones({
				prodId,
				children: [demoEvent1],
				timezone: 'Something/Wrong', // This will not resolve to a VTIMEZONE
				vTimeZoneGenerator,
			}).renderToString();
			expect(str.match(/X-MOCK-VTIMEZONE:/g) || []).toHaveLength(1);
			expect(str).toContain('X-MOCK-VTIMEZONE:Europe/London');
		});
	});
});

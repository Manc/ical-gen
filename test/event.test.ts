// Import from `index.ts` to check that the main entry exports everything.
import { ICalEvent, ICalEventOptions } from '../src';
import { DateTime } from 'luxon';


describe('ICalEvent', () => {
	it('renders the provided options properly', async () => {
		const options: ICalEventOptions = {
			start: {
				date: new Date('2021-05-21T10:00:00Z'),
				zone: 'America/Los_Angeles',
			},
			end: {
				date: new Date('2021-05-21T11:30:00Z'),
				zone: 'America/Los_Angeles',
			},
			uid: 'testuid',
			sequence: 99,
			stamp: new Date('2021-05-09T07:08:09Z'),
			summary: 'Test Title',
			description: 'Test description.',
			url: 'https://example.com',
		};
		const str = await new ICalEvent(options).renderToString();
		expect(str).toMatchSnapshot();
	});

	it('handles event dates being native JS Dates with time zone strings', async () => {
		const options: ICalEventOptions = {
			start: {
				date: new Date('2021-05-21T10:00:06Z'),
				zone: 'America/Los_Angeles',
			},
			end: {
				date: new Date('2021-05-21T11:30:58Z'),
				zone: 'America/Los_Angeles',
			},
			sequence: 1,
			stamp: new Date(1621036800000),
			summary: 'Test',
			uid: 'testuid',
		};
		const str = await new ICalEvent(options).renderToString();
		expect(str).toContain('DTSTART;TZID=America/Los_Angeles:20210521T030006');
		expect(str).toContain('DTEND;TZID=America/Los_Angeles:20210521T043058');
	});

	it('handles event date being Luxon DateTime objects with time zones set for event with time', async () => {
		const options: ICalEventOptions = {
			start: DateTime.fromMillis(new Date('2021-05-21T10:00:06Z').getTime(), { zone: 'America/Los_Angeles' }),
			end: DateTime.fromMillis(new Date('2021-05-21T11:30:58Z').getTime(), { zone: 'America/Los_Angeles' }),
			sequence: 1,
			stamp: new Date(1621036800000),
			summary: 'Test',
			uid: 'testuid',
		};
		const str = await new ICalEvent(options).renderToString();
		expect(str).toContain('DTSTART;TZID=America/Los_Angeles:20210521T030006');
		expect(str).toContain('DTEND;TZID=America/Los_Angeles:20210521T043058');
	});

	it('handles event dates being native JS Dates for all-day event', async () => {
		const options: ICalEventOptions = {
			start: {
				date: new Date('2021-05-21T00:00:00Z'),
			},
			end: {
				date: new Date('2021-05-22T00:00:00Z'),
			},
			allDay: true,
			sequence: 1,
			stamp: new Date(1621036800000),
			summary: 'Test',
			uid: 'testuid',
		};
		const str = await new ICalEvent(options).renderToString();
		expect(str).toContain('DTSTART;VALUE=DATE:20210521');
		expect(str).toContain('DTEND;VALUE=DATE:20210522');
	});

	it('handles event dates being Luxon DateTime objects for all-day event', async () => {
		const options: ICalEventOptions = {
			start: DateTime.fromMillis(new Date('2021-05-21T00:00:00Z').getTime(), { zone: 'UTC' }),
			end: DateTime.fromMillis(new Date('2021-05-22T00:00:00Z').getTime(), { zone: 'UTC' }),
			allDay: true,
			sequence: 1,
			stamp: new Date(1621036800000),
			summary: 'Test',
			uid: 'testuid',
		};
		const str = await new ICalEvent(options).renderToString();
		expect(str).toContain('DTSTART;VALUE=DATE:20210521');
		expect(str).toContain('DTEND;VALUE=DATE:20210522');
	});
});

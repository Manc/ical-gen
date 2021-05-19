import {
	foldLine,
	filterAndJoinICalLines,
	formatZonedDate,
	formatDateProp,
} from '../src/utils';

describe('foldLine()', () => {
	it('should leave a string with 74 octets untouched', () => {
		//                  10        20        30        40        50        60        70  74
		//          ---------|---------|---------|---------|---------|---------|---------|---|
		const s1 = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';
		expect(foldLine(s1)).toBe('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx')
	});

	it('should fold a string with 75 octets or more', () => {
		//                  10        20        30        40        50        60        70  74
		//          ---------|---------|---------|---------|---------|---------|---------|---|
		const s1 = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx Hello';
		const s2 = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx Hello';
		const s3 = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx Hello';

		expect(foldLine(s1)).toBe('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx H\r\n ello');
		expect(foldLine(s2)).toBe('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx \r\n Hello');
		expect(foldLine(s3)).toBe('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx\r\n  Hello');
	});

	it('should fold a line that spans multiple folded lines correctly', () => {
		const s = ''
			//         10        20        30        40        50        60        70  74
			// ---------|---------|---------|---------|---------|---------|---------|---|
			+ '11111111111111111111111111111111111111111111111111111111111111111111111111'
			+ '22222222222222222222222222222222222222222222222222222222222222222222222222'
			+ '33333333333333333333333333333333333333333333333333333333333333333333333333'
			+ 'EOL';
		expect(foldLine(s)).toBe(
			'11111111111111111111111111111111111111111111111111111111111111111111111111\r\n' +
			' 22222222222222222222222222222222222222222222222222222222222222222222222222\r\n' +
			' 33333333333333333333333333333333333333333333333333333333333333333333333333\r\n' +
			' EOL'
		);
	});
});

describe('filterAndJoinICalLines()', () => {
	it('should join lines with the correct line break', () => {
		const str = filterAndJoinICalLines([
			'L1',
			'L2',
			'L3',
		]);
		expect(str).toBe('L1\r\nL2\r\nL3');
	});

	it('should remove undefined lines and empty strings', () => {
		const str = filterAndJoinICalLines([
			'L1',
			undefined,
			'L2',
			'',
			'L3',
		]);
		expect(str).toBe('L1\r\nL2\r\nL3');
	});
});

describe('formatDate()', () => {
	const date1 = new Date('2021-05-08T05:02:01.914Z');
	// const date1 = new Date('2021-10-18T17:32:51.914Z');

	// describe('hasTimezone = false, dateonly = false, floating = false', () => {
	// 	it('should should format date without leading zeros', () => {
	// 		expect(
	// 			formatDateOld(false, date1, false, false)
	// 		).toBe('20211018T173251Z');
	// 	});

	// 	it('should should format date with leading zeros', () => {
	// 		expect(
	// 			formatDateOld(false, date2, false, false)
	// 		).toBe('20210508T070201Z');
	// 	});
	// });

	// describe('hasTimezone = false, dateonly = true, floating = false', () => {
	// 	it('should should format date without leading zeros', () => {
	// 		expect(
	// 			formatDateOld(false, date1, true, false)
	// 		).toBe('20211018');
	// 	});

	// 	it('should should format date with leading zeros', () => {
	// 		expect(
	// 			formatDateOld(false, date2, true, false)
	// 		).toBe('20210508');
	// 	});
	// });

	describe('zondedDateToDateTime()', () => {
		it('should should format date in UTC', () => {
			expect(
				formatZonedDate({ date: date1, zone: 'UTC' }, false)
			).toBe('20210508T050201');
		});

		it('should should format date in America/Los_Angeles', () => {
			expect(
				formatZonedDate({ date: date1, zone: 'America/Los_Angeles' }, false)
			).toBe('20210507T220201');
		});

		// it('should should format date with leading zeros', () => {
		// 	expect(
		// 		formatZonedDate(false, date2, false, false)
		// 	).toBe('20210508T070201Z');
		// });
	});
});

describe('formatDateProp()', () => {
	const date1 = new Date('2021-05-08T05:02:01.914Z');

	describe('input date provided in UTC', () => {
		it('should format a floating date-time', () => {
			expect(
				formatDateProp('DTSTART', { date: date1, zone: 'UTC' }, true, false)
			).toBe('DTSTART:20210508T050201');
		});

		it('should format a floating date-only', () => {
			expect(
				formatDateProp('DTEND', { date: date1, zone: 'UTC' }, true, true)
			).toBe('DTEND;VALUE=DATE:20210508');
		});

		it('should format a non-floating date-time', () => {
			expect(
				formatDateProp('DTSTART', { date: date1, zone: 'UTC' }, false, false)
			).toBe('DTSTART:20210508T050201Z');
		});

		it('should format a non-floating date-only request same as floating', () => {
			expect(
				formatDateProp('DTSTART', { date: date1, zone: 'UTC' }, false, true)
			).toBe('DTSTART;VALUE=DATE:20210508');
		});
	});

	describe('input date provided in a non-UTC time zone', () => {
		it('should format a floating date-time', () => {
			expect(
				formatDateProp('DTSTART', { date: date1, zone: 'America/Los_Angeles' }, true, false)
			).toBe('DTSTART:20210507T220201');
		});

		it('should format a floating date-time', () => {
			expect(
				formatDateProp('DTEND', { date: date1, zone: 'America/Los_Angeles' }, true, true)
			).toBe('DTEND;VALUE=DATE:20210507');
		});

		it('should format a non-floating date-time', () => {
			expect(
				formatDateProp('DTSTART', { date: date1, zone: 'America/Los_Angeles' }, false, false)
			).toBe('DTSTART;TZID=America/Los_Angeles:20210507T220201');
		});

		it('should format a non-floating date-only request same as floating', () => {
			expect(
				formatDateProp('DTSTART', { date: date1, zone: 'America/Los_Angeles' }, false, true)
			).toBe('DTSTART;VALUE=DATE:20210507');
		});
	});

	// describe('non-floating', () => {
	// });
});

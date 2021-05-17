'use strict';

import assert from 'assert';
// import moment from 'moment-timezone';
// import {DateTime} from 'luxon';
// import dayjs from 'dayjs';
// import dayJsUTCPlugin from 'dayjs/plugin/utc';
// import dayJsTimezonePlugin from 'dayjs/plugin/timezone';
import { formatDate, formatDateTZ, escapeICalValue, calLinesToString } from '../src/utils';

// dayjs.extend(dayJsUTCPlugin);
// dayjs.extend(dayJsTimezonePlugin);

describe('ICalTools', function () {
	describe('formatDate()', function () {
		describe('Date / String', function () {
			const date1 = new Date('2018-07-05T18:24:00.052Z');
			const date2 = new Date('2018-07-05T18:24:00.052');

			it('timezone=0 dateonly=0 floating=0', function () {
				assert.strictEqual(
					formatDate(false, date1, false, false),
					'20180705T182400Z'
				);
			});
			it('timezone=0 dateonly=0 floating=1', function () {
				assert.strictEqual(
					formatDate(false, date1, false, true),
					'20180705T182400'
				);
			});
			it('timezone=0 dateonly=1 floating=0', function () {
				assert.strictEqual(
					formatDate(false, date1, true, false),
					'20180705'
				);
			});
			it('timezone=0 dateonly=1 floating=1', function () {
				assert.strictEqual(
					formatDate(false, date1, true, true),
					'20180705'
				);
			});
			it('timezone=1 dateonly=0 floating=0', function () {
				assert.strictEqual(
					formatDate(true, date2, false, false),
					'20180705T182400'
				);
			});
			it('timezone=1 dateonly=0 floating=1', function () {
				assert.strictEqual(
					formatDate(true, date2, false, true),
					'20180705T182400'
				);
			});
			it('timezone=1 dateonly=1 floating=0', function () {
				assert.strictEqual(
					formatDate(true, date2, true, false),
					'20180705'
				);
			});
			it('timezone=1 dateonly=1 floating=1', function () {
				assert.strictEqual(
					formatDate(true, date2, true, true),
					'20180705'
				);
			});
		});
		// describe('moment.js', function () {
		// 	it('should work without setting a timezone', function () {
		// 		assert.strictEqual(
		// 			formatDate(null, moment('2018-07-05T18:24:00.052Z'), false, false),
		// 			'20180705T182400Z'
		// 		);
		// 	});
		// 	it('should work with timezone in event / calendar (with moment-timezone)', function () {
		// 		assert.strictEqual(
		// 			formatDate('Canada/Saskatchewan', moment('2018-07-05T18:24:00.052Z'), false, false),
		// 			'20180705T122400'
		// 		);
		// 	});
		// 	it('should work with floating flag', function () {
		// 		assert.strictEqual(
		// 			formatDate(null, moment('2018-07-05T18:24:00.052'), false, true),
		// 			'20180705T182400'
		// 		);
		// 	});
		// });
		// describe('Luxon', function () {
		// 	it('should work without setting a timezone', function () {
		// 		assert.strictEqual(
		// 			formatDate(null, DateTime.fromISO('2018-07-05T18:24:00.052Z'), false, false),
		// 			'20180705T182400Z'
		// 		);
		// 	});
		// 	it('should work with timezone in event / calendar (with moment-timezone)', function () {
		// 		assert.strictEqual(
		// 			formatDate('Canada/Saskatchewan', DateTime.fromISO('2018-07-05T18:24:00.052Z'), false, false),
		// 			'20180705T122400'
		// 		);
		// 	});
		// 	it('should work with floating flag', function () {
		// 		assert.strictEqual(
		// 			formatDate(null, DateTime.fromISO('2018-07-05T18:24:00.052'), false, true),
		// 			'20180705T182400'
		// 		);
		// 	});
		// 	it('should work with dateonly flag', function () {
		// 		assert.strictEqual(
		// 			formatDate(null, DateTime.fromISO('2018-07-05T18:24:00.052'), true, false),
		// 			'20180705'
		// 		);
		// 	});
		// });
		// describe('Day.js', function () {
		// 	it('should work without setting a timezone', function () {
		// 		assert.strictEqual(
		// 			formatDate(null, dayjs('2018-07-05T18:24:00.052Z'), false, false),
		// 			'20180705T182400Z'
		// 		);
		// 	});
		// 	it('should work with timezone in event / calendar (with moment-timezone)', function () {
		// 		assert.strictEqual(
		// 			formatDate('Canada/Saskatchewan', dayjs('2018-07-05T18:24:00.052Z'), false, false),
		// 			'20180705T122400'
		// 		);
		// 	});
		// 	it('should work with floating flag', function () {
		// 		assert.strictEqual(
		// 			formatDate(null, dayjs('2018-07-05T18:24:00.052'), false, true),
		// 			'20180705T182400'
		// 		);
		// 	});
		// 	it('should work with dateonly flag', function () {
		// 		assert.strictEqual(
		// 			formatDate(null, dayjs('2018-07-05T18:24:00.052'), true, false),
		// 			'20180705'
		// 		);
		// 	});
		// });
	});

	describe('formatDateTZ()', function () {
		const date3 = new Date('2018-07-02T15:48:05.000Z');

		// it('should work with timezone', function () {
		// 	const ed = {timezone: 'Europe/Berlin'};
		// 	assert.strictEqual(
		// 		formatDateTZ('Europe/Berlin', 'DSTART', moment('2018-07-02T15:48:05.000Z'), ed),
		// 		'DSTART;TZID=Europe/Berlin:20180702T174805'
		// 	);
		// });
		it('should work without timezone', function () {
			assert.strictEqual(
				formatDateTZ(false, 'DSTART', date3, {}),
				'DSTART:20180702T154805Z'
			);
		});
		it('should work without eventdata parameter', function () {
			assert.strictEqual(
				formatDateTZ(false, 'DSTART', date3),
				'DSTART:20180702T154805Z'
			);
		});
	});

	describe('escape()', function () {
		it('should escape \\', function () {
			assert.strictEqual(
				escapeICalValue('Lorem \\ipsum'),
				'Lorem \\\\ipsum'
			);
		});
		it('should escape ;', function () {
			assert.strictEqual(
				escapeICalValue('Lorem ;ipsum'),
				'Lorem \\;ipsum'
			);
		});
		it('should escape ,', function () {
			assert.strictEqual(
				escapeICalValue('Lorem, ipsum'),
				'Lorem\\, ipsum'
			);
		});
		it('should escape \\r', function () {
			assert.strictEqual(
				escapeICalValue('Lorem \ripsum'),
				'Lorem \\nipsum'
			);
		});
		it('should escape \\n', function () {
			assert.strictEqual(
				escapeICalValue('Lorem \nipsum'),
				'Lorem \\nipsum'
			);
		});
		it('should escape \\r\\n', function () {
			assert.strictEqual(
				escapeICalValue('Lorem \r\nipsum'),
				'Lorem \\nipsum'
			);
		});
	});

	describe('calLinesToString()', function () {
		it('should work with a long single line', function () {
			assert.strictEqual(
				calLinesToString([
					'12345678ikjhgztrde546rf7g8hjiomkjnhgqfcdxerdftgzuinjhgcfvtzvzvuwcbiweciujzvguhbghbbqwxowidoi21e8981',
				]),
				'12345678ikjhgztrde546rf7g8hjiomkjnhgqfcdxerdftgzuinjhgcfvtzvzvuwcbiweciujz\r\n vguhbghbbqwxowidoi21e8981'
			);
		});
		it('should work with multiple lines', function () {
			assert.strictEqual(
				calLinesToString([
					'12345678ikjhgztrde546rf7g8hjiomkjnhgqfcdxerdftgzuinjhgcfvtzvzvuwcbiweciujzvguhbghbbqwxowidoi21e8981',
					'line 2',
				]),
				'12345678ikjhgztrde546rf7g8hjiomkjnhgqfcdxerdftgzuinjhgcfvtzvzvuwcbiweciujz\r\n vguhbghbbqwxowidoi21e8981\r\nline 2'
			);
		});
		it('should trim and remove empty lines', function () {
			assert.strictEqual(
				calLinesToString([
					'12345678ikjhgztrde546rf7g8hjiomkjnhgqfcdxerdftgzuinjhgcfvtzvzvuwcbiweciujzvguhbghbbqwxowidoi21e8981',
					'',
					' ',
					'line 2 ',
				]),
				'12345678ikjhgztrde546rf7g8hjiomkjnhgqfcdxerdftgzuinjhgcfvtzvzvuwcbiweciujz\r\n vguhbghbbqwxowidoi21e8981\r\nline 2'
			);
		});
		it('should not split surrogate pairs', function () {
			assert.strictEqual(
				calLinesToString([
					'👋🏼12345678ikjhgztrde546rf7g8hjiomkjnhgqfcdxerdftgzuinjhgcfvtzvzvuwcbiweciujvguhbghbbqwxowidoi21e8981',
				]),
				'👋🏼12345678ikjhgztrde546rf7g8hjiomkjnhgqfcdxerdftgzuinjhgcfvtzvzvuwcb\r\n iweciujvguhbghbbqwxowidoi21e8981'
			);
		});
	});

	// describe('checkDate()', function () {
	// 	describe('Date', function () {
	// 		it('should work with valid Date', function () {
	// 			const date = new Date();
	// 			assert.equal(checkDate(date, 'foo'), date);
	// 		});
	// 		it('should throw error for invalid Date', function () {
	// 			const date = new Date('foo');
	// 			assert.throws(() => {
	// 				checkDate(date, 'foo');
	// 			}, /`foo` has to be a valid date!/);
	// 		});
	// 	});
	// 	describe('String', function () {
	// 		it('should work with valid String', function () {
	// 			const date = '2021-03-28T13:15:23.587Z';
	// 			assert.equal(checkDate(date, 'foo'), date);
	// 		});
	// 		it('should throw error for invalid String', function () {
	// 			const date = 'foo';
	// 			assert.throws(() => {
	// 				checkDate(date, 'foo');
	// 			}, /`foo` has to be a valid date!/);
	// 		});
	// 	});
	// 	describe('Luxon', function () {
	// 		it('should work with valid Luxon', function () {
	// 			const date = DateTime.now();
	// 			assert.equal(checkDate(date, 'foo'), date);
	// 		});
	// 		it('should throw error for invalid Luxon', function () {
	// 			const date = DateTime.fromISO('foo');
	// 			assert.throws(() => {
	// 				checkDate(date, 'foo');
	// 			}, /`foo` has to be a valid date!/);
	// 		});
	// 	});
	// 	describe('Moment', function () {
	// 		it('should work with valid Moment', function () {
	// 			const date = moment();
	// 			assert.equal(checkDate(date, 'foo'), date);
	// 		});
	// 		it('should throw error for invalid Moment', function () {
	// 			const date = moment('foo');
	// 			assert.throws(() => {
	// 				checkDate(date, 'foo');
	// 			}, /`foo` has to be a valid date!/);
	// 		});
	// 	});
	// 	describe('Day.js', function () {
	// 		it('should work with valid Day.js', function () {
	// 			const date = dayjs();
	// 			assert.equal(checkDate(date, 'foo'), date);
	// 		});
	// 		it('should throw error for invalid Day.js', function () {
	// 			const date = dayjs('foo');
	// 			assert.throws(() => {
	// 				checkDate(date, 'foo');
	// 			}, /`foo` has to be a valid date!/);
	// 		});
	// 	});
	// });

	// describe('toDate()', function () {
	// 	it('should work with strings', function () {
	// 		const date = new Date();
	// 		assert.deepStrictEqual(toDate(date.toJSON()), date);
	// 	});
	// 	it('should work with native Date', function () {
	// 		const date = new Date();
	// 		assert.deepStrictEqual(toDate(date), date);
	// 	});
	// 	it('should work with moment object', function () {
	// 		const date = new Date();
	// 		assert.deepStrictEqual(toDate(moment(date)), date);
	// 	});
	// 	it('should work with Day.js object', function () {
	// 		const date = new Date();
	// 		assert.deepStrictEqual(toDate(dayjs(date)), date);
	// 	});
	// 	it('should work with luxon DateTime object', function () {
	// 		const date = new Date();
	// 		assert.deepStrictEqual(toDate(DateTime.fromJSDate(date)), date);
	// 	});
	// });
});

export interface ICalRepeatingOptions {
	freq: ICalEventRepeatingFreq;
	count?: number;
	interval?: number;
	until?: Date;
	byDay?: ICalWeekday[] | ICalWeekday;
	byMonth?: number[] | number;
	byMonthDay?: number[] | number;
	bySetPos?: number;
	exclude?: Date[] | Date;
	startOfWeek?: ICalWeekday;
}

export interface ICalGeo {
	lon: number;
	lat: number;
}

export interface ICalLocation {
	title: string;
	address?: string;
	radius?: number;
	geo?: ICalGeo;
}

export interface ICalOrganizer {
	name: string;
	email?: string;
	mailto?: string;
}

export interface ICalDescription {
	plain: string;
	html?: string;
}

export type ICalEventRepeatingFreq =
	| 'SECONDLY'
	| 'MINUTELY'
	| 'HOURLY'
	| 'DAILY'
	| 'WEEKLY'
	| 'MONTHLY'
	| 'YEARLY'
;

export type ICalWeekday =
	| 'MO'
	| 'TU'
	| 'WE'
	| 'TH'
	| 'FR'
	| 'SA'
	| 'SU'
;

import ICalComponent from './component';

export type ICalTimeZoneOptions = {
	fromString: string;
} | {
	fromLines: string[];
}

export default class ICalTimeZone extends ICalComponent {
	public tagName: string = 'VTIMEZONE';
	private lines: string[];

	constructor(options: ICalTimeZoneOptions) {
		super();
		if ('fromLines' in options) {
			this.lines = options.fromLines;
		} else {
			this.lines = options.fromString.split('\n').map(l => l.trimEnd());
		}
	}

	public getTimeZones = (): string[] => [];

	protected renderToLines = async (): Promise<string[]> => this.lines;
}

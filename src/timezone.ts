import ICalComponent from './component';

export interface ICalTimeZoneOptions {
	fromString: string;
}

export default class ICalTimeZone extends ICalComponent {
	public tagName: string = 'VTIMEZONE';

	private lines: string[];

	constructor(options: ICalTimeZoneOptions) {
		super();
		const { fromString } = options;
		this.lines = fromString.split('\n').map(l => l.trimEnd());
	}

	public getTimeZones = () => [];

	protected renderToLines = async () => this.lines;
}

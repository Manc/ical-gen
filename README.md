# ical-gen

[![Build Status][travis-image]][travis-url]
[![NPM version][npm-version-image]][npm-url]
[![Size][min-size-image]][npm-url]
[![MIT License][license-image]][license-url]

**ical-gen** is a super-small library that lets you easily create valid iCalendar files or feeds in Node.js.

**ical-gen** is a fork of the amazing [**ical-generator**](https://github.com/sebbo2002/ical-generator) library by Sebastian Pekarek, which has more features and is probably generally better supported by its author than this brand new library.

> Warning: This library is an early draft with only a small subset of features of the original and certainly not production ready. The API is likely to change significantly until the first stable release has been reached.

> Warning: This version of README relates to the latest push to the `main` branch on GitHub, not necessarily to the latest NPM package.


## 📦 Installation

```sh
yarn add ical-gen
# or
npm install ical-gen
```


## ⚡️ Quick Start

```typescript
import { ICalCalendar, ICalEvent } from 'ical-gen';

// Instantiate a new calendar component:
const calendar = new ICalCalendar({
	prodId: {
		company: 'My Company X',
		product: 'My Product Name',
		language: 'EN',
	},
	// ...add more calendar options if you like...
});

// Instantiate a new event component:
const event = new ICalEvent({
	uid: 'MyUniqueUID@example.com', // or supply a UUID
	// An event date can be represented either by a native JS Date and a time zone
	// string or, if you like, a Luxon DateTime object. Let's use a Date for the
	// start date:
	start: {
		date: new Date('2021-05-17T18:30:00Z')
		zone: 'Europe/London',
	},
	// And let's use a Luxon Datetime for the end date:
	end: DateTime.fromISO('2021-05-16T00:00:00Z', { zone: 'Europe/London' }),
	// For the stamp we can safely use a Date, because no time zone information is required.
	stamp: new Date('2021-05-16T00:00:00Z'),
	sequence: 1,
	summary: 'My Birthday Party',
});

// Add the event component as child of the calendar component:
calendar.addChild(event);
// or directly:
calendar.children.push(event);

// Render the iCalendar file or feed. This is asynchronous, because it enables
// us to do dynamic data fetching if needed, for example to resolve time zone
// components from a time zone database.
const ics = calendar.renderToString()
	.then(ics => {
		// Then do whatever you want with that string. Serve it over HTTP,
		// write it to a file, send it by email or print it to the console:
		console.log(ics);
	});
```


## Why another library?

Although the original **ical-generator** is great, it comes with support for several different third-party date libararies, HTTP server output, validation and more, which are not always needed. This convenience adds some bulk and may slow things down. Personally, I ran into some TypeScript issues using **ical-generator** without also installing third-party libraries in my project.

The goals for this library are:

- efficient and fast processing speed
- clean, simple and strict TypeScript API
- predictable results
- (near) zero dependencies for the production build


## Some differences

Some differences between **ical-generator** and **ical-gen** (this library):

- ~~This library only supports JavaScript-native `Date` objects as date. If you work with Moment.js, Day.js or Luxon, simply convert the date object to a native `Date` and apply the time zone string where applicable.~~
- Experimental: This library uses [Luxon](https://github.com/moment/luxon) `DateTime` objects internally and accepts either `DateTime` objects (with its time zone) or native JavaScript `Date` as event date input.
- The API will be completely rewritten. It will be modular, extensible, componsable, less opinionated, hopefully also cleaner, and with more predictable results. Examples:
  - If a property is required, it will be enforced by the TypeScript API right away instead of throwing a runtime error later down the line.
  - Class properties can usually be accessed and manipulated directly, which saves us a whole lot of getter, setter and other helper methods. As long as you know how to assign a new value to a variable or `push()` an item to an array, you can do everything you want.
- Every iCalendar component will be represented by its own component class, e.g. a root `ICalCalendar` component, that can have one or more `ICalEvent` child components as well as `ICalTimeZone` components.
- The way data is stored internally is different with an aim to be more efficient.
- **ical-generator** always generates a UUID string for the `UID` property when a new event is created, which you can then override with a custom value. With **ical-gen** you must always provide your own `UID` value. If you really, really need a universally unique value that is always different whenever you render the event (which you shouldn’t), apply your own UUID method.
- At least for now, this library is meant to be used in Node.js 11.15 or later, not in a browser environment.
- The render function returns a Promise. This allows any component to do async stuff on the fly if needed without blocking. For example, to resolve time zone data more efficiently.


## Todo:

- A lot more iCalendar components need to be implemented:
  - `ICalEvent` (it’s still a big mess and only a basic draft)
  - `ICalAlarm`
  - `ICalAttendee`
  - `ICalCategory`
  - and probably more
- More tests as more components are implemented
- Evaluate whether to keep Luxon or reduce to plain `Date`
- Provide a basic implementation for resolving time zone strings to iCalendar time zone components.



[npm-url]: https://npmjs.org/package/ical-gen
[npm-version-image]: https://img.shields.io/npm/v/ical-gen.svg?style=flat

[travis-url]: https://travis-ci.org/Manc/ical-gen
[travis-image]: https://img.shields.io/travis/Manc/ical-gen/main.svg?style=flat

[min-size-image]: https://img.shields.io/bundlephobia/min/ical-gen?style=flat

[license-url]: LICENSE
[license-image]: https://img.shields.io/badge/license-MIT-blue.svg?style=flat

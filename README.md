# ical-gen

[![Build Status][travis-image]][travis-url]
[![NPM version][npm-version-image]][npm-url]
[![Size][min-size-image]][npm-url]
[![MIT License][license-image]][license-url]

**ical-gen** is a super-small library that lets you easily create valid iCalendar files or feeds.

**ical-gen** is a fork of the amazing [**ical-generator**](https://github.com/sebbo2002/ical-generator) library by Sebastian Pekarek, which has more features and is probably generally better supported by its author than this brand new library.

> Warning: This library is an early draft with only a small subset of features of the original and certainly not production ready.


## Why another library?

Although the original **ical-generator** is great, it comes with support for several different third-party date libararies, HTTP server output, validation and more, which are not always needed. This convenience adds some bulk and may slow things down. Personally, I ran into some TypeScript issues using **ical-generator** without also installing third-party libraries in my project.

The goals for this library are:

- efficient and fast processing speed
- clean, simple and strict TypeScript API
- predictable results
- zero dependencies for the production build


## Some differences

Some differences between **ical-generator** and **ical-gen** (this library):

- This library only supports JavaScript-native `Date` objects as date. If you work with Moment.js, Day.js or Luxon, simply convert the date object to a native `Date` and apply the time zone string where applicable.
- Although the underlying logic is pretty much the same as that of **ical-generator**, the API is quite a bit different, but also cleaner, which should result in more predictable results.
  - For example, if a property is required, it will be enforced by the TypeScript API right away instead of throwing a runtime error later down the line.
  - Class properties can usually be accessed and manipulated directly, which saves us a whole lot of getter, setter and other helper methods. As long as you know how to assign a new value to a variable or `push()` an item to an array, you can do everything you want.
- The way data is stored internally is different with an aim to be more efficient.
- **ical-generator** always generates a UUID string for the `UID` property when a new event is created, which you can then override with a custom value. With **ical-gen** you must always provide your own `UID` value. If you really, really need a universally unique value that is always different whenever you render the event (which you shoudln’t), apply your own UUID method.


`ical-generator` is a small but fine library with which you can very easily create a valid iCal calendars, for example
to generate subscriptionable calendar feeds.


## 📦 Installation

```sh
yarn add ical-gen
# or
npm install ical-gen
```


## ⚡️ Quick Start

```typescript
import { ICalCalendar, ICalEvent } from 'ical-gen';

// Instantiate a new calendar object:
const calendar = new ICalCalendar({
	prodId: {
		company: 'My Company X',
		product: 'My Product Name',
		language: 'EN',
	},
	// ...add more calendar options if you like...
});

// Instantiate a new event object:
const event = new ICalEvent({
	uid: 'MyUniqueUID@example.com', // or supply a UUID
	timezone: 'Europe/London',
	start: new Date('2021-05-17T18:30:00Z'),
	end: new Date('2021-05-17T21:00:00Z'),
	sequence: 1,
	stamp: new Date('2021-05-16T00:00:00Z'),
	summary: 'My Birthday Party',
});

// Add the event to the calendar:
calendar.addEvent(event);
// or directly:
calendar.events.push(event);

// Render the iCalendar file or feed:
const ics = calendar.render();

// Then do whatever you want with that string. Serve it over HTTP,
// write it to a file, send it by email or print it to the console:
console.log(ics);
```



[npm-url]: https://npmjs.org/package/ical-gen
[npm-version-image]: https://img.shields.io/npm/v/ical-gen.svg?style=flat

[travis-url]: https://travis-ci.org/Manc/ical-gen
[travis-image]: https://img.shields.io/travis/Manc/ical-gen/master.svg?style=flat

[min-size-image]: https://img.shields.io/bundlephobia/min/ical-gen?style=flat

[license-url]: LICENSE
[license-image]: https://img.shields.io/badge/license-MIT-blue.svg?style=flat

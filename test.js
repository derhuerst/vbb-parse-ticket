#!/usr/bin/env node
'use strict'

const test  = require('tape')
const parse = require('./index')

const input = (name, price, tls) => {
	return {
		name,
		price: price * 100,
		shpCtx: JSON.stringify({TLS: tls})
	}
}

test('B0E', (t) => {
	t.plan(1)
	t.deepEqual(parse(input('foo', 1.23, 'B0E')), {
		  name:      'foo'
		, price:     1.23
		, amount:    1
		, reduced:   true
		, shortTrip: true
		, tariff:    'Berlin'
		, coverage:  'short trip'
		, variant:   'reduced'
	})
})

test('B3TK', (t) => {
	t.plan(1)
	t.deepEqual(parse(input('bar', 3.21, 'B3TK')), {
		  name:      'bar'
		, price:     3.21
		, amount:    1
		, fullDay:   true
		, group:     true
		, tariff:    'Berlin'
		, coverage:  'ABC'
		, variant:   '1 day, group'
	})
})

test('R4F', (t) => {
	t.plan(1)
	t.deepEqual(parse(input('baz', 1.32, 'R4F')), {
		  name:      'baz'
		, price:     1.32
		, amount:    1
		, bike:      true
		, tariff:    'rural area'
		, coverage:  '35-45km'
		, variant:   'bike'
	})
})

test('P2ME', (t) => {
	t.plan(1)
	t.deepEqual(parse(input('qux', 3.12, 'P2ME')), {
		  name:      'qux'
		, price:     3.12
		, amount:    4
		, reduced:   true
		, tariff:    'Potsdam'
		, coverage:  'BC'
		, variant:   '4x reduced'
	})
})

test('price in .prc', (t) => {
	t.plan(1)
	t.deepEqual(parse({
		name: 'foo',
		prc: 123,
		shpCtx: JSON.stringify({TLS: 'B0E'})
	}), {
		  name: 'foo'
		, price: 1.23
		, amount: 1
		, reduced: true
		, shortTrip: true
		, tariff: 'Berlin'
		, coverage: 'short trip'
		, variant: 'reduced'
	})
})

test('M0*', (t) => { // Szczecin/Stettin fares
	// see also derhuerst/vbb-hafas#26
	t.plan(1)
	t.deepEqual(parse(input('foo', 1.23, 'M0T')), {
		  name: 'foo'
		, price: 1.23
		, amount: 1
		, fullDay: true
		, tariff: 'Szczecin'
		, coverage: 'urban area'
		, variant: '1 day, adult'
	})
	// todo:
	// { name: 'Regeltarif',
	//   prc: 220,
	//   cur: 'EUR',
	//   shpCtx: '{"FV":"VBB-1","TC":"Bartarif","SW":"3473","ZW":"3473","TLS":"M0P","VT":""}' }
	// { name: 'Ermäßigungstarif',
	//   prc: 160,
	//   cur: 'EUR',
	//   shpCtx: '{"FV":"VBB-1","TC":"Bartarif","SW":"3473","ZW":"3473","TLS":"M0EP","VT":""}' }
	// { name: 'Ermäßigungstarif',
	//   prc: 190,
	//   cur: 'EUR',
	//   shpCtx: '{"FV":"VBB-1","TC":"Bartarif","SW":"3473","ZW":"3473","TLS":"M0TE","VT":""}' }
	// { name: 'Standard',
	//   prc: 640,
	//   cur: 'EUR',
	//   shpCtx: '{"FV":"VBB-1","TC":"Bartarif","SW":"3473","ZW":"3473","TLS":"M0TK","VT":""}' }
})

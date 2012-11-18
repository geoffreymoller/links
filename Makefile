test:
	./node_modules/.bin/testacular start testacular.conf.js 
testAll:
	./node_modules/.bin/testacular start --browsers='Chrome','Safari','Firefox','Opera','PhantomJS' testacular.conf.js 
.PHONY: test

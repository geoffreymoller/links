test:
	./node_modules/.bin/testacular config.js
testAll:
	./node_modules/.bin/testacular --browsers='Chrome','Safari','Firefox','Opera','PhantomJS' config.js
.PHONY: test

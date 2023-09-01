develop:
	npx webpack serve

install:
	npm ci

run:
	npm start

build:
	NODE_ENV=production npx webpack

test:
	npm test

lint:
	npx eslint .

.PHONY: test

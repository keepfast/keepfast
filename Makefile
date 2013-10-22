NODE_LIBS=NODE_PATH=.:./lib/:$(NODE_PATH)
NODE_EXEC=$(NODE_LIBS) ./node_modules/.bin/

run: node_modules
	$(NODE_LIBS) node server.js

node_modules:
	npm install

console: node_modules
	$(NODE_LIBS) node

clean:
	rm -rf ./node_modules/

.PHONY:

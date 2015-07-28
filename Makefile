build: dist/ng-email-list.min.js
	@echo "Build Complete"
dist/ng-email-list.min.js: dist/ng-email-list.js
	uglifyjs dist/ng-email-list.js -o dist/ng-email-list.min.js
dist/ng-email-list.js: src/bundle.js src/emailList.js
	browserify src/bundle.js -o dist/ng-email-list.js
test:
	./node_modules/.bin/karma start
clean:
	rm dist/*

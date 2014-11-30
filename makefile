
bin = ./node_modules/.bin/

test:
	@$(bin)mocha \
		--harmony-generators \
		--reporter dot

.PHONY: test

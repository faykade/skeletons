
# Variables
BUILD = target

# Rules
all: setup hello world combine display

#@ sign suppresses the rule being output
setup:
	@\mkdir -p $(BUILD)

hello:
	@\echo "Hello" > $(BUILD)/hello.txt

world:
	@\echo "World" > $(BUILD)/world.txt

combine:
	@\cat $(BUILD)/hello.txt $(BUILD)/world.txt > $(BUILD)/combined.txt

display:
	@\cat $(BUILD)/combined.txt

clean:
	\rm -rf $(BUILD)

rebuild: clean all

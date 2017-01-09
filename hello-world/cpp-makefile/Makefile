# Variables
EXECUTABLE = HelloWorld
EXECUTABLE_DIR = exe
SOURCE_DIR = src
OBJECT_DIR = build


# Define the list of files to compile for this project. Defaults to all
# of the .cpp files in the source directory.
CPPFILES = $(wildcard $(SOURCE_DIR)/*.cpp)

# For each of the .cpp files found above, determine the name of the
# corresponding .o file to create.
OBJFILES = $(addprefix $(OBJECT_DIR)/,  $(notdir $(CPPFILES:.cpp=.o)))

# The command to run for the C++ compiler and linker
CC = g++

# Basic C++ compiler arguments
CFLAGS = -g -c -Wall

# Basic C++ linker arguments
LDFLAGS = -g

# Rules
all: setup $(EXECUTABLE)

rebuild: clean all

# Create the object_files directory only if it does not exist.
setup: | $(OBJECT_DIR)

$(OBJECT_DIR):
	\mkdir -p $(OBJECT_DIR)
	\mkdir -p $(EXECUTABLE_DIR)

$(EXECUTABLE): $(OBJFILES)
	$(CC) $(LDFLAGS) $(OBJFILES) -o $(EXECUTABLE_DIR)/$@

$(OBJECT_DIR)/%.o: $(SOURCE_DIR)/%.cpp
	$(CC) $(CFLAGS) -o $@ $<

clean:
	\rm -rf $(OBJECT_DIR) $(EXECUTABLE_DIR) $(EXECUTABLE)

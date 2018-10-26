CONTEXT=sdl2
#CONTEXT=glfw3

CXXFLAGS += -DFENETRE_$(CONTEXT)
CXXFLAGS += -g -W -Wall -Wno-unused-parameter -Wno-deprecated-declarations -Wvla -pedantic -std=c++11
CXXFLAGS += $(shell pkg-config --cflags glew)
CXXFLAGS += $(shell pkg-config --cflags $(CONTEXT))

LDFLAGS += -g
LDFLAGS += $(shell pkg-config --libs glew)
LDFLAGS += $(shell pkg-config --libs $(CONTEXT))

ifeq "$(shell uname)" "Darwin"
  LDFLAGS += -framework OpenGL
  ifeq "$(CONTEXT)" "glfw3"
    LDFLAGS += -lobjc -framework Foundation -framework Cocoa
  endif
endif

TP="tp1"
SRC=vanilla3DObjects

exe : $(SRC).exe
run : exe
	./$(SRC).exe
$(SRC).exe : $(SRC).cpp *.h
	$(CXX) $(CXXFLAGS) -o$@ $(SRC).cpp Image.cpp ImageHeader.cpp Pixel.cpp Etat.cpp $(LDFLAGS)

sol :  ; make SRC=$(SRC)Solution exe
runs : ; make SRC=$(SRC)Solution run

clean :
	rm -rf *.o *.exe *.exe.dSYM *.bmp

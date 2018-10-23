#include <iostream>
#include <string>
#include<typeinfo>

#include "ImageParser.h"
#include "Comparator.h"

const static uint8_t EXPECTED_ARGC_VALUES[2] = { 4, 5 };

void help() {
	std::cout << std::endl << "Le programme s'utilise ainsi:" << std::endl
		<< "img-diff-generator [./path/to/compared/file#1] [./path/to/compared/file#2] [./path/to/output/file] [options]" << std::endl
		<< "OPTIONS" << std::endl
		<< "-partiel : ne pas agrandir les pixels différents avec un rayon de 36px" << std::endl << std::endl;
}

int main(int argc, char *argv[])
{
	if (argc != EXPECTED_ARGC_VALUES[0]
		&& argc != EXPECTED_ARGC_VALUES[1]) {
		
		help();
		return -1;
	}

	try
	{
		Comparator comparator;
		if (argc == EXPECTED_ARGC_VALUES[1]) {
			comparator.InterpretOptionStrings(argv[4]);
		}

		comparator.compare(argv[1], argv[2]);
		comparator.saveDiffTo(argv[3]);
	}
	catch (const std::exception & e)	{
		std::cerr << typeid(e).name() << ": " << std::endl
			<< e.what() << std::endl;
		return -1;
	}

	return 0;
}
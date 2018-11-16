#include <iostream>
#include <string>
#include<typeinfo>

#include "ImageParser.h"
#include "Comparator.h"

const static uint8_t EXPECTED_ARGC_VALUES[2] = { 4, 5 };

void help() {
	std::cout << std::endl << "Le programme s'utilise ainsi:" << std::endl
		<< "bmpdiff <file#1> <file#2> <sortie> <options>" << std::endl
		<< "OPTIONS" << std::endl
		<< "-partiel : ne pas agrandir les pixels différents avec un rayon de 36px" << std::endl << std::endl;
}

std::string getAbsolutePath( const char * argv0) 
{
    const char * PROGRAM_NAME = "bmpdiff";

    std::string absoluteRef(argv0);
    absoluteRef = absoluteRef.substr(0, absoluteRef.find(PROGRAM_NAME));

    return absoluteRef;
}

int main(int argc, char *argv[])
{
	if (argc != EXPECTED_ARGC_VALUES[0]
		&& argc != EXPECTED_ARGC_VALUES[1]) {
		
		help();
		return -1;
	}

	const std::string absolutePath = getAbsolutePath(argv[0]);

	try
	{
		Comparator comparator;
		if (argc == EXPECTED_ARGC_VALUES[1]) {
			comparator.InterpretOptionStrings(argv[4]);
		}

		comparator.compare(
			(absolutePath + argv[1]).data(),
			(absolutePath + argv[2]).data()
		);

		comparator.saveDiffTo((absolutePath + argv[3]).data());
	}
	catch (const std::exception & e)	{
		std::cerr << typeid(e).name() << ": " << std::endl
			<< e.what() << std::endl;
		return -1;
	}

	return 0;
}
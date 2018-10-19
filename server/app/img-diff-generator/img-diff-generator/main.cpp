#include <iostream>
#include <string>
#include "ImageParser.h"
#include "Comparator.h"

using namespace std;

const static uint8_t EXPECTED_ARGC_VALUES[2] = { 4, 5 };

void cleanup(const std::exception &e) {
	cerr << e.what() << endl;
	_fcloseall();
	exit(-1);
}

int main(int argc, char *argv[])
{
	if (argc != EXPECTED_ARGC_VALUES[0]
		|| argc != EXPECTED_ARGC_VALUES[1]) {
		
		char* PROGRAM_NAME = _strdup("img-diff-generator");


		ifstream file("./Debug/comp1B64.txt", ios::in | ios::ate | ios::binary);
		if (!file.is_open())
		{
			throw std::runtime_error("Could not open \"./Debug/comp1B64.txt\" for input");
		}

		long fileSize = file.tellg();
		file.seekg(0);

		char* data = new char[fileSize + 1];
		file.read(data, fileSize);
		file.close();

		char* IMAGE1_FILENAME = _strdup(data);

		delete[] data;
		data = nullptr;
		
		char* IMAGE2_FILENAME = _strdup("./Debug/comp2.bmp");
		char* DIFF_FILENAME = _strdup("./Debug/diff.bmp");
		char* OPTION = _strdup("-partiel");

		char * argvBuff[5] = { PROGRAM_NAME, IMAGE1_FILENAME, IMAGE2_FILENAME, DIFF_FILENAME, OPTION };

		argc = EXPECTED_ARGC_VALUES[1]; //with partial option
		argv = argvBuff;
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
	catch (const std::runtime_error & e)	{
		cerr << "Runtime error:" << endl;
		cleanup(e);
	}
	catch (const std::invalid_argument & e)	{
		cerr << "Invalid argument: " << endl;
		cleanup(e);
	}
	catch (const std::out_of_range & e)	{
		cerr << "Out of range: " << endl;
		cleanup(e);
	}
	catch (const std::exception & e)	{
		cerr << "Generic exception: " << endl;
		cleanup(e);
	}
	catch (...)	{
		cerr << "Unknown exception" << endl;
		cleanup(std::exception());
	}

	return 0;
}
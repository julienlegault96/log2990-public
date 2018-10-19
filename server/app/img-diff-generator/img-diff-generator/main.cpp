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

		FILE * file;

		if (fopen_s(&file,
			"C:\\Users\\papal\\Documents\\Travail\\LOG2990 - Projet 2\\server\\app\\img-diff-generator\\img-diff-generator\\Debug\\comp1B64.txt", "rb"))
		{
			throw std::runtime_error("File opening error, could not open test base64 file");
		}

		fseek(file, 0, SEEK_END);
		long fileSize = ftell(file);
		fseek(file, 0, SEEK_SET);

		char * data = new char[fileSize + 1];
		fread(data, fileSize, 1, file);
		fclose(file);

		char* IMAGE1_FILENAME = _strdup(data);

		delete[] data;
		data = nullptr;
		//"C:\\Users\\papal\\Documents\\Travail\\LOG2990 - Projet 2\\server\\app\\img-diff-generator\\img-diff-generator\\Debug\\comp1.bmp");
		//"C:\\Users\\Kevin\\Documents\\PolyMTL\\Session 4\\LOG2990\\log2990\\server\\app\\img-diff-generator\\Debug\\comp1.bmp");
		char* IMAGE2_FILENAME = _strdup(
			"C:\\Users\\papal\\Documents\\Travail\\LOG2990 - Projet 2\\server\\app\\img-diff-generator\\img-diff-generator\\Debug\\comp2.bmp");
		//"C:\\Users\\Kevin\\Documents\\PolyMTL\\Session 4\\LOG2990\\log2990\\server\\app\\img-diff-generator\\Debug\\comp2.bmp");
		char* DIFF_FILENAME = _strdup(
			"C:\\Users\\papal\\Documents\\Travail\\LOG2990 - Projet 2\\server\\app\\img-diff-generator\\img-diff-generator\\Debug\\diff.bmp");

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
		comparator.saveTo(argv[3]);
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
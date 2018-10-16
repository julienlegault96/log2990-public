#include <iostream>
#include <string>
#include "ImageParser.h"
#include "Comparator.h"

using namespace std;

const static uint8_t EXPECTED_ARGC_VALUES[2] = { 3,4 };

int main(int argc, char *argv[])
{
	if (argc != EXPECTED_ARGC_VALUES[0]
		|| argc != EXPECTED_ARGC_VALUES[1]) {

		char* IMAGE1_FILENAME = _strdup(
		"C:\\Users\\papal\\Documents\\Travail\\LOG2990 - Projet 2\\server\\app\\img-diff-generator\\img-diff-generator\\Debug\\comp1.bmp");
		//"C:\\Users\\Kevin\\Documents\\PolyMTL\\Session 4\\LOG2990\\log2990\\server\\app\\img-diff-generator\\Debug\\comp1.bmp";
		char* IMAGE2_FILENAME = _strdup(
			"C:\\Users\\papal\\Documents\\Travail\\LOG2990 - Projet 2\\server\\app\\img-diff-generator\\img-diff-generator\\Debug\\comp2.bmp");
		//"C:\\Users\\Kevin\\Documents\\PolyMTL\\Session 4\\LOG2990\\log2990\\server\\app\\img-diff-generator\\Debug\\comp2.bmp";
		char* DIFF_FILENAME = _strdup(
			"C:\\Users\\papal\\Documents\\Travail\\LOG2990 - Projet 2\\server\\app\\img-diff-generator\\img-diff-generator\\Debug\\diff.bmp");
		char * argvBuff[3] = { IMAGE1_FILENAME,  IMAGE2_FILENAME, DIFF_FILENAME };

		argv = argvBuff;
	}

	try
	{
		Comparator comparator;
		if (argc == EXPECTED_ARGC_VALUES[1]) {
			comparator.InterpretOptionStrings(argv[3]);
		}

		comparator.compare(argv[0], argv[1]);
		comparator.saveTo(argv[2]);
	}
	catch (const std::runtime_error & e)	{
		cerr << "Runtime error:" << endl;
		cerr << e.what() << endl;
		return -1;
	}
	catch (const std::invalid_argument & e)	{
		cerr << "Invalid argument: " << endl;
		cerr << e.what() << endl;
		return -1;
	}
	catch (const std::out_of_range & e)	{
		cerr << "Out of range: " << endl;
		cerr << e.what() << endl;
		return -1;
	}
	catch (const std::exception & e)	{
		cerr << "Generic exception: " << endl;
		cerr << e.what() << endl;
		return -1;
	}
	catch (...)	{
		cerr << "Unknown exception" << endl;
		return -1;
	}

	return 0;
}
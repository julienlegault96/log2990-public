#include "base64.h"

/**
* base64_encode - Base64 encode
* @src: Data to be encoded
* @len: Length of the data to be encoded
* @out_len: Pointer to output length variable, or %NULL if not used
* Returns: Allocated buffer of out_len bytes of encoded data,
* or empty string on failure
*/
std::string base64::encode(const unsigned char *src, size_t len)
{
	unsigned char *out, *pos;
	const unsigned char *end, *in;

	size_t olen;

	olen = 4 * ((len + 2) / 3); /* 3-byte blocks to 4-byte */

	if (olen < len)
		return std::string(); /* integer overflow */

	std::string outStr;
	outStr.resize(olen);
	out = (unsigned char*)&outStr[0];

	end = src + len;
	in = src;
	pos = out;
	while (end - in >= 3) {
		*pos++ = BASE64_TABLE[in[0] >> 2];
		*pos++ = BASE64_TABLE[((in[0] & 0x03) << 4) | (in[1] >> 4)];
		*pos++ = BASE64_TABLE[((in[1] & 0x0f) << 2) | (in[2] >> 6)];
		*pos++ = BASE64_TABLE[in[2] & 0x3f];
		in += 3;
	}

	if (end - in) {
		*pos++ = BASE64_TABLE[in[0] >> 2];
		if (end - in == 1) {
			*pos++ = BASE64_TABLE[(in[0] & 0x03) << 4];
			*pos++ = '=';
		}
		else {
			*pos++ = BASE64_TABLE[((in[0] & 0x03) << 4) |
				(in[1] >> 4)];
			*pos++ = BASE64_TABLE[(in[1] & 0x0f) << 2];
		}
		*pos++ = '=';
	}

	return outStr;
}

std::string base64::decode(const void* data, const size_t len)
{
	unsigned char* p = (unsigned char*)data;
	int pad = len > 0 && (len % 4 || p[len - 1] == '=');
	const size_t L = ((len + 3) / 4 - pad) * 4;
	std::string str(L / 4 * 3 + pad, '\0');

	for (size_t i = 0, j = 0; i < L; i += 4)
	{
		int n = BASE64_INDEX[p[i]] << 18 | BASE64_INDEX[p[i + 1]] << 12 | BASE64_INDEX[p[i + 2]] << 6 | BASE64_INDEX[p[i + 3]];
		str[j++] = n >> 16;
		str[j++] = n >> 8 & 0xFF;
		str[j++] = n & 0xFF;
	}
	if (pad)
	{
		int n = BASE64_INDEX[p[L]] << 18 | BASE64_INDEX[p[L + 1]] << 12;
		str[str.size() - 1] = n >> 16;

		if (len > L + 2 && p[L + 2] != '=')
		{
			n |= BASE64_INDEX[p[L + 2]] << 6;
			str.push_back(n >> 8 & 0xFF);
		}
	}
	return str;
}
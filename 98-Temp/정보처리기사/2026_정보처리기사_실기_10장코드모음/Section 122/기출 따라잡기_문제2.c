#include <stdio.h>
#include <string.h>
void inverse(char *str, int len) {
	for(int i = 0, j = len - 1; i < j; i++, j--) {
		char ch = str[i];
		str[i] = str[j];
		str[j] = ch;
	}
}
int main() {
	char str[100] = "ABCDEFGH";
	int len = strlen(str);
	inverse(str, len);
	for(int i = 1; i < len; i += 2) {
		printf("%c", str[i]);
	}
	return 0;
}
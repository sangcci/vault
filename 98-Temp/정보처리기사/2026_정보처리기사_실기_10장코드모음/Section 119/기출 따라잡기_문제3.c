#include <stdio.h>
#include <stdlib.h>
main(int argc, char *argv[]) {
	int v1 = 0;
	int v2 = 35;
	int v3 = 29;
	if (v1 > v2 ? v2 : v1)
		v2 = v2 << 2;
	else
		v3 = v3 << 2;
	printf("%d", v2 + v3);
	return 0;
}
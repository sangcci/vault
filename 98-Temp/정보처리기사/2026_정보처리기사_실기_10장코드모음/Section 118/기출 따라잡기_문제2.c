#include <stdio.h>
main()
{
	int i = 10, j = 10, k = 30;
	i /= j;
	j -= i;
	k %= j;
	printf("%d, %d, %d\n", i, j, k);
}
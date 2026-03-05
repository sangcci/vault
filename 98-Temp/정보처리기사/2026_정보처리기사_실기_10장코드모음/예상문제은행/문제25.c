#include <stdio.h>
#include <stdlib.h>
struct node {
	int p;
	struct node* n;
};
int main( ) {
	struct node a = {1, NULL};
	struct node b = {2, NULL};
	struct node c = {3, NULL};
	a.n = &b; b.n = &c; c.n = NULL;
	c.n = &a; a.n = &b; b.n = NULL;
	struct node* head = &c;
	printf("%d %d %d", head -> p, head -> n -> p, head -> n -> n -> p);
	return 0;
}
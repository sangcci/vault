a = [1, 2, 3, 4, 5]
x = 100
if x == 10:
	a = list(map(lambda num : num + 10, a))
elif x == 50:
	a = list(map(lambda num : num + 50, a))
else:
	a = list(map(lambda num : num + 100, a))
print(a)
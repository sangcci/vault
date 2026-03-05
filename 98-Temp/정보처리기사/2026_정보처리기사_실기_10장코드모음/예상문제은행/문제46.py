def cnt(str, p):
	result = 0;
	for i in range(len(str)):
		sub = str[i:i+len(p)]
		if sub == p:
			result += 1
	return result
str = "abdcabcabca"
p1 = "ca"
p2 = "ab"
print(f'ab{cnt(str, p1)} ca{cnt(str, p2)}')
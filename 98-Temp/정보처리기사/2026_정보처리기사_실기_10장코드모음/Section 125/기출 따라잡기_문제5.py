class CharClass:
	a = [ 'Seoul', 'Kyeongi', 'Inchon', 'Daejeon', 'Daegu', 'Pusan'];
myVar = CharClass()
str01 = ' '
for i in myVar.a:
	str01 = str01 + i[0]
print(str01)
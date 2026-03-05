a = {'apple', 'lemon', 'banana'}
a.update( {'kiwi', 'banana'} )
a.remove('lemon')
a.add('apple')
for i in a:
	print("과일명 : %s" % i)
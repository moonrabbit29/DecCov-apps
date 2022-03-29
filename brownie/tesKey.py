a="MFswDQYJKoZIhvcNAQEBBQADSgAwRwJAdlIpukyaJ+1NJLRmi5HKe8NQmscZKwJL \
hz4lwi2YE5T/04pfbolGYxwtKztyL95OXzGzCBZZpwLClVJU0Xf7QwIDAQAB"

if __name__ == "__main__" : 
   tes = [a[i:i+62] for i in range(0, len(a), 62)]
   bytes1,bytes2 = tes[0].encode('utf-8'),tes[1].encode('utf-8')
   #"0x%x" % (int('00100001', 2))
   print(tes)
   print(bytes1.hex())
   print(bytes2.hex())

   print("REVERT")


#!/usr/bin/env python
import socket
import time
import random

class DataFaker:
    def __init__(self, kind, value_dev = (500, 80)):
        self.kind = kind
        self.last_time = 4000
        self.value_dev = value_dev

    def get_data(self):
        self.last_time += 1
        val = random.gauss(self.value_dev[0], self.value_dev[1])
        return "T:%d, %s, %d\n" % (self.last_time, self.kind, val)
        


dataFaker = DataFaker('P')

connection = socket.create_connection(("localhost", 3001))

while True:
    connection.send(dataFaker.get_data())
    time.sleep(random.randint(0, 2))
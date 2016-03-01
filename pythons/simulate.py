__author__ = 'monica_wang'
from ultimatepoker import Game
import sys
import json

try:
    simulateTimes = int(sys.argv[1])
except IndexError or ValueError:
    print "Error: Input simulations times. Usage: python simulate.py [times]"
    exit(1)


totalGain = 0
totalBet = 0

# Construct blind bet table
'''
Input Json from stdin
{
    "TWO_PAIR": 0.0,
    "THREE_OF_A_KIND": 99.0,
    "STRAIGHT": 1.0,
    "FLUSH": 1.5,
    "FULL_HOUSE": 3.0,
    "FOUR_OF_A_KIND": 10.0,
    "STRAIGHT_FLUSH": 50.0,
    "ROYAL_FLUSH": 500.0
}
'''
from BlindBetTable import BlindBet
from hand import Str2Type
blindTableJson = json.load(sys.stdin)
for k in blindTableJson.keys():
    if k not in Str2Type:
        raise Exception("Illegal Input")
    BlindBet.Table[Str2Type[k]] = blindTableJson[k]


for i in range(simulateTimes):
    game = Game(False)
    gain, bet = game.playGame()
    totalGain += gain
    totalBet += bet


print json.dumps({'gain': totalGain, 'bet': totalBet, 'ratio': totalGain/totalBet})


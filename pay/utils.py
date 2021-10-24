import random

def random_username():
    f = open("assets/names.txt", "r").read().split('\n')
    return random.choice(f)
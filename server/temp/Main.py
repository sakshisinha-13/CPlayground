# Write your code here.
from collections import deque

def wordLadder(beginWord, endWord, wordList):
    wordSet = set(wordList)
    if endWord not in wordSet:
        return 0

    queue = deque()
    queue.append((beginWord, 1))

    while queue:
        word, level = queue.popleft()
        if word == endWord:
            return level

        for i in range(len(word)):
            for ch in 'abcdefghijklmnopqrstuvwxyz':
                newWord = word[:i] + ch + word[i+1:]
                if newWord in wordSet:
                    queue.append((newWord, level + 1))
                    wordSet.remove(newWord)  # Avoid revisiting

    return 0

# Sample Inputs
beginWord = "hit"
endWord = "cog"
wordList = ["hot","dot","dog","lot","log","cog"]

# Function Call
print(wordLadder(beginWord, endWord, wordList))

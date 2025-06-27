// Write your code here.
#include <iostream>
#include <vector>
#include <string>
#include <map>
#include <climits>
#include <algorithm>
using namespace std;

int minWordTransform(string start, string target, map<string, int> &mp) {
    if (start == target) return 1;

    mp[start] = 1;
    int mini = INT_MAX;

    for (int i = 0; i < start.size(); i++) {
        char originalChar = start[i];

        for (char ch = 'a'; ch <= 'z'; ch++) {
            if (ch == originalChar) continue;

            start[i] = ch;

            if (mp.find(start) != mp.end() && mp[start] == 0) {
                int next = minWordTransform(start, target, mp);
                if (next != INT_MAX)
                    mini = min(mini, 1 + next);
            }
        }

        start[i] = originalChar;
    }

    mp[start] = 0;  // backtrack
    return mini;
}

int wordLadder(string start, string target, vector<string>& arr) {
    map<string, int> mp;
    for (auto &word : arr) {
        mp[word] = 0;
    }

    int res = minWordTransform(start, target, mp);
    return res == INT_MAX ? 0 : res;
}

int main() {
    int n;
    string start, target;
    cin >> start >> target >> n;

    vector<string> arr(n);
    for (int i = 0; i < n; ++i) cin >> arr[i];

    cout << wordLadder(start, target, arr) << endl;
    return 0;
}
#include <iostream>
#include <vector>
using namespace std;

void generateParentheses(int n, int open, int close, string current, vector<string>& result) {
    if (current.length() == 2 * n) {
        result.push_back(current);
        return;
    }

    if (open < n)
        generateParentheses(n, open + 1, close, current + '(', result);

    if (close < open)
        generateParentheses(n, open, close + 1, current + ')', result);
}

vector<string> generateParentheses(int n) {
    vector<string> result;
    generateParentheses(n, 0, 0, "", result);
    return result;
}

int main() {
    int n;
    cin >> n;

    vector<string> result = generateParentheses(n);
    cout << "[";
    for (int i = 0; i < result.size(); i++) {
        cout << "\"" << result[i] << "\"";
        if (i != result.size() - 1)
            cout << ",";
    }
    cout << "]" << endl;

    return 0;
}


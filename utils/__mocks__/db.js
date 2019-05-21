const getSigners = jest.fn(() =>
    Promise.resolve({
        rowCount: 2,
        rows: [{ signature: "abc", userid: 1 }, { signature: "def", userid: 2 }]
    })
);
exports.modules = getSigners;

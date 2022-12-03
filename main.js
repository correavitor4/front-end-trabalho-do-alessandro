

let queries = [];
let queriesNumber = 0;

const startQueries = () => {
    initIndex = queriesNumber;
    queriesNumber += getQueriesNumber();
    for (let i = initIndex; i < queriesNumber; i++) {
        const query = new Query(i);
        queries.push(query);
    }
}

const getQueriesNumber = () => {
    return Math.random() * 10;
}
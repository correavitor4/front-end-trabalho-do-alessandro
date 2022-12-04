

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

const queryRowClicked = (rowId) => {
    queriesIndex = rowId.replace("queriesTableRow", "");
    queries[queriesIndex].select();
}

const getQueriesNumber = () => {
    return Math.random() * 10;
}

const selectQueriesTableRow = (rowId) => {
    let queryCellOfRow = document.getElementById("queriesTableRow"+rowId);
    let input = document.getElementById("req-sel")
    document.getElementById("queriesTableRow"+rowId).addEventListener("click", () => {
        input.innerHTML = queryCellOfRow.innerHTML;
    })  
    // window.alert("row clicked");
}
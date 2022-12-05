let queries = [];
let queriesNumber = 0;
let memoryItems = [];


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

const efetivarBtnClicker = () => {
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
        if(xhr.readyState == 4 && xhr.status == 200){
            window.alert("Requisição efetivada com sucesso!  A competição entre os workers irá começar");
            let response = JSON.parse(xhr.response).assets;
            let memoryItemsCount = 0;
            response.forEach(element => {
                let item = {
                    id: memoryItemsCount,
                    name: element.companyName,
                    symbol: element.symbol,
                    owner: element.owner,
                    toSell: true,
                };
                memoryItems.push(item);
                memoryItemsCount++;
            });
            startCompetition();
        }
        else if(xhr.readyState == 4 && xhr.status != 200){
            window.alert("Requisição não efetivada! Http status code: " + xhr.status);
        }
    }
    let req =  document.getElementById("req-sel").innerHTML
    xhr.open("GET", req, true);
    xhr.send();
}

document.getElementById("efetBtn").addEventListener("click", efetivarBtnClicker);

const startCompetition = async () => {
    // Define arrays
    let workers = [];
    let orders = [];

    // Define workers, define onMessage, start them and push them to workers array
    for(let i=0; i<5; i++){
        let w = new Worker("worker.js");
        w.onmessage = async (e) => {
            if(e.data.message == "buy"){
                let buyOrder = {
                    type: "buy",
                    assetId: e.data.assetId,
                    workerId: e.data.workerId
                }
                orders.push(buyOrder);
                return;
            }

            if(e.data.message == "sell"){
                let sellOrder = {
                    type: "sell",
                    assetId: e.data.assetId,
                    workerId: e.data.workerId
                }
                orders.push(sellOrder);
                return;
            }
        }
        
        let e = {
            message: "start",
            memoryItems: memoryItems,
            index: i,
        }
        w.postMessage(e);
        workers.push(w);
    }
    
    console.log("Workers defined: " + workers);
    console.log("Memory items defined: " + memoryItems);
    while(true){
        if(orders.length > 0){
            let order = orders.shift();
            if(order.type == "buy"){
                if(!memoryItems[order.assetId].toSell){
                    workers[order.workerId].postMessage(
                        {
                            message: "cannot buy",
                            memoryItems: memoryItems,
                            description: "asset" +memoryItems[order.assetId].name+ "already sold to another worker"
                        }
                    );
                    continue;
                }
                memoryItems[order.assetId].toSell = false;
                memoryItems[order.assetId].owner = order.workerId;
                workers[order.workerId].postMessage({
                    message: "bought",
                    memoryItems: memoryItems,
                    description: "asset "+ memoryItems[order.assetId].name +" bought successfully"
                });
            }
            if(order.type == "sell"){
                if(memoryItems[order.assetId].toSell){
                    workers[order.workerId].postMessage(
                        {
                            message: "cannot sell",
                            memoryItems: memoryItems,
                            description: "asset already is on sale"
                        }
                    );
                    continue;
                }
                memoryItems[order.assetId].toSell = true;
                workers[order.workerId].postMessage({
                    message: "sold",
                    memoryItems: memoryItems,
                    description: "asset "+ memoryItems[order.assetId].name +" sold successfully"
                })
            }
        }
        await delay(700);
    }
}


const delay = (time) => {
    return new Promise(resolve => setTimeout(resolve, time));
}

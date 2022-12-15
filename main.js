let queriesNumber = 0;
let memoryItems = [];
var query = new Query();
var page =1;


const nextButtonClicked = () => {
    query.createBaseRequest(page+1);
    page++;
}

const prevButtonClicked = () => {
    if(page < 2){
        window.alert("Não é possível voltar para a página anterior, pois a página atual é a primeira");
        return
    }
    query.createBaseRequest(page-1);
    page--;
}


const startQueries = () => {
     
     query.createBaseRequest(1);
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
    createBaseRequest();
}

const getRandomInt = (min,max) => {
    min = Math.floor(min);
    max = Math.floor(max+1);
    return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}

const createBaseRequest = () => {
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
        if (xhr.readyState == 4 && xhr.status == 200) {
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
    }
    
    var page = getRandomInt(1,10);
    var req = `http://localhost:5251/assets?page=${page}`;
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

document.getElementById("nextButton").addEventListener("click", nextButtonClicked);
document.getElementById("prevButton").addEventListener("click", prevButtonClicked);
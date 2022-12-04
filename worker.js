
let workerId;

// Receives messages from the main thread
this.onmessage = (e) => {
    if(e.data.message == "start"){
        workerId = e.data.index;
        console.log("Worker " + workerId + " started");
        decision(e.data.memoryItems);
    }

    if(e.data.message == "cannot buy"){
        console.log("Worker " + workerId + " cannot buy:" + e.data.description);
        decision(e.data.memoryItems);
    }

    if(e.data.message == "bought"){
        console.log("Worker " + workerId + " bought:" + e.data.description);
        decision(e.data.memoryItems);
    }

    if(e.data.message == "cannot sell"){
        console.log("Worker " + workerId + " cannot sell:" + e.data.description);
        decision(e.data.memoryItems);
    }
    if(e.data.message == "sold"){
        console.log("Worker " + workerId + " sold:" + e.data.description);
        decision(e.data.memoryItems);
    }
}

// Decides what to do (sell or buy)
const decision = (memoryItems) => {
    let dec = getRandomInt(1,2);
    let myAssetsCount = 0;

    memoryItems.forEach(element => {
        if(element.owner == workerId){
            myAssetsCount++;
        }
    });

    if(myAssetsCount == 0){
        buy(memoryItems);
        return;
    }

    switch(dec){
        case 1:
            buy(memoryItems);
            break;
        case 2:
            sell(memoryItems);
            break;
    }
}

// Returns a random integer between min and max
const getRandomInt = (min,max) => {
    min = Math.floor(min);
    max = Math.floor(max+1);
    return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}

// Buy an asset
const buy = (memoryItems) => {
    let cont = true;
    while(cont){
        memoryItems.forEach(element => {
            if(cont){
                if(element.toSell){
                    let e = {
                        message: "buy",
                        assetId: element.id,
                        workerId: workerId,
                    }
                    this.postMessage(e);
                    cont = false;
                }
            }
        });
    }
}

// Sell an asset
const sell = (memoryItems) => {
    let cont = true;
    while(cont){
        memoryItems.forEach(element => {
            if(cont){
                if(element.owner == workerId){
                    if(randomYesOrNot()){
                        let e = {
                            message: "sell",
                            assetId: element.id,
                            workerId: workerId,
                        }
                        this.postMessage(e);
                        cont = false;
                    }
                }
            }
        });
    }
}

// Returns true or false randomly
const randomYesOrNot = () => {
    let dec = getRandomInt(1,2);
    if(dec == 1){
        return true;
    }
    else{
        return false;
    }
}
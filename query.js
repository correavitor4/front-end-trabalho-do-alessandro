class Query{
    constructor(queryIndex){
        this.queryIndex = queryIndex
        this.queriesTable = document.getElementById('queriesTable');
        this.resultsTable = document.getElementById('resultsTable');
        
        this.queryResponse = null;
        // this.createNewRowInEachTable();
    }

    // createNewRowInEachTable(){
    //     this.queriesTable.insertRow(this.queryCounter).innerHTML = `<td id="${"queriesTableRow"+this.queryIndex}">${"Iniciando Requisição"}</td>`;
    //     this.resultsTable.insertRow(this.queryCounter).innerHTML = `<td id="${"resultsTableRow"+this.queryIndex}">${"..."}</td>`;
    //     selectQueriesTableRow(this.queryIndex);
    // }

    createRandomRequest(){
        var res = this.getRandomInt(1,2);
        switch(res){
            case 1:
                this.createBaseRequest();
                break;
            case 2:
                this.createRequestByCompanyName();
                break;
        }
    }

    createBaseRequest(page){
        this.queriesTable.innerHTML = "";
        this.resultsTable.innerHTML = "";
        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = () => {
            if (xhr.readyState == 4 && xhr.status == 200) {
                this.queryResponse = JSON.parse(xhr.response);
                this.queryResponse.assets.forEach(element => {
                    this.createTableRowValue(element);
                });
            }
        }
        
        var req = `http://localhost:5251/assets?page=${page}`;
        xhr.open("GET", req, true);
        xhr.send();
    }

    getRandomInt(min,max){
        min = Math.floor(min);
        max = Math.floor(max+1);
        return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
    }

    createTableRowValue(value){
        // console.log(value);
        // const queriesTableRow = document.getElementById("queriesTableRow"+value.id);
        this.queriesTable.insertRow(this.queryCounter).innerHTML = `<td id="${"queriesTableRow"+value.guid}">${value.guid+" "+value.companyName}</td><td><button id="${"queriesTableButton"+ value.guid}" >Efetivar</button></td>`;
        this.resultsTable.insertRow(this.queryCounter).innerHTML = `<td id="${"resultsTableRow"+value.guid}">${"..."}</td>`;
        let button = document.getElementById("queriesTableButton"+value.guid);
        button.addEventListener("click", () => {
            this.getResourceByGuid(value.guid);
        });
    }

    setResultsRowValue(value){
        let resultsTableRow = document.getElementById("resultsTableRow"+value.guid);
        // console.log(resultsTableRow);
        resultsTableRow.innerHTML = value.guid+" "+value.companyName + " com sucesso";
    }

    setResultsRowValueNoContent(){
        let resultsTableRow = document.getElementById("resultsTableRow"+value.guid);
        // console.log(resultsTableRow);
        resultsTableRow.innerHTML = "Não mais disponível";
    }

    getResourceByGuid(guid){
        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = () => {
            if (xhr.status == 200) {
                let queryResponse = JSON.parse(xhr.response);
                this.setResultsRowValue(queryResponse);
            }
            else{
                this.setResultsRowValueNoContent();
            }
        }
        var req = `http://localhost:5251/assets/${guid}`;
        xhr.open("GET", req, true);
        xhr.send();
    }
}
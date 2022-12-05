class Query{
    constructor(queryIndex){
        this.queryIndex = queryIndex
        this.queriesTable = document.getElementById('queriesTable');
        this.resultsTable = document.getElementById('resultsTable');
        this.queryResponse = null;
        this.createNewRowInEachTable();
        this.request();
    }

    createNewRowInEachTable(){
        this.queriesTable.insertRow(this.queryCounter).innerHTML = `<td id="${"queriesTableRow"+this.queryIndex}">${"Iniciando Requisição"}</td>`;
        this.resultsTable.insertRow(this.queryCounter).innerHTML = `<td id="${"resultsTableRow"+this.queryIndex}">${"..."}</td>`;
        selectQueriesTableRow(this.queryIndex);
    }

    request(){
        this.createRandomRequest();
    }

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

    createBaseRequest(){
        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = () => {
            if (xhr.status == 200) {
                this.queryResponse = JSON.parse(xhr.response);
                this.setResultsRowValue("Assets geted: " + this.queryResponse.count);
            }

            else{
                this.setResultsRowValue("response code: " + xhr.status);
            }
        }
        
        var page = this.getRandomInt(1,5000);
        var req = `http://localhost:5000/assets?page=${page}`;
        this.setQueryRowValue(req);
        xhr.open("GET", req, true);
        xhr.send();
    }

    createRequestByCompanyName(){
        let companiesList = [
            "Compania de Petroleo do Rio de Janeiro",
            "Compania de Carne Aiai",
            "Mineradora Corrêa",
            "Compania Elétrica BA",
            "Compania Eólica",
            "Compania de Eletrodomésticos",
            "Compania de Aviação",
        ]
        let company = companiesList[this.getRandomInt(0,companiesList.length)];

        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = () => {
            if (xhr.status == 200) {
                this.queryResponse = JSON.parse(xhr.response);
                this.setResultsRowValue("Assets geted: " + this.queryResponse.count);
            }
            else{
                this.setResultsRowValue("response code: " + xhr.status);
            }
        }
        var page = this.getRandomInt(1,1000);
        var req = `http://localhost:5000/${company}/assets?page=${page}`;
        this.setQueryRowValue(req);
        xhr.open("GET", req, true);
        xhr.send();
    }

    getRandomInt(min,max){
        min = Math.floor(min);
        max = Math.floor(max+1);
        return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
    }

    setQueryRowValue(value){
        const queriesTableRow = document.getElementById("queriesTableRow"+this.queryIndex);
        queriesTableRow.innerHTML = value;
    }

    setResultsRowValue(value){
        const resultsTableRow = document.getElementById("resultsTableRow"+this.queryIndex);
        resultsTableRow.innerHTML = value;
    }
}
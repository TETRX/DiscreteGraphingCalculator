$(document).ready(function(){
});

function calculateA(){
    const input = document.getElementById("a(n)").value
    var result = new Array();
    for(var i = 0; i<100; i++){
        result.push({x: i, y: solve2(input,i)})
    }
    var ctx = document.getElementById('myChart');
    var myChart = new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: [{
                label: 'a(n)',
                data: result,
                backgroundColor: 'rgba(255, 99, 132, 0.2)'
            }]
        }
    });
}

//DOESN'T WORK
//n*n-5*n+5000-100*n

function solve2(equation,n){
    var formula = equation.replace(/n/g,n.toString(10));
    console.log(n + " " + formula)
    while(formula.indexOf('(')>-1){
        var withBrackets = formula.substr(formula.indexOf('('),formula.lastIndexOf(')')-formula.indexOf('('))
        var inBrackets = formula.substr(formula.indexOf('(')+1,formula.lastIndexOf(')')-formula.indexOf('(')-1)
        formula = formula.replace(withBrackets,solve2(inBrackets,0))
    }
    while(formula.indexOf('/')>-1){
        var opIndex = formula.indexOf('/')
        var i = opIndex-1;
        while(i>=0 && (formula[i]<='9' && formula[i]>='0' || formula[i]=='.' || 
        ( formula[i]=='-' && ( i==0 || formula[i-1]=='-' || formula[i-1]=='/' || formula[i-1]=='*' || formula[i-1]=='+')))){
            i--
        }   
        var firstArg =  parseFloat(formula.substr(i+1,opIndex-i-1));
        var j = opIndex+1;
        while(j<formula.length && (formula[j]<='9' && formula[j]>='0' || formula[j]=='.' || 
        ( formula[j]=='-' && (formula[j-1]=='-' || formula[j-1]=='/' || formula[j-1]=='*' || formula[j-1]=='+')))){
            j++
        }   
        var secondArg =  parseFloat(formula.substr(opIndex+1,j-opIndex-1));
        if(secondArg==0){
            return 0;
        }
        var toBeChanged = formula.substr(i+1,j-i-1);
        formula=formula.replace(toBeChanged,firstArg/secondArg)
    }
    console.log(n + " " + formula)
    while(formula.indexOf('*')>-1){
        var opIndex = formula.indexOf('*')
        var i = opIndex-1;
        while(i>=0 && (formula[i]<='9' && formula[i]>='0' || formula[i]=='.' || 
        ( formula[i]=='-' && (i==0 || formula[i-1]=='-' || formula[i-1]=='/' || formula[i-1]=='*' || formula[i-1]=='+')))){
            i--
        }   
        var firstArg = parseFloat(formula.substr(i+1,opIndex-i-1));
        var j = opIndex+1;
        while(j<formula.length && (formula[j]<='9' && formula[j]>='0' || formula[j]=='.' || 
        ( formula[j]=='-' && (formula[j-1]=='-' || formula[j-1]=='/' || formula[j-1]=='*' || formula[j-1]=='+')))){
            j++
        }   
        var secondArg =  parseFloat(formula.substr(opIndex+1,j-opIndex-1));
        var toBeChanged = formula.substr(i+1,j-i-1);
        formula=formula.replace(toBeChanged,firstArg*secondArg)
    }
    console.log(n + " " + formula)
    console.log(formula.search(/\d-[0-9-]/))
    while(formula.search(/\d-[0-9-]/)>-1){
        var opIndex = formula.search(/\d-[0-9-]/)+1
        var i = opIndex-1;
        while(i>=0 && (formula[i]<='9' && formula[i]>='0' || formula[i]=='.' || 
        ( formula[i]=='-' && ( i==0 || formula[i-1]=='-' || formula[i-1]=='/' && formula[i-1]=='*'&& formula[i-1]=='+')))){
            i--
        }   
        var firstArg =  parseFloat(formula.substr(i+1,opIndex-i-1))
        var j = opIndex+1;
        while(j<formula.length && (formula[j]<='9' && formula[j]>='0' || formula[j]=='.' || 
        ( formula[j]=='-' && (formula[j-1]=='-' || formula[j-1]=='/' || formula[j-1]=='*'|| formula[j-1]=='+' )))){
            j++
        }   
        var secondArg =  parseFloat(formula.substr(opIndex+1,j-opIndex-1));
        var toBeChanged = formula.substr(i+1,j-i-1);
        formula=formula.replace(toBeChanged,firstArg-secondArg)
        console.log(n + " - " + formula)

    }
    console.log(n + " " + formula)
    while(formula.indexOf('+')>-1){
        var opIndex = formula.indexOf('+')
        var i = opIndex-1;
        while(i>=0 && (formula[i]<='9' && formula[i]>='0' || formula[i]=='.' || 
        ( formula[i]=='-' && (i==0 || formula[i-1]=='-' || formula[i-1]=='/' || formula[i-1]=='*' || formula[i-1]=='+')))){
            i--
        }   
        var firstArg =  parseFloat(formula.substr(i+1,opIndex-i-1))
        var j = opIndex+1;
        while(j<formula.length && (formula[j]<='9' && formula[j]>='0' || formula[j]=='.' || 
        ( formula[j]=='-' && (formula[j-1]=='-' || formula[j-1]=='/' || formula[j-1]=='*' || formula[j-1]=='+')))){
            j++
        }   
        var secondArg =  parseFloat(formula.substr(opIndex+1,j-opIndex-1));
        var toBeChanged = formula.substr(i+1,j-i-1);
        formula=formula.replace(toBeChanged,firstArg+secondArg)
    }
    console.log(n + " " + formula)
    return parseFloat(formula)
}
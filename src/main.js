var recursive=false
var chart
var base=0
var baseData = new Array();

$(document).ready(function(){
    var ctx = document.getElementById('myChart');
    chart = new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: [{
                label: 'a(n)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)'
            }]
        }
    });
    $("#base").toggle()

    $("#recursive").click(function(){
        $("#base").toggle()
        recursive=!recursive
    })

    $("#baseSubmit").click(function(){
        baseData.push($("#baseInput").val())
        base++;
        $("#baseDisplay").text('a('+base+')=')
    })
});

function calculateA(){ //called whenever Submit is pressed. Fills the chart with a(0) to a(99).
    const input = document.getElementById("a(n)").value
    chart.data.datasets[0].data=[]
    for(var i = 0; i<base; i++){
        var y = baseData[i]
        chart.data.datasets[0].data.push({x: i, y: y})
    }
    for(var i = base; i<100; i++){
        var y = solve2(input,i)
        chart.data.datasets[0].data.push({x: i, y: y})
        baseData.push(y)
    }
    chart.update()
}

function solve2(equation,n){ //takes a string equation and a number n and evaluates equation for the given n eg.: n=6 equation: 100*n*n+10*n=36*100+10*6=3660
    var formula = equation.replace(/n/g,n.toString(10)); //All calculations are made through modifications of the formula such that the value doesn't change, until only one number remains
    while(formula.indexOf('(')>-1){ //handle brackets first, useful for complicated recursion as well
        var i = formula.indexOf('(')
        var j = i;
        var bracketsOpen = 1;
        while(bracketsOpen >0){// find the closing bracket
            j++ 
            if(formula[j]==')'){
                bracketsOpen--
            }
            if(formula[j]=='('){
                bracketsOpen++
            }
        }
        var withBrackets = formula.substr(i,j-i+1)
        var inBrackets = formula.substr(i+1,j-i-1)
        formula = formula.replace(withBrackets,solve2(inBrackets,0)) //replace an expression in brackets with its evaluation, the value of n doesn't matter
    }
    while(formula.indexOf('a')>-1){ //recursion
        var i=formula.indexOf('a')+1
        var hold=i-1
        while(formula[i]>='0' && formula[i]<='9'){
            i++
        }
        var toBeChanged = formula.substr(hold,i-hold);
        console.log(toBeChanged)
        var index = parseInt(formula.substr(hold+1,i-hold-1));
        console.log(n + " " + formula)
        formula = formula.replace(toBeChanged,baseData[index])
        console.log(n + " " + formula)
    } //a(n-1)+a(n-2)
    while(formula.indexOf('/')>-1){ //division
        var opIndex = formula.indexOf('/')
        var i = opIndex-1; //finds the first number
        while(i>=0 && (formula[i]<='9' && formula[i]>='0' || formula[i]=='.' || //evaluates whether formula[i] is still a part of the first argument and thus finds the first digit/sign
        ( formula[i]=='-' && ( i==0 || formula[i-1]=='-' || formula[i-1]=='/' || formula[i-1]=='*' || formula[i-1]=='+')))){ //of firstArg.
            i--
        }   
        var firstArg =  parseFloat(formula.substr(i+1,opIndex-i-1));
        var j = opIndex+1; //finds the second number
        while(j<formula.length && (formula[j]<='9' && formula[j]>='0' || formula[j]=='.' || 
        ( formula[j]=='-' && (formula[j-1]=='-' || formula[j-1]=='/' || formula[j-1]=='*' || formula[j-1]=='+')))){
            j++
        }   
        var secondArg =  parseFloat(formula.substr(opIndex+1,j-opIndex-1));
        if(secondArg==0){
            return 0;
        }
        var toBeChanged = formula.substr(i+1,j-i-1);
        formula=formula.replace(toBeChanged,firstArg/secondArg) // replaces them with the evaluation
    } // all other operators operate simillarily
    while(formula.indexOf('*')>-1){ //multiplication
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
    while(formula.search(/\d-[0-9-]/)>-1){ //subtraction (the regex's role is to distinguish between a minus that is an operator (eg.: 5-3) vs a sign (eg.: -8))
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
    }
    while(formula.indexOf('+')>-1){ //addition
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
    return parseFloat(formula)
}


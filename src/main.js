$(document).ready(function(){
});

function calculateA(){ //called whenever Submit is pressed. Fills the chart with a(0) to a(99).
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

function solve2(equation,n){ //takes a string equation and a number n and evaluates equation for the given n eg.: n=6 equation: 100*n*n+10*n=36*100+10*6=3660
    var formula = equation.replace(/n/g,n.toString(10)); //All calculations are made through modifications of the formula such that the value doesn't change, until only one number remains
    while(formula.indexOf('(')>-1){ //handle brackets first
        var withBrackets = formula.substr(formula.indexOf('('),formula.lastIndexOf(')')-formula.indexOf('('))
        var inBrackets = formula.substr(formula.indexOf('(')+1,formula.lastIndexOf(')')-formula.indexOf('(')-1)
        formula = formula.replace(withBrackets,solve2(inBrackets,0)) //replace an expression in brackets with its evaluation, the value of n doesn't matter
    }
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
    console.log(n + " " + formula)
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


var recursive=false
var chart
var base=0
var baseData = new Array();

const syntax = "SYNTAX ERROR"
const upperBoundOnUpperBound = 1000;

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
        var y = baseData[base]
        chart.data.datasets[0].data.push({x: base, y: y})
        chart.update()
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
        baseData.push(y)
    }
    var upperBound = 100;
    if(document.getElementById("upperBound").value!=""){
        try{
            upperBound=parseInt(document.getElementById("upperBound").value);
        }
        catch(err){
            window.alert(err)
            return;
        }
        if(upperBound>upperBoundOnUpperBound){
            window.alert("Upper bound cannot exceed: " + upperBoundOnUpperBound)
            return
        }
    }
    for(var i = base; i<upperBound; i++){
        var y;
        try{
            y = solve2(input,i)
        }catch(err){
            window.alert(err)
            return;
        }
        chart.data.datasets[0].data.push({x: i, y: y})
        baseData.push(y)
    }
    chart.update()
}


function solve2(equation,n){ //takes a string equation and a number n and evaluates equation for the given n eg.: n=6 equation: 100*n*n+10*n=36*100+10*6=3660
    var formula =equation
    while(formula.indexOf(':')>-1){ //handle functions first, because of ','
        var start = end = formula.indexOf(':')
        end++
        while(formula[end]!=':'){
            end++
            if(end>formula.length){
                throw syntax;
            }
        }
        var command = formula.substr(start+1,end-start-1)
        var bracketsOpen = 1;
        var args = new Array()
        var argStart=argEnd=end+2;
        while(bracketsOpen >0){
            while(formula[argEnd]!=','){
                argEnd++
                if(argEnd>formula.length){
                    throw syntax;
                }
                if(formula[argEnd]==')'){
                    bracketsOpen--
                    if(bracketsOpen==0){
                        break;
                    }
                }
                if(formula[argEnd]=='('){
                    bracketsOpen++
                }
            }
            var argString=formula.substr(argStart,argEnd-argStart)
            args.push(solve2(argString,n))
            argStart=++argEnd
        }
        var result
        switch(command){
            case "gcd":
                result=gcd(...args)
                break;
            case "gcm":
                result=gcm(...args)
                break;
            default:
                throw syntax;
        }
        var allOfFunction= formula.substr(start,argEnd-start)
        formula=formula.replace(allOfFunction,result)
    }
    var formula = formula.replace(/n/g,n.toString(10)); //All calculations are made through modifications of the formula such that the value doesn't change, until only one number remains
    while(formula.indexOf('(')>-1){ //handle brackets first, useful for complicated recursion as well
        var i = formula.indexOf('(')
        var j = i;
        var bracketsOpen = 1;
        while(bracketsOpen >0){// find the closing bracket
            j++ 
            if(j>formula.length){
                throw syntax;
            }
            if(formula[j]==')'){
                bracketsOpen--
            }
            if(formula[j]=='('){
                bracketsOpen++
            }
        }
        var withBrackets = formula.substr(i,j-i+1)
        var inBrackets = formula.substr(i+1,j-i-1)
        try{
            formula = formula.replace(withBrackets,solve2(inBrackets,0)) //replace an expression in brackets with its evaluation, the value of n doesn't matter
        }
        catch(err){
            throw syntax;
        }
    }
    while(formula.indexOf('a')>-1){ //recursion
        var i=formula.indexOf('a')+1
        var hold=i-1
        while(formula[i]>='0' && formula[i]<='9'){
            i++
            if(i>formula.length){
                break;
            }
            if(formula[i]=='.'){
                throw syntax;
            }
        }
        if(i=hold+1){
            throw syntax;
        }
        var toBeChanged = formula.substr(hold,i-hold);
        console.log(toBeChanged)
        var index;
        try{
             index = parseInt(formula.substr(hold+1,i-hold-1));
        } catch(err){
            throw syntax;
        }
        console.log(n + " " + formula)
        formula = formula.replace(toBeChanged,baseData[index])
        console.log(n + " " + formula)
    } 
    while(formula.indexOf('/')>-1){ //division
        var opIndex = formula.indexOf('/')
        var i = opIndex-1; //finds the first number
        while(i>=0 && (formula[i]<='9' && formula[i]>='0' || formula[i]=='.' || //evaluates whether formula[i] is still a part of the first argument and thus finds the first digit/sign
        ( formula[i]=='-' && ( i==0 || formula[i-1]=='-' || formula[i-1]=='/' || formula[i-1]=='*' || formula[i-1]=='+')))){ //of firstArg.
            i--
            
        }      
        if(i==opIndex-1){
            throw syntax
        }
        var firstArg =  parseFloat(formula.substr(i+1,opIndex-i-1));
        var j = opIndex+1; //finds the second number
        while(j<formula.length && (formula[j]<='9' && formula[j]>='0' || formula[j]=='.' || 
        ( formula[j]=='-' && (formula[j-1]=='-' || formula[j-1]=='/' || formula[j-1]=='*' || formula[j-1]=='+')))){
            j++
        }    
        if(j==opIndex+1){
            throw syntax
        }
        var secondArg =  parseFloat(formula.substr(opIndex+1,j-opIndex-1));
        if(secondArg==0){
            throw syntax;
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
        if(i==opIndex-1){
            throw syntax
        }   
        var firstArg = parseFloat(formula.substr(i+1,opIndex-i-1));
        var j = opIndex+1;
        while(j<formula.length && (formula[j]<='9' && formula[j]>='0' || formula[j]=='.' || 
        ( formula[j]=='-' && (formula[j-1]=='-' || formula[j-1]=='/' || formula[j-1]=='*' || formula[j-1]=='+')))){
            j++
        }    
        if(j==opIndex+1){
            throw syntax
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
        if(i==opIndex-1){
            throw syntax
        }
        var firstArg =  parseFloat(formula.substr(i+1,opIndex-i-1))
        var j = opIndex+1;
        while(j<formula.length && (formula[j]<='9' && formula[j]>='0' || formula[j]=='.' || 
        ( formula[j]=='-' && (formula[j-1]=='-' || formula[j-1]=='/' || formula[j-1]=='*'|| formula[j-1]=='+' )))){
            j++
        }    
        if(j==opIndex+1){
            throw syntax
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
        if(i==opIndex-1){
            throw syntax
        }
        var firstArg =  parseFloat(formula.substr(i+1,opIndex-i-1))
        var j = opIndex+1;
        while(j<formula.length && (formula[j]<='9' && formula[j]>='0' || formula[j]=='.' || 
        ( formula[j]=='-' && (formula[j-1]=='-' || formula[j-1]=='/' || formula[j-1]=='*' || formula[j-1]=='+')))){
            j++
        }   
        if(j==opIndex+1){
            throw syntax
        }
        var secondArg =  parseFloat(formula.substr(opIndex+1,j-opIndex-1));
        var toBeChanged = formula.substr(i+1,j-i-1);
        formula=formula.replace(toBeChanged,firstArg+secondArg)
    }
    var ret = parseFloat(formula);
    if(ret==NaN){
        throw syntax;
    }
    return ret
}


const gcdSyntax = ":gcd: SYNTAX ERROR"
const gcmSyntax = ":gcm: SYNTAX ERROR"

function gcd(){
    if(arguments.length==1){
        if(!Number.isInteger(argument[0])){
            throw gcdSyntax;
        }
        return argument[0];
    }
    if(arguments.length==2){
        var x= arguments[0], y=arguments[1]
        if(!Number.isInteger(x) || !Number.isInteger(y)){
            throw gcdSyntax;
        }
        if(x%y==0){
            return y
        }
        if(y%x==0){
            return x
        }
        if(x>y){
            return gcd(y,x%y)
        }
        if(y>x){
            return gcd(x,y%x)
        }
    }
    var newArg = new Array()
    var i=0
    if(arguments.length%2==1){
        newArg.push(arguments[0])
        if(!Number.isInteger(arguments[0])){
            throw gcdSyntax;
        }
        i++
    }
    for(;i<arguments.length;i+=2){
        newArg.push(gcd(arguments[i],arguments[i+1]))
    }
    return gcd(...newArg)
}

function gcm(){
    if(arguments.length==2){
        var x= arguments[0], y=arguments[1]
        try{
             return (x*y)/gcd(x,y)
    
        }
        catch(err){
            throw gcmSyntax;
        }
    }
    var newArg = new Array()
    var i=0
    if(arguments.length%2==1){
        newArg.push(arguments[0])
        i++
    }
    for(;i<arguments.length;i+=2){
        newArg.push(gcm(arguments[i],arguments[i+1]))
    }
    return gcm(...newArg)
}
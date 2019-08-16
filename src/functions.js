function gcd(){
    if(arguments.length==2){
        var x= arguments[0], y=arguments[1]
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
        return (x*y)/gcd(x,y)
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
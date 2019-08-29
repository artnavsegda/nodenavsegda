function parsetime(timeinstring)
{
    var timenumber;
    var timesplit = timeinstring.split(":");
    timenumber = Number(timesplit[2]) + Number(timesplit[1])*60 + Number(timesplit[0])*60*60;
    return timenumber;
}

console.log(parsetime("00:10:01"));

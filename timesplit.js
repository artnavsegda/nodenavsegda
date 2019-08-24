function parsetime(timeinstring)
{
    var timenumber;
    var timesplit = timeinstring.split(":");
    timenumber = timesplit[2] + timesplit[1]*60 + timesplit[0]*60*60;
}

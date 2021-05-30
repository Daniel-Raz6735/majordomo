import moment from "moment";

export function set_offset(date) {
    //set offset on a timestamp
    var d = moment.utc(date);
    return (moment(d.format()))
}
export function get_date(date) {
    //get string of day
    var today = moment();
    if(today.format('YYYY')===date.format('YYYY'))
        return date.format('MM/DD');
    return date.format('L');
}
export function get_time(date) {
    //get string of day
    return date.format('HH:mm');
}
export function get_hours(date) {
    //get string of hours
    return date.format('HH');
}
export function get_minutes(date) {
    //get string of minutes
    return date.format('mm');
}

/*tests the date and time of a momet object and determines what key it should have
output:
if date is last 24 hr then time only
date is from yesterday but not last 24hr ago: date and time
else date only(if keepTime than also time)*/
export function get_table_key(date, keepTime=true){
    if (!date)
        return;
    var res = ""
    var yesterday = moment().subtract(1, 'days').valueOf(),
        startOfYesterday = moment().subtract(1, 'days').startOf('day').valueOf(),
        testDate = date.valueOf();
    if (testDate > yesterday)
        return get_time(date);
    res = get_date(date);
    if ((testDate <= yesterday && testDate >= startOfYesterday)||keepTime)
        res +=" - "+get_time(date);
    return res;
}

export function remove_offset(date) {
    //remove an offset for an item
    var d = moment(date);
    return (moment.utc(d.format()))
}
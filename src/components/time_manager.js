import moment from "moment";

export function set_offset(date) {
    //set offset on a timestamp
    var d = moment.utc(date);
    return(moment(d.format()))
}
export function get_date(date) {
    //get string of day
    return date.format('L');
}
export function get_time(date) {
    //get string of day
    return date.format('HHmm');
}

export function remove_offset(date) {
    //remove an offset for an item
    var d = moment(date);
    return(moment.utc(d.format()))
}
export function timeLeft(triggerTimeSpan) {
    if(!triggerTimeSpan){
        return {
            days:0,
            hours:0,
            minutes:0,
            seconds:0,
        };
    }
    let now = new Date();
    let leftTime = triggerTimeSpan - now.getTime();
    leftTime = leftTime / 1000;
    let days = Math.floor(leftTime / (60 * 60 * 24));
    let hours = Math.floor((leftTime / (60 * 60)) % 24);
    let minutes = Math.floor((leftTime / 60) % 60);
    let seconds = Math.floor(leftTime % 60);
    return {
        days,
        hours,
        minutes,
        seconds,
    };
}

export function timePlusDays(date, days) {
    const date2 = new Date(date);
    date2.setDate(date2.getDate() + days);
    return date2
}

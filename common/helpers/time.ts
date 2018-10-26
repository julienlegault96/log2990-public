export const MINUTES_IN_HOUR: number = 60;
export const SECONDS_IN_MINUTE: number = 60;
export const MILLISECONDS_IN_SECOND: number = 1000;
export const LIMIT_TO_ADD_ZERO: number = 10;

export function getformattedTime(seconds: number): string {
    const minutes: number = Math.floor(seconds / SECONDS_IN_MINUTE);
    seconds = seconds - (minutes * SECONDS_IN_MINUTE);

    let formattedTime: string;
    formattedTime = minutes < LIMIT_TO_ADD_ZERO ? ("0" + minutes) : (String(minutes));
    formattedTime += ":";
    formattedTime += seconds < LIMIT_TO_ADD_ZERO ? ("0" + seconds) : (String(seconds));

    return formattedTime;
}
const hasPeriodExpired = ({ timeInMs, date }: { timeInMs: number, date: string }) => {
    const paidAt = new Date(date).getTime();
    const currentTime = new Date(Date.now()).getTime();
    const totalMilliSec = currentTime - timeInMs;
    const periodExpired = paidAt - totalMilliSec < 0;
    return periodExpired;
}

export default hasPeriodExpired;
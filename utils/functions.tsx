export const GetMonth = (month: number) => {
    const months: any = {
        0: "Jan",
        1: "Feb",
        2: "Mar",
        3: "Apr",
        4: "May",
        5: "June",
        6: "July",
        7: "Aug",
        8: "Sep",
        9: "Oct",
        10: "Nov",
        11: "Dec"
    }
    return months[month]
}


export const timeSince = (date: Date) => {
    const intervals = [
        { label: 'year', seconds: 31536000 },
        { label: 'month', seconds: 2592000 },
        { label: 'day', seconds: 86400 },
        { label: 'hour', seconds: 3600 },
        { label: 'minute', seconds: 60 },
        { label: 'second', seconds: 1 }
    ];

    const seconds = Math.floor((Date.now() - date.getTime()) / 1000)
    const interval = intervals.find(i => i.seconds < seconds)
    if (interval != undefined) {
        const count = Math.floor(seconds / interval.seconds)
        return `${count} ${interval.label}${count !== 1 ? 's' : ''} ago`;
    }
    return "Error fetching data"
}

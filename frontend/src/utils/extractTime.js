export function extractTime(dateString) {
    const date = new Date(dateString);
    let hours = date.getHours();
    const minutes = padZero(date.getMinutes());

    // Determine AM or PM suffix
    const amPm = hours >= 12 ? 'PM' : 'AM';
    
    // Convert hours from 24-hour to 12-hour format
    hours = hours % 12 || 12; // Convert 0 to 12 for midnight

    return `${hours}:${minutes} ${amPm}`;
}

// Helper function to pad single-digit numbers with a leading zero
function padZero(number) {
    return number.toString().padStart(2, "0");
}

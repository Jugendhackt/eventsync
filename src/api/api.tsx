const ip = "10.42.14.240";
export const api = {
    read: async () => {
        const response = await fetch("http://"+ip+":8000/events")
        return await response.json() satisfies Event[];
    }
}

import { MapEvent } from "@/server/schema";

const ip = "10.42.2.88";
export const api = {
    read: async () => {
        const response = await fetch("http://" + ip + ":8000/events?search_filter={}")
        if (Math.floor(response.status / 100) !== 2) {
            throw new Error();
        }
        return await response.json() satisfies MapEvent[];
    },
    create: async (event: MapEvent) => {
        const response = await fetch("http://" + ip + ":8000/events", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(event)
        })
        if (Math.floor(response.status / 100) !== 2) {
            throw new Error();
        }
        return await response.json() satisfies MapEvent;
    },
    get_events_admin: async () => {
        const response = await fetch("http://" + ip + ":8000/admin?search_filter={}",
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'token': localStorage.getItem('token') || ''
                }
            }
        )
        if (Math.floor(response.status / 100) !== 2) {
            throw new Error();
        }
        return await response.json() satisfies MapEvent[];
    },

    delete_event: async (id: string) => {
        const response = await fetch("http://" + ip + ":8000/admin?event_id=" + id, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'token': localStorage.getItem('token') || ''
            },
        })
        if (Math.floor(response.status / 100) !== 2) {
            throw new Error();
        }
        return await response.json() satisfies MapEvent;
    },

    verify_event: async (id: string) => {
        const response = await fetch("http://" + ip + ":8000/admin?event_id=" + id, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'token': localStorage.getItem('token') || ''
            },
        })
        if (Math.floor(response.status / 100) !== 2) {
            throw new Error();
        }
        return await response.json() satisfies MapEvent;
    },

    login: async (username: string, password: string) => {
        const response = await fetch("http://" + ip + ":8000/login", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        if (Math.floor(response.status / 100) !== 2) {
            throw new Error();
        }
        return await response.json();
    }

}

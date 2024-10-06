import { MapEvent, User } from "@/server/schema";

const ip = "https://eventsync.auroraborealis.cloud";
//const ip = "10.42.14.240";
export const api = {
    read: async () => {
        const response = await fetch( ip + "/events?search_filter={}")
        if (Math.floor(response.status / 100) !== 2) {
            throw new Error();
        }
        return await response.json() satisfies MapEvent[];
    },
    create: async (event: MapEvent) => {
        const response = await fetch( ip + "/events", {
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
        const response = await fetch( ip + "/admin?search_filter={}",
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
        const response = await fetch( ip + "/admin?event_id=" + id, {
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
        const response = await fetch( ip + "/admin", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'token': localStorage.getItem('token') || ''
            },
            body: JSON.stringify({ event_id: id })
        })
        if (Math.floor(response.status / 100) !== 2) {
            throw new Error();
        }
        return await response.json() satisfies MapEvent;
    },

    login: async (username: string, password: string) => {
        const response = await fetch( ip + "/login", {
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
    },

    register: async (username: string, password: string, display_name: string) => {
        const response = await fetch( ip + "/user/register", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password, display_name })
        });

        if (Math.floor(response.status / 100) !== 2) {
            throw new Error();
        }
        return await response.json();
    },

    listUsers: async ():Promise<User[]> => {
        const response = await fetch( ip + "/admin/users", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'token': localStorage.getItem('token') || ''
            }
        })
        if (Math.floor(response.status / 100) !== 2) {
            throw new Error();
        }
        return await response.json() satisfies User[];
    },

    changeAdmin: async (user_id: string, is_admin: boolean) => {
        const response = await fetch( ip + "/admin/op", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'token': localStorage.getItem('token') || ''
            },
            body: JSON.stringify({ is_admin, user_id })
        })
        if (Math.floor(response.status / 100) !== 2) {
            throw new Error();
        }
        return await response.json();
    },

    deleteUser: async (user_id: string) => {
        const response = await fetch( ip + "/admin/user", {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'token': localStorage.getItem('token') || ''
            },
            body: JSON.stringify({ user_id })
        })
        if (Math.floor(response.status / 100) !== 2) {
            throw new Error();
        }
        return await response.json();
    },

    likeEvent: async (event_id: string, like:boolean) => {
        const response = await fetch( ip + "/event/like", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'token': localStorage.getItem('token') || ''
            },
            body: JSON.stringify({ event_id, like })
        })
        if (Math.floor(response.status / 100) !== 2) {
            throw new Error();
        }
        return await response.json();
    },

    getLikedEvents: async () => {
        const response = await fetch( ip + "/user/likes", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'token': localStorage.getItem('token') || ''
            }
        })
        if (Math.floor(response.status / 100) !== 2) {
            throw new Error();
        }
        return await response.json() satisfies string[];
    }

}

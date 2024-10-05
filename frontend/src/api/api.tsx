import { MapEvent, User } from "@/server/schema";

//const ip = "10.42.2.88";
const ip = "172.20.10.2";
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
    },

    register: async (username: string, password: string, display_name: string) => {
        const response = await fetch("http://" + ip + ":8000/user/register", {
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
        const response = await fetch("http://" + ip + ":8000/admin/users", {
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
        const response = await fetch("http://" + ip + ":8000/admin/op", {
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
        const response = await fetch("http://" + ip + ":8000/admin/user", {
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
    }

}

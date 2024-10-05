import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { api } from "@/api/api"
import { useAccount } from "@/zustand/userAccount"

export const Login = () => {

    const [localUsername, setLocalUsername] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const {username,setUsername} = useAccount();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // Here you would typically handle the login logic
        // For this example, we'll just show an error if the fields are empty
        if (!localUsername || !password) {
            setError("Please fill in all fields")
        } else {
            api.login(localUsername, password).then((data) => {
                console.log(data);
                if(data.success){
                    window.localStorage.setItem("token", data.token);
                    console.log("Login successful");
                    setUsername("Admin")
                    
                }else{
                    setError("Falsche Anmeldedaten");
                }
            }).catch((error) => {
                setError("Fehler bei der Anmeldung");
            });
            setError("")
            console.log("Login attempted with:", { localUsername, password })
        }
    }
    return (<Dialog>
        <DialogTrigger>Login</DialogTrigger>
        <DialogContent >
            <DialogHeader>
                <DialogTitle>Login</DialogTitle>
                <DialogDescription>
                    <p>Bitte loggen Sie sich ein</p>
                </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="username">Username</Label>
                        <Input
                            id="username"
                            type="text"
                            placeholder="Max Mustermann"
                            value={localUsername}
                            onChange={(e) => setLocalUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    {error && (
                        <Alert variant="destructive">
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}
                </CardContent>
                <CardFooter>
                    <Button type="submit" className="w-full">Log in</Button>
                </CardFooter>
            </form>

        </DialogContent>
    </Dialog>)
}
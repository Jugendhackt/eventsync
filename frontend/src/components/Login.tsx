"use client";
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { api } from "@/api/api"
import { useAccount } from "@/zustand/userAccount"
import { LOAD_DATA_FROM_API } from "@/dataSource"
import { login, register } from "@/server/dbAccess"

export const Login = () => {

    const [localUsername, setLocalUsername] = useState("")
    const [display_name, setDisplay_name] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const { setUsername, setIsAdmin } = useAccount();
    const [isRegister, setIsRegister] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if (isRegister) {
            if(LOAD_DATA_FROM_API) {
                api.register(localUsername.toLocaleLowerCase(), password, display_name).then((data) => {
                    console.log(data);
                    if (data.success) {
                        window.localStorage.setItem("token", data.token);
                        console.log("Register successful");
                        const usernameCapitalized = data.display_name.charAt(0).toUpperCase() + data.display_name.slice(1);
                        setUsername(usernameCapitalized);
                        setIsAdmin(data.is_admin);
                        window.location.reload(); //TODO fix
                    }
                }).catch((error) => {
                    setError("Fehler bei der Registrierung/Username bereits vergeben");
                });
            }else{
                register(localUsername.toLocaleLowerCase(), password, display_name).then((data) => {
                    console.log(data);
                    if (data.success) {
                        window.localStorage.setItem("token", data.token);
                        console.log("Register successful");
                        const usernameCapitalized = data.display_name.charAt(0).toUpperCase() + data.display_name.slice(1);
                        setUsername(usernameCapitalized);
                        setIsAdmin(data.is_admin);
                        window.location.reload(); //TODO fix
                    }
                }
                ).catch((error) => {
                    setError("Fehler bei der Registrierung/Username bereits vergeben");
                });
            }
        } else {
            if(LOAD_DATA_FROM_API) {
                api.login(localUsername.toLocaleLowerCase(), password).then((data) => {
                    console.log(data);
                    if (data.success) {
                        window.localStorage.setItem("token", data.token);
                        console.log("Login successful");
                        const usernameCapitalized = data.display_name.charAt(0).toUpperCase() + data.display_name.slice(1);
                        setUsername(usernameCapitalized);
                        setIsAdmin(data.is_admin);
                        window.location.reload(); //TODO fix
                    } else {
                        setError("Falsche Anmeldedaten");
                    }
                }).catch((error) => {
                    setError("Fehler bei der Anmeldung");
                });
                setError("")
            }else{
                login(localUsername.toLocaleLowerCase(), password).then((data) => {
                    console.log(data);
                    if (data.success) {
                        window.localStorage.setItem("token", data.token);
                        console.log("Login successful");
                        const usernameCapitalized = data.display_name.charAt(0).toUpperCase() + data.display_name.slice(1);
                        setUsername(usernameCapitalized);
                        setIsAdmin(data.is_admin??false);
                        window.location.reload(); //TODO fix
                    } else {
                        setError("Falsche Anmeldedaten");
                    }
                }).catch((error) => {
                    setError("Fehler bei der Anmeldung");
                });
            }
        }



    }
    return (<Dialog>

        <DialogTrigger>Login</DialogTrigger>
        <DialogContent >
            <DialogHeader>
                <DialogTitle>{isRegister ? "Registrieren" : "Login"}</DialogTitle>
                <DialogDescription>
                    <p>{isRegister ? "Bitte registriere dich" : "Bitte logge dich ein"}</p>
                </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="username">Username</Label>
                        <Input
                            id="username"
                            type="text"
                            placeholder="maxi"
                            value={localUsername}
                            onChange={(e) => setLocalUsername(e.target.value)}
                            required
                        />
                    </div>
                    {
                        isRegister &&
                        <div className="space-y-2">
                            <Label htmlFor="username">Anzeigename</Label>
                            <Input
                                id="display_name"
                                type="text"
                                placeholder="Max Mustermann"
                                value={display_name}
                                onChange={(e) => setDisplay_name(e.target.value)}
                                required
                            />
                        </div>
                    }
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
                <CardFooter className="">
                    <Button type="submit" className="w-full">{isRegister ? "Registrieren" : "Login"}</Button>
                </CardFooter>
            </form>
            <div className="w-full flex justify-center items-center">
                <div className="cursor-pointer" onClick={() => setIsRegister(!isRegister)}>{isRegister ? "Login" : "Registrieren"}</div>
            </div>


        </DialogContent>
    </Dialog>)
}
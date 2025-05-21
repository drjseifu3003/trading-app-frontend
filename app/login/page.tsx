import LoginScreen from "@/src/screens/LoginScreen"
import { Suspense } from "react"


const LoginPage = () => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <LoginScreen/>
        </Suspense>
    )
}

export default LoginPage
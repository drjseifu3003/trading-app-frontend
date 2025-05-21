import { SignupForm } from "@/src/screens/SignupScreen"
import { Suspense } from "react"


const SignUpPage = () => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <SignupForm/>
        </Suspense>
    )
}

export default SignUpPage
import ProtectedPage from "@/components/protectedPage"
import PersonalScreen from "@/src/screens/PersonalScreen"

export default function PersonalPage() {
  return (
    <ProtectedPage>
        <PersonalScreen />
    </ProtectedPage>
  )
}

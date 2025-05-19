"use client"

import type React from "react"
import { useAppDispatch } from "../store"
import { logout } from "../store/slices/authSlice"
import { useGetUserProfileQuery } from "../store/api/userApi"
import { useState } from "react"
import PersonalInfoForm from "../components/PersonalInformationModal"
import { useRouter } from "next/navigation"
import HistoryModal from "../components/HistoryModal"
import { ChangePasswordModal } from "../components/changePassword"

const PersonalScreen: React.FC = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const [showPersonalInfoModal, setShowPersonalInfoModal] = useState(false)
  const [showHistoryModal, setShowHistoryModal] = useState(false)
  const [showChangeLoginPasswordModal, setShowChangeLoginPasswordModal] = useState(false)
  const { data: userProfile, isLoading, error } = useGetUserProfileQuery()

  const handleLogout = async () => {
    await dispatch(logout())
    router.push("/login")
  }

  const menuItems = [
    { icon: "history", label: "History"},
    { icon: "user", label: "Personal information" },
    { icon: "lock", label: "Change Login Password" },
    { icon: "info", label: "About us" },
  ]


  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 text-center">
        <p className="text-red-500">Error loading profile. Please try again.</p>
        <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-amber-500 text-white rounded">
          Reload
        </button>
      </div>
    )
  }

  return (
    <div className="pb-16 relative">
      {/* Header with user info */}
      <div className="bg-white p-4 mb-2 flex items-center">
        <div className="w-14 h-14 bg-indigo-900 rounded-full flex items-center justify-center mr-4">
          <span className="text-white text-2xl">{userProfile?.full_name ? userProfile?.full_name?.charAt(0) : ""}</span>
        </div>
        <div>
          <div className="font-medium">{userProfile?.full_name ?? "No Name"}</div>
          <div className="flex items-center mt-1">
            <span className="bg-black text-white text-xs px-2 py-0.5 rounded mr-2">
              Credit Score {userProfile?.credit_score}
            </span>
            <span className="bg-green-800 text-white text-xs px-2 py-0.5 rounded">Lv {userProfile?.verification_level}</span>
          </div>
        </div>
      </div>

      {/* Balance section */}
      <div className="bg-white p-4 mb-2">
        <div className="text-gray-500 text-sm">Balance</div>
        <div className="flex justify-between items-center">
          <div className="text-2xl font-bold">{userProfile?.cash || "0.00"}</div>
          <button className="bg-gray-100 p-2 rounded">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="2" y="5" width="20" height="14" rx="2" />
              <line x1="2" y1="10" x2="22" y2="10" />
            </svg>
          </button>
        </div>
        <div className="text-sm text-gray-500">Margin: {userProfile?.margin || "0.00"}</div>

        {/* Withdrawal and Recharge buttons */}
        <div className="grid grid-cols-2 gap-4 mt-4">
          <button className="flex items-center justify-center py-3 border border-gray-300 rounded">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2"
            >
              <polyline points="7 11 12 6 17 11" />
              <polyline points="7 17 12 12 17 17" />
            </svg>
            Withdrawal
          </button>
          <button className="flex items-center justify-center py-3 bg-amber-500 text-white rounded">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2"
            >
              <polyline points="7 13 12 18 17 13" />
              <polyline points="7 6 12 11 17 6" />
            </svg>
            Recharge
          </button>
        </div>
      </div>

      {/* Menu items */}
      <div className="bg-white mb-2">
        {menuItems.map((item, index) => (
          <div 
          key={index} 
          className="flex items-center justify-between p-4 border-b border-gray-100 last:border-b-0 cursor-pointer"
          onClick={() => {
            switch(index) {
              case 0:
                setShowHistoryModal(true)
                break;
              case 1:
                setShowPersonalInfoModal(true)
                break;
              case 2:
                setShowChangeLoginPasswordModal(true)
                break;

            }
          }
          }
          >
            <div className="flex items-center">
              <div className="w-5 h-5 text-amber-500 mr-3">
                <MenuIcon name={item.icon} />
              </div>
              <span>{item.label}</span>
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-gray-400"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </div>
        ))}
      </div>

      {/* Logout button */}
      <div className="px-4 mb-4">
        <button className="w-full bg-amber-500 text-white py-3 rounded" onClick={handleLogout}>
          Log out
        </button>
      </div>
      {
        showPersonalInfoModal && (
          <PersonalInfoForm onClose={() => setShowPersonalInfoModal(false)} isOpen={showPersonalInfoModal}/>
        )
      }
      {
        showChangeLoginPasswordModal && (
          <ChangePasswordModal onOpenChange={() => setShowChangeLoginPasswordModal(false)} open={showChangeLoginPasswordModal}/>
        )
      }
      {
        showHistoryModal && (
          <HistoryModal
            isOpen={showHistoryModal}
            onClose={() => setShowHistoryModal(false)}
          />
        )
      }

    </div>
  )
}


// Helper component for menu icons
const MenuIcon: React.FC<{ name: string }> = ({ name }) => {
  switch (name) {
    case "history":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      )
    case "user":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      )
    case "shield":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      )
    case "link":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
        </svg>
      )
    case "lock":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      )
    case "key":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
        </svg>
      )
    case "google":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="12" r="4" />
          <line x1="21.17" y1="8" x2="12" y2="8" />
          <line x1="3.95" y1="6.06" x2="8.54" y2="14" />
          <line x1="10.88" y1="21.94" x2="15.46" y2="14" />
        </svg>
      )
    case "info":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="16" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
      )
    case "file":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
      )
    default:
      return null
  }
}

export default PersonalScreen

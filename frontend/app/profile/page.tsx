"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Pencil } from "lucide-react"
import { useRouter } from "next/navigation"
import { updateUser } from "@/lib/api/auth"
import { toast } from "sonner"
import React from "react"

export default function ProfilePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = React.useState(true)
  const [editMode, setEditMode] = React.useState({
    username: false,
    email: false
  })
  const [formData, setFormData] = React.useState({
    username: "",
    email: "",
    avatar: "",
    role: ""
  })
  const [passwordData, setPasswordData] = React.useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  })
  const [errors, setErrors] = React.useState({
    currentPassword: "",
    confirmPassword: ""
  })

  React.useEffect(() => {
    const userData = localStorage.getItem("User")
    if (!userData) {
      router.push("/auth")
      return
    }

    try {
      const parsedData = JSON.parse(userData)
      setFormData({
        username: parsedData.username,
        email: parsedData.email,
        avatar: parsedData.role === "ADMIN" ? "/avatars/admin.png" : "/avatars/staff.png",
        role: parsedData.role
      })
    } catch (error) {
      console.error("Error parsing user data:", error)
      router.push("/auth")
      return
    }

    setIsLoading(false)
  }, [router])

  const handleEdit = (field: keyof typeof editMode) => {
    setEditMode(prev => ({ ...prev, [field]: true }))
  }

  const handleSave = (field: keyof typeof editMode) => {
    setEditMode(prev => ({ ...prev, [field]: false }))
  }

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handlePasswordChange = (field: keyof typeof passwordData, value: string) => {
    setPasswordData(prev => ({ ...prev, [field]: value }))
    // Clear errors when user types
    if (field === 'currentPassword') {
      setErrors(prev => ({ ...prev, currentPassword: "" }))
    }
    if (field === 'confirmPassword') {
      setErrors(prev => ({ ...prev, confirmPassword: "" }))
    }
  }

  const handleUpdateProfile = async () => {
    // Reset errors
    setErrors({
      currentPassword: "",
      confirmPassword: ""
    })

    // Get user data from localStorage
    const userData = localStorage.getItem("User")
    if (!userData) {
      router.push("/auth")
      return
    }

    try {
      const parsedData = JSON.parse(userData)

      // Only validate current password if new password is being set
      if (passwordData.newPassword) {
        // Validate current password
        if (passwordData.currentPassword !== parsedData.password) {
          setErrors(prev => ({ ...prev, currentPassword: "Current password is incorrect" }))
          return
        }

        // Validate new password match
        if (passwordData.newPassword !== passwordData.confirmPassword) {
          setErrors(prev => ({ ...prev, confirmPassword: "New passwords do not match" }))
          return
        }
      }

      // Prepare update data
      const updateData = {
        username: formData.username,
        email: formData.email,
        password: passwordData.newPassword || parsedData.password // Keep old password if no new one
      }

      // Call API
      await updateUser(parsedData.id, updateData)

      // Update localStorage
      const updatedUserData = {
        ...parsedData,
        ...updateData
      }
      localStorage.setItem("User", JSON.stringify(updatedUserData))

      toast.success("Profile updated successfully", {
        duration: 3000,
      })
      
      // Reset password fields
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      })
    } catch (error) {
      console.error("Error updating profile:", error)
      toast.error("Failed to update profile", {
        duration: 3000,
      })
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <div className="px-4 lg:px-6">
          <Skeleton className="h-9 w-64" />
        </div>
        <div className="space-y-4 px-4 lg:px-6">
          <div className="flex items-center justify-between">
            <div className="flex flex-1 items-center space-x-2">
              <Skeleton className="h-8 w-[250px]" />
              <Skeleton className="h-8 w-[100px]" />
            </div>
            <Skeleton className="h-8 w-[120px]" />
          </div>
          <div className="rounded-md border">
            <div className="relative w-full">
              <div className="space-y-2 p-4">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 py-6 md:gap-6 px-12">
      <div className="px-4 lg:px-6">
        <h1 className="text-3xl font-bold">Profile Management</h1>
      </div>

      <div className="space-y-6 px-10">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-6 px-6 pt-4">
              <img
                src={formData.avatar}
                alt="Avatar"
                className="w-24 h-24 rounded-full object-cover border-2 border-primary"
              />
              <div className="space-y-2">
                <div className="text-2xl font-semibold leading-tight">{formData.username}</div>
                <div className="text-muted-foreground text-base">{formData.email}</div>
                <div className="text-sm font-medium px-3 py-1 rounded-full bg-primary/10 text-primary w-fit">
                  Role: {formData.role}
                </div>
              </div>
            </div>
            <CardTitle className="sr-only">Profile Information</CardTitle>
            <CardDescription className="sr-only">
              Update your profile information here
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 p-2 px-6">
              <div className="grid gap-2">
                <Label htmlFor="username">Username</Label>
                <div className="flex items-center gap-2">
                  {editMode.username ? (
                    <>
                      <Input 
                        id="username" 
                        value={formData.username}
                        onChange={(e) => handleChange('username', e.target.value)}
                      />
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleSave('username')}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </>
                  ) : (
                    <>
                      <div className="flex-1 text-base">{formData.username}</div>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleEdit('username')}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <div className="flex items-center gap-2">
                  {editMode.email ? (
                    <>
                      <Input 
                        id="email" 
                        type="email" 
                        value={formData.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                      />
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleSave('email')}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </>
                  ) : (
                    <>
                      <div className="flex-1 text-base">{formData.email}</div>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleEdit('email')}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input 
                  id="current-password" 
                  type="password" 
                  placeholder="Enter current password"
                  value={passwordData.currentPassword}
                  onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                />
                {errors.currentPassword && (
                  <p className="text-sm text-red-500">{errors.currentPassword}</p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input 
                  id="new-password" 
                  type="password" 
                  placeholder="Enter new password"
                  value={passwordData.newPassword}
                  onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input 
                  id="confirm-password" 
                  type="password" 
                  placeholder="Confirm new password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                />
                {errors.confirmPassword && (
                  <p className="text-sm text-red-500">{errors.confirmPassword}</p>
                )}
              </div>
              <Button 
                className="w-fit my-4"
                onClick={handleUpdateProfile}
              >
                Update Profile
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

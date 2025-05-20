'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useAppDispatch, useAppSelector } from '../store'
import { clearError, selectAuth, signup } from '../store/slices/authSlice'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

const formSchema = z
  .object({
    email: z.string().email({ message: 'Invalid email address' }),
    password: z.string().min(8, { message: 'Password must be at least 8 characters' }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

type FormData = z.infer<typeof formSchema>

export function SignupForm() {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const { isAuthenticated, isLoading, error } = useAppSelector(selectAuth)

    useEffect(() => {
        // If user is already authenticated, redirect to home
        if (isAuthenticated) {
        router.push("/")
        }

        // Clear any errors when component mounts
        dispatch(clearError())
    }, [isAuthenticated, dispatch, router])

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  const onSubmit = async (data: FormData) => {
      await dispatch(signup({ email: data.email, password: data.password }))
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <Form {...form}>
            
        <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-md w-full space-y-8 bg-white p-6 rounded-lg shadow-md">
            <div className="text-center">
            <div className="flex justify-center">
                <div className="w-12 h-12 bg-indigo-900 text-white rounded flex items-center justify-center font-bold text-xl">
                M
                </div>
            </div>
            <h2 className="mt-4 text-2xl font-bold text-amber-500">MDEX Pro</h2>
            <p className="mt-2 text-gray-600">Sign in to your account</p>
            </div>
            {error && <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">{error}</div>}

            <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                    <Input type="email" placeholder="you@example.com" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />

            <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />

            <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                    <Input type="password" placeholder="Repeat your password" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />


            <Button type="submit" className="w-full bg-amber-500 hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-50" disabled={isLoading}>
            {isLoading ? "Registering..." : "Register"}
            </Button>
            <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Aleady have an account?{" "}
            <a href="/login" className="font-medium text-amber-500 hover:text-amber-400">
              Login
            </a>
          </p>
        </div>
        </form>
        </Form>
        
    </div>
  )
}

'use client'
import { loginWithEmail } from "./_actions/loginWithEmail"
import { loginWithOAuth } from "./_actions/loginWithOAuth"
import { signup } from "./_actions/signup"
import { forgotPassword } from "./_actions/forgotPassword"
import { cn } from "@/shared/lib/utils"
import { Button } from "@/shared/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card"
import { Input } from "@/shared/ui/input"
import { Label } from "@/shared/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/shared/ui/radio-group"
import { Github } from "lucide-react"
import { useState } from "react"
import { UserRole } from "@/shared/types/user"
import { SubmitHelper } from "@/shared/ui/submit-helper"


export function AuthForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [isResetPassword, setIsResetPassword] = useState(false)

  return (
    <div className={cn("flex flex-col gap-6 min-w-[400px]", className)} {...props}>
      <Card className="w-full">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome to BookingSystem</CardTitle>
          <CardDescription>
            Login with your Github account or email
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <form action={loginWithOAuth.bind(null, "github")}>
              <Button variant="outline" type="submit" className="w-full">
                <Github className="size-4" />
                Login with Github
              </Button>
            </form>
            <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
              <span className="relative z-10 bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
            {isResetPassword ? (
              <form action={forgotPassword}>
                <div className="grid gap-2">
                  <Label htmlFor="reset-email">Email</Label>
                  <Input
                    id="reset-email"
                    name="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                  />
                </div>
                <div className="mt-4 flex gap-2">
                  <SubmitHelper>
                    {pending =>
                      <Button disabled={pending} type="submit" className="flex-1">
                        Reset Password
                      </Button>}
                  </SubmitHelper>
                  <Button type="button" variant="outline" onClick={() => setIsResetPassword(false)}>
                    Back
                  </Button>
                </div>
              </form>
            ) : (
              <Tabs defaultValue="login">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="register">Register</TabsTrigger>
                </TabsList>
                <TabsContent value="login">
                  <form action={loginWithEmail}>
                    <div className="grid gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="m@example.com"
                          required
                        />
                      </div>
                      <div className="grid gap-2">
                        <div className="flex items-center">
                          <Label htmlFor="password">Password</Label>
                          <button
                            type="button"
                            onClick={() => setIsResetPassword(true)}
                            className="ml-auto text-sm underline-offset-4 hover:underline"
                          >
                            Forgot password?
                          </button>
                        </div>
                        <Input id="password" name="password" type="password" required />
                      </div>
                      <SubmitHelper>
                        {pending => <Button type="submit" disabled={pending} className="w-full">
                          Login
                        </Button>}
                      </SubmitHelper>
                    </div>
                  </form>
                </TabsContent>
                <TabsContent value="register">
                  <form action={signup}>
                    <div className="grid gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="signup-email">Email</Label>
                        <Input
                          id="signup-email"
                          name="email"
                          type="email"
                          placeholder="m@example.com"
                          required
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="signup-password">Password</Label>
                        <Input id="signup-password" name="password" type="password" required />
                      </div>
                      <div className="grid gap-2">
                        <Label>Role</Label>
                        <RadioGroup defaultValue={UserRole.USER} name="role" required>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value={UserRole.USER} id="user" />
                            <Label htmlFor="user">User</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value={UserRole.ADMIN} id="admin" />
                            <Label htmlFor="admin">Admin</Label>
                          </div>
                        </RadioGroup>
                      </div>
                      <SubmitHelper>
                        {pending =>
                          <Button type="submit" disabled={pending} className="w-full">
                            Sign Up
                          </Button>
                        }
                      </SubmitHelper>

                    </div>
                  </form>
                </TabsContent>
              </Tabs>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 
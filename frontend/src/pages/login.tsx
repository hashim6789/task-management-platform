import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { LockIcon, LogInIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { LoginFormType, loginSchema } from "@/schemas";

export const LoginPage: React.FC = () => {
  const { login, isLoading } = useAuth();

  const form = useForm<LoginFormType>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: LoginFormType) {
    login(values.email, values.password);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 p-4">
      <Card className="w-full max-w-md shadow-2xl transition-all duration-300 hover:shadow-3xl bg-white/95 backdrop-blur-sm">
        <CardHeader className="space-y-2 text-center">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-blue-600 p-3 text-white shadow-md">
              <LockIcon className="h-7 w-7" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-gray-800">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-gray-600 text-sm">
            Sign in to your task management account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 px-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="email@example.com"
                        className="border-gray-300 focus:ring-2 focus:ring-blue-500 transition-all"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-xs" />
                  </FormItem>
                )}
              />
              <FormField
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        className="border-gray-300 focus:ring-2 focus:ring-blue-500 transition-all"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-xs" />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 transition-all duration-200 flex items-center justify-center gap-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Signing in...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <LogInIcon className="h-4 w-4" />
                    Sign In
                  </span>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center pb-6">
          <p className="text-xs text-gray-500 text-center">
            For demo: admin@example.com / user@example.com (password: 123456)
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginPage;

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, selectAuth } from "../features/auth/authSlice";
import { AppDispatch } from "../app/store";
import { Link, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

// import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import {
	Card,
	CardContent,
	CardDescription,
	// CardFooter,
	CardHeader,
	CardTitle,
} from "../components/ui/card";
import {
	Form,
	FormControl,
	// FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "../components/ui/form";
import { Button } from "../components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert";
import { ExclamationTriangleIcon, ReloadIcon } from "@radix-ui/react-icons";
import { loginSchema } from "@/lib/validators";

function Login(): JSX.Element {
	const dispatch = useDispatch<AppDispatch>();
	const { loading, error } = useSelector(selectAuth);
	const navigate = useNavigate();

	const form = useForm<z.infer<typeof loginSchema>>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	async function onSubmit(data: z.infer<typeof loginSchema>) {
		console.log("user signup data", data);
		dispatch(loginUser({ email: data.email, password: data.password }))
			.unwrap()
			.then(() => {
				navigate("/dashboard");
			})
			.catch((error) => {
				console.error("Login failed:", error);
			});
	}

	useEffect(() => {
		console.log("sign_up form errors", form.formState.errors); // Log form errors
	}, [form.formState.errors]);

	return (
		<div className="h-[100vh] bg-muted-foreground/10 flex items-center justify-center">
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="z-10 space-y-3 min-w-[400px] max-w-[500px] mx-auto"
				>
					{error && (
						<Alert variant="destructive" className="bg-background">
							<ExclamationTriangleIcon className="h-4 w-4" />
							<AlertTitle>Error</AlertTitle>
							<AlertDescription>{error}</AlertDescription>
						</Alert>
					)}
					<Card className="w-full">
						<CardHeader>
							<CardTitle className="text-2xl">Login</CardTitle>
							<CardDescription>
								Enter your email below to login to your account
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="grid gap-4">
								<FormField
									control={form.control}
									name="email"
									render={({ field }) => (
										<FormItem>
											<FormLabel>
												Email <span className="text-red-500">*</span>
											</FormLabel>
											<FormControl>
												<Input
													type="email"
													placeholder="max@example.com"
													{...field}
												/>
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
											<FormLabel>
												Password <span className="text-red-500">*</span>
											</FormLabel>
											<FormControl>
												<Input type="password" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								{loading ? (
									<Button disabled>
										<ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
										Please wait
									</Button>
								) : (
									<Button type="submit" className="w-full">
										Login
									</Button>
								)}
							</div>
							<div className="mt-4 text-center text-sm">
								Already have an account?{" "}
								<Link to="/register" className="underline text-blue-500">
									Register
								</Link>
							</div>
						</CardContent>
					</Card>
				</form>
			</Form>
		</div>
	);
}

export default Login;

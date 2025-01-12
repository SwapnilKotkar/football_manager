import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser, selectAuth } from "../features/auth/authSlice";
import { AppDispatch } from "../app/store";
import { useNavigate, Link } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
import { signUpSchema } from "@/lib/validators";

function Register(): JSX.Element {
	const dispatch = useDispatch<AppDispatch>();
	const { loading, error } = useSelector(selectAuth);
	const navigate = useNavigate();

	const form = useForm<z.infer<typeof signUpSchema>>({
		resolver: zodResolver(signUpSchema),
		defaultValues: {
			email: "",
			password: "",
			confirmPassword: "",
		},
	});

	async function onSubmit(data: z.infer<typeof signUpSchema>) {
		console.log("user signup data", data);
		dispatch(registerUser({ email: data.email, password: data.password }))
			.unwrap()
			.then(() => {
				navigate("/login");
			})
			.catch(() => {});
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
							<CardTitle className="text-xl">Sign Up</CardTitle>
							<CardDescription>
								Enter your information to create an account
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
								<FormField
									control={form.control}
									name="confirmPassword"
									render={({ field }) => (
										<FormItem>
											<FormLabel>
												Confirm Password <span className="text-red-500">*</span>
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
										Create an account
									</Button>
								)}
							</div>
							<div className="mt-4 text-center text-sm">
								Already have an account?{" "}
								<Link to="/login" className="underline text-blue-500">
									Sign in
								</Link>
							</div>
						</CardContent>
					</Card>
				</form>
			</Form>
		</div>
	);
}

export default Register;

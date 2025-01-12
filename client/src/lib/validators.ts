import * as z from "zod";

export const signUpSchema = z
	.object({
		email: z.string().email({ message: "Invalid email address." }),
		password: z
			.string()
			.min(6, { message: "Password must be at least 6 characters." }),
		confirmPassword: z
			.string()
			.min(6, { message: "Confirm password must be at least 6 characters." }),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords do not match.",
		path: ["confirmPassword"], // Optional: The field where the error message will appear
	});

export const loginSchema = z.object({
	email: z.string().email({ message: "Invalid email address." }),
	password: z.string().min(6, "Password must be at least 6 characters long"),
});

export const forgotPasswordSchema = z.object({
	email: z.string().email({ message: "Invalid email address." }),
});

export const newPasswordSchema = z
	.object({
		newPassword: z
			.string()
			.min(6, { message: "Password must be at least 6 characters." }),
		confirmNewPassword: z
			.string()
			.min(6, { message: "Confirm password must be at least 6 characters." }),
	})
	.refine((data) => data.newPassword === data.confirmNewPassword, {
		message: "Passwords do not match.",
		path: ["confirmNewPassword"], // Optional: The field where the error message will appear
	});

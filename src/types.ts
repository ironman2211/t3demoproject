import { z } from "zod";

export const todoinput = z.string({
    required_error: "This field is required",
    message: "This field is required",
}).min(1).max(100);
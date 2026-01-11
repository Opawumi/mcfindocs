import { withAuth } from "next-auth/middleware";

export default withAuth({
    pages: {
        signIn: "/login",
    },
    secret: "mcfin-docs-development-secret-key-change-this",
});

export const config = {
    matcher: ["/dashboard/:path*"],
};

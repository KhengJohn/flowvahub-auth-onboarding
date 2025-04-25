import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { signIn, signUp, resetPassword } from "@/lib/auth";

export async function POST(request: Request) {    
     const cookieStore = await cookies();
  try {
    const { action, email, password } = await request.json();

    switch (action) {
      case "signin": {
        const result = await signIn(email, password);
        if (result) {
          const { user, token } = result;

          // Set cookie
          const cookieStore = await cookies();
          cookieStore.set({
            name: "token",
            value: token,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
            maxAge: 7 * 24 * 60 * 60, // 7 days
          });

          return NextResponse.json({ success: true, user });
        }
        return NextResponse.json(
          { success: false, message: "Invalid credentials" },
          { status: 401 }
        );
      }

      case "signup": {
        const result = await signUp(email, password);
        if (result) {
          const { user, token } = result;

          // Set cookie
          cookieStore.set({
            name: "token",
            value: token,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
            maxAge: 7 * 24 * 60 * 60, // 7 days
          });

          return NextResponse.json({ success: true, user });
        }
        return NextResponse.json(
          { success: false, message: "Email already in use" },
          { status: 400 }
        );
      }

      case "reset": {
        const result = await resetPassword(email);
        if (result) {
          return NextResponse.json({
            success: true,
            message: "Password reset email sent",
          });
        }
        return NextResponse.json(
          { success: false, message: "Email not found" },
          { status: 400 }
        );
      }

      case "signout": {
 
        cookieStore.delete("token");
        return NextResponse.json({ success: true });
      }

      default:
        return NextResponse.json(
          { success: false, message: "Invalid action" },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Auth API error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}

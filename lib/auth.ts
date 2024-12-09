interface User {
  id: string;
  email: string;
  name: string;
  role: "admin" | "instructor" | "practitioner";
}

const users = {
  admin: {
    id: "1",
    email: "admin@example.com",
    password: "password",
    name: "Admin User",
    role: "admin",
  },
  instructor: {
    id: "2",
    email: "instructor@example.com",
    password: "password",
    name: "Instructor User",
    role: "instructor",
  },
  user: {
    id: "3",
    email: "user@example.com",
    password: "password",
    name: "Regular User",
    role: "practitioner",
  },
} as const;

export async function authenticate(
  email: string,
  password: string
): Promise<User | null> {
  const user = Object.values(users).find(
    (u) => u.email === email && u.password === password
  );

  if (!user) return null;

  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

export function getUser(): User | null {
  const userStr = localStorage.getItem("user");
  if (!userStr) return null;
  return JSON.parse(userStr);
}

export function setUser(user: User) {
  localStorage.setItem("user", JSON.stringify(user));
}

export function removeUser() {
  localStorage.removeItem("user");
}
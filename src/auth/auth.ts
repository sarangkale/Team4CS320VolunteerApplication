import { supabase } from "../lib/supabase"

// SIGN UP
export async function signUp(email: string, password: string, name: string, university: string, role: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })

  if (data.user) {
    await supabase.from("profiles").insert([
      {
        id: data.user.id,
        name: name,
        university: university,
        role: role
      }
    ])
  }

  if (error) {
    console.error(error)
  }

  return data
}

// LOGIN
export async function login(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })

  if (error) {
    console.error(error)
  }

  return data
}

// LOGOUT
export async function logout() {
  const { error } = await supabase.auth.signOut()

  if (error) {
    console.error(error)
  }
}

// GET USER
const { data: { user } } = await supabase.auth.getUser()

export function getCurrentUser() {
  return user
}


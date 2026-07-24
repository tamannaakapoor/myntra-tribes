const supabase = require("../config/supabase");

// ----------------------
// SIGN UP
// ----------------------
const signUp = async ({ email, password, username }) => {
  // 1. Create auth user
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) throw error;

  // 2. Create profile with INITIAL 500 POINTS
  const { error: profileError } = await supabase
    .from("profiles")
    .insert({
      id: data.user.id,
      username,
      avatar_url: null,
      active_tribe_id: null,
      points: 500, // <--- FIXED: New users now safely start with 500!
    });

  if (profileError) throw profileError;

  // 3. If Supabase already returned a session, use it
  if (data.session) {
    return {
      user: data.user,
      session: data.session,
    };
  }

  // 4. Otherwise log the user in immediately
  const { data: loginData, error: loginError } =
    await supabase.auth.signInWithPassword({
      email,
      password,
    });

  if (loginError) throw loginError;

  return {
    user: loginData.user,
    session: loginData.session,
  };
};

// ----------------------
// LOGIN
// ----------------------
const login = async ({ email, password }) => {
  const { data, error } =
    await supabase.auth.signInWithPassword({
      email,
      password,
    });

  if (error) throw error;

  return data;
};

module.exports = {
  signUp,
  login,
};
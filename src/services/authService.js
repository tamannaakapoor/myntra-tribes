const supabase = require("../config/supabase");

// ----------------------
// SIGN UP
// ----------------------
// const signUp = async ({ email, password, username }) => {

//   // Create auth user
//   const { data, error } = await supabase.auth.signUp({
//     email,
//     password,
//   });

//   if (error) throw error;

//   // Create profile
//   const { error: profileError } = await supabase
//     .from("profiles")
//     .insert({
//       id: data.user.id,
//       username,
//       avatar_url: null,
//       active_tribe_id: null,
//       points: 0,
//     });

//   if (profileError) throw profileError;

//   return data;
// };
// const signUp = async ({ email, password, username }) => {

//   const { data, error } = await supabase.auth.signUp({
//     email,
//     password,
//   });

//   if (error) throw error;

//   const { error: profileError } = await supabase
//     .from("profiles")
//     .insert({
//       id: data.user.id,
//       username,
//       avatar_url: null,
//       active_tribe_id: null,
//       points: 0,
//     });

//   if (profileError) throw profileError;

//   // If a session exists, return it
//   return {
//     user: data.user,
//     session: data.session,
//   };
// };
const signUp = async ({ email, password, username }) => {
  // Create auth user
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) throw error;

  // Create profile
  const { error: profileError } = await supabase
    .from("profiles")
    .insert({
      id: data.user.id,
      username,
      avatar_url: null,
      active_tribe_id: null,
      points: 0,
    });

  if (profileError) throw profileError;

  // If Supabase already returned a session, use it
  if (data.session) {
    return {
      user: data.user,
      session: data.session,
    };
  }

  // Otherwise log the user in immediately
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
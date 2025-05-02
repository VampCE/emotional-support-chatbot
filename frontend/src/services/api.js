const API_URL = "http://localhost:5001/api";

// ✅ Kullanıcı kaydetme
export const registerUser = async (email, password) => {
  try {
    const response = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const result = await response.text();
    if (response.ok) {
      return result;
    } else {
      throw new Error(result);
    }
  } catch (error) {
    console.error("Kayıt hatası:", error);
    throw error;
  }
};

// ✅ Giriş yapma
export const loginUser = async (email, password) => {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const result = await response.text();
    if (response.ok) {
      return result;
    } else {
      throw new Error(result);
    }
  } catch (error) {
    console.error("Giriş hatası:", error);
    throw error;
  }
};

// ✅ Mesaj gönderme
export const sendMessage = async (userId, messageText) => {
  try {
    const response = await fetch(`${API_URL}/send-message`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId, message_text: messageText }),
    });

    const result = await response.text();
    if (response.ok) {
      return result;
    } else {
      throw new Error(result);
    }
  } catch (error) {
    console.error("Mesaj gönderme hatası:", error);
    throw error;
  }
};

// ✅ İlgi alanı kaydetme
export const submitInterests = async (email, selectedInterests) => {
  try {
    const response = await fetch(`${API_URL}/interests`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, interests: selectedInterests }),
    });

    const result = await response.text();
    if (response.ok) {
      return result;
    } else {
      throw new Error(result);
    }
  } catch (error) {
    console.error("İlgi alanı gönderme hatası:", error);
    throw error;
  }
};
export const sendPasswordResetEmail = async (email) => {
  const response = await fetch(`${API_URL}/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  const result = await response.text();
  if (!response.ok) throw new Error(result);
  return result;
};
export const fetchUserInterests = async (email) => {
  const response = await fetch(`http://localhost:5001/api/interests/${email}`);
  const result = await response.json();
  return result;
};

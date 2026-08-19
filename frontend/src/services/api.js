const API_URL = "http://127.0.0.1:8000";

export async function login(email, password) {
  const formData = new URLSearchParams();

  formData.append("username", email);
  formData.append("password", password);

  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Login failed");
  }

  return data;
}


export async function getMe() {
  const token = localStorage.getItem("access_token");

  const response = await fetch(`${API_URL}/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Failed to get user");
  }

  return data;
}


export async function apiFetch(endpoint, options = {}) {
  const token = localStorage.getItem("access_token");

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Request failed");
  }

  return data;
}

export async function getMyFeedback() {
  return await apiFetch("/feedback/my");
}

export async function getFeedback(feedbackId) {
  return await apiFetch(`/feedback/${feedbackId}`);
}

export async function getAllFeedback() {
  return await apiFetch("/manager/feedback");
}

export async function updateFeedbackStatus(feedbackId, status) {
  return await apiFetch(
    `/manager/feedback/${feedbackId}/status?status=${encodeURIComponent(status)}`,
    {
      method: "PUT",
    }
  );
}

export async function respondToFeedback(feedbackId, responseText) {
  return await apiFetch(
    `/manager/feedback/${feedbackId}/response`,
    {
      method: "POST",
      body: JSON.stringify({
        response_text: responseText,
      }),
    }
  );
}

export const deleteResponse = async (feedbackId, responseId) => {
  const token = localStorage.getItem("access_token");

  const response = await fetch(
    `${API_URL}/manager/feedback/${feedbackId}/response/${responseId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.detail || "Failed to delete response"
    );
  }

  return data;
};

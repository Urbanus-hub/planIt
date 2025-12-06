"use server";

import { cookies } from "next/headers";
import apiClient from "@/lib/instances/axios.instance";

// Helper function to get auth headers from server-side cookies
async function getAuthHeaders() {
  const cookieStore = await cookies();
  const token = cookieStore.get("authToken")?.value;

  if (token) {
    return {
      Authorization: `Bearer ${token}`,
    };
  }
  return {};
}

// Conversation Actions
export async function getUserConversations(userId: string) {
  try {
    const headers = await getAuthHeaders();
    const response = await apiClient.get(`/conversations/user/${userId}`, {
      headers,
    });
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to get conversations"
    );
  }
}

export async function getOrCreateConversation(participantId: string) {
  try {
    const headers = await getAuthHeaders();
    const response = await apiClient.post(
      "/conversations/create",
      { participantId },
      { headers }
    );
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to create conversation"
    );
  }
}

export async function getConversationMessages(
  conversationId: string,
  page: number = 1,
  limit: number = 50
) {
  try {
    const headers = await getAuthHeaders();
    const response = await apiClient.get(
      `/conversations/${conversationId}/messages`,
      {
        params: { page, limit },
        headers,
      }
    );
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to get messages");
  }
}

export async function markMessagesAsRead(conversationId: string) {
  try {
    const headers = await getAuthHeaders();
    const response = await apiClient.patch(
      `/conversations/${conversationId}/read`,
      {},
      { headers }
    );
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to mark messages as read"
    );
  }
}
